import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { StyleSheet, TouchableOpacity } from 'react-native';

interface FilterButton {
    label: string;
    value: string;
    count: number;
}

interface FilterButtonsProps {
    filters: FilterButton[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export function FilterButtons({ filters, activeFilter, onFilterChange }: FilterButtonsProps) {
    return (
        <ThemedView style={styles.filterContainer}>
            {filters.map((filter) => (
                <TouchableOpacity
                    key={filter.value}
                    style={[
                        styles.filterButton,
                        activeFilter === filter.value && styles.filterButtonActive,
                    ]}
                    onPress={() => onFilterChange(filter.value)}
                >
                    <ThemedText
                        type="caption"
                        style={[
                            styles.filterButtonText,
                            activeFilter === filter.value && styles.filterButtonTextActive,
                        ]}
                        numberOfLines={1}
                    >
                        {filter.label} ({filter.count})
                    </ThemedText>
                </TouchableOpacity>
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 16,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
    },
    filterButtonActive: {
        backgroundColor: '#2196F3',
    },
    filterButtonText: {
        fontWeight: '600',
        color: '#666',
    },
    filterButtonTextActive: {
        color: '#fff',
    },
});
