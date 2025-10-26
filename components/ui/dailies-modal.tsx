import { useQuests } from '@/hooks/query/use-quests';
import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function DailiesModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { quests, completeQuest } = useQuests();
  const dailyQuests = quests.filter((q) => q.daily || q.repeatable);

  const handleComplete = async (questId: string) => {
    try {
      await completeQuest(questId);
    } catch {
      // ignore for now
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Daily Tasks</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={dailyQuests}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.questTitle}>{item.title}</Text>
                  <Text style={styles.questDesc}>{item.completionCriteria}</Text>
                </View>
                <View style={styles.actions}>
                  <Text style={styles.reward}>+{item.reward}⚡</Text>
                  <TouchableOpacity
                    style={styles.completeBtn}
                    onPress={() => handleComplete(item.id)}
                  >
                    <Text style={styles.completeText}>Claim</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: '#ccc', marginTop: 12 }}>No daily tasks right now.</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0b0b12',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  close: {
    color: '#999',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#101019',
    borderRadius: 12,
    marginBottom: 10,
  },
  info: { flex: 1 },
  questTitle: { color: '#fff', fontWeight: '700' },
  questDesc: { color: '#ccc', marginTop: 4 },
  actions: { justifyContent: 'center', alignItems: 'center' },
  reward: { color: '#ffd166', fontWeight: '700', marginBottom: 6 },
  completeBtn: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  completeText: { color: '#fff', fontWeight: '700' },
});
