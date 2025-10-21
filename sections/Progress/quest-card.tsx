import type { Quest } from '@/types/quest';
import { getCategoryEmoji, getDifficultyColor } from '@/utils/quest-helpers';
import { useRouter } from 'expo-router';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

interface QuestCardProps {
    quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/quest-details',
            params: { questId: quest.id },
        });
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <ThemedView style={styles.questCard}>
                <View style={styles.questHeader}>
                    <Text style={styles.categoryEmoji}>{getCategoryEmoji(quest.category)}</Text>
                    <View style={styles.questTitleContainer}>
                        <ThemedText type="defaultSemiBold">{quest.title}</ThemedText>
                        <ThemedText type="caption" style={styles.questLocation}>{quest.location.address}</ThemedText>
                    </View>
                    {quest.status === 'completed' && (
                        <Text style={styles.completedBadge}>✅</Text>
                    )}
                </View>

                <ThemedText type="bodySmall" style={styles.questDescription}>{quest.description}</ThemedText>

                <View style={styles.questFooter}>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quest.difficulty) }]}>
                        <Text style={styles.difficultyText}>{quest.difficulty}</Text>
                    </View>
                    <View style={styles.rewardBadge}>
                        <Text style={styles.rewardText}>🪙 {quest.reward}</Text>
                    </View>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    questCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    categoryEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    questTitleContainer: {
        flex: 1,
    },
    questLocation: {
        opacity: 0.7,
    },
    completedBadge: {
        fontSize: 24,
        color: '#4CAF50',
    },
    questDescription: {
        marginBottom: 12,
        opacity: 0.8,
    },
    questFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    difficultyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    rewardBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
    },
    rewardText: {
        color: '#F57C00',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
