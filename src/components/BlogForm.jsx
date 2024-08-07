import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, Input, Button, Stack } from '@chakra-ui/react';

import { createBlog } from '../slices/blogsSlice';

const BlogForm = ({ toggleVisibility }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();

    toggleVisibility();

    const blogObject = { title, author, url };
    dispatch(createBlog(blogObject));

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <Stack rounded={'lg'} boxShadow={'lg'} p={8} m={8}>
      <FormControl id="title">
        <FormLabel>Title</FormLabel>
        <Input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>
      <FormControl id="author">
        <FormLabel>Author</FormLabel>
        <Input
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </FormControl>
      <FormControl id="url">
        <FormLabel>Url</FormLabel>
        <Input
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </FormControl>
      <Button onClick={addBlog}>add</Button>
    </Stack>
  );
};

BlogForm.propTypes = {
  toggleVisibility: PropTypes.func,
};

export default BlogForm;
