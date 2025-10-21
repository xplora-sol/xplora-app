import { ThemedText } from '@/components/themed-text';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

interface QuestMarkerProps {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    reward: number;
    onPress: (id: string) => void;
}

export function QuestMarker({
    id,
    latitude,
    longitude,
    title,
    difficulty,
    category,
    reward,
    onPress,
}: QuestMarkerProps) {
    const getDifficultyColor = () => {
        switch (difficulty) {
            case 'easy':
                return '#4CAF50';
            case 'medium':
                return '#FF9800';
            case 'hard':
                return '#F44336';
            default:
                return '#2196F3';
        }
    };

    const getCategoryIcon = () => {
        switch (category) {
            case 'social':
                return <Ionicons name="people" size={18} color="#fff" />;
            case 'fitness':
                return <Ionicons name="fitness" size={18} color="#fff" />;
            case 'exploration':
                return <Ionicons name="map" size={18} color="#fff" />;
            case 'education':
                return <Ionicons name="school" size={18} color="#fff" />;
            case 'food':
                return <Ionicons name="restaurant" size={18} color="#fff" />;
            case 'community':
                return <MaterialCommunityIcons name="handshake" size={18} color="#fff" />;
            default:
                return <Ionicons name="star" size={18} color="#fff" />;
        }
    };

    return (
        <Marker
            coordinate={{ latitude, longitude }}
            onPress={() => onPress(id)}
            title={title}
            description={`${category} • ${reward} tokens`}
        >
            <View style={styles.markerContainer}>
                <View style={styles.markerShadow}>
                    <View style={[styles.markerInner, { backgroundColor: getDifficultyColor() }]}>
                        <View style={styles.iconContainer}>
                            {getCategoryIcon()}
                        </View>
                    </View>
                </View>
                <View style={styles.rewardBadge}>
                    <ThemedText type="tiny" style={styles.rewardText}>{reward}</ThemedText>
                </View>
            </View>
        </Marker>
    );
}

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 60,
    },
    markerShadow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerInner: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196F3',
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    rewardBadge: {
        marginTop: 2,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderWidth: 1.5,
        borderColor: '#FFD700',
        minWidth: 24,
        alignItems: 'center',
    },
    rewardText: {
        color: '#F57C00',
        fontWeight: 'bold',
    },
});
