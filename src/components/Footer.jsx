import { Text, Link, HStack, Divider } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const repositoryLink = 'https://github.com/winchest3r/fullstackopen2024';
const courseLink = 'https://fullstackopen.com/en/';

const Footer = () => {
  return (
    <HStack divider={<Divider orientation="vertical" />}>
      <Link href={repositoryLink}>
        github repository
        <ExternalLinkIcon />
      </Link>
      <Link href={courseLink}>
        full stack open course
        <ExternalLinkIcon />
      </Link>
      <Text>2024</Text>
    </HStack>
  );
};

export default Footer;
