import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Flex, Spacer, Text } from '@chakra-ui/react';

const Blog = ({ blog }) => {
  const navigate = useNavigate();

  const handleLink = (id) => () => {
    navigate(`/blogs/${id}`);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      onClick={handleLink(blog.id)}
      _hover={{ bg: 'aliceblue' }}
      cursor="pointer"
      p="2"
    >
      <Flex>
        <Text>
          {blog.title} - {blog.author}
        </Text>
        <Spacer />
        <Text>{blog.likes}🙂</Text>
      </Flex>
    </Box>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
};

export default Blog;
