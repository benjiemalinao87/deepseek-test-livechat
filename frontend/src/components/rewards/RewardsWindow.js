import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Progress, Badge, IconButton, useColorModeValue, Grid, Tooltip, Button, useToast } from '@chakra-ui/react';
import { Trophy, Star, Target, Award, Zap, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpinAndWin } from './SpinAndWin';
import { DailyChallenges } from './DailyChallenges';

const AchievementCard = ({ title, description, points, progress, total, isCompleted, onUnlock }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const wasCompleted = React.useRef(isCompleted);

  useEffect(() => {
    if (isCompleted && !wasCompleted.current) {
      onUnlock(title, points);
      wasCompleted.current = true;
    }
  }, [isCompleted, onUnlock, title, points]);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Box
        p={4}
        bg={bgColor}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        position="relative"
        overflow="hidden"
      >
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Text fontWeight="bold">{title}</Text>
            <Badge colorScheme={isCompleted ? 'green' : 'blue'}>
              {points} pts
            </Badge>
          </HStack>
          <Text fontSize="sm" color="gray.500">{description}</Text>
          <Progress 
            value={(progress / total) * 100} 
            colorScheme={isCompleted ? 'green' : 'blue'} 
            borderRadius="full"
          />
          <Text fontSize="xs" textAlign="right">
            {progress}/{total}
          </Text>
        </VStack>

        {/* Achievement unlock animation overlay */}
        <AnimatePresence>
          {isCompleted && !wasCompleted.current && (
            <motion.div
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 255, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
              }}
            >
              <Trophy size={40} color="gold" />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, label, value, change }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        p={4}
        bg={bgColor}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Icon size={20} />
            <Badge colorScheme={change >= 0 ? 'green' : 'red'}>
              {change >= 0 ? '+' : ''}{change}%
            </Badge>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold">{value}</Text>
          <Text fontSize="sm" color="gray.500">{label}</Text>
        </VStack>
      </Box>
    </motion.div>
  );
};

export function RewardsWindow({ onClose }) {
  const [level] = useState(5);
  const [experience] = useState(2500);
  const [nextLevelExp] = useState(5000);
  const [activeTab, setActiveTab] = useState('overview');
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const toast = useToast();

  const achievements = [
    {
      title: 'Speed Demon',
      description: 'Respond to 50 messages within 2 minutes',
      points: 100,
      progress: 35,
      total: 50,
      isCompleted: false
    },
    {
      title: 'Lead Master',
      description: 'Successfully qualify 25 leads',
      points: 200,
      progress: 25,
      total: 25,
      isCompleted: true
    },
    {
      title: 'Perfect Score',
      description: 'Maintain 100% CSAT for 7 days',
      points: 300,
      progress: 5,
      total: 7,
      isCompleted: false
    }
  ];

  const stats = [
    { icon: Trophy, label: 'Total Points', value: '2,500', change: 15 },
    { icon: Star, label: 'Achievements', value: '12/30', change: 5 },
    { icon: Target, label: 'Accuracy', value: '95%', change: -2 },
    { icon: Zap, label: 'Response Rate', value: '98%', change: 3 }
  ];

  const handleAchievementUnlock = (title, points) => {
    toast({
      title: 'Achievement Unlocked!',
      description: `Congratulations! You've earned ${points} points for completing "${title}"`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <Box h="100%" p={6} bg={bgColor} overflow="auto">
      {/* Level and Experience Section */}
      <VStack spacing={6} align="stretch">
        <Box textAlign="center" position="relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <HStack justify="center" spacing={4} mb={4}>
              <Crown size={32} color="gold" />
              <Text fontSize="3xl" fontWeight="bold">Level {level}</Text>
            </HStack>
          </motion.div>
          <Progress 
            value={(experience / nextLevelExp) * 100} 
            colorScheme="blue" 
            borderRadius="full"
            h={4}
            mb={2}
          />
          <Text fontSize="sm" color="gray.500">
            {experience} / {nextLevelExp} XP to Level {level + 1}
          </Text>
        </Box>

        {/* Navigation */}
        <HStack spacing={4} justify="center">
          {['overview', 'challenges', 'spin'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'solid' : 'ghost'}
              colorScheme="blue"
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </HStack>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <VStack spacing={6}>
                {/* Stats Grid */}
                <Grid templateColumns="repeat(4, 1fr)" gap={4} w="100%">
                  {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                  ))}
                </Grid>

                {/* Achievements Section */}
                <Box w="100%">
                  <HStack justify="space-between" mb={4}>
                    <Text fontSize="xl" fontWeight="bold">Active Achievements</Text>
                    <Button size="sm" leftIcon={<Award size={16} />}>
                      View All
                    </Button>
                  </HStack>
                  <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    {achievements.map((achievement, index) => (
                      <AchievementCard 
                        key={index} 
                        {...achievement} 
                        onUnlock={handleAchievementUnlock}
                      />
                    ))}
                  </Grid>
                </Box>
              </VStack>
            )}

            {activeTab === 'challenges' && <DailyChallenges />}
            {activeTab === 'spin' && <SpinAndWin />}
          </motion.div>
        </AnimatePresence>
      </VStack>
    </Box>
  );
} 