const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// will setup connection path in app.js
blogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response
      .status(400)
      .json({ error: "Title or URL missing "});
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url, 
    likes: body.likes || 0
  })

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
