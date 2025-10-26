import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export interface OnboardingSlideData {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

interface OnboardingSlideProps {
  slide: OnboardingSlideData;
}

export function OnboardingSlide({ slide }: OnboardingSlideProps) {
  return (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { backgroundColor: slide.color }]}>
        <Ionicons name={slide.icon} size={80} color="#fff" />
      </View>
      <ThemedText type="heading2" style={styles.title}>
        {slide.title}
      </ThemedText>
      <ThemedText style={styles.description}>{slide.description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
