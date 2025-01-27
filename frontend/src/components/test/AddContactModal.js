import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';

export const AddContactModal = ({ isOpen, onClose, onAddContact }) => {
  const [newContact, setNewContact] = React.useState({ name: '', phone: '' });
  const toast = useToast();

  const handleSubmit = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: 'Error',
        description: 'Please enter both name and phone number',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Format phone number to E.164 format
    let formattedPhone = newContact.phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('1')) {
      formattedPhone = '1' + formattedPhone;
    }
    formattedPhone = '+' + formattedPhone;

    onAddContact({ ...newContact, phone: formattedPhone });
    setNewContact({ name: '', phone: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Contact</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Contact name"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone number (e.g., 16267888830)"
            />
          </FormControl>

          <Button mt={4} colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button mt={4} onClick={onClose}>Cancel</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
