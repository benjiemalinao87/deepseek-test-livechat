import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

export const MessageList = ({ messages = [] }) => {
  return (
    <Box 
      flex="1" 
      p={4} 
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'gray.300',
          borderRadius: '24px',
        },
      }}
    >
      <VStack spacing={4} align="stretch">
        {messages.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text color="gray.500">No messages yet</Text>
          </Box>
        ) : (
          messages.map((msg, index) => {
            const isOutbound = msg.from === 'me' || msg.direction === 'outbound';
            const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <Box 
                key={index}
                alignSelf={isOutbound ? 'flex-end' : 'flex-start'}
                maxW="70%"
              >
                <Box
                  bg={isOutbound ? 'blue.500' : 'gray.100'}
                  color={isOutbound ? 'white' : 'black'}
                  p={3}
                  borderRadius="lg"
                  position="relative"
                >
                  <Text>{msg.message}</Text>
                  <Text
                    fontSize="xs"
                    color={isOutbound ? 'whiteAlpha.700' : 'gray.500'}
                    textAlign="right"
                    mt={1}
                  >
                    {time}
                  </Text>
                </Box>
              </Box>
            );
          })
        )}
      </VStack>
    </Box>
  );
};
