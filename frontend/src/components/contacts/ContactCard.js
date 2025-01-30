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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react';
import { MessageCircle } from 'lucide-react';
import { QuickMessage } from './QuickMessage';

/**
 * ContactCard Component
 * 
 * Displays contact information and provides messaging options:
 * 1. Open in LiveChat - Opens the full LiveChat interface
 * 2. Quick Message - Opens a popup for sending a quick message
 * 
 * @param {Object} contact - Contact information object
 * @param {Function} onOpenLiveChat - Callback to open LiveChat with the contact
 */
export const ContactCard = ({ contact, onOpenLiveChat }) => {
  const [isQuickMessageOpen, setIsQuickMessageOpen] = useState(false);
  
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
   * Uses existing LiveChat logic for Twilio integration
   */
  const handleOpenLiveChat = () => {
    if (onOpenLiveChat) {
      onOpenLiveChat(contact);
    }
  };

  /**
   * Toggle the QuickMessage popup
   * QuickMessage component handles its own Twilio integration
   */
  const handleToggleQuickMessage = () => {
    setIsQuickMessageOpen(!isQuickMessageOpen);
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

        {/* Message Actions Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MessageCircle size={18} />}
            variant="ghost"
            size="sm"
            aria-label="Send Message"
            className="actions"
            opacity={0.6}
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

      {/* Quick Message Popup */}
      <QuickMessage
        isOpen={isQuickMessageOpen}
        onClose={() => setIsQuickMessageOpen(false)}
        contact={contact}
      />
    </Box>
  );
};
