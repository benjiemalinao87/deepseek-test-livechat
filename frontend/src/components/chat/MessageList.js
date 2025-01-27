import React, { useRef, useEffect } from 'react';
import { Box, VStack, Text, Flex } from '@chakra-ui/react';

export const MessageList = ({ messages = [] }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <VStack
      flex="1"
      w="full"
      spacing={4}
      overflowY="auto"
      p={4}
      align="stretch"
    >
      {messages.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">No messages yet</Text>
        </Box>
      ) : (
        messages.map((msg, index) => {
          const isOutbound = msg.direction === 'outbound';
          return (
            <Flex
              key={index}
              w="100%"
              justify={isOutbound ? 'flex-end' : 'flex-start'}
            >
              <Box
                maxW="80%"
                bg={isOutbound ? 'blue.500' : 'gray.100'}
                color={isOutbound ? 'white' : 'black'}
                p={3}
                borderRadius="lg"
                borderTopRightRadius={isOutbound ? '4px' : 'lg'}
                borderTopLeftRadius={!isOutbound ? '4px' : 'lg'}
                shadow="sm"
              >
                <Text 
                  fontSize="xs" 
                  color={isOutbound ? 'blue.100' : 'gray.500'} 
                  mb={1}
                  fontWeight="medium"
                >
                  {isOutbound ? 'You' : msg.from}
                </Text>
                <Text>{msg.message}</Text>
                <Text 
                  fontSize="xs" 
                  color={isOutbound ? 'blue.100' : 'gray.500'}
                  textAlign="right"
                  mt={1}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Text>
              </Box>
            </Flex>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </VStack>
  );
};
