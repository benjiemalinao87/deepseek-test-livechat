import React from "react";
import { HStack, Textarea, IconButton } from "@chakra-ui/react";
import { Send } from "lucide-react";

export const MessageInput = ({
  message,
  onChange,
  onSend,
  isDark,
  disabled
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <HStack p={4} bg={isDark ? "gray.800" : "white"} borderTop="1px" borderColor={isDark ? "gray.700" : "gray.200"}>
      <Textarea
        placeholder="Type a message..."
        value={message}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        rows={1}
        resize="none"
        disabled={disabled}
        bg={isDark ? "gray.700" : "white"}
        color={isDark ? "white" : "gray.800"}
        borderColor={isDark ? "gray.600" : "gray.200"}
        _hover={{
          borderColor: isDark ? "gray.500" : "gray.300"
        }}
        _focus={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
        }}
      />
      <IconButton
        aria-label="Send message"
        icon={<Send size={18} />}
        onClick={onSend}
        isDisabled={!message.trim() || disabled}
        colorScheme="blue"
      />
    </HStack>
  );
};
