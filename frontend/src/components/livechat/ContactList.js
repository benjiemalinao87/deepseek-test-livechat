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
  Badge,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { BsFilter } from 'react-icons/bs';

const ContactList = ({
  contacts,
  selectedContact,
  onSelectContact,
  onAddContact,
  messages,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Open');
  const [assignmentFilter, setAssignmentFilter] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const bg = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(23, 25, 35, 0.9)');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const buttonBg = useColorModeValue('transparent', 'transparent');
  const activeButtonBg = useColorModeValue('gray.100', 'gray.700');

  // Available agents data
  const availableAgents = [
    { id: 1, name: 'Darin Booth', initials: 'DB' },
    { id: 2, name: 'Allison', initials: 'AL' },
    { id: 3, name: 'Lyndel', initials: 'LY' },
    { id: 4, name: 'Guktork', initials: 'GK' }
  ];

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

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" bg={bg}>
      {/* Header Section */}
      <Box 
        borderBottom="1px" 
        borderColor={borderColor}
        bg={headerBg}
        position="sticky"
        top={0}
        zIndex={1}
        backdropFilter="blur(10px)"
      >
        {/* Status and Filter Row */}
        <Flex 
          justify="space-between" 
          align="center" 
          px={4}
          py={3}
          borderBottom="1px"
          borderColor={borderColor}
        >
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg={buttonBg}
              _hover={{ bg: hoverBg }}
              _active={{ bg: activeButtonBg }}
              size="sm"
              fontWeight="medium"
              color={textColor}
            >
              {statusFilter}
            </MenuButton>
            <MenuList
              mt={1}
              borderRadius="md"
              overflow="hidden"
              border="1px"
              borderColor={borderColor}
              py={1}
            >
              <MenuItem onClick={() => setStatusFilter('Open')}>Open</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Pending')}>Pending</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Done')}>Done</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Spam')}>Spam</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Invalid')}>Invalid</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Unsubscribe')}>Unsubscribe</MenuItem>
            </MenuList>
          </Menu>

          <HStack spacing={2}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg={buttonBg}
                _hover={{ bg: hoverBg }}
                _active={{ bg: activeButtonBg }}
                size="sm"
                fontWeight="medium"
                color={textColor}
              >
                {assignmentFilter}
              </MenuButton>
              <MenuList
                mt={1}
                borderRadius="md"
                overflow="hidden"
                border="1px"
                borderColor={borderColor}
                py={1}
              >
                <MenuItem onClick={() => setAssignmentFilter('All')}>All</MenuItem>
                <MenuItem onClick={() => setAssignmentFilter('Me')}>Me</MenuItem>
                <MenuItem onClick={() => setAssignmentFilter('Unassigned')}>Unassigned</MenuItem>
              </MenuList>
            </Menu>
            <IconButton
              icon={<BsFilter />}
              bg={buttonBg}
              _hover={{ bg: hoverBg }}
              _active={{ bg: activeButtonBg }}
              size="sm"
              aria-label="Additional filters"
            />
          </HStack>
        </Flex>

        {/* Search and Assignment Section */}
        <Box px={4} py={3}>
          <InputGroup size="sm" mb={4}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color={mutedTextColor} />
            </InputLeftElement>
            <Input
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg={buttonBg}
              borderRadius="md"
              borderColor={borderColor}
              _focus={{
                borderColor: 'blue.400',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
              }}
              _hover={{
                borderColor: 'gray.300',
              }}
              fontSize="sm"
            />
          </InputGroup>

          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              size="sm"
              w="100%"
              borderRadius="md"
              borderColor={borderColor}
              bg={buttonBg}
              _hover={{ bg: hoverBg }}
              _active={{ bg: activeButtonBg }}
              height="auto"
              py={2}
            >
              <HStack spacing={2} justify="flex-start">
                {selectedAgent ? (
                  <>
                    <Avatar
                      size="xs"
                      name={selectedAgent.name}
                      bg="green.500"
                    >
                      {selectedAgent.initials}
                    </Avatar>
                    <Text fontSize="sm" fontWeight="medium">
                      {selectedAgent.name}
                    </Text>
                  </>
                ) : (
                  <Text fontSize="sm" color={mutedTextColor}>
                    Assign to agent...
                  </Text>
                )}
              </HStack>
            </MenuButton>
            <MenuList
              mt={1}
              borderRadius="md"
              overflow="hidden"
              border="1px"
              borderColor={borderColor}
              py={1}
            >
              {availableAgents.map((agent) => (
                <MenuItem
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <HStack spacing={2}>
                    <Avatar
                      size="xs"
                      name={agent.name}
                      bg="green.500"
                    >
                      {agent.initials}
                    </Avatar>
                    <Text fontSize="sm">
                      {agent.name}
                    </Text>
                  </HStack>
                </MenuItem>
              ))}
              <Divider my={1} />
              <MenuItem
                onClick={() => setSelectedAgent(null)}
                color="gray.500"
              >
                <Text fontSize="sm">Clear assignment</Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      {/* Contact List */}
      <VStack 
        flex={1} 
        spacing={0} 
        overflowY="auto" 
        align="stretch"
        divider={<Divider borderColor={borderColor} />}
      >
        {filteredContacts.map((contact) => {
          const lastMessage = getLastMessage(contact.phone);
          const isSelected = selectedContact && selectedContact.phone === contact.phone;

          return (
            <Box
              key={contact.phone}
              p={4}
              cursor="pointer"
              bg={isSelected ? hoverBg : 'transparent'}
              _hover={{ bg: hoverBg }}
              onClick={() => onSelectContact(contact)}
            >
              <HStack spacing={4} align="start">
                <Box position="relative">
                  <Avatar
                    size="md"
                    name={contact.name}
                    bg="orange.500"
                  />
                  <Badge
                    position="absolute"
                    bottom="-2px"
                    right="-2px"
                    fontSize="xs"
                    colorScheme="gray"
                    borderRadius="sm"
                  >
                    SMS
                  </Badge>
                </Box>
                
                <Box flex={1}>
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontWeight="semibold" color={textColor}>
                      {contact.name}
                    </Text>
                    {lastMessage && (
                      <Text fontSize="xs" color={mutedTextColor}>
                        {formatTime(lastMessage.timestamp)}
                      </Text>
                    )}
                  </Flex>
                  {lastMessage && (
                    <Text fontSize="sm" color={mutedTextColor} noOfLines={1}>
                      {lastMessage.direction === 'outbound' ? 'Agent: ' : ''}{lastMessage.message}
                    </Text>
                  )}
                </Box>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export { ContactList };
