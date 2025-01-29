import React, { useState } from 'react';
import { Box, Button, Text, VStack, HStack, useColorModeValue, Badge, useToast } from '@chakra-ui/react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Gift, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SpinAndWin = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [currentReward, setCurrentReward] = useState(null);
  const controls = useAnimation();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const rewards = [
    { label: '500 XP', color: '#FF6B6B' },
    { label: '100 Points', color: '#4ECDC4' },
    { label: '200 XP', color: '#45B7D1' },
    { label: '50 Points', color: '#96CEB4' },
    { label: '1000 XP', color: '#FFEEAD' },
    { label: '150 Points', color: '#D4A5A5' },
    { label: '300 XP', color: '#9DE0AD' },
    { label: '75 Points', color: '#FF9999' }
  ];

  const triggerConfetti = () => {
    // Fire multiple confetti bursts
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        scalar: 1.2,
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const showRewardNotification = (reward) => {
    toast({
      title: "🎉 Congratulations!",
      description: (
        <VStack align="stretch" spacing={2}>
          <Text fontWeight="bold">You won: {reward.label}!</Text>
          <Text fontSize="sm">Come back tomorrow for another chance to win!</Text>
        </VStack>
      ),
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
      icon: <PartyPopper />,
    });
  };

  const spinWheel = async () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setCanSpin(false);
    setCurrentReward(null);

    // Random number of full rotations (3-5) plus random segment
    const rotations = 3 + Math.random() * 2;
    const randomSegment = Math.floor(Math.random() * rewards.length);
    const finalRotation = rotations * 360 + (randomSegment * (360 / rewards.length));

    await controls.start({
      rotate: finalRotation,
      transition: {
        duration: 4,
        ease: [0.2, 0, 0.2, 1]
      }
    });

    // Show reward animation
    setTimeout(() => {
      setIsSpinning(false);
      const wonReward = rewards[randomSegment];
      setCurrentReward(wonReward);
      triggerConfetti();
      showRewardNotification(wonReward);
      // Reset after 24 hours
      setTimeout(() => setCanSpin(true), 24 * 60 * 60 * 1000);
    }, 4000);
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">Spin & Win</Text>
        <Badge colorScheme={canSpin ? 'green' : 'red'}>
          {canSpin ? 'Ready to Spin!' : 'Next spin in 24h'}
        </Badge>
      </HStack>

      <Box
        position="relative"
        w="300px"
        h="300px"
        mx="auto"
        bg={bgColor}
        borderRadius="full"
        border="2px solid"
        borderColor={borderColor}
        overflow="hidden"
        boxShadow="xl"
      >
        <motion.div
          animate={controls}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {rewards.map((reward, index) => {
            const rotation = (index * 360) / rewards.length;
            return (
              <Box
                key={index}
                position="absolute"
                top="0"
                left="50%"
                width="50%"
                height="50%"
                transformOrigin="0% 100%"
                transform={`rotate(${rotation}deg) skewY(-${360 / rewards.length / 2}deg)`}
                bg={reward.color}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  transform={`rotate(${90 + (360 / rewards.length / 2)}deg)`}
                  fontSize="xs"
                  fontWeight="bold"
                  color="white"
                >
                  {reward.label}
                </Text>
              </Box>
            );
          })}
        </motion.div>

        {/* Center pointer */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="20px"
          h="20px"
          bg="white"
          borderRadius="full"
          boxShadow="lg"
          zIndex={2}
        />

        {/* Celebration overlay */}
        <AnimatePresence>
          {currentReward && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '50%',
                zIndex: 3,
              }}
            >
              <VStack spacing={2}>
                <PartyPopper size={40} color="gold" />
                <Text color="white" fontWeight="bold" fontSize="xl">
                  {currentReward.label}
                </Text>
              </VStack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Button
        leftIcon={<Gift />}
        colorScheme="blue"
        isDisabled={!canSpin || isSpinning}
        onClick={spinWheel}
        size="lg"
        w="200px"
        mx="auto"
        _hover={{
          transform: 'scale(1.05)',
        }}
        transition="all 0.2s"
      >
        {isSpinning ? 'Spinning...' : 'Spin Now!'}
      </Button>

      {currentReward && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Text textAlign="center" fontSize="lg" fontWeight="bold" color="green.500">
            Congratulations! You won {currentReward.label}! 🎉
          </Text>
        </motion.div>
      )}
    </VStack>
  );
}; 