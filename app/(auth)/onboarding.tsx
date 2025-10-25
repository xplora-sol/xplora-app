import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/query/use-auth';
import { OnboardingFooter } from '@/sections/Auth/onboarding-footer';
import type { OnboardingSlideData } from '@/sections/Auth/onboarding-slide';
import { OnboardingSlide } from '@/sections/Auth/onboarding-slide';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const slides: OnboardingSlideData[] = [
  {
    id: '1',
    icon: 'map',
    title: 'Discover Quests',
    description:
      'Explore your city and discover exciting quests nearby. From coffee shops to heritage sites, adventure awaits!',
    color: '#2196F3',
  },
  {
    id: '2',
    icon: 'camera',
    title: 'Complete Challenges',
    description:
      "Take photos, answer quizzes, and complete various challenges to prove you've been there.",
    color: '#4CAF50',
  },
  {
    id: '3',
    icon: 'trophy',
    title: 'Earn Rewards',
    description:
      'Collect tokens for completing quests and unlock achievements as you explore more locations.',
    color: '#FFC107',
  },
  {
    id: '4',
    icon: 'notifications',
    title: 'Get Notified',
    description:
      "Receive notifications when you're near a quest location. Never miss an opportunity!",
    color: '#FF5722',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => <OnboardingSlide slide={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
      />

      <OnboardingFooter
        currentIndex={currentIndex}
        totalSlides={slides.length}
        currentColor={slides[currentIndex].color}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
