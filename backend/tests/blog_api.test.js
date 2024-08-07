const { test, beforeEach, after, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcryptjs');

const helper = require('./test_helper');

const Blog = require('../models/blog');
const User = require('../models/user');

const getToken = async (name) => {
  const response = await api
    .post('/api/login')
    .send({ username: name, password: name });

  return response.body.token || null;
};

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('root', 10);
  const user = new User({
    username: 'root',
    name: 'superuser',
    passwordHash: passwordHash,
  });
  await user.save();

  const passwordHash2 = await bcrypt.hash('admin', 10);
  const user2 = new User({
    username: 'admin',
    name: 'admin',
    passwordHash: passwordHash2,
  });
  await user2.save();

  const root = await User.findOne({ username: 'root' });

  await Blog.deleteMany({});

  const updatedBlogs = helper.getInitialBlogs(root);

  await Blog.insertMany(updatedBlogs);
});

describe('testing of blog api', () => {
  describe('get blogs from database', () => {
    test('correct amount of blog posts in json format', async () => {
      const blogs = await helper.getBlogsInDB();

      assert.strictEqual(blogs.length, helper.initialBlogs.length);
    });

    test('right id naming', async () => {
      const blogs = await helper.getBlogsInDB();
      assert(blogs.every((b) => Boolean(b.id)));
    });
  });

  describe('post a blog to database', () => {
    test('post a valid blog to database', async () => {
      const blogsAtStart = await helper.getBlogsInDB();

      const newBlog = {
        title: 'What is a void operator?',
        author: 'loverajoel',
        url: 'https://www.jstips.co/en/javascript/what-is-a-void-operator/',
        likes: 1,
      };

      const token = await getToken('root');

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.getBlogsInDB();
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length - 1);
      assert(helper.findBlog(blogsAtEnd, newBlog));
    });

    test('add likes in a blog without them', async () => {
      const newBlog = {
        title: 'Title without likes',
        author: 'evgenii',
        url: 'http://example.com/title-without-likes',
      };

      const token = await getToken('root');

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.getBlogsInDB();
      const newBlogWithLikes = {
        ...newBlog,
        likes: 0,
      };
      assert(helper.findBlog(blogsAtEnd, newBlogWithLikes));
    });

    test('post an invalid blog', async () => {
      const token = await getToken('root');

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send({ title: 'data without url' })
        .expect(400)
        .expect('Content-Type', /application\/json/);

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send({ url: 'http://data-without-title.com' })
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('delete a blog from database', () => {
    test('delete an existed blog', async () => {
      const blogsAtStart = await helper.getBlogsInDB();
      const removedBlog = blogsAtStart.pop();

      const token = await getToken('root');

      await api
        .delete(`/api/blogs/${removedBlog.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(204);

      const blogsAtEnd = await helper.getBlogsInDB();

      // equal length because one was poped at start
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);
    });

    test('delete non existed blog', async () => {
      const token = await getToken('root');

      const someId = '12ljadf1234adsfpa';

      await api
        .delete(`/api/blogs/${someId}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(400);
    });

    test('try to delete a blog unrelated to user', async () => {
      const blogsAtStart = await helper.getBlogsInDB();
      const removedBlog = blogsAtStart.pop();

      const token = await getToken('admin');

      await api
        .delete(`/api/blogs/${removedBlog.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('update a blog in database', () => {
    test('update likes', async () => {
      const blogsAtStart = await helper.getBlogsInDB();
      const blogToUpdate = blogsAtStart[0];
      blogToUpdate.likes += 999;

      const token = await getToken('root');

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', 'Bearer ' + token)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.getBlogsInDB();
      assert(helper.findBlog(blogsAtEnd, blogToUpdate));
    });
  });
});

describe('testing of user api', () => {
  test('get users from database', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const users = await helper.getUsersInDB();
    assert.strictEqual(users.length, 2);

    const usernames = users.map((u) => u.username);
    assert(usernames.includes('root'));
  });

  test('post a valid user', async () => {
    const usersAtStart = await helper.getUsersInDB();

    const user = {
      username: 'dirty_raider1337',
      name: 'Ivan Ivanov',
      password: 'qwerty12345',
    };

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.getUsersInDB();
    assert.strictEqual(usersAtStart.length, usersAtEnd.length - 1);
    assert(usersAtEnd.map((u) => u.username).includes(user.username));
  });

  test('post an existing user', async () => {
    const usersAtStart = await helper.getUsersInDB();

    const result = await api
      .post('/api/users')
      .send({ username: 'root', password: 'password' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.getUsersInDB();
    assert(result.body.error.includes('expected `username` to be unique'));
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });

  test('post invalid username or password', async () => {
    const usersAtStart = await helper.getUsersInDB();

    // short login
    await api
      .post('/api/users')
      .send({ username: 'yo', password: 'long_enough' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    // forbidden characters in login
    await api
      .post('/api/users')
      .send({ username: '=+b[a]d-nAm[e]+=', password: 'long_enough' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    await api
      .post('/api/users')
      .send({ username: 'long_enough', password: 'yo' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.getUsersInDB();
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
