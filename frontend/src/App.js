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
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    // Listen for all possible inbound SMS events
    const inboundEvents = ['new_message'];
    
    console.log('🎧 Setting up listeners for events:', inboundEvents);

    inboundEvents.forEach(event => {
      socket.on(event, (data) => {
        console.log(`📥 New message on ${event}:`, data);
        try {
          // Handle array of messages
          const messages = Array.isArray(data) ? data : [data];
          
          messages.forEach(messageData => {
            console.log('📦 Processing message:', messageData);
            
            // Try to parse if message is a string
            const parsedData = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
            
            const formattedMessage = {
              from: parsedData.From || parsedData.from || parsedData.sender || parsedData.phoneNumber,
              to: parsedData.To || parsedData.to || parsedData.recipient || 'me',
              message: parsedData.Body || parsedData.body || parsedData.text || parsedData.message || parsedData.content,
              timestamp: parsedData.timestamp || parsedData.time || new Date().toISOString(),
              direction: 'inbound'
            };
            
            // Validate message
            if (!formattedMessage.from || !formattedMessage.message) {
              console.warn('⚠️ Invalid message format:', parsedData);
              return;
            }
            
            console.log('✨ Adding formatted message:', formattedMessage);
            setMessages(prev => {
              const newMessages = [...prev, formattedMessage];
              console.log('📚 Updated messages:', newMessages);
              return newMessages;
            });
            
            toast({
              title: 'New Message',
              description: `From: ${formattedMessage.from}`,
              status: 'info',
              duration: 5000,
              isClosable: true,
            });
          });
        } catch (error) {
          console.error('❌ Error processing message:', {
            error: error.message,
            originalData: data
          });
        }
      });
    });

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      inboundEvents.forEach(event => socket.off(event));
    };
  }, [toast]);

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

      // Add sent message to messages state
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
          bg={isDark ? 'rgba(26, 32, 44, 0.7)' : 'rgba(255, 255, 255, 0.7)'}
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