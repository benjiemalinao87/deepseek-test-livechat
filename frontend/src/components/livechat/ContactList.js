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
  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(23, 25, 35, 0.8)');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBg = useColorModeValue('white', 'gray.800');
  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonShadow = useColorModeValue('0 1px 2px rgba(0, 0, 0, 0.05)', '0 1px 2px rgba(255, 255, 255, 0.05)');
  const dropdownShadow = useColorModeValue(
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
  );

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
        px={4}
        py={3}
      >
        {/* Status and Filter Dropdowns */}
        <Flex 
          justify="space-between" 
          align="center" 
          mb={3}
        >
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg={buttonBg}
              shadow={buttonShadow}
              _hover={{ bg: hoverBg }}
              _active={{ bg: hoverBg }}
              size="md"
              px={4}
              fontWeight="medium"
              borderRadius="xl"
            >
              {statusFilter}
            </MenuButton>
            <MenuList
              shadow={dropdownShadow}
              borderRadius="xl"
              overflow="hidden"
              border="1px"
              borderColor={borderColor}
            >
              <MenuItem onClick={() => setStatusFilter('Open')}>Open</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Pending')}>Pending</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Done')}>Done</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Spam')}>Spam</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Invalid')}>Invalid</MenuItem>
              <MenuItem onClick={() => setStatusFilter('Unsubscribe')}>Unsubscribe</MenuItem>
            </MenuList>
          </Menu>

          <HStack spacing={3}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg={buttonBg}
                shadow={buttonShadow}
                _hover={{ bg: hoverBg }}
                _active={{ bg: hoverBg }}
                size="md"
                px={4}
                fontWeight="medium"
                borderRadius="xl"
              >
                {assignmentFilter}
              </MenuButton>
              <MenuList
                shadow={dropdownShadow}
                borderRadius="xl"
                overflow="hidden"
                border="1px"
                borderColor={borderColor}
              >
                <MenuItem onClick={() => setAssignmentFilter('All')}>All</MenuItem>
                <MenuItem onClick={() => setAssignmentFilter('Me')}>Me</MenuItem>
                <MenuItem onClick={() => setAssignmentFilter('Unassigned')}>Unassigned</MenuItem>
              </MenuList>
            </Menu>
            <IconButton
              icon={<BsFilter />}
              bg={buttonBg}
              shadow={buttonShadow}
              _hover={{ bg: hoverBg }}
              _active={{ bg: hoverBg }}
              size="md"
              borderRadius="xl"
              aria-label="Additional filters"
            />
          </HStack>
        </Flex>

        {/* Assigned To Section */}
        <Box mb={3}>
          <Text fontSize="sm" color={mutedTextColor} mb={2} fontWeight="medium">
            Assigned to
          </Text>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              p={2}
              _hover={{ bg: hoverBg }}
              w="100%"
              borderRadius="xl"
              borderColor={borderColor}
              bg={buttonBg}
              height="auto"
              transition="all 0.2s"
            >
              <HStack spacing={2} justify="flex-start" w="100%" py={1}>
                {selectedAgent ? (
                  <>
                    <Avatar
                      size="sm"
                      name={selectedAgent.name}
                      bg="green.500"
                      borderRadius="lg"
                    >
                      {selectedAgent.initials}
                    </Avatar>
                    <Text fontSize="sm" fontWeight="medium">
                      {selectedAgent.name}
                    </Text>
                  </>
                ) : (
                  <Text fontSize="sm" color={mutedTextColor}>
                    Select an agent
                  </Text>
                )}
              </HStack>
            </MenuButton>
            <MenuList
              shadow={dropdownShadow}
              borderRadius="xl"
              overflow="hidden"
              border="1px"
              borderColor={borderColor}
            >
              {availableAgents.map((agent) => (
                <MenuItem
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  py={2}
                >
                  <HStack spacing={2}>
                    <Avatar
                      size="sm"
                      name={agent.name}
                      bg="green.500"
                      borderRadius="lg"
                    >
                      {agent.initials}
                    </Avatar>
                    <Text fontSize="sm" fontWeight="medium">
                      {agent.name}
                    </Text>
                  </HStack>
                </MenuItem>
              ))}
              <Divider my={2} />
              <MenuItem
                onClick={() => setSelectedAgent(null)}
                color="gray.500"
                py={2}
              >
                <Text fontSize="sm">Clear assignment</Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>

        {/* Search Bar */}
        <Box>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color={mutedTextColor} />
            </InputLeftElement>
            <Input
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg={buttonBg}
              borderRadius="xl"
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
