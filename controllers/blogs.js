const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

// will setup connection path in app.js
blogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    response.json(blog);
  } catch (err) {
    next(err);
  }
})

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "Title or URL missing " });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      updatedBlog,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (result) response.json(result);
    else response.status(404).end();
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
