import React from "react";
import { HStack, IconButton, Box, Tooltip } from "@chakra-ui/react";
import { MessageCircle, Users, GitBranch, Calendar, Phone, Tool, Settings } from "lucide-react";

interface DockProps {
  activeWindow: string | null;
  onWindowChange: (window: string) => void;
}

export function Dock({
  activeWindow,
  onWindowChange
}: DockProps) {
  const icons = [
    {
      id: "livechat",
      Icon: MessageCircle,
      label: "Livechat"
    },
    {
      id: "contacts",
      Icon: Users,
      label: "Contacts"
    },
    {
      id: "pipelines",
      Icon: GitBranch,
      label: "Pipelines"
    },
    {
      id: "calendar",
      Icon: Calendar,
      label: "Calendar"
    },
    {
      id: "dialer",
      Icon: Phone,
      label: "Dialer"
    },
    {
      id: "tools",
      Icon: Tool,
      label: "Tools"
    },
    {
      id: "settings",
      Icon: Settings,
      label: "Settings"
    }
  ];

  return (
    <Box 
      position="fixed" 
      bottom="20px" 
      left="50%" 
      transform="translateX(-50%)" 
      bg="rgba(255, 255, 255, 0.2)" 
      backdropFilter="blur(10px)" 
      borderRadius="18px" 
      p={2} 
      boxShadow="lg"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <HStack spacing={3}>
        {icons.map(({ id, Icon, label }) => (
          <Tooltip key={id} label={label} placement="top" hasArrow>
            <IconButton
              aria-label={label}
              icon={<Icon size={24} />}
              variant="ghost"
              color={activeWindow === id ? "blue.500" : "gray.600"}
              _hover={{
                transform: "scale(1.2)",
                bg: "rgba(255, 255, 255, 0.3)"
              }}
              transition="all 0.2s"
              onClick={() => onWindowChange(id)}
              size="lg"
              borderRadius="full"
            />
          </Tooltip>
        ))}
      </HStack>
    </Box>
  );
}