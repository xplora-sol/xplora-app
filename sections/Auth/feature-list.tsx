import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

import { StyleSheet, View } from 'react-native';

interface Feature {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    color: string;
}

const defaultFeatures: Feature[] = [
    {
        icon: 'map',
        text: 'Discover nearby quests',
        color: '#2196F3',
    },
    {
        icon: 'trophy',
        text: 'Earn tokens & achievements',
        color: '#FFC107',
    },
    {
        icon: 'people',
        text: 'Join a community of explorers',
        color: '#4CAF50',
    },
];

interface FeatureListProps {
    features?: Feature[];
}

export function FeatureList({ features = defaultFeatures }: FeatureListProps) {
    return (
        <View style={styles.container}>
            {features.map((feature, index) => (
                <View key={index} style={styles.feature}>
                    <Ionicons
                        name={feature.icon}
                        size={24}
                        color={feature.color}
                    />
                    <ThemedText type="bodyMedium" style={styles.featureText}>
                        {feature.text}
                    </ThemedText>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        flex: 1,
    },
});
