import { ThemedText } from '@/components/themed-text';

import { StyleSheet, View } from 'react-native';

interface QuestDescriptionSectionProps {
    description: string;
}

export function QuestDescriptionSection({ description }: QuestDescriptionSectionProps) {
    return (
        <View style={styles.section}>
            <ThemedText type="heading4" style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText type="bodyMedium" style={styles.description}>{description}</ThemedText>
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
    description: {
        opacity: 0.8,
    },
});
