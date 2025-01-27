import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, AddIcon } from '@chakra-ui/icons';

export const ContactList = ({ 
  contacts, 
  selectedPhone, 
  onSelectContact, 
  onAddContact, 
  messages,
  isDark,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack h="100%" spacing={0} borderRight="1px" borderColor={borderColor}>
      <Box p={4} w="100%" borderBottom="1px" borderColor={borderColor}>
        <HStack spacing={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color={mutedTextColor} />
            </InputLeftElement>
            <Input
              placeholder="Search conversations"
              variant="filled"
              bg={inputBg}
              _focus={{ bg: isDark ? 'gray.600' : 'white' }}
              color={textColor}
            />
          </InputGroup>
          <IconButton
            icon={<AddIcon />}
            onClick={onAddContact}
            colorScheme="blue"
            variant="ghost"
            aria-label="Add new contact"
          />
        </HStack>
      </Box>
      
      <Box p={2} w="100%">
        <HStack justify="space-between" px={2}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              size="sm"
              variant="ghost"
              color={textColor}
            >
              All
            </MenuButton>
            <MenuList bg={bg} borderColor={borderColor}>
              <MenuItem>All Messages</MenuItem>
              <MenuItem>Unread</MenuItem>
              <MenuItem>Archived</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      <VStack flex={1} w="100%" overflowY="auto" spacing={0} align="stretch">
        {contacts.map((contact) => (
          <Box 
            key={contact.id}
            p={3} 
            _hover={{ bg: isDark ? 'gray.700' : 'gray.50' }} 
            cursor="pointer"
            bg={selectedPhone === contact.phone ? (isDark ? 'gray.700' : 'blue.50') : 'transparent'}
            onClick={() => onSelectContact(contact.phone)}
          >
            <HStack spacing={3}>
              <Avatar size="sm" name={contact.name} bg="purple.500">
                {contact.avatar}
              </Avatar>
              <Box flex={1}>
                <HStack justify="space-between">
                  <Text fontWeight="medium" color={textColor}>{contact.name}</Text>
                  <Text fontSize="xs" color={mutedTextColor}>{contact.time}</Text>
                </HStack>
                <Text fontSize="sm" color={mutedTextColor} noOfLines={1}>
                  {messages.filter(m => m.to === contact.phone || m.from === contact.phone).slice(-1)[0]?.message || contact.lastMessage}
                </Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};
