const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const { title } = require('node:process');

const api = supertest(app);

describe("when there is initially some blogs saved", async() => {
  beforeEach(async() => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    // console.log('cleared');

    /*
    parallel/random order:
    const blogObject = helper.initialBlog.map(blog => new Blog(blog));
    const promises = blogObject.map(blog => blog.save());
    await Promise.all(promises)

    in order: use a for loop
    */
  })

  test("blogs are returned as json", async() => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  });

  test("all blogs are returned", async() => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("a specific blogs are within the returned blogs", async() => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map(blog => blog.title);
    assert(titles.includes('Advanced MongoDB Techniques'));
  })

  describe("4.8 - 4.12", async() => {
    test("4.8: test GET requests to /api/blogs", async() => {
      const res = await api.get('/api/blogs');

      assert.strictEqual(res.body.length, helper.initialBlogs.length);
    })

    test("4.9: test all blogs to have unique ids", async() => {
      const res = await api.get('/api/blogs');

      // console.log("res.body", res.body);
      const set = new Set(res.body.map(blog => blog.id));
      // console.log(set);

      assert.strictEqual(set.size, helper.initialBlogs.length);
    })

    test("4.10: test POST requests to /api/blogs", async() => {
      await api
        .post('/api/blogs')
        .send(helper.newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAfterAdd = await helper.blogsInDb();
      assert.strictEqual(blogsAfterAdd.length, helper.initialBlogs.length + 1);

      // console.log(blogsAfterAdd.at(-1));
      // console.log(helper.newBlog);

      // after added the blog will have an id - different than newBlog 
      // (which doesn't have an id) 
      // so have to delete in order to compare
      const blogsAdded = blogsAfterAdd.at(-1);
      delete blogsAdded.id;

      assert.deepStrictEqual(blogsAdded, helper.newBlog);
    })

    test("4.11: Blogs without likes will be defaulted to 0", async() => {
      await api
        .post('/api/blogs')
        .send(helper.blogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAfterAdd = await helper.blogsInDb();
      assert.strictEqual(blogsAfterAdd.length, helper.initialBlogs.length + 1);

      const blogsAdded = blogsAfterAdd.at(-1);
      delete blogsAdded.id;

      const tempBlog = helper.blogWithoutLikes;
      tempBlog.likes = 0;

      assert.deepStrictEqual(blogsAdded, tempBlog);
    })

    test("4.12: Blogs without URL/titles will be rejected with status 400", async() => {
      const blogWithoutTitle = helper.newBlog;
      delete blogWithoutTitle.title;

      const blogWithoutUrl = helper.newBlog;
      delete blogWithoutUrl.url;

      await api.post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400);

      await api.post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400);

      const currentDb = await api.get('/api/blogs');
      assert.strictEqual(currentDb.body.length, helper.initialBlogs.length);
    })
  })
})

after(async() => {
  await mongoose.connection.close();
})