import React from 'react';
import { HStack, Select, Button } from '@chakra-ui/react';

export const ContactSelect = ({ contacts, selectedContact, onSelectContact, onAddContact }) => {
  return (
    <HStack>
      <Select
        placeholder="Select contact"
        value={selectedContact?.phone || ''}
        onChange={(e) => {
          const contact = contacts.find(c => c.phone === e.target.value);
          onSelectContact(contact);
        }}
      >
        {contacts.map(contact => (
          <option key={contact.phone} value={contact.phone}>
            {contact.name} ({contact.phone})
          </option>
        ))}
      </Select>
      <Button onClick={onAddContact}>Add Contact</Button>
    </HStack>
  );
};
