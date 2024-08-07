import { useSelector, useDispatch } from 'react-redux';
import { Button, Text, HStack } from '@chakra-ui/react';

import blogService from '../services/blogs';

import { setLoggedUser } from '../slices/loggedUserSlice';
import { setNotification } from '../slices/notificationSlice';

const LogoutForm = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector(({ loggedUser }) => loggedUser);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    dispatch(setLoggedUser(null));
    blogService.setToken('');
    dispatch(setNotification('you are successfully logged out'));
  };

  if (!loggedUser) {
    return null;
  }

  return (
    <HStack>
      <Text>{loggedUser.name} is logged in</Text>
      <Button onClick={handleLogout} variant="outline" size="xs">
        logout
      </Button>
    </HStack>
  );
};

export default LogoutForm;
