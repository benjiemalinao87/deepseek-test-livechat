import React, { useState, useEffect } from 'react';
import { Box, useToast, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { socket } from '../../socket';
import { ContactList } from './ContactList';
import { ChatArea } from './ChatArea';
import { UserDetails } from './UserDetails';
import { AddContactModal } from './AddContactModal';

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
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
    setPhone(newContactData.phone);

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

  const selectedContact = contacts.find(c => c.phone === phone);

  return (
    <>
      <Box h="100vh" bg={bg} position="relative">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15}>
            <ContactList 
              contacts={contacts}
              selectedPhone={phone}
              onSelectContact={setPhone}
              onAddContact={() => setIsNewContactModalOpen(true)}
              messages={messages}
              isDark={isDark}
            />
          </Panel>

          <ResizeHandle />

          <Panel defaultSize={55} minSize={30}>
            <ChatArea 
              selectedContact={selectedContact}
              messages={messages}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              isDark={isDark}
            />
          </Panel>

          <ResizeHandle />

          <Panel defaultSize={25} minSize={15}>
            <UserDetails selectedContact={selectedContact} />
          </Panel>
        </PanelGroup>
      </Box>

      <AddContactModal 
        isOpen={isNewContactModalOpen}
        onClose={() => setIsNewContactModalOpen(false)}
        newContact={newContact}
        onNewContactChange={setNewContact}
        onAddContact={handleAddContact}
      />
    </>
  );
};
