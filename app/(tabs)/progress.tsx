import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EventsBanner } from '@/components/ui/events-banner';
import { EventsModal } from '@/components/ui/events-modal';
import { useEvents } from '@/hooks/query/use-events';
import { useQuestStatsQuery, useQuests } from '@/hooks/query/use-quests';
import { ProgressStatsGrid } from '@/sections/Profile/progress-stats-grid';
import { FilterButtons } from '@/sections/Progress/filter-buttons';
import { QuestCard } from '@/sections/Progress/quest-card';
import type { Quest } from '@/types/quest';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProgressScreen() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const { activeQuests, completedQuests, completionRate, totalTokens } = useQuestStatsQuery();
  const { quests } = useQuests();
  const { activeEvents, events } = useEvents();
  const router = useRouter();
  const [devEventsVisible, setDevEventsVisible] = useState(false);
  const [eventsModalVisible, setEventsModalVisible] = useState(false);

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
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <ThemedText type="title" style={styles.title}>
            Quest Progress
          </ThemedText>
          {__DEV__ ? (
            <TouchableOpacity onPress={() => setDevEventsVisible(true)} style={styles.devBtn}>
              <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Dev: Events</ThemedText>
            </TouchableOpacity>
          ) : null}
        </View>
      </ThemedView>

      {activeEvents.length > 0 ? (
        <View style={{ paddingHorizontal: 20 }}>
          <EventsBanner
            title={activeEvents[0].title}
            endIso={activeEvents[0].end}
            color={activeEvents[0].bannerColor}
            bannerImageSrc={activeEvents[0].bannerImageSrc}
            onPress={() => setEventsModalVisible(true)}
          />
        </View>
      ) : null}

      <ProgressStatsGrid stats={statsData} />

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
      <EventsModal
        visible={eventsModalVisible}
        events={activeEvents}
        onClose={() => setEventsModalVisible(false)}
      />

      {__DEV__ ? (
        <Modal visible={devEventsVisible} transparent animationType="fade">
          <View style={devStyles.backdrop}>
            <View style={devStyles.container}>
              <View style={devStyles.headerRow}>
                <ThemedText type="title" style={{ fontSize: 18, color: '#fff' }}>
                  All Events
                </ThemedText>
                <TouchableOpacity onPress={() => setDevEventsVisible(false)}>
                  <ThemedText style={{ color: '#999' }}>Close</ThemedText>
                </TouchableOpacity>
              </View>
              <ScrollView>
                {events
                  .slice()
                  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                  .map((e) => (
                    <TouchableOpacity
                      key={e.id}
                      style={devStyles.eventRow}
                      onPress={() => {
                        setDevEventsVisible(false);
                        router.push({
                          pathname: '/event/[eventId]',
                          params: { eventId: e.id },
                        } as any);
                      }}
                    >
                      {e.bannerImageSrc ? (
                        <Image source={{ uri: e.bannerImageSrc }} style={devStyles.thumb} />
                      ) : null}
                      <View style={{ flex: 1 }}>
                        <ThemedText style={{ color: '#fff', fontWeight: '700' }}>
                          {e.title} {e.hidden ? '(hidden)' : ''}
                        </ThemedText>
                        <ThemedText style={{ color: '#bbb' }}>
                          {new Date(e.start).toLocaleString()} — {new Date(e.end).toLocaleString()}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
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
  devBtn: {
    backgroundColor: '#111',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

const devStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  container: { backgroundColor: '#0b0b12', borderRadius: 12, padding: 12, maxHeight: '80%' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  thumb: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
});
