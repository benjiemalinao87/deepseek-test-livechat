import React, { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  useDisclosure,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { MessageCircle, Send, ExternalLink, X } from 'lucide-react';
import { sendTwilioMessage } from '../../services/twilio';

export const QuickMessage = ({ contact, onOpenLiveChat }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      await sendTwilioMessage({
        to: contact.phone,
        message: message.trim(),
      });

      toast({
        title: 'Message sent',
        description: `Message sent to ${contact.name}`,
        status: 'success',
        duration: 3000,
      });

      setMessage('');
      onClose();
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Menu>
      <MenuButton>
        <IconButton
          icon={<MessageCircle size={20} />}
          variant="ghost"
          colorScheme="blue"
          aria-label="Message options"
          size="sm"
          _hover={{ bg: 'blue.50' }}
          _dark={{ _hover: { bg: 'blue.900' } }}
        />
      </MenuButton>
      <MenuList>
        <MenuItem 
          icon={<ExternalLink size={16} />} 
          onClick={onOpenLiveChat}
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

      <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
        closeOnBlur={false}
      >
        <PopoverContent
          width="300px"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.200"
          _dark={{ borderColor: 'gray.600' }}
          borderRadius="xl"
        >
          <PopoverBody p={4}>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between" align="center">
                <Text fontSize="sm" fontWeight="medium">
                  Message to {contact.name}
                </Text>
                <IconButton
                  icon={<X size={14} />}
                  size="xs"
                  variant="ghost"
                  onClick={onClose}
                  aria-label="Close"
                  _hover={{ bg: 'red.50', color: 'red.500' }}
                  _dark={{ _hover: { bg: 'red.900', color: 'red.300' } }}
                />
              </HStack>
              
              <Box
                borderRadius="lg"
                bg="gray.50"
                _dark={{ bg: 'gray.800' }}
                p={3}
              >
                <HStack spacing={2}>
                  <Input
                    size="sm"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="unstyled"
                    disabled={isSending}
                  />
                  <IconButton
                    icon={<Send size={14} />}
                    size="sm"
                    colorScheme="blue"
                    isDisabled={!message.trim() || isSending}
                    onClick={handleSendMessage}
                    aria-label="Send message"
                    isLoading={isSending}
                    _hover={{ transform: 'translateX(2px)' }}
                    transition="all 0.2s"
                  />
                </HStack>
              </Box>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Menu>
  );
};
