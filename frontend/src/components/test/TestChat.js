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
  useColorMode,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Plus,
} from '@chakra-ui/react';
import { socket } from '../../socket';
import { SearchIcon, ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import { BsEmojiSmile, BsPaperclip, BsMic, BsCalendarEvent } from 'react-icons/bs';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export const TestChat = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Test User',
      phone: '+16267888830',
      avatar: 'TU',
      lastMessage: 'No messages yet',
      time: '2m ago'
    },
    {
      id: 2,
      name: 'Test User2',
      phone: '+16265539681',
      avatar: 'TU2',
      lastMessage: 'No messages yet',
      time: '1m ago'
    },
    {
      id: 3,
      name: 'Test User3',
      phone: '+16265539682',
      avatar: 'TU3',
      lastMessage: 'No messages yet',
      time: 'Just now'
    }
  ]);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const messageBg = useColorModeValue('gray.100', 'gray.700');
  const outboundMessageBg = useColorModeValue('blue.500', 'blue.400');

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
        
        if (isDuplicate) return prev;
        return [...prev, data];
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

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: 'Error',
        description: 'Please fill in both name and phone number',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const newContactData = {
      id: contacts.length + 1,
      name: newContact.name,
      phone: newContact.phone,
      avatar: newContact.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      lastMessage: 'No messages yet',
      time: 'Just now'
    };

    setContacts(prev => [...prev, newContactData]);
    setNewContact({ name: '', phone: '' });
    setIsNewContactModalOpen(false);
    setPhone(newContactData.phone); // Select the new contact

    toast({
      title: 'Contact added',
      description: `${newContactData.name} has been added to your contacts`,
      status: 'success',
      duration: 3000,
    });
  };

  const ResizeHandle = () => (
    <PanelResizeHandle className="ResizeHandleOuter">
      <Box 
        w="4px" 
        bg={borderColor} 
        h="100%" 
        cursor="col-resize"
        _hover={{ bg: 'blue.500' }}
        transition="background 0.2s"
      />
    </PanelResizeHandle>
  );

  return (
    <Box 
      h="100vh" 
      bg={bg}
      position="relative"
    >
      <PanelGroup direction="horizontal">
        {/* Left Panel - User List */}
        <Panel defaultSize={20} minSize={15}>
          <VStack h="100%" spacing={0} borderRight="1px" borderColor={borderColor}>
            <Box p={4} w="100%" borderBottom="1px" borderColor={borderColor}>
              <HStack spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color={mutedTextColor} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search conversations"
                    variant="filled"
                    bg={inputBg}
                    _focus={{ bg: isDark ? 'gray.600' : 'white' }}
                    color={textColor}
                  />
                </InputGroup>
                <IconButton
                  icon={<Plus />}
                  onClick={() => setIsNewContactModalOpen(true)}
                  colorScheme="blue"
                  variant="ghost"
                  aria-label="Add new contact"
                />
              </HStack>
            </Box>
            
            <Box p={2} w="100%">
              <HStack justify="space-between" px={2}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    size="sm"
                    variant="ghost"
                    color={textColor}
                  >
                    All
                  </MenuButton>
                  <MenuList bg={bg} borderColor={borderColor}>
                    <MenuItem>All Messages</MenuItem>
                    <MenuItem>Unread</MenuItem>
                    <MenuItem>Archived</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Box>

            <VStack flex={1} w="100%" overflowY="auto" spacing={0} align="stretch">
              {contacts.map((contact) => (
                <Box 
                  key={contact.id}
                  p={3} 
                  _hover={{ bg: isDark ? 'gray.700' : 'gray.50' }} 
                  cursor="pointer"
                  bg={phone === contact.phone ? (isDark ? 'gray.700' : 'blue.50') : 'transparent'}
                  onClick={() => setPhone(contact.phone)}
                >
                  <HStack spacing={3}>
                    <Avatar size="sm" name={contact.name} bg="purple.500">
                      {contact.avatar}
                    </Avatar>
                    <Box flex={1}>
                      <HStack justify="space-between">
                        <Text fontWeight="medium" color={textColor}>{contact.name}</Text>
                        <Text fontSize="xs" color={mutedTextColor}>{contact.time}</Text>
                      </HStack>
                      <Text fontSize="sm" color={mutedTextColor} noOfLines={1}>
                        {messages.filter(m => m.to === contact.phone || m.from === contact.phone).slice(-1)[0]?.message || contact.lastMessage}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Panel>

        <ResizeHandle />

        {/* Middle Panel - Chat Area */}
        <Panel defaultSize={55} minSize={30}>
          <VStack h="100%" spacing={0}>
            {/* Chat Header */}
            <Box p={4} w="100%" borderBottom="1px" borderColor={borderColor}>
              <HStack justify="space-between">
                <HStack>
                  <Avatar size="sm" name="Test User" />
                  <Box>
                    <Text fontWeight="medium" color={textColor}>Test User</Text>
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
                  color={textColor}
                />
              </HStack>
            </Box>

            {/* Messages Area */}
            <Box 
              flex={1} 
              w="100%" 
              overflowY="auto" 
              p={4}
              bg={isDark ? 'gray.900' : 'gray.50'}
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
                        bg={isOutbound ? outboundMessageBg : bg}
                        color={isOutbound ? 'white' : textColor}
                        p={3}
                        rounded="lg"
                        shadow="sm"
                      >
                        <Text>{msg.message}</Text>
                        <Text 
                          fontSize="xs" 
                          color={isOutbound ? 'whiteAlpha.800' : mutedTextColor}
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
            <Box p={4} w="100%" borderTop="1px" borderColor={borderColor}>
              <HStack spacing={2}>
                <IconButton
                  icon={<BsEmojiSmile />}
                  variant="ghost"
                  aria-label="Add emoji"
                  color={textColor}
                />
                <IconButton
                  icon={<BsPaperclip />}
                  variant="ghost"
                  aria-label="Attach file"
                  color={textColor}
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
                  bg={inputBg}
                  color={textColor}
                />
                <IconButton
                  icon={<BsMic />}
                  variant="ghost"
                  aria-label="Voice message"
                  color={textColor}
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
        </Panel>

        <ResizeHandle />

        {/* Right Panel - User Details */}
        <Panel defaultSize={25} minSize={15}>
          <VStack h="100%" p={6} spacing={6} align="stretch" borderLeft="1px" borderColor={borderColor}>
            <VStack spacing={4} align="center">
              <Avatar size="xl" name="Test User" />
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="medium" color={textColor}>Test User</Text>
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
                  <Text color={textColor}>{phone || 'Not set'}</Text>
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
        </Panel>
      </PanelGroup>
    </Box>

    {/* New Contact Modal */}
    <Modal isOpen={isNewContactModalOpen} onClose={() => setIsNewContactModalOpen(false)}>
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader color={textColor}>Add New Contact</ModalHeader>
        <ModalCloseButton color={textColor} />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color={textColor}>Name</FormLabel>
              <Input
                placeholder="Enter contact name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                bg={inputBg}
                color={textColor}
              />
            </FormControl>
            <FormControl>
              <FormLabel color={textColor}>Phone</FormLabel>
              <Input
                placeholder="Enter phone number"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                bg={inputBg}
                color={textColor}
              />
            </FormControl>
            <Button colorScheme="blue" w="100%" onClick={handleAddContact}>
              Add Contact
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
