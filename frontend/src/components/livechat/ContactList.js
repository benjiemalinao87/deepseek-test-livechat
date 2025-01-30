import React, { useState } from 'react';
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
  Flex,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon, BellIcon, ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { BsThreeDotsVertical } from 'react-icons/bs';

const ContactList = ({
  contacts,
  selectedContact,
  onSelectContact,
  onAddContact,
  messages,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  // Get last message for each contact
  const getLastMessage = (contactPhone) => {
    const contactMessages = messages.filter(msg =>
      msg.to === contactPhone || msg.from === contactPhone
    );
    return contactMessages[contactMessages.length - 1];
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" bg={bg}>
      {/* Sticky Header */}
      <Box 
        borderBottom="1px" 
        borderColor={borderColor}
        bg={headerBg}
        position="sticky"
        top={0}
        zIndex={1}
      >
        {/* Title and Actions */}
        <Flex 
          justify="space-between" 
          align="center" 
          p={4}
          borderBottom="1px"
          borderColor={borderColor}
        >
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Chats
          </Text>
          <HStack spacing={2}>
            <IconButton
              icon={<BellIcon />}
              variant="ghost"
              size="sm"
              aria-label="Notifications"
            />
            <IconButton
              icon={<BsThreeDotsVertical />}
              variant="ghost"
              size="sm"
              aria-label="More options"
            />
          </HStack>
        </Flex>

        {/* Search and Filter */}
        <Box p={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color={mutedTextColor} />
            </InputLeftElement>
            <Input
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg={useColorModeValue('gray.100', 'gray.700')}
              _placeholder={{ color: mutedTextColor }}
              rounded="full"
            />
          </InputGroup>
          <HStack mt={4} spacing={4}>
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
              <MenuList>
                <MenuItem>All Chats</MenuItem>
                <MenuItem>Unread</MenuItem>
                <MenuItem>Active</MenuItem>
                <MenuItem>Closed</MenuItem>
              </MenuList>
            </Menu>
            <IconButton
              icon={<AddIcon />}
              variant="ghost"
              size="sm"
              onClick={onAddContact}
              aria-label="Add contact"
            />
          </HStack>
        </Box>
      </Box>

      {/* Scrollable Contact List */}
      <Box 
        flex={1} 
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '2px',
          },
        }}
      >
        <VStack spacing={0} align="stretch">
          {filteredContacts.map((contact) => {
            const lastMessage = getLastMessage(contact.phone);
            const isSelected = selectedContact === contact;
            
            return (
              <Box
                key={contact.id}
                p={4}
                cursor="pointer"
                bg={isSelected ? hoverBg : 'transparent'}
                _hover={{ bg: hoverBg }}
                onClick={() => onSelectContact(contact)}
                borderBottom="1px"
                borderColor={borderColor}
              >
                <HStack spacing={3}>
                  <Avatar
                    size="md"
                    name={contact.name}
                    bg="purple.500"
                  >
                    {contact.avatar}
                  </Avatar>
                  <Box flex={1}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" color={textColor}>
                        {contact.name}
                      </Text>
                      <Text fontSize="xs" color={mutedTextColor}>
                        {contact.time}
                      </Text>
                    </HStack>
                    <Text 
                      fontSize="sm" 
                      color={mutedTextColor}
                      noOfLines={1}
                    >
                      {lastMessage ? lastMessage.message : 'No messages yet'}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
};

export { ContactList };
