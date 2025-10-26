import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { useEvents } from '@/hooks/query/use-events';
import { useQuests } from '@/hooks/query/use-quests';
import { QuestCard } from '@/sections/Progress/quest-card';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { events } = useEvents();
  const { quests } = useQuests();

  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText>Event not found</ThemedText>
      </View>
    );
  }

  const featured = (event.featuredQuestIds || [])
    .map((id) => quests.find((q) => q.id === id))
    .filter(Boolean) as any[];
  const byEvent = quests.filter(
    (q) => q.event?.id === event.id && !featured.find((f) => f.id === q.id),
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView style={styles.root}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ThemedText style={{ color: '#1a73e8' }}>Back</ThemedText>
        </Pressable>

        <View style={styles.bannerWrap}>
          {event.bannerImageSrc ? (
            <Image
              source={{ uri: event.bannerImageSrc }}
              style={styles.banner}
              resizeMode="cover"
            />
          ) : null}
        </View>

        <View style={styles.headerBelowBanner}>
          <ThemedText style={styles.titleBelow}>{event.title}</ThemedText>
          {event.fomoText ? (
            <ThemedText style={styles.fomoBelow}>{event.fomoText}</ThemedText>
          ) : null}
        </View>

        <View style={styles.container}>
          <ThemedText style={styles.sectionTitle}>About this event</ThemedText>
          <ThemedText style={styles.description}>{event.description}</ThemedText>

          {featured.length > 0 ? (
            <>
              <ThemedText style={styles.sectionTitle}>Featured quests</ThemedText>
              {featured.map((q) => (
                <QuestCard key={q.id} quest={q} />
              ))}
            </>
          ) : null}

          {byEvent.length > 0 ? (
            <>
              <ThemedText style={styles.sectionTitle}>Other event quests</ThemedText>
              {byEvent.map((q) => (
                <QuestCard key={q.id} quest={q} />
              ))}
            </>
          ) : null}
        </View>
      </ThemedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: { padding: 12 },
  bannerWrap: { width: '100%', height: 240, overflow: 'hidden', borderRadius: 12 },
  banner: { width: '100%', aspectRatio: 1 },
  headerBelowBanner: { marginTop: 16, paddingHorizontal: 16 },
  titleBelow: { fontSize: 20, fontWeight: '700' },
  fomoBelow: { color: '#6b7280', marginTop: 6 },
  container: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  description: { color: '#6b7280' },
});
