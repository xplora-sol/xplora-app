import { ThemedText } from '@/components/themed-text';
import { useEvents } from '@/hooks/query/use-events';
import { useQuests } from '@/hooks/query/use-quests';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { QuestActionButton } from '@/sections/Progress/quest-action-button';
import { QuestBadges } from '@/sections/QuestDetails/quest-badges';
import { QuestDescriptionSection } from '@/sections/QuestDetails/quest-description-section';
import { QuestDetailsHeader } from '@/sections/QuestDetails/quest-details-header';
import { QuestLocationSection } from '@/sections/QuestDetails/quest-location-section';
import { QuestRewardCard } from '@/sections/QuestDetails/quest-reward-card';
import { QuestVerificationSteps } from '@/sections/QuestDetails/quest-verification-steps';
import { getActionColor, getDifficultyColor } from '@/utils/quest-helpers';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Countdown } from '@/components/ui/countdown';
import { QuestBadge } from '@/components/ui/quest-badge';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function QuestDetailsScreen() {
  const { questId } = useLocalSearchParams<{ questId: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();
  const { getQuestById, completeQuest } = useQuests();
  const quest = getQuestById(questId as string);
  // Events (for event quests)
  const { events } = useEvents();
  const event = quest?.event ? events.find((e) => e.id === quest.event?.id) : undefined;

  // Animated pulse for reward badge (declared before early returns so hooks run consistently)
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  if (!quest) {
    return (
      <View
        style={[styles.placeholder, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}
      >
        <ThemedText>Quest not found</ThemedText>
      </View>
    );
  }

  const openCamera = async (questId: string, reward: number) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      completeQuest(questId);
      router.back();
      Alert.alert('Success!', `Quest completed! You earned ${reward} tokens! 🎉`);
    }
  };

  const handleAction = (actionType: string, reward: number) => {
    switch (actionType) {
      case 'photo':
        Alert.alert('Take Photo', 'Choose how you want to upload your photo:', [
          { text: 'Open Camera', onPress: () => openCamera(quest.id, reward) },
          { text: 'Cancel', style: 'cancel' },
        ]);
        break;
      case 'quiz':
        Alert.alert(
          'Quiz Time!',
          `Answer ${quest.quizQuestions?.length || 3} questions to complete this quest.`,
          [
            {
              text: 'Start Quiz',
              onPress: () => {
                router.back();
                Alert.alert('Quiz', 'In a real app, this would show the quiz questions!');
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
        break;
      case 'photo_rating':
      case 'checkin_photo':
        Alert.alert('Photo', 'Open camera to submit proof', [
          { text: 'Open Camera', onPress: () => openCamera(quest.id, reward) },
          { text: 'Cancel', style: 'cancel' },
        ]);
        break;
      case 'timed_photo': {
        const currentHour = new Date().getHours();
        if (currentHour < 6) {
          Alert.alert('Perfect Timing!', "You're here early! Take your photo now.", [
            { text: 'Open Camera', onPress: () => openCamera(quest.id, reward) },
            { text: 'Cancel', style: 'cancel' },
          ]);
        } else {
          Alert.alert(
            'Too Late',
            'This quest requires you to be there before 6 AM. Try again tomorrow!',
          );
        }
        break;
      }
      case 'review':
        Alert.alert('Write Review', 'Share your thoughts about your visit!', [
          {
            text: 'Write Review',
            onPress: () => {
              completeQuest(quest.id);
              router.back();
              Alert.alert('Submitted!', `Thanks for your review! +${reward} tokens! ✍️`);
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
        break;
    }
  };

  return (
    <LinearGradient
      colors={colorScheme === 'dark' ? ['#071223', '#07121a'] : ['#f4f9ff', '#e9f2ff']}
      style={styles.root}
    >
      <QuestDetailsHeader
        colorScheme={colorScheme}
        paddingTop={top}
        onClose={() => router.back()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
          {/* Decorative hero */}
          <View style={styles.heroRow}>
            <View style={[styles.heroBadge, { backgroundColor: getActionColor(quest.actionType) }]}>
              <Ionicons name="trophy" size={34} color="#fff" />
            </View>
            <View style={styles.heroTextWrap}>
              <ThemedText type="title" style={styles.title} numberOfLines={2}>
                {quest.title}
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                {quest.category} • {quest.difficulty}
              </ThemedText>
            </View>
          </View>
          {event?.bannerImageSrc || event?.bannerImage ? (
            <View style={styles.bannerWrap}>
              <Pressable onPress={() => Alert.alert(event.title, event.description || '')}>
                <Image
                  source={{ uri: event.bannerImageSrc || event.bannerImage }}
                  style={styles.eventBanner}
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.36)']}
                  style={styles.bannerOverlay}
                >
                  <ThemedText style={styles.bannerTitle}>{event.title}</ThemedText>
                  {event.fomoText ? (
                    <ThemedText style={styles.bannerFomo}>{event.fomoText}</ThemedText>
                  ) : null}
                </LinearGradient>
              </Pressable>
            </View>
          ) : null}

          {quest?.rarity ? (
            <>
              <View style={styles.headerRowCompact}>
                <View style={{ flex: 1 }}>
                  <View style={styles.metaRowCompact}>
                    <QuestBadge
                      label={quest.rarity?.toUpperCase()}
                      rarity={quest.rarity as any}
                      multiplier={quest.multiplier}
                      isLimited={!!quest.limitedTime}
                    />
                    <View style={{ width: 10 }} />
                    <ThemedText style={styles.categoryText}>{quest.category}</ThemedText>
                  </View>
                </View>

                <Animated.View style={[{ transform: [{ scale: pulse }] }, styles.rewardBadgeWrap]}>
                  <LinearGradient
                    colors={[getActionColor(quest.actionType), '#ffd479']}
                    style={styles.rewardBadgeGradient}
                    start={[0, 0]}
                    end={[1, 1]}
                  >
                    <Ionicons name="trophy" size={28} color="#fff" style={{ marginBottom: 2 }} />
                    <ThemedText style={styles.rewardTextLarge}>+{quest.reward ?? 0}</ThemedText>
                    {quest.multiplier ? (
                      <View style={styles.multiplierPill}>
                        <ThemedText style={styles.multiplierPillText}>
                          x{quest.multiplier}
                        </ThemedText>
                      </View>
                    ) : null}
                  </LinearGradient>
                </Animated.View>
              </View>
            </>
          ) : null}

          <View style={styles.rowBetween}>
            {quest.limitedTime?.end ? (
              <Countdown endIso={quest.limitedTime.end} />
            ) : (
              <ThemedText style={styles.infoText}>{quest.completionCriteria}</ThemedText>
            )}
            {quest.daily ? <ThemedText style={styles.dailyPill}>Daily</ThemedText> : null}
          </View>

          {quest.event?.step && quest.event?.totalSteps ? (
            <View style={styles.eventProgressWrap}>
              <ThemedText style={styles.eventProgressText}>
                Event progress — Step {quest.event.step} of {quest.event.totalSteps}
              </ThemedText>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(quest.event.step / quest.event.totalSteps) * 100}%`,
                      backgroundColor: getActionColor(quest.actionType),
                    },
                  ]}
                />
              </View>
            </View>
          ) : null}

          <QuestBadges
            difficulty={quest.difficulty}
            difficultyColor={getDifficultyColor(quest.difficulty)}
            category={quest.category}
            categoryColor={getActionColor(quest.actionType)}
          />

          <QuestDescriptionSection description={quest.description} />
          <QuestLocationSection
            address={quest.location?.address || 'Unknown location'}
            colorScheme={colorScheme}
          />
          <QuestVerificationSteps steps={quest.verificationSteps || []} />
          <QuestRewardCard reward={quest.reward ?? 0} colorScheme={colorScheme} />

          <QuestActionButton
            actionType={quest.actionType}
            actionLabel={quest.actionLabel}
            color={getActionColor(quest.actionType)}
            onPress={() => handleAction(quest.actionType, quest.reward ?? 0)}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  card: { borderRadius: 16, padding: 16, marginBottom: 40, overflow: 'hidden' },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  heroBadge: {
    width: 64,
    height: 64,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  heroTextWrap: { flex: 1 },
  subtitle: { color: '#f59e0b', marginTop: 4, fontSize: 13 },
  cardLight: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  cardDark: {
    backgroundColor: '#0b0d0f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 6,
  },
  bannerWrap: { marginBottom: 14, borderRadius: 12, overflow: 'hidden' },
  eventBanner: { width: '100%', height: 150 },
  bannerOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  bannerFomo: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 14,
  },
  metaRowCompact: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  categoryText: { fontSize: 13, color: '#6b7280' },
  rewardBadgeGradient: {
    minWidth: 110,
    height: 110,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
  },
  rewardTextLarge: { color: '#fff', fontWeight: '900', fontSize: 22 },
  rewardBadgeWrap: {
    overflow: 'visible',
  },
  multiplierPill: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 20,
    // subtle shadow so the pill sits above the badge visually
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 6,
  },
  multiplierPillText: { fontSize: 12, fontWeight: '700', color: '#222' },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  infoText: { color: '#6b7280' },
  dailyPill: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    color: '#3b82f6',
  },
  eventProgressWrap: { marginVertical: 18 },
  eventProgressText: { fontSize: 13, color: '#8b8b9a', marginBottom: 8 },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e6e9ef',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', width: '20%', borderRadius: 8 },
});
