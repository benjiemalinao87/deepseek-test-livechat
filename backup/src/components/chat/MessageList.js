import React from "react";
import { VStack, HStack, Text, Box, Avatar } from "@chakra-ui/react";

export const MessageList = ({
  messages,
  currentUser,
  isDark,
}) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <VStack
      spacing={4}
      p={4}
      flex={1}
      overflowY="auto"
      alignItems="stretch"
      bg={isDark ? "gray.900" : "gray.50"}
    >
      {messages.map((msg, index) => {
        const isOutbound = msg.direction === 'outbound';
        const alignment = isOutbound ? "flex-end" : "flex-start";
        const bgColor = isOutbound
          ? isDark ? "blue.600" : "blue.500"
          : isDark ? "gray.700" : "gray.200";
        const textColor = isOutbound ? "white" : isDark ? "white" : "gray.800";

        return (
          <Box
            key={index}
            alignSelf={alignment}
            maxW="70%"
          >
            <HStack spacing={2} align="flex-start" justify={isOutbound ? "flex-end" : "flex-start"}>
              {!isOutbound && (
                <Avatar
                  size="sm"
                  src={currentUser?.avatar}
                  name={currentUser?.name}
                />
              )}
              <VStack align={alignment} spacing={1}>
                <Box
                  p={3}
                  bg={bgColor}
                  color={textColor}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Text fontSize="sm">{msg.message}</Text>
                </Box>
                <HStack spacing={2} justify={alignment}>
                  <Text fontSize="xs" color={isDark ? "gray.400" : "gray.500"}>
                    {formatTime(msg.timestamp)}
                  </Text>
                  {isOutbound && msg.status && (
                    <Text fontSize="xs" color={isDark ? "gray.400" : "gray.500"}>
                      {msg.status === 'sent' ? '✓' : msg.status === 'delivered' ? '✓✓' : ''}
                    </Text>
                  )}
                </HStack>
              </VStack>
              {isOutbound && (
                <Avatar
                  size="sm"
                  src={currentUser?.avatar}
                  name={currentUser?.name}
                />
              )}
            </HStack>
          </Box>
        );
      })}
    </VStack>
  );
};
