import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Container,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { socket } from '../../socket';

export const TestChat = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Socket connection status
    socket.on('connect', () => {
      console.log('✅ Connected to socket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket');
      setIsConnected(false);
    });

    // Listen for new messages
    socket.on('new_message', (data) => {
      console.log('📥 Received message:', data);
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_message');
    };
  }, []);

  const handleSendMessage = async () => {
    if (!message || !phone) {
      toast({
        title: 'Error',
        description: 'Please enter both phone number and message',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const response = await fetch('https://cc.automate8.com/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: message,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('');
        toast({
          title: 'Message sent',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.sm" py={5}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Test Chat</Heading>
        <Text color={isConnected ? 'green.500' : 'red.500'}>
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </Text>

        <Box>
          <Input
            placeholder="Enter phone number (e.g., +1234567890)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            mb={2}
          />
        </Box>

        <Box 
          h="400px" 
          border="1px" 
          borderColor="gray.200" 
          borderRadius="md" 
          overflowY="auto"
          p={4}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              bg={msg.direction === 'outbound' ? 'blue.100' : 'gray.100'}
              p={2}
              my={1}
              borderRadius="md"
              alignSelf={msg.direction === 'outbound' ? 'flex-end' : 'flex-start'}
            >
              <Text fontSize="sm" color="gray.500">
                {msg.direction === 'outbound' ? 'You' : msg.from}
              </Text>
              <Text>{msg.message}</Text>
              <Text fontSize="xs" color="gray.500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Text>
            </Box>
          ))}
        </Box>

        <Box>
          <Input
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            mb={2}
          />
          <Button 
            colorScheme="blue" 
            onClick={handleSendMessage}
            isDisabled={!isConnected || !phone || !message}
          >
            Send Message
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};
