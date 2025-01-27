import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
  Button,
  Heading,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { BsCalendarEvent } from 'react-icons/bs';

export const UserDetails = ({ selectedContact }) => {
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack h="100%" p={6} spacing={6} align="stretch" borderLeft="1px" borderColor={borderColor}>
      <VStack spacing={4} align="center">
        <Avatar 
          size="xl" 
          name={selectedContact?.name || "Unknown"}
          bg="purple.500"
        >
          {selectedContact?.avatar}
        </Avatar>
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="medium" color={textColor}>
            {selectedContact?.name || "Select a contact"}
          </Text>
          <HStack justify="center" mt={2} spacing={2}>
            <Badge colorScheme="green">CUSTOMER</Badge>
            <Badge colorScheme="blue">OPEN</Badge>
          </HStack>
        </Box>
      </VStack>

      <Divider />

      <VStack spacing={4} align="stretch">
        <Heading size="sm" color={textColor}>Contact Information</Heading>
        <VStack spacing={3} align="stretch">
          <HStack>
            <Text color={mutedTextColor}>Phone:</Text>
            <Text color={textColor}>{selectedContact?.phone || 'Not set'}</Text>
          </HStack>
          <HStack>
            <Text color={mutedTextColor}>Location:</Text>
            <Text color={textColor}>San Francisco, CA</Text>
          </HStack>
        </VStack>
      </VStack>

      <Button
        leftIcon={<BsCalendarEvent />}
        colorScheme="blue"
        variant="outline"
        w="100%"
      >
        Schedule Meeting
      </Button>
    </VStack>
  );
};
