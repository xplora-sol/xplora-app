import { ThemedText } from '@/components/themed-text';
import { useQuests } from '@/hooks/query/use-quests';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { QuestActionButton } from '@/sections/Progress/quest-action-button';
import { QuestBadges } from '@/sections/QuestDetails/quest-badges';
import { QuestDescriptionSection } from '@/sections/QuestDetails/quest-description-section';
import { QuestDetailsHeader } from '@/sections/QuestDetails/quest-details-header';
import { QuestLocationSection } from '@/sections/QuestDetails/quest-location-section';
import { QuestRewardCard } from '@/sections/QuestDetails/quest-reward-card';
import { QuestVerificationSteps } from '@/sections/QuestDetails/quest-verification-steps';
import { getActionColor, getDifficultyColor } from '@/utils/quest-helpers';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function QuestDetailsScreen() {
    const { questId } = useLocalSearchParams<{ questId: string }>();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { top } = useSafeAreaInsets();

    // Use React Query hooks
    const { getQuestById, completeQuest } = useQuests();
    const quest = getQuestById(questId as string);

    if (!quest) {
        return (
            <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
                <ThemedText>Quest not found</ThemedText>
            </View>
        );
    }

    const openCamera = async (questId: string, reward: number) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            completeQuest(questId);
            router.back();
            Alert.alert('Success!', `Quest completed! You earned ${reward} tokens! 🎉`);
        }
    };

    const pickImage = async (questId: string, reward: number) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Media library permission is required to pick photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            completeQuest(questId);
            router.back();
            Alert.alert('Success!', `Quest completed! You earned ${reward} tokens! 🎉`);
        }
    };

    const handleAction = (actionType: string, reward: number) => {
        switch (actionType) {
            case 'photo':
                Alert.alert(
                    'Take Photo',
                    'Choose how you want to upload your photo:',
                    [
                        {
                            text: 'Open Camera',
                            onPress: () => openCamera(quest.id, reward)
                        },
                        {
                            text: 'Pick from Gallery',
                            onPress: () => pickImage(quest.id, reward)
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                break;

            case 'quiz':
                Alert.alert(
                    'Quiz Time!',
                    `Answer ${quest.quizQuestions?.length || 3} questions to complete this quest.`,
                    [
                        {
                            text: 'Start Quiz',
                            onPress: () => {
                                router.back();
                                Alert.alert('Quiz', 'In a real app, this would show the quiz questions!');
                            }
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                break;

            case 'photo_rating':
                Alert.alert(
                    'Photo & Rating',
                    'Take a photo and rate your experience!',
                    [
                        {
                            text: 'Open Camera',
                            onPress: () => openCamera(quest.id, reward)
                        },
                        {
                            text: 'Pick from Gallery',
                            onPress: () => pickImage(quest.id, reward)
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                break;

            case 'checkin_photo':
                Alert.alert(
                    'Check In',
                    'Verify your location and upload proof of your contribution!',
                    [
                        {
                            text: 'Open Camera',
                            onPress: () => openCamera(quest.id, reward)
                        },
                        {
                            text: 'Pick from Gallery',
                            onPress: () => pickImage(quest.id, reward)
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                break;

            case 'timed_photo':
                const currentHour = new Date().getHours();
                if (currentHour < 6) {
                    Alert.alert('Perfect Timing!', 'You\'re here early! Take your photo now.', [
                        {
                            text: 'Open Camera',
                            onPress: () => openCamera(quest.id, reward)
                        },
                        {
                            text: 'Pick from Gallery',
                            onPress: () => pickImage(quest.id, reward)
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]);
                } else {
                    Alert.alert('Too Late', 'This quest requires you to be there before 6 AM. Try again tomorrow!');
                }
                break;

            case 'review':
                Alert.alert(
                    'Write Review',
                    'Share your thoughts about your visit!',
                    [
                        {
                            text: 'Write Review',
                            onPress: () => {
                                completeQuest(quest.id);
                                router.back();
                                Alert.alert('Submitted!', `Thanks for your review! +${reward} tokens! ✍️`);
                            }
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                break;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#f5f5f5' }]}>
            <QuestDetailsHeader
                colorScheme={colorScheme}
                paddingTop={top}
                onClose={() => router.back()}
            />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.content, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
                    <ThemedText type="title" style={styles.title}>
                        {quest.title}
                    </ThemedText>

                    <QuestBadges
                        difficulty={quest.difficulty}
                        difficultyColor={getDifficultyColor(quest.difficulty)}
                        category={quest.category}
                        categoryColor={getActionColor(quest.actionType)}
                    />

                    <QuestDescriptionSection description={quest.description} />

                    <QuestLocationSection address={quest.location.address} colorScheme={colorScheme} />

                    <QuestVerificationSteps steps={quest.verificationSteps || []} />

                    <QuestRewardCard reward={quest.reward} colorScheme={colorScheme} />

                    <QuestActionButton
                        actionType={quest.actionType}
                        actionLabel={quest.actionLabel}
                        color={getActionColor(quest.actionType)}
                        onPress={() => handleAction(quest.actionType, quest.reward)}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    content: {
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        marginBottom: 16,
    },
});
