import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, useColorMode, VStack, IconButton, useToast } from '@chakra-ui/react';
import { UserList } from './components/chat/UserList';
import { MessageList } from './components/chat/MessageList';
import { MessageInput } from './components/chat/MessageInput';
import { ContactForm } from './components/chat/ContactForm';
import { Plus, Moon, Sun } from 'lucide-react';
import { socket } from './socket';
import axios from 'axios';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const isDark = colorMode === 'dark';

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      toast({
        title: 'Connected',
        description: 'Successfully connected to the server',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
      toast({
        title: 'Disconnected',
        description: 'Lost connection to the server',
        status: 'error',
        duration: null,
        isClosable: true,
      });
    });

    socket.on('new_message', (newMsg) => {
      console.log('New message received:', newMsg);
      setMessages(prev => [...prev, {
        ...newMsg,
        timestamp: new Date(newMsg.timestamp || Date.now()),
      }]);
      
      // Update users list with new message
      setUsers(prev => {
        const userPhoneNumber = newMsg.direction === 'inbound' ? newMsg.from : newMsg.to;
        const existingUser = prev.find(user => user.phoneNumber === userPhoneNumber);
        
        if (!existingUser) {
          // Create new user if doesn't exist
          const newUser = {
            id: userPhoneNumber,
            name: `User (${userPhoneNumber})`,
            avatar: `https://ui-avatars.com/api/?name=${userPhoneNumber}&background=random`,
            phoneNumber: userPhoneNumber,
            lastMessage: newMsg.message,
            time: new Date().toLocaleTimeString(),
            isNew: newMsg.direction === 'inbound',
            newCount: 1
          };
          return [...prev, newUser];
        } else {
          // Update existing user
          return prev.map(user => 
            user.id === existingUser.id 
              ? {
                  ...user,
                  lastMessage: newMsg.message,
                  time: new Date().toLocaleTimeString(),
                  isNew: newMsg.direction === 'inbound' && user.id !== selectedUser,
                  newCount: user.id !== selectedUser ? (user.newCount || 0) + 1 : 0
                }
              : user
          );
        }
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_message');
    };
  }, [selectedUser, toast]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    try {
      const user = users.find(u => u.id === selectedUser);
      if (!user?.phoneNumber) {
        throw new Error('No phone number for selected user');
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-sms`, {
        to: user.phoneNumber,
        message: message.trim()
      });

      if (response.data.success) {
        setMessage('');
        // Add message to local state immediately for better UX
        const newMessage = {
          id: Date.now().toString(),
          from: process.env.REACT_APP_TWILIO_PHONE,
          to: user.phoneNumber,
          message: message.trim(),
          timestamp: new Date(),
          direction: 'outbound',
          status: 'sent'
        };
        setMessages(prev => [...prev, newMessage]);
      } else {
        toast({
          title: 'Error',
          description: response.data.error || 'Failed to send message',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddContact = (newContact) => {
    setUsers(prev => {
      const existingContact = prev.find(user => user.phoneNumber === newContact.phoneNumber);
      if (existingContact) {
        toast({
          title: 'Contact exists',
          description: `${newContact.name} is already in your contacts`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return prev;
      }
      return [...prev, newContact];
    });
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isNew: false, newCount: 0 }
          : user
      )
    );
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.toLowerCase().includes(searchLower) ||
      user.lastMessage?.toLowerCase().includes(searchLower)
    );
  });

  const currentUser = selectedUser ? users.find(u => u.id === selectedUser) : null;
  const filteredMessages = messages.filter(msg => 
    currentUser?.phoneNumber && (msg.from === currentUser.phoneNumber || msg.to === currentUser.phoneNumber)
  );

  return (
    <ChakraProvider>
      <Box h="100vh" bg={isDark ? "gray.800" : "white"}>
        <VStack h="100%" spacing={0}>
          <Box
            w="100%"
            p={2}
            bg={isDark ? "gray.700" : "gray.100"}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              aria-label="Add contact"
              icon={<Plus />}
              onClick={() => setShowAddContact(true)}
              size="sm"
            />
            <IconButton
              aria-label="Toggle theme"
              icon={isDark ? <Sun /> : <Moon />}
              onClick={toggleColorMode}
              size="sm"
            />
          </Box>

          <Box flex="1" w="100%" overflow="hidden">
            <Box
              display="flex"
              h="100%"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              {/* Left sidebar */}
              <Box w="300px" borderRightWidth="1px">
                <UserList
                  users={filteredUsers}
                  selectedUser={selectedUser}
                  onSelectUser={handleUserSelect}
                  isDark={isDark}
                />
              </Box>

              {/* Right chat area */}
              <Box flex="1" display="flex" flexDirection="column">
                <MessageList
                  messages={filteredMessages}
                  currentUser={currentUser}
                  isDark={isDark}
                />
                <MessageInput
                  message={message}
                  onChange={setMessage}
                  onSend={handleSendMessage}
                  isDark={isDark}
                  disabled={!selectedUser || !connected}
                />
              </Box>
            </Box>
          </Box>
        </VStack>

        <ContactForm
          isOpen={showAddContact}
          onClose={() => setShowAddContact(false)}
          onAddContact={handleAddContact}
          isDark={isDark}
        />
      </Box>
    </ChakraProvider>
  );
}

export default App;