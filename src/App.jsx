import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Box,
  Flex,
  Spacer,
  Center,
} from '@chakra-ui/react';

import { setLoggedUser } from './slices/loggedUserSlice';

import blogService from './services/blogs';

import Notification from './components/Notification';
import Bloglist from './components/Bloglist';
import LoginForm from './components/LoginForm';
import LogoutForm from './components/LogoutForm';
import Users from './components/Users';
import UserView from './components/UserView';
import BlogView from './components/BlogView';
import Footer from './components/Footer';

const App = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector(({ loggedUser }) => loggedUser);

  useEffect(() => {
    const userJSON = window.localStorage.getItem('loggedUser');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      dispatch(setLoggedUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  return (
    <Container maxW="4xl">
      <Flex direction="column">
        <Flex borderRadius="lg" borderWidth="1px">
          <Box p="1">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/">blogs</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/users">users</Link>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
          <Spacer />
          <Box p="1">
            <LogoutForm />
          </Box>
        </Flex>

        <Notification />

        {loggedUser === null ? (
          <Center>
            <LoginForm />
          </Center>
        ) : (
          <Routes>
            <Route path="/" element={<Bloglist />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserView />} />
            <Route path="/blogs/:id" element={<BlogView />} />
          </Routes>
        )}
        <Spacer />
        <Center mt={4}>
          <Footer />
        </Center>
      </Flex>
    </Container>
  );
};

export default App;
