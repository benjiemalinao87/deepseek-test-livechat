import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, useColorMode, VStack, IconButton, useToast, Image, HStack, Flex, AnimatePresence } from '@chakra-ui/react';
import { UserList } from './components/chat/UserList';
import { MessageList } from './components/chat/MessageList';
import { MessageInput } from './components/chat/MessageInput';
import { ContactForm } from './components/chat/ContactForm';
import { Plus, Moon, Sun, MessageCircle, ChatIcon, SettingsIcon, InfoIcon } from 'lucide-react';
import { socket } from './socket';
import axios from 'axios';
import { DockWindow } from './components/dock/DockWindow';
import { ChatWindow } from './components/windows/ChatWindow';
import { SettingsWindow } from './components/windows/SettingsWindow';
import { AboutWindow } from './components/windows/AboutWindow';

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
  const [selectedWindow, setSelectedWindow] = useState('chat');
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
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <Flex direction="column" h="100vh">
          <Header colorMode={colorMode} toggleColorMode={toggleColorMode} />
          
          {/* Dock */}
          <Flex 
            position="fixed" 
            bottom="20px" 
            left="50%" 
            transform="translateX(-50%)" 
            bg={useColorModeValue('white', 'gray.800')} 
            borderRadius="full" 
            boxShadow="xl" 
            p={2}
            zIndex={1000}
          >
            <IconButton
              icon={<ChatIcon />}
              aria-label="Chat"
              colorScheme="blue"
              variant="ghost"
              size="lg"
              onClick={() => setSelectedWindow('chat')}
              isActive={selectedWindow === 'chat'}
              mx={1}
            />
            <IconButton
              icon={<SettingsIcon />}
              aria-label="Settings"
              colorScheme="blue"
              variant="ghost"
              size="lg"
              onClick={() => setSelectedWindow('settings')}
              isActive={selectedWindow === 'settings'}
              mx={1}
            />
            <IconButton
              icon={<InfoIcon />}
              aria-label="About"
              colorScheme="blue"
              variant="ghost"
              size="lg"
              onClick={() => setSelectedWindow('about')}
              isActive={selectedWindow === 'about'}
              mx={1}
            />
          </Flex>

          {/* Windows Container */}
          <Flex flex="1" position="relative" overflow="hidden">
            <AnimatePresence>
              {selectedWindow === 'chat' && (
                <ChatWindow
                  key="chat"
                  isConnected={connected}
                  messages={messages}
                  selectedUser={selectedUser}
                  onUserSelect={setSelectedUser}
                  onSendMessage={handleSendMessage}
                />
              )}
              {selectedWindow === 'settings' && (
                <SettingsWindow
                  key="settings"
                />
              )}
              {selectedWindow === 'about' && (
                <AboutWindow
                  key="about"
                />
              )}
            </AnimatePresence>
          </Flex>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;