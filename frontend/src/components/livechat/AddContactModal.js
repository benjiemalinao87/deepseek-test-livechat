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
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

export const AddContactModal = ({
  isOpen,
  onClose,
  newContact,
  onNewContactChange,
  onAddContact,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader color={textColor}>Add New Contact</ModalHeader>
        <ModalCloseButton color={textColor} />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color={textColor}>Name</FormLabel>
              <Input
                placeholder="Enter contact name"
                value={newContact.name}
                onChange={(e) => onNewContactChange({ ...newContact, name: e.target.value })}
                bg={inputBg}
                color={textColor}
              />
            </FormControl>
            <FormControl>
              <FormLabel color={textColor}>Phone</FormLabel>
              <Input
                placeholder="Enter phone number"
                value={newContact.phone}
                onChange={(e) => onNewContactChange({ ...newContact, phone: e.target.value })}
                bg={inputBg}
                color={textColor}
              />
            </FormControl>
            <Button colorScheme="blue" w="100%" onClick={onAddContact}>
              Add Contact
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
