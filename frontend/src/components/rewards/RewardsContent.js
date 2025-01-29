import React from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  VStack,
  HStack,
  Text,
  Progress,
  Grid,
  Badge,
  Button,
  Icon,
} from '@chakra-ui/react';
import { Crown, Trophy, Target, Star, Zap, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';
import { Leaderboard } from './leaderboard/Leaderboard';

const MetricCard = ({ icon, value, label, change }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
      transition="all 0.2s"
    >
      <VStack spacing={2} align="stretch">
        <HStack justify="space-between">
          <Box color="gray.500">
            {icon}
          </Box>
          <Badge
            colorScheme={change >= 0 ? 'green' : 'red'}
            variant="subtle"
          >
            {change >= 0 ? '+' : ''}{change}%
          </Badge>
        </HStack>
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {label}
        </Text>
      </VStack>
    </Box>
  );
};

const AchievementCard = ({ title, description, points, progress, total }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
      transition="all 0.2s"
    >
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <Text fontWeight="bold">{title}</Text>
          <Badge colorScheme="blue">{points} PTS</Badge>
        </HStack>
        <Text fontSize="sm" color="gray.500">
          {description}
        </Text>
        <Progress
          value={(progress / total) * 100}
          size="sm"
          colorScheme="blue"
          borderRadius="full"
        />
      </VStack>
    </Box>
  );
};

const Overview = () => {
  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} align="center">
        <HStack spacing={2}>
          <Icon as={Crown} color="yellow.400" boxSize={8} />
          <Text fontSize="4xl" fontWeight="bold">Level 5</Text>
        </HStack>
        <Progress
          value={50}
          size="lg"
          w="100%"
          maxW="600px"
          colorScheme="blue"
          borderRadius="full"
        />
        <Text color="gray.500">2500 / 5000 XP to Level 6</Text>
      </VStack>

      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        <MetricCard
          icon={<Trophy size={20} />}
          value="2,500"
          label="Total Points"
          change={15}
        />
        <MetricCard
          icon={<Star size={20} />}
          value="12/30"
          label="Achievements"
          change={5}
        />
        <MetricCard
          icon={<Crosshair size={20} />}
          value="95%"
          label="Accuracy"
          change={-2}
        />
        <MetricCard
          icon={<Zap size={20} />}
          value="98%"
          label="Response Rate"
          change={3}
        />
      </Grid>

      <HStack justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">Active Achievements</Text>
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<Trophy size={16} />}
        >
          View All
        </Button>
      </HStack>

      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <AchievementCard
          title="Speed Demon"
          description="Respond to 50 messages within 2 minutes"
          points={100}
          progress={30}
          total={50}
        />
        <AchievementCard
          title="Lead Master"
          description="Successfully qualify 25 leads"
          points={200}
          progress={20}
          total={25}
        />
        <AchievementCard
          title="Perfect Score"
          description="Maintain 100% CSAT for 7 days"
          points={300}
          progress={5}
          total={7}
        />
      </Grid>
    </VStack>
  );
};

export const RewardsContent = () => {
  return (
    <VStack spacing={6} align="stretch" w="full">
      <Tabs variant="soft-rounded" colorScheme="blue" align="center">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Leaderboard</Tab>
          <Tab>Challenges</Tab>
          <Tab>Spin</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Overview />
          </TabPanel>
          <TabPanel>
            <Leaderboard />
          </TabPanel>
          <TabPanel>
            {/* Challenges content */}
          </TabPanel>
          <TabPanel>
            {/* Spin content */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}; 