const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// Read:
// https://codahale.com/how-to-safely-store-a-password/

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1});
  return response.json(users);
})

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds 
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
