import React from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';

export const MessageList = ({
  messages,
  currentUser,
  isDark,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const outgoingBg = useColorModeValue('blue.500', 'blue.400');
  const incomingBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      flex="1"
      p={4}
      overflowY="auto"
      bg={bgColor}
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('gray.300', 'gray.600'),
          borderRadius: '24px',
        },
      }}
    >
      <VStack spacing={4} align="stretch">
        {messages.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text color={mutedColor}>No messages yet</Text>
          </Box>
        ) : (
          messages.map((message, index) => (
            <Box
              key={index}
              alignSelf={message.direction === 'outbound' ? 'flex-end' : 'flex-start'}
              maxW="70%"
            >
              <Box
                bg={message.direction === 'outbound' ? outgoingBg : incomingBg}
                color={message.direction === 'outbound' ? 'white' : textColor}
                px={4}
                py={2}
                borderRadius="lg"
              >
                <Text fontSize="sm">{message.message}</Text>
              </Box>
              <Text fontSize="xs" color={mutedColor} mt={1}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </Text>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};
