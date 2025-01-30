import React, { useState } from 'react';
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
  HStack,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  useToast,
} from '@chakra-ui/react';
import { LabelManager } from '../labels/LabelManager';
import { OpportunityCreator } from '../opportunities/OpportunityCreator';
import { AppointmentScheduler } from '../appointments/AppointmentScheduler';

export const AddContactModal = ({
  isOpen,
  onClose,
  newContact,
  onNewContactChange,
  onAddContact,
  onCreateOpportunity,
  onScheduleAppointment,
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBg = useColorModeValue('gray.100', 'gray.700');

  const handleSubmit = () => {
    const contact = {
      ...newContact,
      labels: selectedLabels.map(label => label.text), // Extract just the label text
    };
    onAddContact(contact);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader color={textColor}>New Contact</ModalHeader>
        <ModalCloseButton color={textColor} />
        <ModalBody pb={6}>
          <Tabs isFitted variant="soft-rounded" mb={4}>
            <TabList>
              <Tab 
                _selected={{ bg: 'blue.500', color: 'white' }}
                onClick={() => setActiveTab('basic')}
              >
                Basic Info
              </Tab>
              <Tab 
                _selected={{ bg: 'blue.500', color: 'white' }}
                onClick={() => setActiveTab('additional')}
              >
                Additional
              </Tab>
            </TabList>
          </Tabs>

          {activeTab === 'basic' ? (
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color={textColor}>First Name</FormLabel>
                <Input
                  placeholder="First name"
                  value={newContact.firstName}
                  onChange={(e) => onNewContactChange({ ...newContact, firstName: e.target.value })}
                  bg={inputBg}
                  color={textColor}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Last Name</FormLabel>
                <Input
                  placeholder="Last name"
                  value={newContact.lastName}
                  onChange={(e) => onNewContactChange({ ...newContact, lastName: e.target.value })}
                  bg={inputBg}
                  color={textColor}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color={textColor}>Phone</FormLabel>
                <Input
                  placeholder="Phone number"
                  value={newContact.phone}
                  onChange={(e) => onNewContactChange({ ...newContact, phone: e.target.value })}
                  bg={inputBg}
                  color={textColor}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input
                  placeholder="Email address"
                  value={newContact.email}
                  onChange={(e) => onNewContactChange({ ...newContact, email: e.target.value })}
                  bg={inputBg}
                  color={textColor}
                  type="email"
                />
              </FormControl>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color={textColor}>Lead Source</FormLabel>
                <Input
                  placeholder="Enter lead source"
                  value={newContact.leadSource}
                  onChange={(e) => onNewContactChange({ ...newContact, leadSource: e.target.value })}
                  bg={inputBg}
                  color={textColor}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Market</FormLabel>
                <Input
                  placeholder="Enter market"
                  value={newContact.market}
                  onChange={(e) => onNewContactChange({ ...newContact, market: e.target.value })}
                  bg={inputBg}
                  color={textColor}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Product</FormLabel>
                <Input
                  placeholder="Enter product"
                  value={newContact.product}
                  onChange={(e) => onNewContactChange({ ...newContact, product: e.target.value })}
                  bg={inputBg}
                  color={textColor}
                />
              </FormControl>
            </VStack>
          )}

          <HStack spacing={2} mt={4} mb={4} justify="center">
            <LabelManager
              selectedLabels={selectedLabels}
              onLabelsChange={setSelectedLabels}
            />
            <OpportunityCreator
              contact={newContact}
              onCreateOpportunity={onCreateOpportunity}
            />
            <AppointmentScheduler
              contact={newContact}
              onSchedule={onScheduleAppointment}
            />
          </HStack>

          <Button colorScheme="blue" w="100%" onClick={handleSubmit}>
            Add Contact
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
