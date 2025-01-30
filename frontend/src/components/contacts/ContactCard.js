import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Avatar,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Collapse,
  Circle,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { MessageCircle, Phone, Calendar, Mic, Speaker, X, ChevronDown } from 'lucide-react';
import { QuickMessage } from './QuickMessage';
import { AppointmentScheduler } from '../appointments/AppointmentScheduler';
import { format } from 'date-fns';

const CallStatus = {
  IDLE: 'idle',
  DIALING: 'dialing',
  CONNECTED: 'connected',
  ENDED: 'ended'
};

// Lead status colors mapping
const leadStatusColors = {
  Set: 'yellow',
  Confirmed: 'blue',
  Issued: 'purple',
  Sold: 'green',
  Canceled: 'red',
  DNS: 'gray'
};

// Label colors mapping
const labelColors = {
  opportunity: 'green',
  appointment: 'purple',
  vip: 'red',
  enterprise: 'blue',
  technical: 'cyan',
  default: 'blue'
};

/**
 * ContactCard Component
 * 
 * Displays contact information and provides messaging options:
 * 1. Open in LiveChat - Opens the full LiveChat interface
 * 2. Quick Message - Opens a popup for sending a quick message
 * 3. Call - Simulates a phone call with in-place UI
 * 4. Schedule Appointment - Opens appointment scheduler
 * 
 * @param {Object} contact - Contact information object
 * @param {Function} onOpenLiveChat - Callback to open LiveChat with the contact
 */
export const ContactCard = ({ contact, onOpenLiveChat }) => {
  const [isQuickMessageOpen, setIsQuickMessageOpen] = useState(false);
  const [callStatus, setCallStatus] = useState(CallStatus.IDLE);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const menuBg = useColorModeValue('white', 'gray.700');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');

  // Format creation date
  const formattedCreatedAt = contact.createdAt 
    ? format(new Date(contact.createdAt), 'MMM d, yyyy h:mm a')
    : 'N/A';

  // Handle call connection after 2 seconds
  useEffect(() => {
    if (callStatus === CallStatus.DIALING) {
      const timer = setTimeout(() => {
        setCallStatus(CallStatus.CONNECTED);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [callStatus]);

  // Handle call duration timer
  useEffect(() => {
    let interval;
    if (callStatus === CallStatus.CONNECTED) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Format duration as mm:ss
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Handle opening LiveChat with the current contact
   */
  const handleOpenLiveChat = () => {
    if (onOpenLiveChat) {
      onOpenLiveChat(contact);
    }
  };

  /**
   * Toggle the QuickMessage popup
   */
  const handleToggleQuickMessage = () => {
    setIsQuickMessageOpen(!isQuickMessageOpen);
  };

  /**
   * Start a simulated call
   */
  const handleCall = () => {
    if (callStatus === CallStatus.IDLE) {
      setCallStatus(CallStatus.DIALING);
    } else {
      handleEndCall();
    }
  };

  /**
   * End the current call
   */
  const handleEndCall = () => {
    setCallStatus(CallStatus.ENDED);
    setTimeout(() => {
      setCallStatus(CallStatus.IDLE);
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeaker(false);
    }, 500);
  };

  /**
   * Handle scheduling an appointment
   */
  const handleScheduleAppointment = (appointment) => {
    toast({
      title: 'Appointment Scheduled',
      description: `Appointment scheduled with ${contact.name} for ${appointment.date} at ${appointment.time}`,
      status: 'success',
      duration: 3000,
    });
  };

  const isCallActive = callStatus !== CallStatus.IDLE;

  return (
    <Box
      bg={cardBg}
      p={3}
      borderRadius="md"
      border="1px solid"
      borderColor={borderColor}
      _hover={{ 
        shadow: 'md',
        borderColor: 'blue.500',
        '& .actions': { opacity: 1 }
      }}
      transition="all 0.2s"
    >
      {/* Header Section */}
      <HStack spacing={3} align="start">
        <Avatar size="sm" name={contact.name} src={contact.avatar} />
        
        <VStack align="start" spacing={0} flex={1}>
          <HStack w="100%" justify="space-between">
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              {contact.name}
            </Text>
            <Badge colorScheme={
              contact.status === 'Active' ? 'green' :
              contact.status === 'Busy' ? 'red' :
              contact.status === 'Away' ? 'yellow' :
              'gray'
            }>
              {contact.status}
            </Badge>
          </HStack>
          
          <Text fontSize="xs" color={mutedColor} mb={1}>
            {contact.phone}
          </Text>

          {/* Labels Section */}
          <HStack spacing={2} flexWrap="wrap">
            {Array.isArray(contact.labels) && contact.labels.map((label, index) => (
              <Badge
                key={index}
                colorScheme={labelColors[label.toLowerCase()] || labelColors.default}
                variant="subtle"
                fontSize="xs"
              >
                {label}
              </Badge>
            ))}
          </HStack>
        </VStack>

        {/* Action Icons */}
        <HStack spacing={1} className="actions" opacity={0.6}>
          <IconButton
            icon={<Phone size={18} />}
            variant={isCallActive ? "solid" : "ghost"}
            size="sm"
            aria-label="Call Contact"
            onClick={handleCall}
            colorScheme={isCallActive ? "red" : "gray"}
            transition="all 0.2s"
          />
          
          <AppointmentScheduler
            contact={contact}
            onSchedule={handleScheduleAppointment}
          />

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MessageCircle size={18} />}
              variant="ghost"
              size="sm"
              aria-label="Send Message"
            />
            <MenuList bg={menuBg}>
              <MenuItem onClick={handleOpenLiveChat}>
                Open in LiveChat
              </MenuItem>
              <MenuItem onClick={handleToggleQuickMessage}>
                Send Quick Message
              </MenuItem>
            </MenuList>
          </Menu>

          <IconButton
            icon={<ChevronDown size={18} />}
            variant="ghost"
            size="sm"
            aria-label="Toggle Details"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            transform={isDetailsOpen ? 'rotate(180deg)' : undefined}
            transition="all 0.2s"
          />
        </HStack>
      </HStack>

      {/* Contact Details Grid */}
      <Collapse in={isDetailsOpen} animateOpacity>
        <Grid 
          templateColumns="repeat(2, 1fr)" 
          gap={3}
          p={3}
          mt={3}
          bg={sectionBg}
          rounded="md"
          fontSize="xs"
        >
          <GridItem>
            <Text color={mutedColor}>Lead Status</Text>
            <Badge 
              colorScheme={leadStatusColors[contact.leadStatus] || 'gray'}
              mt={1}
            >
              {contact.leadStatus || 'Not Set'}
            </Badge>
          </GridItem>

          <GridItem>
            <Text color={mutedColor}>Interest</Text>
            <Text fontWeight="medium">{contact.interest || 'Not Specified'}</Text>
          </GridItem>

          <GridItem>
            <Text color={mutedColor}>Lead Source</Text>
            <Text fontWeight="medium">{contact.leadSource || 'Not Specified'}</Text>
          </GridItem>

          <GridItem>
            <Text color={mutedColor}>Market</Text>
            <Text fontWeight="medium">{contact.market || 'Not Specified'}</Text>
          </GridItem>

          <GridItem>
            <Text color={mutedColor}>State</Text>
            <Text fontWeight="medium">{contact.state || 'Not Specified'}</Text>
          </GridItem>

          <GridItem>
            <Text color={mutedColor}>Created At</Text>
            <Text fontWeight="medium">{formattedCreatedAt}</Text>
          </GridItem>
        </Grid>
      </Collapse>

      {/* Call Controls */}
      <Collapse in={isCallActive} animateOpacity>
        <HStack 
          mt={3} 
          p={2} 
          bg={sectionBg}
          rounded="md"
          justify="space-between"
          align="center"
        >
          <HStack spacing={4}>
            <Text fontSize="sm" color={mutedColor}>
              {callStatus === CallStatus.DIALING ? 'Calling...' : 
               callStatus === CallStatus.CONNECTED ? formatDuration(callDuration) :
               'Call ended'}
            </Text>
            
            {callStatus === CallStatus.CONNECTED && (
              <HStack spacing={2}>
                <IconButton
                  icon={<Mic size={16} />}
                  size="sm"
                  variant={isMuted ? "solid" : "ghost"}
                  colorScheme={isMuted ? "red" : "gray"}
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label="Toggle Mute"
                />
                <IconButton
                  icon={<Speaker size={16} />}
                  size="sm"
                  variant={isSpeaker ? "solid" : "ghost"}
                  colorScheme={isSpeaker ? "blue" : "gray"}
                  onClick={() => setIsSpeaker(!isSpeaker)}
                  aria-label="Toggle Speaker"
                />
              </HStack>
            )}
          </HStack>
          
          <Circle
            size="32px"
            bg="red.500"
            color="white"
            cursor="pointer"
            onClick={handleEndCall}
            _hover={{ transform: 'scale(1.1)' }}
            transition="all 0.2s"
          >
            <X size={16} />
          </Circle>
        </HStack>
      </Collapse>

      {/* Quick Message Popup */}
      <QuickMessage
        isOpen={isQuickMessageOpen}
        onClose={() => setIsQuickMessageOpen(false)}
        contact={contact}
      />
    </Box>
  );
};
