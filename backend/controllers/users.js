const usersRouter = require('express').Router();
const bcrypt = require('bcryptjs');

const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  response.json(user);
});

usersRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password less then 3 characters long' });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const newUser = new User({
    username: body.username,
    name: body.name || 'unknown',
    passwordHash: passwordHash,
  });

  const result = await newUser.save();
  response.status(201).json(result);
});

module.exports = usersRouter;
