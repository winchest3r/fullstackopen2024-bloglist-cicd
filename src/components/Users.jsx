import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

import userService from '../services/users';

import { setNotification } from '../slices/notificationSlice';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleLink = (id) => () => {
    navigate(`/users/${id}`);
  };

  useEffect(() => {
    userService
      .users()
      .then((data) => setUsers(data))
      .catch((exception) => setNotification(exception.response.data.error));
  }, []);

  let updatedUsers = [];
  for (const user of users) {
    const data = {
      ...user,
      totalLikes: user.blogs
        .map((b) => b.likes)
        .reduce((acc, val) => acc + val, 0),
    };
    updatedUsers = updatedUsers.concat(data);
  }
  updatedUsers.sort((a, b) => b.totalLikes - a.totalLikes);

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>user</Th>
            <Th>name</Th>
            <Th>blogs created</Th>
            <Th>likes total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {updatedUsers.map((user) => (
            <Tr
              key={user.id}
              onClick={handleLink(user.id)}
              cursor="pointer"
              _hover={{ bg: 'aliceblue' }}
            >
              <Td>{user.username}</Td>
              <Td>{user.name}</Td>
              <Td>{user.blogs.length}</Td>
              <Td>{user.totalLikes}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Users;
