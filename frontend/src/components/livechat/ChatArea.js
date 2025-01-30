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
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';

const ChatArea = ({ 
  selectedContact, 
  messages = [], 
  onSendMessage,
  socket,
  isDark 
}) => {
  const [newMessage, setNewMessage] = useState('');
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
                {selectedContact.status || 'Online'}
              </Text>
            </Box>
          </HStack>
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
                        maxW="70%"
                        bg={isOutbound ? 'purple.500' : 'gray.100'}
                        color={isOutbound ? 'white' : 'gray.800'}
                        px={4}
                        py={2}
                        borderRadius="lg"
                        position="relative"
                      >
                        <Text>{message.message}</Text>
                        <Text
                          fontSize="xs"
                          color={isOutbound ? 'whiteAlpha.800' : 'gray.500'}
                          textAlign={isOutbound ? 'right' : 'left'}
                          mt={1}
                        >
                          {time}
                        </Text>
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
