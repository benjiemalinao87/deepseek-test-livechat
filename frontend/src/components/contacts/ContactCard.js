import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { MessageCircle, Phone, Mail, MoreVertical } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusColors = {
    active: 'green',
    busy: 'red',
    away: 'yellow',
    offline: 'gray'
  };

  return (
    <Badge
      colorScheme={statusColors[status?.toLowerCase()] || 'gray'}
      variant="subtle"
      size="sm"
      fontSize="xs"
      textTransform="capitalize"
    >
      {status || 'Unknown'}
    </Badge>
  );
};

export const ContactCard = ({ contact }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Define label colors
  const labelColors = {
    opportunity: 'green',
    appointment: 'purple',
    vip: 'red',
    enterprise: 'blue',
    technical: 'cyan',
    default: 'blue'
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
            <StatusBadge status={contact.status} />
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

        <HStack spacing={1} className="actions" opacity={0.7}>
          <Tooltip label="Send Message">
            <IconButton
              icon={<MessageCircle size={14} />}
              size="xs"
              variant="ghost"
              colorScheme="blue"
              aria-label="Send message"
            />
          </Tooltip>
          <Tooltip label="Call">
            <IconButton
              icon={<Phone size={14} />}
              size="xs"
              variant="ghost"
              colorScheme="blue"
              aria-label="Call"
            />
          </Tooltip>
          <Tooltip label="Email">
            <IconButton
              icon={<Mail size={14} />}
              size="xs"
              variant="ghost"
              colorScheme="blue"
              aria-label="Email"
            />
          </Tooltip>
          
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MoreVertical size={14} />}
              variant="ghost"
              size="xs"
              aria-label="More options"
            />
            <MenuList>
              <MenuItem>Edit Contact</MenuItem>
              <MenuItem>Delete Contact</MenuItem>
              <MenuItem>Add to Group</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </Box>
  );
};
