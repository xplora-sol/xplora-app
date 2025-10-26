import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

function formatRemaining(ms: number) {
  if (ms <= 0) return 'Ended';
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function Countdown({ endIso }: { endIso: string }) {
  const end = useMemo(() => new Date(endIso), [endIso]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = end.getTime() - now.getTime();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatRemaining(remaining)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#111827',
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 12,
  },
});
