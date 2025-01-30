import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { X, Minus, Square } from 'lucide-react';
import useContactStore from '../../services/contactState';
import io from 'socket.io-client';
import { ChatArea } from './ChatArea';
import { ContactList } from './ContactList';
import { UserDetails } from './UserDetails';
import { StatusMenu } from './StatusMenu';
import Draggable from 'react-draggable';

/**
 * LiveChat Component
 * 
 * Main chat interface that shows filtered contacts based on conversation status
 * and handles real-time messaging through Socket.IO
 */
const LiveChat = ({ isDark, onClose, selectedContact: initialSelectedContact }) => {
  // Use shared contact state
  const { 
    contacts,
    currentFilter,
    setFilter,
    updateContact,
    updateLastMessage,
    getFilteredContacts
  } = useContactStore();

  // Local state
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);
  const containerRef = useRef(null);

  // Socket.IO connection
  const socket = useRef(null);

  // Set default filter to 'Open' for LiveChat
  useEffect(() => {
    setFilter('Open');
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    socket.current = io('https://cc.automate8.com', {
      transports: ['websocket'],
      upgrade: false
    });

    socket.current.on('connect', handleConnect);
    socket.current.on('disconnect', handleDisconnect);
    socket.current.on('new_message', handleNewMessage);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Handle initial selected contact
  useEffect(() => {
    if (initialSelectedContact) {
      const existingContact = contacts.find(c => c.phone === initialSelectedContact.phone);
      if (!existingContact) {
        // Add the contact if it doesn't exist
        const newContactData = {
          id: contacts.length + 1,
          name: initialSelectedContact.name,
          phone: initialSelectedContact.phone,
          avatar: initialSelectedContact.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          lastMessage: initialSelectedContact.lastMessage || 'No messages yet',
          time: initialSelectedContact.time || 'Just now',
          conversationStatus: 'Open'
        };
        updateContact(newContactData.id, newContactData);
      }
      setSelectedContact(initialSelectedContact);
    }
  }, [initialSelectedContact]);

  // Handle new incoming message
  const handleNewMessage = (data) => {
    const { from, message, timestamp } = data;
    setMessages(prev => {
      const isDuplicate = prev.some(m => 
        m.messageSid === data.messageSid || 
        (m.timestamp === timestamp && m.message === message)
      );
      
      if (isDuplicate) return prev;
      return [...prev, data];
    });
    
    // Update contact's last message and status
    const contact = contacts.find(c => c.phone === from);
    if (contact) {
      updateLastMessage(contact.id, message, timestamp);
      if (contact.conversationStatus !== 'Open') {
        updateContact(contact.id, { conversationStatus: 'Open' });
      }
    }

    // Show toast notification for new messages
    if (data.direction === 'inbound') {
      toast({
        title: 'New Message',
        description: `From: ${from}\n${message}`,
        status: 'info',
        duration: 3000,
      });
    }
  };

  // Handle sending message
  const handleSendMessage = async (message, to) => {
    if (!socket.current?.connected || !message || !to) {
      toast({
        title: 'Error',
        description: 'Please enter both phone number and message',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      // Send message using HTTP endpoint
      const response = await fetch('https://cc.automate8.com/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to,
          message: message.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Create outbound message object
        const outboundMessage = {
          from: '+13256665486',
          to: to,
          message: message.trim(),
          timestamp: new Date().toISOString(),
          direction: 'outbound',
          messageSid: data.messageSid,
          status: data.status
        };

        // Add message to state
        setMessages(prev => {
          const isDuplicate = prev.some(m => 
            m.messageSid === data.messageSid || 
            (m.timestamp === outboundMessage.timestamp && m.message === outboundMessage.message)
          );
          
          if (isDuplicate) return prev;
          return [...prev, outboundMessage];
        });

        // Update contact's last message
        const contact = contacts.find(c => c.phone === to);
        if (contact) {
          updateLastMessage(contact.id, message, outboundMessage.timestamp);
        }

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

  // Socket event handlers
  const handleConnect = () => setIsConnected(true);
  const handleDisconnect = () => setIsConnected(false);

  // Window resize handlers
  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: windowSize.width,
      startHeight: windowSize.height
    };

    // Add window-level event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = (e) => {
    if (!isResizing) return;
    
    setIsResizing(false);
    resizeRef.current = null;

    // Remove window-level event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing || !resizeRef.current) return;

    e.preventDefault(); // Prevent text selection while resizing
    const deltaX = e.clientX - resizeRef.current.startX;
    const deltaY = e.clientY - resizeRef.current.startY;

    requestAnimationFrame(() => {
      setWindowSize({
        width: Math.max(600, resizeRef.current.startWidth + deltaX),
        height: Math.max(400, resizeRef.current.startHeight + deltaY)
      });
    });
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []); // Empty dependency array since we're just cleaning up

  const bg = useColorModeValue('whiteAlpha.800', 'blackAlpha.700');
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.100');
  const headerBg = useColorModeValue('whiteAlpha.500', 'blackAlpha.400');
  const textColor = useColorModeValue('gray.800', 'white');
  const toast = useToast();

  // Normalize phone number by removing non-digit characters and ensuring it starts with country code
  const normalizePhone = (phone) => {
    if (!phone) return '';
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // If it doesn't start with +1 or 1, add it
    if (!digits.startsWith('1')) {
      return '1' + digits;
    }
    return digits;
  };

  return (
    <Draggable
      handle=".window-handle"
      defaultPosition={{ x: 50, y: 50 }}
      bounds={{
        left: 0,
        top: 0,
        right: window.innerWidth - windowSize.width,
        bottom: window.innerHeight - windowSize.height
      }}
    >
      <Box
        ref={containerRef}
        bg={bg}
        rounded="lg"
        shadow="lg"
        overflow="hidden"
        w={`${windowSize.width}px`}
        h={`${windowSize.height}px`}
        position="absolute"
      >
        {/* Window Title Bar */}
        <HStack
          className="window-handle"
          px={3}
          py={2}
          bg={headerBg}
          cursor="grab"
          justify="space-between"
          userSelect="none"
          borderBottom="1px solid"
          borderColor={borderColor}
          _active={{ cursor: "grabbing" }}
        >
          <HStack spacing={2}>
            <IconButton
              size="xs"
              icon={<X size={12} />}
              isRound
              aria-label="Close"
              bg="red.400"
              _hover={{ bg: 'red.500' }}
              onClick={onClose}
            />
            <IconButton
              size="xs"
              icon={<Minus size={12} />}
              isRound
              aria-label="Minimize"
              bg="yellow.400"
              _hover={{ bg: 'yellow.500' }}
            />
            <IconButton
              size="xs"
              icon={<Square size={12} />}
              isRound
              aria-label="Maximize"
              bg="green.400"
              _hover={{ bg: 'green.500' }}
            />
          </HStack>
          <HStack>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              Live Chat
            </Text>
            {selectedContact && (
              <StatusMenu 
                currentStatus={selectedContact.conversationStatus} 
                onStatusChange={(newStatus) => updateContact(selectedContact.id, { conversationStatus: newStatus })} 
              />
            )}
          </HStack>
          <Box w={70} /> {/* Spacer to center the title */}
        </HStack>

        {/* Window Content */}
        <Box height="calc(100% - 45px)">
          <Grid
            templateColumns="300px 1fr 300px"
            h="100%"
            overflow="hidden"
          >
            <GridItem borderRight="1px" borderColor={borderColor} overflow="hidden">
              <ContactList
                contacts={getFilteredContacts()}
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
                messages={messages}
                isDark={isDark}
              />
            </GridItem>
            <GridItem overflow="hidden">
              <ChatArea
                selectedContact={selectedContact}
                messages={messages.filter(msg => {
                  const normalizedFrom = normalizePhone(msg.from);
                  const normalizedTo = normalizePhone(msg.to);
                  const normalizedContact = normalizePhone(selectedContact?.phone);
                  return normalizedFrom === normalizedContact || normalizedTo === normalizedContact;
                })}
                onSendMessage={handleSendMessage}
                socket={socket.current}
                isDark={isDark}
              />
            </GridItem>
            <GridItem borderLeft="1px" borderColor={borderColor} overflow="hidden">
              <UserDetails selectedContact={selectedContact} />
            </GridItem>
          </Grid>
        </Box>

        {/* Resize Handle */}
        <Box
          position="absolute"
          bottom={2}
          right={2}
          w="20px"
          h="20px"
          cursor="nwse-resize"
          onMouseDown={handleMouseDown}
          borderRadius="full"
          bg="blue.500"
          opacity="0.8"
          _hover={{ opacity: 1 }}
          transition="opacity 0.2s"
          zIndex={1000}
          _before={{
            content: '""',
            position: 'absolute',
            bottom: '6px',
            right: '6px',
            width: '8px',
            height: '2px',
            bg: 'white',
            transform: 'rotate(-45deg)'
          }}
          _after={{
            content: '""',
            position: 'absolute',
            bottom: '9px',
            right: '9px',
            width: '8px',
            height: '2px',
            bg: 'white',
            transform: 'rotate(-45deg)'
          }}
        />
      </Box>
    </Draggable>
  );
};

export default LiveChat;
