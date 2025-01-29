import React, { useState } from 'react';
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  Badge,
} from '@chakra-ui/react';
import { Trophy, Target, Zap, Star, Award, GitBranch } from 'lucide-react';
import { DailyChallenges } from './challenges/DailyChallenges';
import { SpinAndWin } from './spin/SpinAndWin';
import { PowerUps } from './powerups/PowerUps';
import { Leaderboard } from './leaderboard/Leaderboard';
import { SkillTree } from './skillTree/SkillTree';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, helpText, icon }: {
  label: string;
  value: string | number;
  helpText?: string;
  icon: React.ReactNode;
}) => {
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
      <Stat>
        <HStack spacing={2} mb={2}>
          <Box color="blue.500">
            {icon}
          </Box>
          <StatLabel>{label}</StatLabel>
        </HStack>
        <StatNumber>{value}</StatNumber>
        {helpText && (
          <StatHelpText>{helpText}</StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

const Overview = () => {
  // Mock data - replace with real data
  const stats = {
    level: 15,
    xp: 2750,
    nextLevelXp: 3000,
    achievements: 24,
    totalAchievements: 50,
    powerUps: 3,
    skillPoints: 450,
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack spacing={4}>
        <Text fontSize="3xl" fontWeight="bold">Level {stats.level}</Text>
        <Badge colorScheme="purple" p={2} borderRadius="md">
          {stats.xp} / {stats.nextLevelXp} XP
        </Badge>
      </HStack>

      <Progress
        value={(stats.xp / stats.nextLevelXp) * 100}
        size="lg"
        colorScheme="purple"
        borderRadius="full"
        hasStripe
        isAnimated
      />

      <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={4}>
        <StatCard
          label="Achievements"
          value={`${stats.achievements}/${stats.totalAchievements}`}
          helpText="48% Complete"
          icon={<Trophy size={20} />}
        />
        <StatCard
          label="Active Power-ups"
          value={stats.powerUps}
          helpText="3 Effects Active"
          icon={<Zap size={20} />}
        />
        <StatCard
          label="Skill Points"
          value={stats.skillPoints}
          helpText="Available to Spend"
          icon={<GitBranch size={20} />}
        />
        <StatCard
          label="Daily Streak"
          value="7 Days"
          helpText="+50% XP Bonus"
          icon={<Award size={20} />}
        />
      </Grid>
    </VStack>
  );
};

export const RewardsWindow = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      bg={bgColor}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      w="full"
      maxW="1200px"
      mx="auto"
      boxShadow="lg"
    >
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList mb={4}>
          <Tab gap={2}>
            <Trophy size={16} />
            Overview
          </Tab>
          <Tab gap={2}>
            <Target size={16} />
            Daily Challenges
          </Tab>
          <Tab gap={2}>
            <Star size={16} />
            Spin & Win
          </Tab>
          <Tab gap={2}>
            <Zap size={16} />
            Power-ups
          </Tab>
          <Tab gap={2}>
            <Award size={16} />
            Leaderboard
          </Tab>
          <Tab gap={2}>
            <GitBranch size={16} />
            Skill Tree
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Overview />
          </TabPanel>
          <TabPanel>
            <DailyChallenges />
          </TabPanel>
          <TabPanel>
            <SpinAndWin />
          </TabPanel>
          <TabPanel>
            <PowerUps />
          </TabPanel>
          <TabPanel>
            <Leaderboard />
          </TabPanel>
          <TabPanel>
            <SkillTree />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}; 