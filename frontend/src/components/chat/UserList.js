import React from 'react';
import {
  VStack,
  Box,
  Text,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';

export const UserList = ({ users, selectedUser, onSelectUser, messages }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  const getUserUnreadCount = (userId) => {
    return messages.filter(msg => 
      msg.from === userId && !msg.read
    ).length;
  };

  return (
    <VStack spacing={0} w="100%" h="100%" overflowY="auto">
      <Box p={4} w="100%">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search size={18} color={mutedColor} />
          </InputLeftElement>
          <Input
            placeholder="Search conversations..."
            variant="filled"
            size="sm"
            borderRadius="md"
          />
        </InputGroup>
      </Box>

      <Box w="100%" overflowY="auto">
        <Text px={4} py={2} fontSize="sm" fontWeight="medium" color={mutedColor}>
          All Conversations
        </Text>

        {users.map((user) => {
          const unreadCount = getUserUnreadCount(user.phoneNumber);
          const lastMessage = messages
            .filter(msg => msg.from === user.phoneNumber || msg.to === user.phoneNumber)
            .pop();

          return (
            <Box
              key={user.phoneNumber}
              p={3}
              cursor="pointer"
              bg={selectedUser === user.phoneNumber ? selectedBg : bgColor}
              _hover={{ bg: selectedUser === user.phoneNumber ? selectedBg : hoverBg }}
              onClick={() => onSelectUser(user.phoneNumber)}
              display="flex"
              alignItems="center"
              gap={3}
            >
              <Avatar
                size="sm"
                name={user.name}
                src={user.avatar}
              />
              <Box flex="1">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {user.name}
                  </Text>
                  {unreadCount > 0 && (
                    <Badge colorScheme="green" borderRadius="full">
                      {unreadCount}
                    </Badge>
                  )}
                </Box>
                {lastMessage && (
                  <Text fontSize="xs" color={mutedColor} noOfLines={1}>
                    {lastMessage.message}
                  </Text>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </VStack>
  );
};
