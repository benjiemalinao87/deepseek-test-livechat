import React from 'react';
import {
  Box,
  Input,
  IconButton,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';

export const MessageInput = ({ message, onChange, onSend }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('gray.400', 'gray.500');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box p={4} bg={bgColor} borderTop="1px solid" borderColor={borderColor}>
      <HStack spacing={2}>
        <IconButton
          icon={<Paperclip size={20} />}
          variant="ghost"
          color={iconColor}
          isRound
        />
        <Input
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          variant="filled"
          size="md"
          borderRadius="full"
        />
        <IconButton
          icon={<Smile size={20} />}
          variant="ghost"
          color={iconColor}
          isRound
        />
        <IconButton
          icon={<Mic size={20} />}
          variant="ghost"
          color={iconColor}
          isRound
        />
        <IconButton
          icon={<Send size={20} />}
          colorScheme="blue"
          onClick={onSend}
          isDisabled={!message.trim()}
          isRound
        />
      </HStack>
    </Box>
  );
};
