import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  VStack,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { sendTwilioMessage } from '../../services/twilio';

/**
 * QuickMessage Component
 * 
 * A popup component for sending quick messages to contacts.
 * Uses the existing Twilio integration for message sending.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {function} props.onClose - Callback to close the modal
 * @param {Object} props.contact - Contact to send message to
 */
export const QuickMessage = ({ isOpen, onClose, contact }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();

  // Color modes
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  /**
   * Handles sending the message via Twilio
   * Uses the same Twilio service as LiveChat
   */
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      // Use existing Twilio service
      await sendTwilioMessage({
        to: contact.phone,
        message: message.trim(),
      });

      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully',
        status: 'success',
        duration: 3000,
      });

      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: error.message || 'Failed to send message',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg={bg} borderColor={borderColor}>
        <ModalHeader>Quick Message</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" fontWeight="medium">
              To: {contact?.name} ({contact?.phone})
            </Text>
            
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              size="sm"
              rows={4}
              resize="vertical"
              autoFocus
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSendMessage}
            isLoading={isSending}
            loadingText="Sending..."
            isDisabled={!message.trim()}
          >
            Send Message
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
