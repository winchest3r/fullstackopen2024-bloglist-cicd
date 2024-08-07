import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { Text, Textarea, Button, Box, Stack } from '@chakra-ui/react';

import { addComment } from '../slices/blogsSlice';

const Comments = () => {
  const dispatch = useDispatch();
  const id = useMatch('/blogs/:id').params.id;
  const [content, setContent] = useState('');

  const blog = useSelector(({ blogs }) => blogs.filter((b) => b.id === id)[0]);

  const handleNewComment = () => {
    dispatch(addComment(blog, content));
    setContent('');
  };

  return (
    <Stack>
      <Textarea
        resize="none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          blog.comments.length === 0 ? 'be first!' : 'write something here...'
        }
      />
      <Button onClick={handleNewComment}>add</Button>
      {blog.comments.map((c) => (
        <Box key={c.id} borderRadius="lg" borderWidth="1px" m={1}>
          <Text>{c.content}</Text>
        </Box>
      ))}
    </Stack>
  );
};

export default Comments;
