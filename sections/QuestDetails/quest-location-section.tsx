import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

import { ColorSchemeName, StyleSheet, View } from 'react-native';

interface QuestLocationSectionProps {
  address: string;
  colorScheme: ColorSchemeName;
}

export function QuestLocationSection({ address, colorScheme }: QuestLocationSectionProps) {
  return (
    <View style={styles.section}>
      <ThemedText type="heading4" style={styles.sectionTitle}>
        Location
      </ThemedText>
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        <ThemedText type="bodyMedium" style={styles.location}>
          {address}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  location: {
    flex: 1,
  },
});
