import { useSelector } from 'react-redux';
import { Alert, AlertIcon } from '@chakra-ui/react';

const Notification = () => {
  const info = useSelector(({ notification }) => notification);

  if (!info) {
    return null;
  }

  return (
    <Alert status={info.type}>
      <AlertIcon />
      {info.message}
    </Alert>
  );
};

export default Notification;
