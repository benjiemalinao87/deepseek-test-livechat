import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Circle,
} from '@chakra-ui/react';
import { MessageCircle, ExternalLink, Phone, MoreVertical } from 'lucide-react';
import { QuickMessage } from './QuickMessage';

const StatusBadge = ({ status }) => {
  const statusColors = {
    active: 'green',
    away: 'yellow',
    busy: 'red',
    offline: 'gray',
  };

  return (
    <Badge
      colorScheme={statusColors[status.toLowerCase()]}
      variant="subtle"
      px={2}
      py={0.5}
      borderRadius="full"
    >
      {status}
    </Badge>
  );
};

export const ContactListItem = ({ 
  contact, 
  onOpenLiveChat,
  isSelected, 
  onClick, 
  isDark 
}) => {
  const bgColor = isSelected 
    ? isDark ? 'gray.700' : 'gray.100'
    : 'transparent';

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'green';
      case 'Pending': return 'yellow';
      case 'Done': return 'gray';
      case 'Spam': return 'red';
      case 'Invalid': return 'purple';
      default: return 'gray';
    }
  };

  const { name, email, phone, status, leadSource, tags = [], unreadCount } = contact;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      p={3}
      cursor="pointer"
      bg={bgColor}
      _hover={{ bg: isDark ? 'gray.700' : 'gray.100' }}
      borderRadius="md"
      onClick={onClick}
      position="relative"
    >
      <HStack spacing={3} align="flex-start">
        <Avatar
          size="sm"
          name={name}
          bg="purple.500"
        />
        <VStack align="flex-start" flex={1} spacing={1}>
          <HStack width="100%" justify="space-between">
            <Text fontWeight="bold" fontSize="sm">
              {name}
            </Text>
            <HStack spacing={2}>
              {/* Unread message count indicator */}
              {unreadCount > 0 && status === 'Open' && (
                <Circle 
                  size="18px" 
                  bg="green.500" 
                  color="white" 
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {unreadCount}
                </Circle>
              )}
              <Badge 
                colorScheme={getStatusColor(status)}
                variant="subtle"
                fontSize="xs"
              >
                {status}
              </Badge>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MoreVertical />}
                  variant="ghost"
                  size="sm"
                  aria-label="More options"
                  onClick={(e) => e.stopPropagation()}
                />
                <MenuList>
                  <MenuItem 
                    icon={<ExternalLink size={16} />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLiveChat(contact);
                    }}
                  >
                    Open in LiveChat
                  </MenuItem>
                  <MenuItem 
                    icon={<MessageCircle size={16} />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen();
                    }}
                  >
                    Quick Message
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {email} • {phone}
          </Text>
          <HStack spacing={2}>
            {leadSource && (
              <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                {leadSource}
              </Badge>
            )}
            {tags.map((tag) => (
              <Badge
                key={tag}
                colorScheme="blue"
                variant="subtle"
                fontSize="xs"
              >
                {tag}
              </Badge>
            ))}
          </HStack>
        </VStack>
      </HStack>
      {isOpen && (
        <QuickMessage 
          contact={contact}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </Box>
  );
};
