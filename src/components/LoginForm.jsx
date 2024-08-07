import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Box,
} from '@chakra-ui/react';

import { setLoggedUser } from '../slices/loggedUserSlice';
import { setNotification } from '../slices/notificationSlice';

import blogService from '../services/blogs';
import loginService from '../services/login';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      dispatch(setLoggedUser(user));
      blogService.setToken(user.token);
      dispatch(setNotification(`welcome, ${user.name}`));
      navigate('/');
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'error'));
    }

    setUsername('');
    setPassword('');
  };

  return (
    <Box rounded={'lg'} boxShadow={'lg'} p={8} m={8}>
      <Stack>
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input
            data-testid="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            data-testid="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button onClick={handleLogin}>login</Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
