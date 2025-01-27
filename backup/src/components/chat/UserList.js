import React from "react";
import { VStack, HStack, Avatar, Text, Box, Badge } from "@chakra-ui/react";

export const UserList = ({
  users,
  selectedUser,
  onSelectUser,
  isDark,
}) => {
  return (
    <VStack spacing={0} w="100%" overflow="auto">
      {users.map((user) => (
        <Box
          key={user.id}
          w="100%"
          p={3}
          cursor="pointer"
          bg={selectedUser === user.id ? (isDark ? "gray.700" : "blue.50") : "transparent"}
          _hover={{ bg: isDark ? "gray.700" : "gray.100" }}
          onClick={() => onSelectUser(user.id)}
        >
          <HStack spacing={3}>
            <Avatar size="sm" src={user.avatar} name={user.name} />
            <Box flex={1}>
              <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="medium">
                  {user.name}
                </Text>
                <Text fontSize="xs" color={isDark ? "gray.400" : "gray.500"}>
                  {user.time}
                </Text>
              </HStack>
              <HStack justify="space-between" mt={1}>
                <Text fontSize="xs" color={isDark ? "gray.400" : "gray.500"} noOfLines={1}>
                  {user.lastMessage}
                </Text>
                {user.isNew && (
                  <Badge colorScheme="blue" borderRadius="full" fontSize="xs">
                    {user.newCount}
                  </Badge>
                )}
              </HStack>
              {user.phoneNumber && (
                <Text fontSize="xs" color={isDark ? "gray.400" : "gray.500"}>
                  {user.phoneNumber}
                </Text>
              )}
            </Box>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};
