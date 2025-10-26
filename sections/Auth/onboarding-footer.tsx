import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

import { StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';

interface OnboardingFooterProps {
  currentIndex: number;
  totalSlides: number;
  currentColor: string;
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingFooter({
  currentIndex,
  totalSlides,
  currentColor,
  onNext,
  onSkip,
}: OnboardingFooterProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.dot,
        {
          backgroundColor:
            currentIndex === index ? (isDark ? '#fff' : '#2196F3') : isDark ? '#444' : '#ddd',
          width: currentIndex === index ? 24 : 8,
        },
      ]}
    />
  );

  const isLastSlide = currentIndex === totalSlides - 1;

  return (
    <View style={styles.footer}>
      <View style={styles.pagination}>
        {Array.from({ length: totalSlides }).map((_, index) => renderDot(index))}
      </View>

      <View style={styles.buttons}>
        {!isLastSlide && (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <ThemedText style={styles.skipText}>Skip</ThemedText>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: currentColor }]}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <ThemedText type="heading4" style={styles.nextText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </ThemedText>
          {!isLastSlide && <Ionicons name="arrow-forward" size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    opacity: 0.6,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextText: {
    color: '#fff',
  },
});
