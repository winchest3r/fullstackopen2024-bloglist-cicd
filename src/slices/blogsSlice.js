import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

import { setNotification } from './notificationSlice';

export const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog: (state, action) => {
      return state.concat(action.payload);
    },
    setBlogs: (state, action) => {
      return action.payload;
    },
    replaceBlog: (state, action) => {
      const toReplace = action.payload;
      return state.map((b) => (b.id !== toReplace.id ? b : toReplace));
    },
    remove: (state, action) => {
      const toRemove = action.payload;
      return state.filter((b) => b.id !== toRemove.id);
    },
  },
});

export const createBlog = (blog) => async (dispatch) => {
  try {
    const newBlog = await blogService.add(blog);
    dispatch(addBlog(newBlog));
    dispatch(setNotification(`a new blog '${newBlog.title}' added`));
  } catch (exception) {
    dispatch(setNotification(exception.response.data.error, 'error'));
  }
};

export const initializeBlogs = () => async (dispatch) => {
  try {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  } catch (exception) {
    dispatch(setNotification(exception.response.data.error, 'error'));
  }
};

export const likeBlog = (blog) => async (dispatch) => {
  const liked = {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user.id,
  };
  try {
    const updatedBlog = await blogService.update(liked);
    dispatch(replaceBlog(updatedBlog));
  } catch (exception) {
    dispatch(setNotification(exception.response.data.error, 'error'));
  }
};

export const removeBlog = (blog) => async (dispatch) => {
  const blogToRemove = {
    ...blog,
    user: blog.user.id,
  };
  try {
    await blogService.remove(blogToRemove);
    dispatch(remove(blog));
    dispatch(setNotification(`blog '${blog.title}' removed`));
  } catch (exception) {
    dispatch(setNotification(exception.response.data.error, 'error'));
  }
};

export const addComment = (blog, content) => async (dispatch) => {
  try {
    const comment = await blogService.addComment(blog.id, content);
    const blogWithComment = {
      ...blog,
      comments: blog.comments.concat(comment),
    };
    dispatch(replaceBlog(blogWithComment));
  } catch (exception) {
    setNotification(exception.response.data.error, 'error');
  }
};

export const { addBlog, setBlogs, replaceBlog, remove } = blogsSlice.actions;

export default blogsSlice.reducer;
