import React from 'react';
import { Box, VStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { UserList } from '../chat/UserList';
import { MessageList } from '../chat/MessageList';
import { MessageInput } from '../chat/MessageInput';
import { DockWindow } from '../dock/DockWindow';

export const ChatWindow = ({ isConnected, messages, selectedUser, onUserSelect, onSendMessage }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <DockWindow title="LiveChat">
      <Box h="100%" display="flex">
        {/* Left Panel */}
        <Box w="300px" borderRight="1px solid" borderColor={borderColor}>
          <VStack h="100%" spacing={0}>
            <Box p={4} w="100%">
              <IconButton
                icon={<Plus />}
                size="sm"
                colorScheme="blue"
                variant="ghost"
                isRound
              />
            </Box>
            <UserList
              users={[]}
              selectedUser={selectedUser}
              onSelectUser={onUserSelect}
              messages={messages}
            />
          </VStack>
        </Box>

        {/* Right Panel */}
        <Box flex="1" display="flex" flexDirection="column">
          <MessageList messages={messages} />
          <MessageInput onSend={onSendMessage} />
        </Box>
      </Box>
    </DockWindow>
  );
};
