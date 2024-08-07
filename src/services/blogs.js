import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = 'Bearer ' + newToken;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const add = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

const update = async (blogToUpdate) => {
  const response = await axios.put(
    `${baseUrl}/${blogToUpdate.id}`,
    blogToUpdate,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};

const remove = async (blogToRemove) => {
  await axios.delete(`${baseUrl}/${blogToRemove.id}`, {
    headers: {
      Authorization: token,
    },
  });
};

const get = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

const addComment = async (id, content) => {
  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    { content },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};

export default {
  setToken,
  getAll,
  get,
  add,
  update,
  remove,
  addComment,
};
