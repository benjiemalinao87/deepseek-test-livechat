import React, { useState, useRef } from 'react';
import { Box, HStack, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { X, Minus, Square } from 'lucide-react';
import Draggable from 'react-draggable';

export const DraggableWindow = ({ title, onClose, children, defaultPosition = { x: 50, y: 50 }, defaultSize = { width: 800, height: 600 } }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowSize, setWindowSize] = useState(defaultSize);
  const [previousSize, setPreviousSize] = useState(defaultSize);
  const [previousPosition, setPreviousPosition] = useState(defaultPosition);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);
  
  // Color mode hooks
  const bgColor = useColorModeValue('whiteAlpha.800', 'blackAlpha.700');
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.100');
  const headerBg = useColorModeValue('whiteAlpha.500', 'blackAlpha.400');
  const scrollbarThumbColor = useColorModeValue('gray.400', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

  const toggleFullscreen = () => {
    if (isFullscreen) {
      // Restore previous size and position
      setWindowSize(previousSize);
      setIsFullscreen(false);
    } else {
      // Save current size and position before going fullscreen
      setPreviousSize(windowSize);
      setPreviousPosition(defaultPosition);
      // Set to fullscreen
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setIsFullscreen(true);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target === resizeRef.current) {
      setIsResizing(true);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const newWidth = Math.max(800, e.clientX - e.target.getBoundingClientRect().left);
    const newHeight = Math.max(600, e.clientY - e.target.getBoundingClientRect().top);
    
    setWindowSize({
      width: newWidth,
      height: newHeight
    });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (isMinimized) return null;

  return (
    <Draggable
      handle=".window-handle"
      defaultPosition={defaultPosition}
      position={isFullscreen ? { x: 0, y: 0 } : undefined}
      disabled={isFullscreen}
      bounds={{
        left: 0,
        top: 0,
        right: window.innerWidth - windowSize.width,
        bottom: window.innerHeight - windowSize.height
      }}
    >
      <Box
        position="absolute"
        width={`${windowSize.width}px`}
        height={`${windowSize.height}px`}
        bg={bgColor}
        borderRadius={isFullscreen ? "0" : "lg"}
        boxShadow={isFullscreen ? "none" : "xl"}
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(10px)"
        transition="all 0.2s"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: scrollbarThumbColor,
            borderRadius: '24px',
          },
        }}
      >
        {/* Window Title Bar */}
        <HStack
          className="window-handle"
          px={3}
          py={2}
          bg={headerBg}
          cursor={isFullscreen ? "default" : "grab"}
          justify="space-between"
          userSelect="none"
          borderBottom="1px solid"
          borderColor={borderColor}
          _active={{ cursor: isFullscreen ? "default" : "grabbing" }}
        >
          <HStack spacing={2}>
            <IconButton
              size="xs"
              icon={<X size={12} />}
              isRound
              aria-label="Close"
              bg="red.400"
              _hover={{ bg: 'red.500' }}
              onClick={onClose}
            />
            <IconButton
              size="xs"
              icon={<Minus size={12} />}
              isRound
              aria-label="Minimize"
              bg="yellow.400"
              _hover={{ bg: 'yellow.500' }}
              onClick={() => setIsMinimized(true)}
            />
            <IconButton
              size="xs"
              icon={<Square size={12} />}
              isRound
              aria-label="Toggle Fullscreen"
              bg="green.400"
              _hover={{ bg: 'green.500' }}
              onClick={toggleFullscreen}
            />
          </HStack>
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            {title}
          </Text>
          <Box w={70} /> {/* Spacer to center the title */}
        </HStack>

        {/* Window Content */}
        <Box p={4} height="calc(100% - 45px)" overflowY="auto">
          {children}
        </Box>

        {/* Resize Handle - Only show when not fullscreen */}
        {!isFullscreen && (
          <Box
            ref={resizeRef}
            position="absolute"
            bottom={2}
            right={2}
            w="20px"
            h="20px"
            cursor="nwse-resize"
            onMouseDown={handleMouseDown}
            borderRadius="full"
            bg="blue.500"
            opacity="0.8"
            _hover={{ opacity: 1 }}
            transition="opacity 0.2s"
            zIndex={1000}
            _before={{
              content: '""',
              position: 'absolute',
              bottom: '6px',
              right: '6px',
              width: '8px',
              height: '2px',
              bg: 'white',
              transform: 'rotate(-45deg)'
            }}
            _after={{
              content: '""',
              position: 'absolute',
              bottom: '9px',
              right: '9px',
              width: '8px',
              height: '2px',
              bg: 'white',
              transform: 'rotate(-45deg)'
            }}
          />
        )}
      </Box>
    </Draggable>
  );
};
