const blogsRouter = require('express').Router();
const middleware = require('../utils/middleware');

const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = await User.findById(request.user.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  });

  response.status(201).json(populatedBlog);
});

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== request.user.id) {
      return response
        .status(401)
        .json({ error: 'cannot delete a blog unrelated to user' });
    }

    await blog.deleteOne();

    response.status(204).end();
  }
);

blogsRouter.get('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user', {
      username: 1,
      name: 1,
    })
    .populate('comments', { content: 1 });

  response.json(blog);
});

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes, user } = request.body;

  const blog = await Blog.findById(request.params.id);
  const comments = blog.comments;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes, user, comments },
    { new: true, runValidators: true }
  )
    .populate('user', {
      username: 1,
      name: 1,
    })
    .populate('comments', { content: 1 });

  response.json(updatedBlog);
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const { content } = request.body;

  const blog = await Blog.findById(request.params.id);

  const comment = new Comment({ content });

  const savedComment = await comment.save();
  blog.comments = blog.comments.concat(savedComment._id);
  await blog.save();

  response.status(201).json(savedComment);
});

module.exports = blogsRouter;
