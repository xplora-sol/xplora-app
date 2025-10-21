import { ThemedText } from '@/components/themed-text';

import { StyleSheet, Text, View } from 'react-native';

interface QuestVerificationStepsProps {
    steps: string[];
}

export function QuestVerificationSteps({ steps }: QuestVerificationStepsProps) {
    if (!steps || steps.length === 0) {
        return null;
    }

    return (
        <View style={styles.section}>
            <ThemedText type="heading4" style={styles.sectionTitle}>How to Complete</ThemedText>
            {steps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <ThemedText type="bodyMedium" style={styles.stepText}>{step}</ThemedText>
                </View>
            ))}
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
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    stepText: {
        flex: 1,
    },
});
