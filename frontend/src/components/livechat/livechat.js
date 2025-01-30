import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  useToast, 
  useColorMode, 
  useColorModeValue, 
  Grid, 
  GridItem,
  HStack,
  IconButton,
  Text,
  Spacer
} from '@chakra-ui/react';
import { socket } from '../../socket';
import { ContactList } from './ContactList';
import { ChatArea } from './ChatArea';
import { UserDetails } from './UserDetails';
import { AddContactModal } from '../contacts/AddContactModal';
import { StatusMenu } from './StatusMenu';
import { X, Minus, Square } from 'lucide-react';
import Draggable from 'react-draggable';

const LiveChat = ({ isDark, onClose, selectedContact: initialSelectedContact }) => {
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Test User', phone: '+16267888830', time: '2m ago', status: 'Open' },
    { id: 2, name: 'Test User2', phone: '+16267888831', time: '1m ago', status: 'Done' },
    { id: 3, name: 'Test User3', phone: '+16267888832', time: 'Just now', status: 'Pending' },
  ]);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    leadSource: '',
    market: '',
    product: ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);
  const containerRef = useRef(null);

  const bg = useColorModeValue('whiteAlpha.800', 'blackAlpha.700');
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.100');
  const headerBg = useColorModeValue('whiteAlpha.500', 'blackAlpha.400');
  const textColor = useColorModeValue('gray.800', 'white');
  const toast = useToast();

  // Socket.IO Event Handlers
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

  // Add effect to handle initialSelectedContact changes
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
          status: 'Open'
        };
        setContacts(prev => [...prev, newContactData]);
      }
      setSelectedPhone(initialSelectedContact.phone);
    }
  }, [initialSelectedContact]);

  const handleMouseDown = (e) => {
    if (e.target === resizeRef.current) {
      setIsResizing(true);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e) => {
    if (!isResizing || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const newWidth = Math.max(800, e.clientX - container.left);
    const newHeight = Math.max(600, e.clientY - container.top);
    
    setWindowSize({
      width: newWidth,
      height: newHeight
    });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleSendMessage = async (message, to) => {
    if (!message || !to) {
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
        to: to,
        message: message
      });

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

  const handleAddContact = async (contactData) => {
    try {
      // Create the contact
      const contact = {
        id: contacts.length + 1,
        name: `${contactData.firstName} ${contactData.lastName}`.trim(),
        phone: contactData.phone,
        email: contactData.email,
        leadSource: contactData.leadSource,
        market: contactData.market,
        product: contactData.product,
        labels: contactData.labels || [],
        time: 'Just now',
        status: 'Open'
      };
      
      setContacts(prev => [...prev, contact]);
      setIsAddContactModalOpen(false);
      setNewContact({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        leadSource: '',
        market: '',
        product: ''
      });

      toast({
        title: 'Contact Added',
        description: `${contact.name} has been added to your contacts`,
        status: 'success',
        duration: 3000,
      });

      return contact;
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to add contact. Please try again.',
        status: 'error',
        duration: 3000,
      });
      throw error;
    }
  };

  const handleCreateOpportunity = async (opportunity) => {
    try {
      // Add opportunity to pipeline
      const pipelineCard = {
        id: `card-${Date.now()}`,
        name: opportunity.contactName,
        phone: opportunity.contactPhone,
        lastMessage: opportunity.title,
        time: 'Just now',
        priority: 'high',
        type: 'opportunity',
        value: opportunity.value,
        service: opportunity.service,
        stage: opportunity.stage,
        notes: opportunity.notes
      };

      // Update pipeline data
      setContacts(prev => prev.map(contact => 
        contact.phone === opportunity.contactPhone 
          ? { ...contact, labels: [...(contact.labels || []), 'opportunity'] }
          : contact
      ));

      toast({
        title: 'Opportunity Created',
        description: `New opportunity added to pipeline: ${opportunity.title}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast({
        title: 'Error',
        description: 'Failed to create opportunity. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleScheduleAppointment = async (appointment) => {
    try {
      // Add appointment to calendar
      const calendarEvent = {
        id: appointment.id,
        title: `${appointment.type} with ${appointment.contactName}`,
        start: `${appointment.date}T${appointment.time}`,
        end: `${appointment.date}T${appointment.time.split(':')[0]}:${
          parseInt(appointment.time.split(':')[1]) + 30
        }`,
        description: appointment.notes,
        type: appointment.type,
        contactId: appointment.contactId,
        contactName: appointment.contactName,
        contactPhone: appointment.contactPhone
      };

      // TODO: Update calendar component with new event
      console.log('Calendar event created:', calendarEvent);

      // Add to pipeline as well
      const pipelineCard = {
        id: `card-${Date.now()}`,
        name: appointment.contactName,
        phone: appointment.contactPhone,
        lastMessage: `${appointment.type} scheduled for ${appointment.date} at ${appointment.time}`,
        time: 'Just now',
        priority: 'medium',
        type: 'appointment',
        appointmentDetails: appointment
      };

      // Update pipeline data
      setContacts(prev => prev.map(contact => 
        contact.phone === appointment.contactPhone 
          ? { ...contact, labels: [...(contact.labels || []), 'appointment'] }
          : contact
      ));

      toast({
        title: 'Appointment Scheduled',
        description: `${appointment.type} scheduled with ${appointment.contactName}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule appointment. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
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
        width={`${windowSize.width}px`}
        height={`${windowSize.height}px`}
        bg={bg}
        position="absolute"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="xl"
        border="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(10px)"
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
            {currentContact && (
              <StatusMenu 
                currentStatus={currentContact.status} 
                onStatusChange={handleStatusChange} 
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
                contacts={contacts}
                selectedPhone={selectedPhone}
                onSelectContact={setSelectedPhone}
                onAddContact={() => setIsAddContactModalOpen(true)}
                messages={messages}
                isDark={isDark}
              />
            </GridItem>
            <GridItem overflow="hidden">
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
            <GridItem borderLeft="1px" borderColor={borderColor} overflow="hidden">
              <UserDetails selectedContact={currentContact} />
            </GridItem>
          </Grid>
        </Box>

        {/* Resize Handle */}
        <Box
          ref={resizeRef}
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

        <AddContactModal 
          isOpen={isAddContactModalOpen}
          onClose={() => setIsAddContactModalOpen(false)}
          onNewContactChange={setNewContact}
          onAddContact={handleAddContact}
          onCreateOpportunity={handleCreateOpportunity}
          onScheduleAppointment={handleScheduleAppointment}
          newContact={newContact}
        />
      </Box>
    </Draggable>
  );
};

export default LiveChat;
