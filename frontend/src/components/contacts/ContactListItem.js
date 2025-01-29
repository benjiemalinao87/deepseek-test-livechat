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
  useDisclosure,
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

export const ContactListItem = ({ contact, onOpenLiveChat }) => {
  const { name, title, company, status, tags = [] } = contact;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      _hover={{ bg: 'gray.50' }}
      _dark={{ _hover: { bg: 'gray.800' } }}
      transition="all 0.2s"
      position="relative"
    >
      <HStack spacing={4}>
        <Avatar
          name={name}
          size="md"
          bg="blue.500"
          color="white"
        />
        
        <VStack align="start" spacing={1} flex={1}>
          <HStack width="full">
            <Text fontWeight="medium">{name}</Text>
            <StatusBadge status={status} />
          </HStack>
          
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
            {title} at {company}
          </Text>
          
          <HStack spacing={2}>
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

        <HStack spacing={2}>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MessageCircle size={20} />}
              variant="ghost"
              colorScheme="blue"
              aria-label="Message options"
              size="sm"
              _hover={{ bg: 'blue.50' }}
              _dark={{ _hover: { bg: 'blue.900' } }}
            />
            <MenuList>
              <MenuItem 
                icon={<ExternalLink size={16} />} 
                onClick={() => onOpenLiveChat(contact)}
                _hover={{ bg: 'blue.50' }}
                _dark={{ _hover: { bg: 'blue.900' } }}
              >
                Open in LiveChat
              </MenuItem>
              <MenuItem 
                icon={<MessageCircle size={16} />} 
                onClick={onOpen}
                _hover={{ bg: 'blue.50' }}
                _dark={{ _hover: { bg: 'blue.900' } }}
              >
                Quick Message
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            icon={<Phone size={20} />}
            variant="ghost"
            colorScheme="green"
            aria-label="Call contact"
            size="sm"
          />
          <IconButton
            icon={<MoreVertical size={20} />}
            variant="ghost"
            aria-label="More options"
            size="sm"
          />
        </HStack>
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
