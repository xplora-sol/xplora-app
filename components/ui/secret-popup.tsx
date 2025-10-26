import { Quest } from '@/types/quest';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function SecretPopup({
  visible,
  onClose,
  quest,
  onReveal,
}: {
  visible: boolean;
  onClose: () => void;
  quest?: Quest | null;
  onReveal: (questId: string) => Promise<void> | void;
}) {
  if (!quest) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Secret Nearby!</Text>
          <Text style={styles.desc}>
            You&apos;ve sensed something mysterious near {quest.location.address}.
          </Text>
          <Text style={styles.questTitle}>{quest.title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.revealBtn} onPress={() => onReveal(quest.id)}>
              <Text style={styles.revealText}>Reveal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Ignore</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '86%',
    backgroundColor: '#0b0b12',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  title: { color: '#ffd166', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  desc: { color: '#ccc', marginBottom: 8 },
  questTitle: { color: '#fff', fontWeight: '700', marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  revealBtn: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  revealText: { color: '#fff', fontWeight: '800' },
  closeBtn: { paddingHorizontal: 18, paddingVertical: 10 },
  closeText: { color: '#999' },
});
