import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { StyleSheet } from 'react-native';

interface StatCardProps {
    label: string;
    value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
    return (
        <ThemedView style={styles.card}>
            <ThemedText type="caption" style={styles.label}>{label}</ThemedText>
            <ThemedText type="subtitle" style={styles.value}>{value}</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        opacity: 0.7,
    },
    value: {
        marginTop: 4,
    },
});
