import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  Avatar,
  useColorModeValue,
  Flex,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { BsThreeDotsVertical, BsPersonPlus } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';

const ChatArea = ({ 
  selectedContact, 
  messages = [], 
  onSendMessage,
  socket,
  isDark,
  availableAgents = [],
  onAssignAgent
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('gray.50', 'gray.900');
  const scrollbarThumbBg = useColorModeValue('rgba(0,0,0,0.2)', 'rgba(255,255,255,0.2)');

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when contact is selected
  useEffect(() => {
    if (selectedContact) {
      inputRef.current?.focus();
    }
  }, [selectedContact]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      onSendMessage(newMessage, selectedContact.phone);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(msg => {
      const date = formatDate(msg.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  if (!selectedContact) {
    return (
      <Flex h="100%" align="center" justify="center" bg={bg}>
        <Text color={mutedTextColor}>Select a contact to start chatting</Text>
      </Flex>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <Flex direction="column" h="100%" bg={bg}>
      {/* Sticky Header */}
      <Box 
        borderBottom="1px" 
        borderColor={borderColor}
        bg={headerBg}
        position="sticky"
        top={0}
        zIndex={1}
      >
        <Flex justify="space-between" align="center" p={4}>
          <HStack spacing={3}>
            <Avatar
              size="sm"
              name={selectedContact.name}
              bg="purple.500"
            />
            <Box>
              <Text fontWeight="bold" color={textColor}>
                {selectedContact.name}
              </Text>
              <Text fontSize="sm" color={mutedTextColor}>
                {selectedContact.status || 'Active'}
              </Text>
            </Box>
          </HStack>
          <HStack spacing={2}>
            <Menu>
              <MenuButton
                as={IconButton}
                variant="ghost"
                size="sm"
                p={0}
                minW={8}
                h={8}
                _hover={{ bg: 'gray.100' }}
              >
                {selectedAgent ? (
                  <Avatar
                    size="sm"
                    name={selectedAgent.name}
                    bg={selectedAgent.color}
                    fontSize="xs"
                  >
                    {selectedAgent.initials}
                  </Avatar>
                ) : (
                  <Avatar
                    size="sm"
                    icon={<Icon as={BsPersonPlus} fontSize="1.2rem" color="gray.600" />}
                    bg="gray.100"
                    _hover={{ bg: 'gray.200' }}
                  />
                )}
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
                    onClick={() => {
                      setSelectedAgent(agent);
                      if (onAssignAgent) onAssignAgent(selectedContact, agent);
                    }}
                  >
                    <HStack spacing={2}>
                      <Avatar
                        size="sm"
                        name={agent.name}
                        bg={agent.color}
                        fontSize="xs"
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
                  onClick={() => {
                    setSelectedAgent(null);
                    if (onAssignAgent) onAssignAgent(selectedContact, null);
                  }}
                  color="gray.500"
                >
                  <Text fontSize="sm">Clear assignment</Text>
                </MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<BsThreeDotsVertical />}
                variant="ghost"
                size="sm"
                aria-label="More options"
              />
              <MenuList>
                <MenuItem>View Profile</MenuItem>
                <MenuItem>Clear Chat</MenuItem>
                <MenuItem>Block Contact</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      {/* Messages Area */}
      <Box 
        flex={1} 
        overflowY="auto" 
        p={4}
        ref={chatContainerRef}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: scrollbarThumbBg,
            borderRadius: '2px',
          },
        }}
      >
        <VStack spacing={6} align="stretch">
          {Object.entries(messageGroups).map(([date, groupMessages]) => (
            <Box key={date}>
              <Flex align="center" my={4}>
                <Divider flex={1} borderColor={borderColor} />
                <Text
                  mx={4}
                  fontSize="sm"
                  color={mutedTextColor}
                  whiteSpace="nowrap"
                >
                  {date}
                </Text>
                <Divider flex={1} borderColor={borderColor} />
              </Flex>

              <VStack spacing={4} align="stretch">
                {groupMessages.map((message, index) => {
                  const isOutbound = message.direction === 'outbound';
                  const time = formatTime(message.timestamp);

                  return (
                    <Flex
                      key={index}
                      justify={isOutbound ? 'flex-end' : 'flex-start'}
                    >
                      <Box
                        bg={message.direction === 'inbound' ? 'gray.100' : 'blue.500'}
                        color={message.direction === 'inbound' ? 'black' : 'white'}
                        px={4}
                        py={2}
                        borderRadius="lg"
                        maxW="70%"
                      >
                        <Text>{message.message}</Text>
                        <Flex 
                          justify={message.direction === 'outbound' ? 'flex-end' : 'flex-start'}
                          mt={1}
                        >
                          <HStack spacing={1} fontSize="xs" color={message.direction === 'inbound' ? 'gray.500' : 'whiteAlpha.800'}>
                            <Text>{formatTime(message.timestamp)}</Text>
                            {message.direction === 'outbound' && (
                              <Text color={message.status === 'pending' ? 'yellow.500' : 'green.500'}>
                                {message.status === 'pending' ? '⋯' : '✓'}
                              </Text>
                            )}
                          </HStack>
                        </Flex>
                      </Box>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Sticky Input Area */}
      <Box 
        borderTop="1px" 
        borderColor={borderColor}
        bg={bg}
        p={4}
        position="sticky"
        bottom={0}
        zIndex={1}
      >
        <form onSubmit={handleSendMessage}>
          <HStack spacing={2}>
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              size="md"
              autoComplete="off"
              _focus={{
                borderColor: 'purple.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
              }}
            />
            <IconButton
              type="submit"
              icon={<IoSend />}
              colorScheme="purple"
              isDisabled={!newMessage.trim()}
              aria-label="Send message"
            />
          </HStack>
        </form>
      </Box>
    </Flex>
  );
};

export { ChatArea };
