import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { socket } from '../../socket';
import { ContactSelect } from './ContactSelect';
import { AddContactModal } from './AddContactModal';

export const TestChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([
    { name: 'Benjie', phone: '+16267888830' }
  ]);
  const [selectedContact, setSelectedContact] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Register Twilio number on mount
  useEffect(() => {
    const twilioNumber = '+13256665486';
    socket.emit('register', twilioNumber);
    
    socket.on('registered', (data) => {
      console.log('✅ Number registered:', data);
    });

    socket.on('new_message', (data) => {
      console.log('📥 Received message:', data);
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('registered');
      socket.off('new_message');
    };
  }, []);

  const handleSendMessage = async () => {
    if (!selectedContact || !message.trim()) {
      toast({
        title: 'Error',
        description: 'Please select a contact and enter a message',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const messageData = {
      to: selectedContact.phone,
      message: message.trim(),
    };

    try {
      const response = await fetch('http://localhost:3001/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setMessage('');
      toast({
        title: 'Message Sent',
        description: `Message sent to ${selectedContact.name}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddContact = (newContact) => {
    setContacts(prev => [...prev, newContact]);
    toast({
      title: 'Contact Added',
      description: `Added ${newContact.name} to contacts`,
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box p={4} maxW="600px" mx="auto">
      <VStack spacing={4} align="stretch">
        {/* Contact Selection */}
        <ContactSelect
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          onAddContact={onOpen}
        />

        {/* Messages */}
        <Box
          borderWidth={1}
          borderRadius="lg"
          p={4}
          minH="400px"
          maxH="400px"
          overflowY="auto"
        >
          {messages.map((msg, index) => (
            <Box
              key={msg.messageSid || index}
              mb={2}
              p={2}
              bg={msg.direction === 'outbound' ? 'blue.100' : 'gray.100'}
              borderRadius="md"
              alignSelf={msg.direction === 'outbound' ? 'flex-end' : 'flex-start'}
            >
              <Text fontSize="sm" color="gray.500">
                {msg.direction === 'outbound' ? 'You' : msg.from}
              </Text>
              <Text>{msg.message}</Text>
              <Text fontSize="xs" color="gray.500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Message Input */}
        <HStack>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} colorScheme="blue">
            Send
          </Button>
        </HStack>
      </VStack>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isOpen}
        onClose={onClose}
        onAddContact={handleAddContact}
      />
    </Box>
  );
};
