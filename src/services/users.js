import axios from 'axios';

const baseUrl = '/api/users';

const users = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const user = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export default {
  users,
  user,
};
