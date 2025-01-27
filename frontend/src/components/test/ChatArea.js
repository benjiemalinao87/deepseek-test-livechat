import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Avatar,
  Text,
  Badge,
  Button,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { BsEmojiSmile, BsPaperclip, BsMic } from 'react-icons/bs';

export const ChatArea = ({
  selectedContact,
  messages,
  message,
  onMessageChange,
  onSendMessage,
  isDark,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const outboundMessageBg = useColorModeValue('blue.500', 'blue.400');

  return (
    <VStack h="100%" spacing={0}>
      <Box p={4} w="100%" borderBottom="1px" borderColor={borderColor}>
        <HStack justify="space-between">
          <HStack>
            <Avatar size="sm" name={selectedContact?.name || "Unknown"} />
            <Box>
              <Text fontWeight="medium" color={textColor}>
                {selectedContact?.name || "Select a contact"}
              </Text>
              <HStack spacing={2}>
                <Badge colorScheme="green">CUSTOMER</Badge>
                <Badge colorScheme="blue">OPEN</Badge>
              </HStack>
            </Box>
          </HStack>
          <IconButton
            icon={<CloseIcon />}
            variant="ghost"
            size="sm"
            aria-label="Close chat"
            color={textColor}
          />
        </HStack>
      </Box>

      <Box 
        flex={1} 
        w="100%" 
        overflowY="auto" 
        p={4}
        bg={isDark ? 'gray.900' : 'gray.50'}
      >
        <VStack spacing={4} align="stretch">
          {messages.map((msg, index) => {
            const isOutbound = msg.direction === 'outbound';
            return (
              <Flex
                key={index}
                justify={isOutbound ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="70%"
                  bg={isOutbound ? outboundMessageBg : bg}
                  color={isOutbound ? 'white' : textColor}
                  p={3}
                  rounded="lg"
                  shadow="sm"
                >
                  <Text>{msg.message}</Text>
                  <Text 
                    fontSize="xs" 
                    color={isOutbound ? 'whiteAlpha.800' : mutedTextColor}
                    textAlign="right"
                    mt={1}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </VStack>
      </Box>

      <Box p={4} w="100%" borderTop="1px" borderColor={borderColor}>
        <HStack spacing={2}>
          <IconButton
            icon={<BsEmojiSmile />}
            variant="ghost"
            aria-label="Add emoji"
            color={textColor}
          />
          <IconButton
            icon={<BsPaperclip />}
            variant="ghost"
            aria-label="Attach file"
            color={textColor}
          />
          <Input
            placeholder="Type your message here"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSendMessage();
              }
            }}
            bg={inputBg}
            color={textColor}
          />
          <IconButton
            icon={<BsMic />}
            variant="ghost"
            aria-label="Voice message"
            color={textColor}
          />
          <Button
            colorScheme="blue"
            onClick={onSendMessage}
            isDisabled={!message.trim() || !selectedContact}
          >
            Send
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
};
