import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

import { ColorSchemeName, StyleSheet, View } from 'react-native';

interface QuestRewardCardProps {
    reward: number;
    colorScheme: ColorSchemeName;
}

export function QuestRewardCard({ reward, colorScheme }: QuestRewardCardProps) {
    return (
        <View
            style={[
                styles.rewardContainer,
                { backgroundColor: colorScheme === 'dark' ? '#2d2000' : '#FFF3E0' },
            ]}
        >
            <Ionicons name="trophy" size={24} color="#F57C00" />
            <View style={styles.rewardTextContainer}>
                <ThemedText type="bodySmall" style={styles.rewardLabel}>Reward</ThemedText>
                <ThemedText type="heading3" style={styles.rewardValue}>{reward} tokens</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        gap: 12,
    },
    rewardTextContainer: {
        flex: 1,
    },
    rewardLabel: {
        fontWeight: '600',
        color: '#F57C00',
        marginBottom: 4,
    },
    rewardValue: {
        color: '#F57C00',
    },
});
