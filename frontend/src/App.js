import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, useColorMode, VStack, IconButton, useToast, Image, HStack, Button } from '@chakra-ui/react';
import { UserList } from './components/chat/UserList';
import { MessageList } from './components/chat/MessageList';
import { MessageInput } from './components/chat/MessageInput';
import { ContactForm } from './components/chat/ContactForm';
import { Plus, Moon, Sun, MessageCircle } from 'lucide-react';
import { socket } from './socket';
import axios from 'axios';
import { DockWindow } from './components/dock/DockWindow';
import { TestChat } from './components/test/TestChat';

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
  const [showTestChat, setShowTestChat] = useState(false);
  const toast = useToast();

  const isDark = colorMode === 'dark';

  useEffect(() => {
    const inboundEvents = ['new_message'];
    console.log('🎧 Setting up listeners for events:', inboundEvents);

    inboundEvents.forEach(event => {
      socket.on(event, (rawData) => {
        console.log(`📥 Raw socket event:`, rawData);
        try {
          // Extract message data
          let messageData;
          
          // Handle different message formats
          if (rawData && typeof rawData === 'object') {
            console.log('📦 Processing message object:', rawData);
            
            // Use the message data directly as it's already formatted by the backend
            messageData = {
              from: rawData.from,
              to: rawData.to,
              message: rawData.message,
              timestamp: rawData.timestamp || new Date().toISOString(),
              direction: rawData.direction || 'inbound',
              messageSid: rawData.messageSid,
              status: rawData.status
            };
            
            console.log('✨ Formatted message:', messageData);
          } else {
            console.warn('⚠️ Unexpected message format:', rawData);
            return;
          }
          
          // Validate message
          if (!messageData.from || !messageData.message) {
            console.warn('⚠️ Invalid message:', messageData);
            return;
          }

          console.log('✨ Adding message to UI:', messageData);
          
          // Update messages state with the new message
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const exists = prev.some(m => m.messageSid === messageData.messageSid);
            if (exists) {
              console.log('📝 Message already exists, skipping:', messageData.messageSid);
              return prev;
            }
            return [...prev, messageData];
          });
          
          // Show notification for inbound messages
          toast({
            title: 'New Message',
            description: `From: ${messageData.from}\n${messageData.message}`,
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          console.error('❌ Error handling message:', {
            error: error.message,
            rawData
          });
        }
      });
    });

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      inboundEvents.forEach(event => socket.off(event));
    };
  }, [toast, setMessages]);

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
    if (!selectedUser || !message.trim()) return;

    try {
      const response = await fetch('https://cc.automate8.com/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedUser,
          message: message.trim()
        })
      });

      const responseData = await response.json();
      console.log('SMS API Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to send message');
      }

      const sentMessage = {
        from: 'me',
        to: selectedUser,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        direction: 'outbound'
      };
      console.log('Sent message:', sentMessage);
      setMessages(prev => [...prev, sentMessage]);
      
      setMessage('');
      toast({
        title: 'Message Sent',
        description: 'SMS sent successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
        
        {/* Test Chat Toggle */}
        <Box position="fixed" right="4" top="4">
          <Button onClick={toggleColorMode} size="sm">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </Box>
        
        <VStack spacing={4} p={4}>
          <Button onClick={() => setShowTestChat(!showTestChat)}>
            {showTestChat ? 'Show Dock UI' : 'Show Test Chat'}
          </Button>
          
          {showTestChat ? (
            <TestChat />
          ) : (
            <DockWindow />
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;