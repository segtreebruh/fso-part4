const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async() => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
  console.log('cleared');

  /*
  parallel/random order:
  const blogObject = helper.initialBlog.map(blog => new Blog(blog));
  const promises = blogObject.map(blog => blog.save());
  await Promise.all(promises)

  in order: use a for loop
  */
})

describe("4.8 - 4.12", async() => {
  test("4.8: test GET requests to /api/blogs", async() => {
    const res = await api.get('/api/blogs');

    assert.strictEqual(res.body.length, helper.initialBlogs.length);
  })
})

after(async() => {
  await mongoose.connection.close();
})