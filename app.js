const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');

const app = express();
app.use(cors());

console.log('connecting to ', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB: ', error.message));

// use to load static files (images etc.)
app.use(express.static('dist'));

app.use(express.json());

// blogRouter will automatically redirect to /api/blogs
app.use('/api/blogs', blogsRouter);

module.exports = app;