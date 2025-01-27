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
  Flex,
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

    // Debug connection test
    socket.on('connection_test', (data) => {
      console.log('🔌 Connection test:', data);
      toast({
        title: 'Socket Connected',
        description: `Socket ID: ${data.socketId}`,
        status: 'success',
        duration: 3000,
      });
    });

    // Listen for new messages
    socket.on('new_message', (data) => {
      console.log('📥 Received message:', data);
      
      // Validate message data
      if (!data || !data.message) {
        console.warn('⚠️ Invalid message data:', data);
        return;
      }

      // Add message to state
      setMessages(prev => {
        // Check for duplicates
        const isDuplicate = prev.some(m => 
          m.messageSid === data.messageSid || 
          (m.timestamp === data.timestamp && m.message === data.message)
        );
        
        if (isDuplicate) {
          console.log('📝 Duplicate message, skipping');
          return prev;
        }

        const newMessages = [...prev, data];
        console.log('📝 Updated messages:', newMessages);
        return newMessages;
      });

      // Show notification for inbound messages
      if (data.direction === 'inbound') {
        toast({
          title: 'New Message',
          description: `From: ${data.from}\n${data.message}`,
          status: 'info',
          duration: 3000,
        });
      }
    });

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connection_test');
      socket.off('new_message');
    };
  }, [toast]);

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
          display="flex"
          flexDirection="column"
          gap={2}
        >
          {messages.map((msg, index) => {
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
                >
                  <Text fontSize="xs" color={isOutbound ? 'blue.100' : 'gray.500'} mb={1}>
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
          })}
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
