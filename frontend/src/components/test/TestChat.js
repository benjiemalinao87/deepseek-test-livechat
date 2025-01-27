import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Input,
  Button,
  Text,
  useToast,
  Container,
  Heading,
  Flex,
  VStack,
  HStack,
  Avatar,
  IconButton,
  InputGroup,
  InputLeftElement,
  Badge,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { socket } from '../../socket';
import { SearchIcon, ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import { BsEmojiSmile, BsPaperclip, BsMic, BsCalendarEvent } from 'react-icons/bs';

export const TestChat = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to socket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket');
      setIsConnected(false);
    });

    socket.on('new_message', (data) => {
      console.log('📥 Received message:', data);
      if (!data || !data.message) {
        console.warn('⚠️ Invalid message data:', data);
        return;
      }

      setMessages(prev => {
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

      if (data.direction === 'inbound') {
        toast({
          title: 'New Message',
          description: `From: ${data.from}\n${data.message}`,
          status: 'info',
          duration: 3000,
        });
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
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
      console.log('📤 Sending message:', {
        to: phone,
        message: message
      });

      const response = await fetch('https://cc.automate8.com/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: message.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const outboundMessage = {
          from: '+13256665486',
          to: phone,
          message: message.trim(),
          timestamp: new Date().toISOString(),
          direction: 'outbound',
          messageSid: data.messageSid,
          status: data.status
        };

        setMessages(prev => {
          const isDuplicate = prev.some(m => 
            m.messageSid === data.messageSid || 
            (m.timestamp === outboundMessage.timestamp && m.message === outboundMessage.message)
          );
          
          if (isDuplicate) return prev;

          return [...prev, outboundMessage];
        });

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
      console.error('❌ Send message error:', error);
      toast({
        title: 'Error sending message',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box h="100vh" bg="gray.50">
      <Grid
        templateColumns="300px 1fr 300px"
        h="100%"
        gap={0}
        bg="white"
        shadow="lg"
        rounded="lg"
        overflow="hidden"
      >
        {/* Left Panel - User List */}
        <GridItem borderRight="1px" borderColor="gray.200" bg="white">
          <VStack h="100%" spacing={0}>
            <Box p={4} w="100%" borderBottom="1px" borderColor="gray.200">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search conversations"
                  variant="filled"
                  bg="gray.100"
                  _focus={{ bg: 'white' }}
                />
              </InputGroup>
            </Box>
            
            <Box p={2} w="100%">
              <HStack justify="space-between" px={2}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    size="sm"
                    variant="ghost"
                  >
                    All
                  </MenuButton>
                  <MenuList>
                    <MenuItem>All Messages</MenuItem>
                    <MenuItem>Unread</MenuItem>
                    <MenuItem>Archived</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Box>

            <VStack flex={1} w="100%" overflowY="auto" spacing={0} align="stretch">
              {/* Contact Item */}
              <Box 
                p={3} 
                _hover={{ bg: 'gray.50' }} 
                cursor="pointer"
                bg={phone ? 'blue.50' : 'transparent'}
                onClick={() => setPhone('+16267888830')}
              >
                <HStack spacing={3}>
                  <Avatar size="sm" name="Test User" />
                  <Box flex={1}>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Test User</Text>
                      <Text fontSize="xs" color="gray.500">2m ago</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" noOfLines={1}>
                      {messages[messages.length - 1]?.message || 'No messages yet'}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </VStack>
        </GridItem>

        {/* Middle Panel - Chat Area */}
        <GridItem>
          <VStack h="100%" spacing={0}>
            {/* Chat Header */}
            <Box p={4} w="100%" borderBottom="1px" borderColor="gray.200">
              <HStack justify="space-between">
                <HStack>
                  <Avatar size="sm" name="Test User" />
                  <Box>
                    <Text fontWeight="medium">Test User</Text>
                    <HStack justify="center" mt={2} spacing={2}>
                      <Badge colorScheme="green">CUSTOMER</Badge>
                      <Badge colorScheme="blue">OPEN</Badge>
                    </HStack>
                  </Box>
                </HStack>
                <IconButton
                  icon={<CloseIcon />}
                  variant="ghost"
                  size="sm"
                  aria-label="Close chat"
                />
              </HStack>
            </Box>

            {/* Messages Area */}
            <Box 
              flex={1} 
              w="100%" 
              overflowY="auto" 
              p={4}
              bg="gray.50"
            >
              <VStack spacing={4} align="stretch">
                {messages.map((msg, index) => {
                  const isOutbound = msg.direction === 'outbound';
                  return (
                    <Flex
                      key={index}
                      justify={isOutbound ? 'flex-end' : 'flex-start'}
                    >
                      <Box
                        maxW="70%"
                        bg={isOutbound ? 'blue.500' : 'white'}
                        color={isOutbound ? 'white' : 'black'}
                        p={3}
                        rounded="lg"
                        shadow="sm"
                      >
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
              </VStack>
            </Box>

            {/* Message Input */}
            <Box p={4} w="100%" borderTop="1px" borderColor="gray.200">
              <HStack spacing={2}>
                <IconButton
                  icon={<BsEmojiSmile />}
                  variant="ghost"
                  aria-label="Add emoji"
                />
                <IconButton
                  icon={<BsPaperclip />}
                  variant="ghost"
                  aria-label="Attach file"
                />
                <Input
                  placeholder="Type your message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <IconButton
                  icon={<BsMic />}
                  variant="ghost"
                  aria-label="Voice message"
                />
                <Button
                  colorScheme="blue"
                  onClick={handleSendMessage}
                  isDisabled={!message.trim() || !phone}
                >
                  Send
                </Button>
              </HStack>
            </Box>
          </VStack>
        </GridItem>

        {/* Right Panel - User Details */}
        <GridItem borderLeft="1px" borderColor="gray.200" bg="white">
          <VStack h="100%" p={6} spacing={6} align="stretch">
            <VStack spacing={4} align="center">
              <Avatar size="xl" name="Test User" />
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="medium">Test User</Text>
                <HStack justify="center" mt={2} spacing={2}>
                  <Badge colorScheme="green">CUSTOMER</Badge>
                  <Badge colorScheme="blue">OPEN</Badge>
                </HStack>
              </Box>
            </VStack>

            <Divider />

            <VStack spacing={4} align="stretch">
              <Heading size="sm">Contact Information</Heading>
              <VStack spacing={3} align="stretch">
                <HStack>
                  <Text color="gray.500">Phone:</Text>
                  <Text>{phone || 'Not set'}</Text>
                </HStack>
                <HStack>
                  <Text color="gray.500">Location:</Text>
                  <Text>San Francisco, CA</Text>
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
        </GridItem>
      </Grid>
    </Box>
  );
};
