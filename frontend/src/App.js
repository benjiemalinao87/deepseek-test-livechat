import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, useColorMode, VStack, IconButton, useToast, Image, HStack } from '@chakra-ui/react';
import { UserList } from './components/chat/UserList';
import { MessageList } from './components/chat/MessageList';
import { MessageInput } from './components/chat/MessageInput';
import { ContactForm } from './components/chat/ContactForm';
import { Plus, Moon, Sun, MessageCircle } from 'lucide-react';
import { socket } from './socket';
import axios from 'axios';
import { DockWindow } from './components/dock/DockWindow';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const isDark = colorMode === 'dark';

  useEffect(() => {
    console.log('🔧 Environment:', {
      apiUrl: process.env.REACT_APP_API_URL || 'https://cc.automate8.com',
      nodeEnv: process.env.NODE_ENV
    });

    const socket = socket;
    console.log('🔌 Socket connection initialized');

    // Debug socket connection
    socket.on('connect', () => {
      console.log('✅ Socket connected with ID:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('🚨 Socket connection error:', {
        message: error.message,
        type: error.type,
        description: error.description
      });
      setConnected(false);
    });

    // Handle inbound messages
    socket.on('new_message', (data) => {
      console.log('📥 Received inbound message:', data);
      const newMessage = {
        id: data.messageSid || Date.now(),
        from: data.from,
        message: data.message || data.Body,
        timestamp: new Date(),
        direction: data.direction || 'inbound'
      };
      console.log('💬 Processed message:', newMessage);
      setMessages(prev => [...prev, newMessage]);
    });

    // Debug all socket events
    socket.onAny((eventName, ...args) => {
      console.log('🎯 Socket Event:', {
        event: eventName,
        args: args
      });
    });

    return () => {
      console.log('🔌 Cleaning up socket connection');
      socket.off('new_message');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleSendMessage = async () => {
    try {
      console.log('📤 Sending message:', message);
      const response = await fetch('https://cc.automate8.com/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: selectedUser,
          message: message.trim()
        })
      });

      const result = await response.json();
      console.log('📨 Send message response:', result);

      if (result.success) {
        const newMessage = {
          id: result.messageSid || Date.now(),
          from: 'You',
          message: message.trim(),
          timestamp: new Date(),
          direction: 'outbound'
        };
        console.log('💬 Adding outbound message:', newMessage);
        setMessages(prev => [...prev, newMessage]);
      } else {
        console.error('❌ Failed to send message:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('🚨 Error sending message:', error);
      throw error;
    }
  };

  const handleAddContact = async (contact) => {
    setUsers(prev => [...prev, contact]);
    setShowAddContact(false);
    toast({
      title: 'Contact Added',
      description: 'Successfully added new contact',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredMessages = messages.filter(msg => 
    msg.from === selectedUser || msg.to === selectedUser
  );

  return (
    <ChakraProvider>
      <Box 
        minH="100vh" 
        position="relative"
        bgImage="url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        {/* Add a semi-transparent overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={isDark ? 'rgba(26, 32, 44, 0.3)' : 'transparent'}
          zIndex="0"
        />
        
        {/* Content */}
        <Box position="relative" zIndex="1">
          {/* Dock */}
          <Box
            position="fixed"
            bottom="20px"
            left="50%"
            transform="translateX(-50%)"
            bg={isDark ? 'gray.700' : 'white'}
            p={2}
            borderRadius="full"
            boxShadow="lg"
            zIndex={1000}
          >
            <HStack spacing={4}>
              <IconButton
                icon={<MessageCircle />}
                colorScheme="blue"
                variant="ghost"
                isRound
                onClick={() => setShowChat(true)}
              />
              <IconButton
                icon={isDark ? <Sun /> : <Moon />}
                onClick={toggleColorMode}
                variant="ghost"
                isRound
              />
            </HStack>
          </Box>

          {/* Chat Window */}
          {showChat && (
            <DockWindow title="LiveChat" onClose={() => setShowChat(false)}>
              <Box h="100%" display="flex">
                {/* Left Panel */}
                <Box w="300px" borderRight="1px solid" borderColor={isDark ? 'gray.700' : 'gray.200'}>
                  <VStack h="100%" spacing={0}>
                    <Box p={4} w="100%">
                      <IconButton
                        icon={<Plus />}
                        onClick={() => setShowAddContact(true)}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        isRound
                      />
                    </Box>
                    <UserList
                      users={users}
                      selectedUser={selectedUser}
                      onSelectUser={setSelectedUser}
                      messages={messages}
                    />
                  </VStack>
                </Box>

                {/* Right Panel */}
                <Box flex="1" display="flex" flexDirection="column">
                  <MessageList messages={filteredMessages} />
                  <MessageInput
                    message={message}
                    onChange={setMessage}
                    onSend={handleSendMessage}
                  />
                </Box>
              </Box>
            </DockWindow>
          )}

          {/* Add Contact Modal */}
          {showAddContact && (
            <ContactForm
              isOpen={showAddContact}
              onClose={() => setShowAddContact(false)}
              onAddContact={handleAddContact}
              isDark={isDark}
            />
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;