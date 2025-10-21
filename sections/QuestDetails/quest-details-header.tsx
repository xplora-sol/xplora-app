import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

import { ColorSchemeName, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuestDetailsHeaderProps {
    colorScheme: ColorSchemeName;
    paddingTop: number;
    onClose: () => void;
}

export function QuestDetailsHeader({ colorScheme, paddingTop, onClose }: QuestDetailsHeaderProps) {
    return (
        <View
            style={[
                styles.header,
                {
                    backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
                    paddingTop: Platform.OS === 'ios' ? 16 : paddingTop,
                },
            ]}
        >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons
                    name={Platform.OS === 'ios' ? 'close' : 'arrow-back'}
                    size={28}
                    color={colorScheme === 'dark' ? '#fff' : '#000'}
                />
            </TouchableOpacity>
            <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
                Quest Details
            </ThemedText>
            <View style={styles.headerPlaceholder} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
    },
    headerPlaceholder: {
        width: 40,
    },
});
