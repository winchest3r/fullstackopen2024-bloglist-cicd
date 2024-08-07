const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const result = blogs.reduce((mx, blog) => {
    return blog.likes > mx.likes ? blog : mx;
  }, blogs[0]);

  return {
    title: result.title,
    author: result.author,
    likes: result.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  // Group by authors
  const grouped = blogs.reduce((result, blog) => {
    if (!result[blog.author]) {
      result[blog.author] = [];
    }
    result[blog.author].push(blog);
    return result;
  }, {});

  let result = null;
  Object.keys(grouped).forEach((author) => {
    if (result === null || grouped[author].length > result.blogs) {
      result = {
        author: author,
        blogs: grouped[author].length,
      };
    }
  });
  return result;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  // { author: likes }
  const grouped = blogs.reduce((result, blog) => {
    if (!result[blog.author]) {
      result[blog.author] = 0;
    }
    result[blog.author] += blog.likes;
    return result;
  }, {});

  let result = null;
  Object.keys(grouped).forEach((author) => {
    if (result === null || grouped[author] > result.likes) {
      result = {
        author: author,
        likes: grouped[author],
      };
    }
  });
  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
