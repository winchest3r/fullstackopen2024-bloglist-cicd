import { useEffect } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Text,
  Heading,
  Button,
  Divider,
  Link,
  HStack,
  Box,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { initializeBlogs, likeBlog, removeBlog } from '../slices/blogsSlice';

import Comments from './Comments';

const BlogView = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector(({ loggedUser }) => loggedUser);
  const blogs = useSelector(({ blogs }) => blogs);

  const id = useMatch('/blogs/:id').params.id;
  const blog = id ? blogs.find((b) => b.id === id) : null;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const handleLikes = () => {
    dispatch(likeBlog(blog));
  };

  const handleRemove = () => {
    if (window.confirm('Remove blog ' + blog.title)) {
      dispatch(removeBlog(blog));
      navigate('/');
    }
  };

  if (!blog) {
    return <>cannot find a blog</>;
  }

  return (
    <Box>
      <Heading m={4}>{blog.title}</Heading>
      <Divider mb={4} />
      <Link href={blog.url} isExternal>
        {blog.url} <ExternalLinkIcon mx="2px" />
      </Link>
      <HStack>
        <Text>{blog.likes} likes</Text>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={handleLikes}
          size="xs"
          data-testid="like"
        >
          ❤️
        </Button>
      </HStack>
      <HStack>
        <Text>added by {blog.user.name}</Text>
        {loggedUser.username !== blog.user.username ? (
          ''
        ) : (
          <Button size="xs" onClick={handleRemove}>
            remove
          </Button>
        )}
      </HStack>
      <Comments />
    </Box>
  );
};

export default BlogView;
