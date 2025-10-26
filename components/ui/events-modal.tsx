import { EventData } from '@/types/event';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Countdown } from './countdown';

export function EventsModal({
  visible,
  events,
  onClose,
}: {
  visible: boolean;
  events: EventData[];
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Running Events</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={events}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={[styles.eventRow, { borderLeftColor: item.bannerColor || '#888' }]}>
                {item.bannerImageSrc ? (
                  <Image
                    source={
                      typeof item.bannerImageSrc === 'string'
                        ? { uri: item.bannerImageSrc }
                        : item.bannerImageSrc
                    }
                    style={styles.eventThumbnail}
                    resizeMode="cover"
                  />
                ) : null}
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDesc}>{item.fomoText || item.description}</Text>
                  <View style={{ marginTop: 6 }}>
                    <Countdown endIso={item.end} />
                  </View>
                </View>

                <View style={styles.eventActions}>
                  {item.featuredQuestIds && item.featuredQuestIds.length > 0 ? (
                    <TouchableOpacity
                      style={styles.openBtn}
                      onPress={() => {
                        // Open first featured quest for now
                        router.push({
                          pathname: '/quest-details',
                          params: { questId: item.featuredQuestIds![0] },
                        });
                        onClose();
                      }}
                    >
                      <Text style={styles.openText}>Open Quest</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )}
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
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  close: {
    color: '#999',
  },
  eventRow: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 6,
    backgroundColor: '#101019',
    marginBottom: 10,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: '#fff',
    fontWeight: '700',
  },
  eventDesc: {
    color: '#ccc',
    marginTop: 4,
  },
  eventActions: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  openBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1a73e8',
    borderRadius: 8,
  },
  openText: {
    color: '#fff',
    fontWeight: '700',
  },
  eventThumbnail: {
    width: 96,
    height: 72,
    borderRadius: 10,
    marginRight: 10,
  },
});
