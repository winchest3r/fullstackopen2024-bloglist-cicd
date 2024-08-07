const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

// Blogs for tests from https://github.com/fullstack-hy2020/misc/blob/master/blogs_for_test.md
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

test('dummy return one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('totalLikes', () => {
  test('of empty list', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  test('of list with single element', () => {
    assert.strictEqual(listHelper.totalLikes([blogs[0]]), 7);
  });

  test('of list with many blogs', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36);
  });
});

describe('favoriteBlog', () => {
  test('of empty list', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null);
  });

  test('of list with single element', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([blogs[0]]), {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    });
  });

  test('of list with many blogs', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});

describe('mostBlogs', () => {
  test('of empty list', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null);
  });

  test('of list with single element', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([blogs[0]]), {
      author: 'Michael Chan',
      blogs: 1,
    });
  });

  test('of list with many blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});

describe('mostLikes', () => {
  test('of empty list', () => {
    assert.strictEqual(listHelper.mostLikes([]), null);
  });

  test('of list with single element', () => {
    assert.deepStrictEqual(listHelper.mostLikes([blogs[0]]), {
      author: 'Michael Chan',
      likes: 7,
    });
  });

  test('of list with many blogs', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
