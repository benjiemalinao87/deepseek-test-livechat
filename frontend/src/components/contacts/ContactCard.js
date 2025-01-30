import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { MessageCircle, Phone, Calendar } from 'lucide-react';
import { QuickMessage } from './QuickMessage';
import { AppointmentScheduler } from '../appointments/AppointmentScheduler';

/**
 * ContactCard Component
 * 
 * Displays contact information and provides messaging options:
 * 1. Open in LiveChat - Opens the full LiveChat interface
 * 2. Quick Message - Opens a popup for sending a quick message
 * 3. Call - Simulates a phone call
 * 4. Schedule Appointment - Opens appointment scheduler
 * 
 * @param {Object} contact - Contact information object
 * @param {Function} onOpenLiveChat - Callback to open LiveChat with the contact
 */
export const ContactCard = ({ contact, onOpenLiveChat }) => {
  const [isQuickMessageOpen, setIsQuickMessageOpen] = useState(false);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const menuBg = useColorModeValue('white', 'gray.700');

  // Define label colors
  const labelColors = {
    opportunity: 'green',
    appointment: 'purple',
    vip: 'red',
    enterprise: 'blue',
    technical: 'cyan',
    default: 'blue'
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
   * Simulate a phone call
   */
  const handleCall = () => {
    toast({
      title: 'Calling...',
      description: `Initiating call to ${contact.name} at ${contact.phone}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    
    // Simulate call connection after 2 seconds
    setTimeout(() => {
      toast({
        title: 'Call Connected',
        description: `Connected with ${contact.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
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
      <HStack spacing={3}>
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
          
          <Text fontSize="xs" color={mutedColor}>
            {contact.phone}
          </Text>
          
          <HStack spacing={2} mt={1} flexWrap="wrap">
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
            variant="ghost"
            size="sm"
            aria-label="Call Contact"
            onClick={handleCall}
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
        </HStack>
      </HStack>

      {/* Quick Message Popup */}
      <QuickMessage
        isOpen={isQuickMessageOpen}
        onClose={() => setIsQuickMessageOpen(false)}
        contact={contact}
      />
    </Box>
  );
};
