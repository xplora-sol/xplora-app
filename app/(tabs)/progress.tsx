import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useQuestStatsQuery, useQuests } from '@/hooks/query/use-quests';
import { ProgressStatsGrid } from '@/sections/Profile/progress-stats-grid';
import { FilterButtons } from '@/sections/Progress/filter-buttons';
import { ProgressBar } from '@/sections/Progress/progress-bar';
import { QuestCard } from '@/sections/Progress/quest-card';
import type { Quest } from '@/types/quest';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function ProgressScreen() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const { activeQuests, completedQuests, completionRate, totalTokens } = useQuestStatsQuery();
  const { quests } = useQuests();
  const totalPossibleTokens = quests.reduce((sum, q) => sum + q.reward, 0);

  const getFilteredQuests = () => {
    if (filter === 'active') return activeQuests;
    if (filter === 'completed') return completedQuests;
    return quests;
  };

  const statsData = [
    [
      { value: completedQuests.length, label: 'Completed' },
      { value: activeQuests.length, label: 'Active' },
    ],
    [
      { value: totalTokens, label: 'Tokens Earned' },
      { value: `${completionRate}%`, label: 'Completion' },
    ],
  ];

  const filterOptions = [
    { label: 'All', value: 'all', count: quests.length },
    { label: 'Active', value: 'active', count: activeQuests.length },
    { label: 'Completed', value: 'completed', count: completedQuests.length },
  ];

  return (
    <ThemedScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Quest Progress
        </ThemedText>
      </ThemedView>

      <ProgressStatsGrid stats={statsData} />

      <ProgressBar current={totalTokens} total={totalPossibleTokens} label="Overall Progress" />

      <FilterButtons
        filters={filterOptions}
        activeFilter={filter}
        onFilterChange={(value) => setFilter(value as 'all' | 'active' | 'completed')}
      />

      <ThemedView style={styles.questsSection}>
        {getFilteredQuests().map((quest) => (
          <QuestCard key={quest.id} quest={quest as Quest} />
        ))}
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  questsSection: {
    padding: 20,
    paddingTop: 0,
  },
});
