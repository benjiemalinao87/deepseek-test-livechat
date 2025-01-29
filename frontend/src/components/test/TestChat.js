import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  useToast, 
  useColorMode, 
  useColorModeValue, 
  Grid, 
  GridItem,
  HStack,
  Text,
} from '@chakra-ui/react';
import { socket } from '../../socket';
import { ContactList } from './ContactList';
import { ChatArea } from './ChatArea';
import { UserDetails } from './UserDetails';
import { AddContactModal } from './AddContactModal';
import { StatusMenu } from './StatusMenu';

export const TestChat = ({ isDark, selectedContact: initialSelectedContact }) => {
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Test User', phone: '+16267888830', time: '2m ago', status: 'Open' },
    { id: 2, name: 'Test User2', phone: '+16267888831', time: '1m ago', status: 'Done' },
    { id: 3, name: 'Test User3', phone: '+16267888832', time: 'Just now', status: 'Pending' },
  ]);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [isConnected, setIsConnected] = useState(false);
  const containerRef = useRef(null);

  const bg = useColorModeValue('whiteAlpha.900', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const contentBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const scrollbarThumbColor = useColorModeValue('gray.300', 'gray.600');
  const scrollbarTrackColor = useColorModeValue('gray.100', 'gray.800');
  const toast = useToast();

  // Keep all the existing socket and message handling logic
  useEffect(() => {
    const handleConnect = () => {
      console.log('✅ Connected to socket');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('❌ Disconnected from socket');
      setIsConnected(false);
    };

    const handleNewMessage = (data) => {
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
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_message', handleNewMessage);
    };
  }, [toast]);

  // Keep initialSelectedContact handling
  useEffect(() => {
    if (initialSelectedContact) {
      const existingContact = contacts.find(c => c.phone === initialSelectedContact.phone);
      if (!existingContact) {
        const newContactData = {
          id: contacts.length + 1,
          name: initialSelectedContact.name,
          phone: initialSelectedContact.phone,
          avatar: initialSelectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          lastMessage: initialSelectedContact.lastMessage || 'No messages yet',
          time: initialSelectedContact.time || 'Just now',
          status: 'Open'
        };
        setContacts(prev => [...prev, newContactData]);
      }
      setSelectedPhone(initialSelectedContact.phone);
    }
  }, [initialSelectedContact]);

  const handleSendMessage = async (message, to) => {
    try {
      console.log('📤 Sending message:', { message, to });
      
      const timestamp = new Date().toISOString();
      const newMessage = {
        direction: 'outbound',
        message,
        to,
        from: 'SYSTEM',
        timestamp,
      };

      setMessages(prev => [...prev, newMessage]);

      // Emit the message through socket
      socket.emit('send_message', {
        to,
        message,
        timestamp
      });

    } catch (error) {
      console.error('❌ Send message error:', error);
      toast({
        title: 'Error sending message',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  }

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
      time: 'Just now',
      status: 'Open'
    };

    setContacts(prev => [...prev, newContactData]);
    setNewContact({ name: '', phone: '' });
    setIsAddContactModalOpen(false);
    setSelectedPhone(newContactData.phone);

    toast({
      title: 'Contact added',
      description: `${newContactData.name} has been added to your contacts`,
      status: 'success',
      duration: 3000,
    });
  };

  const handleStatusChange = (newStatus) => {
    setContacts(contacts.map(contact => 
      contact.phone === selectedPhone 
        ? { ...contact, status: newStatus }
        : contact
    ));
  };

  const currentContact = contacts.find(c => c.phone === selectedPhone);

  return (
    <Box
      ref={containerRef}
      height="100%"
      bg={contentBg}
      borderRadius="lg"
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      boxShadow={isDark ? 'dark-lg' : 'lg'}
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: scrollbarTrackColor,
        },
        '&::-webkit-scrollbar-thumb': {
          background: scrollbarThumbColor,
          borderRadius: '4px',
        },
      }}
    >
      {/* Chat Content */}
      <Grid
        templateColumns="300px 1fr 300px"
        h="100%"
        overflow="hidden"
        bg={bg}
      >
        <GridItem 
          borderRight="1px" 
          borderColor={borderColor} 
          overflow="hidden"
          bg={contentBg}
        >
          <ContactList
            contacts={contacts}
            selectedPhone={selectedPhone}
            onSelectContact={setSelectedPhone}
            onAddContact={() => setIsAddContactModalOpen(true)}
            messages={messages}
            isDark={isDark}
          />
        </GridItem>
        <GridItem 
          overflow="hidden"
          bg={contentBg}
        >
          <ChatArea
            selectedContact={currentContact}
            messages={messages.filter(
              m => m.to === selectedPhone || m.from === selectedPhone
            )}
            onSendMessage={handleSendMessage}
            socket={socket}
            isDark={isDark}
          />
        </GridItem>
        <GridItem 
          borderLeft="1px" 
          borderColor={borderColor} 
          overflow="hidden"
          bg={contentBg}
        >
          <UserDetails 
            selectedContact={currentContact} 
            textColor={textColor}
            mutedTextColor={mutedTextColor}
          />
        </GridItem>
      </Grid>

      <AddContactModal 
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        onNewContactChange={setNewContact}
        onAddContact={handleAddContact}
        newContact={newContact}
      />
    </Box>
  );
};
