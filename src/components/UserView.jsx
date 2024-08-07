import { useState, useEffect } from 'react';
import { useMatch, Link } from 'react-router-dom';
import {
  Text,
  Heading,
  UnorderedList,
  ListItem,
  Divider,
  Box,
} from '@chakra-ui/react';

import userService from '../services/users';

const UserView = () => {
  const match = useMatch('/users/:id');
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService
      .user(match.params.id)
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [match.params.id]);

  if (!user) {
    return <Text>cannot find a user</Text>;
  }

  return (
    <Box>
      <Heading m={4}>{user.name}</Heading>
      <Divider mb={4} />
      {user.blogs.length === 0 ? (
        <Text>no blogs</Text>
      ) : (
        <>
          <UnorderedList>
            {user.blogs.map((b) => (
              <ListItem key={b.id}>
                <Link to={`/blogs/${b.id}`}>{b.title}</Link>
              </ListItem>
            ))}
          </UnorderedList>
        </>
      )}
    </Box>
  );
};

export default UserView;
