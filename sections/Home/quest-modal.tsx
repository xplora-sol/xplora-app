import { ThemedText } from '@/components/themed-text';
import { useQuests } from '@/hooks/query/use-quests';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { QuestActionButton } from '@/sections/Progress/quest-action-button';
import type { Quest } from '@/types/quest';
import { getActionColor, getDifficultyColor } from '@/utils/quest-helpers';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuestModalProps {
  visible: boolean;
  quest: Quest | null;
  onClose: () => void;
}

export function QuestModal({ visible, quest, onClose }: QuestModalProps) {
  const colorScheme = useColorScheme();
  const { completeQuest } = useQuests();

  if (!quest) return null;

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
      onClose();
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
      onClose();
      Alert.alert('Success!', `Quest completed! You earned ${reward} tokens! 🎉`);
    }
  };

  const handleAction = (actionType: string, reward: number) => {
    switch (actionType) {
      case 'photo':
        Alert.alert('Take Photo', 'Choose how you want to upload your photo:', [
          {
            text: 'Open Camera',
            onPress: () => openCamera(quest.id, reward),
          },
          {
            text: 'Pick from Gallery',
            onPress: () => pickImage(quest.id, reward),
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
        break;

      case 'quiz':
        Alert.alert(
          'Quiz Time!',
          `Answer ${quest.quizQuestions?.length || 3} questions to complete this quest.`,
          [
            {
              text: 'Start Quiz',
              onPress: () => {
                completeQuest(quest.id);
                onClose();
                Alert.alert('Quiz', 'In a real app, this would show the quiz questions!');
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
        break;

      case 'photo_rating':
        Alert.alert('Photo & Rating', 'Take a photo and rate your experience!', [
          {
            text: 'Open Camera',
            onPress: () => openCamera(quest.id, reward),
          },
          {
            text: 'Pick from Gallery',
            onPress: () => pickImage(quest.id, reward),
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
        break;

      case 'checkin_photo':
        Alert.alert('Check In', 'Verify your location and upload proof of your contribution!', [
          {
            text: 'Open Camera',
            onPress: () => openCamera(quest.id, reward),
          },
          {
            text: 'Pick from Gallery',
            onPress: () => pickImage(quest.id, reward),
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
        break;

      case 'timed_photo':
        const currentHour = new Date().getHours();
        if (currentHour < 6) {
          Alert.alert('Perfect Timing!', "You're here early! Take your photo now.", [
            {
              text: 'Open Camera',
              onPress: () => openCamera(quest.id, reward),
            },
            {
              text: 'Pick from Gallery',
              onPress: () => pickImage(quest.id, reward),
            },
            { text: 'Cancel', style: 'cancel' },
          ]);
        } else {
          Alert.alert(
            'Too Late',
            'This quest requires you to be there before 6 AM. Try again tomorrow!',
          );
        }
        break;

      case 'review':
        Alert.alert('Write Review', 'Share your thoughts about your visit!', [
          {
            text: 'Write Review',
            onPress: () => {
              completeQuest(quest.id);
              onClose();
              Alert.alert('Submitted!', `Thanks for your review! +${reward} tokens! ✍️`);
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
        break;
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topCloseButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={[
            styles.modalContent,
            { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' },
          ]}
        >
          <ThemedText type="title" style={styles.modalTitle}>
            {quest.title}
          </ThemedText>

          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: getDifficultyColor(quest.difficulty) }]}>
              <ThemedText type="caption" style={styles.badgeText}>
                {quest.difficulty.toUpperCase()}
              </ThemedText>
            </View>
            <View style={styles.badge}>
              <ThemedText type="caption" style={styles.badgeText}>
                {quest.category}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <ThemedText style={styles.description}>{quest.description}</ThemedText>

          <ThemedText style={styles.sectionTitle}>Location</ThemedText>
          <ThemedText style={styles.location}>
            {quest.location?.address || 'Unknown location'}
          </ThemedText>

          {quest.verificationSteps && (
            <>
              <ThemedText style={styles.sectionTitle}>How to Complete</ThemedText>
              {quest.verificationSteps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <ThemedText style={styles.stepText}>{step}</ThemedText>
                </View>
              ))}
            </>
          )}

          <View style={styles.rewardContainer}>
            <ThemedText style={styles.rewardLabel}>Reward:</ThemedText>
            <ThemedText style={styles.rewardValue}>{quest.reward ?? 0} tokens</ThemedText>
          </View>

          <QuestActionButton
            actionType={quest.actionType}
            actionLabel={quest.actionLabel}
            color={getActionColor(quest.actionType)}
            onPress={() => handleAction(quest.actionType, quest.reward ?? 0)}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText type="body" style={styles.closeButtonText}>
              Close
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 16,
    paddingRight: 16,
  },
  topCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 48,
  },
  modalTitle: {
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2196F3',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  location: {
    fontSize: 14,
    opacity: 0.8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
  },
  rewardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  rewardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#F57C00',
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#666',
  },
});
