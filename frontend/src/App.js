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

  // Register phone number when user is selected
  useEffect(() => {
    if (selectedUser?.phone) {
      // Register the Twilio number to receive messages
      const twilioNumber = '+13256665486';
      console.log('📱 Registering numbers:', {
        twilio: twilioNumber,
        user: selectedUser.phone
      });
      
      // Register both numbers to receive messages
      socket.emit('register', twilioNumber);
      socket.emit('register', selectedUser.phone);

      socket.on('registered', (data) => {
        console.log('✅ Number registered:', data);
        toast({
          title: 'Chat Ready',
          description: `Connected to ${selectedUser.name}`,
          status: 'success',
          duration: 3000,
        });
      });
    }
    return () => socket.off('registered');
  }, [selectedUser, toast]);

  // Handle messages
  useEffect(() => {
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

    return () => socket.off('new_message');
  }, [toast]);

  // Connection status
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to socket');
      setConnected(true);

      // Re-register numbers if user is selected
      if (selectedUser?.phone) {
        const twilioNumber = '+13256665486';
        socket.emit('register', twilioNumber);
        socket.emit('register', selectedUser.phone);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket');
      setConnected(false);
      toast({
        title: 'Disconnected',
        status: 'warning',
        duration: 3000,
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [selectedUser, toast]);

  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) return;

    try {
      console.log('📤 Sending message:', {
        to: selectedUser.phone,
        message: message
      });

      const response = await fetch('https://cc.automate8.com/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedUser.phone,
          message: message.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Create outbound message object
        const outboundMessage = {
          from: '+13256665486', // Twilio number
          to: selectedUser.phone,
          message: message.trim(),
          timestamp: new Date().toISOString(),
          direction: 'outbound',
          messageSid: data.messageSid,
          status: data.status
        };

        // Add to messages state
        setMessages(prev => {
          const isDuplicate = prev.some(m => 
            m.messageSid === data.messageSid || 
            (m.timestamp === outboundMessage.timestamp && m.message === outboundMessage.message)
          );
          
          if (isDuplicate) {
            console.log('📝 Duplicate message, skipping');
            return prev;
          }

          console.log('📝 Adding outbound message to history:', outboundMessage);
          return [...prev, outboundMessage];
        });

        // Clear input
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
      <Box minH="100vh" bg={isDark ? 'gray.800' : 'gray.50'}>
        {/* Header */}
        <HStack justify="flex-end" p={4} spacing={2}>
          <Button
            leftIcon={<MessageCircle />}
            onClick={() => setShowTestChat(!showTestChat)}
            colorScheme="purple"
            variant="ghost"
          >
            Test Chat
          </Button>
          <IconButton
            icon={isDark ? <Sun /> : <Moon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </HStack>

        {/* Main Content */}
        {showTestChat ? (
          <TestChat />
        ) : (
          <DockWindow
            isOpen={showChat}
            onClose={() => setShowChat(false)}
            onOpen={() => setShowChat(true)}
          >
            <VStack h="full" spacing={0}>
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
            </VStack>
          </DockWindow>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;