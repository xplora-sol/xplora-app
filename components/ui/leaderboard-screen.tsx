import { useLeaderboards } from '@/hooks/query/use-leaderboard';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const colors = ['#ffd166', '#9EE493', '#9b59b6', '#1abc9c'];
  const bg = colors[name.length % colors.length];
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: Math.round(size / 2.6) }]}>{initials}</Text>
    </View>
  );
}

export function LeaderboardScreen() {
  const { data, isLoading } = useLeaderboards();

  if (isLoading || !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading leaderboard...</Text>
      </View>
    );
  }

  const { globalAllTime, seasonal, locationBased, questSpecific, streakLeaders, recentActivity } =
    data;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
    >
      {/* Podium / Top 3 */}
      <View style={styles.podiumContainer}>
        <Text style={styles.podiumTitle}>Top Explorers</Text>
        <View style={styles.podiumRow}>
          {globalAllTime.byQuestsCompleted.slice(0, 3).map((u, idx) => (
            <View key={`pod-${u.userId}`} style={[styles.podiumItem, idx === 0 && styles.champion]}>
              <Avatar name={u.username} size={idx === 0 ? 78 : 62} />
              <Text style={styles.podiumName} numberOfLines={1} ellipsizeMode="tail">
                {u.username}
              </Text>
              <Text style={styles.podiumStat}>{u.completedQuests} Qs</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Global — lists in compact cards */}
      <View style={styles.section}>
        <SectionTitle>Global — All Time</SectionTitle>
        <Text style={styles.subTitle}>By Quests Completed</Text>
        {globalAllTime.byQuestsCompleted.map((u, idx) => (
          <View style={styles.cardRow} key={`gq-${u.userId}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
              <Avatar name={u.username} size={48} />
              <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
                 {u.username}
              </Text>
            </View>
            <Text style={styles.stat}>{u.completedQuests}</Text>
          </View>
        ))}

        <View style={{ height: 10 }} />

        <Text style={styles.subTitle}>By XP Earned</Text>
        {globalAllTime.byXpEarned.map((u, idx) => (
          <View style={styles.cardRow} key={`gx-${u.userId}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
              <Avatar name={u.username} size={48} />
              <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
                {u.username}
              </Text>
            </View>
            <Text style={styles.stat}>{u.xp}</Text>
          </View>
        ))}
      </View>

      {/* Seasonal */}
      <View style={styles.section}>
        <SectionTitle>Seasonal</SectionTitle>
        <Text style={styles.smallText}>Current season: {seasonal.currentSeason}</Text>
        {seasonal.seasons.map((s) => (
          <View key={s.id} style={{ marginTop: 8 }}>
            <Text style={styles.seasonName}>{s.name}</Text>
            {s.standings.slice(0, 3).map((p) => (
              <View style={styles.cardRow} key={p.userId}>
                <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
                  <Avatar name={p.username} size={44} />
                  <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
                    {p.username}
                  </Text>
                </View>
                <Text style={styles.stat}>{p.points} pts</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Location Based */}
      <View style={styles.section}>
        <SectionTitle>Location — Top Explorers</SectionTitle>
        {Object.entries(locationBased).map(([city, list]) => (
          <View key={city} style={{ marginTop: 8 }}>
            <Text style={styles.city}>{city}</Text>
            {list.map((p) => (
              <View style={styles.cardRow} key={`${city}-${p.userId}`}>
                <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
                  <Avatar name={p.username} size={40} />
                  <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
                    {p.username}
                  </Text>
                </View>
                <Text style={styles.stat}>{p.score}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Quest Specific */}
      <View style={styles.section}>
        <SectionTitle>Quest Specific</SectionTitle>
        {Object.entries(questSpecific).map(([qid, info]) => (
          <View key={qid} style={{ marginTop: 8 }}>
            <Text style={styles.seasonName}>{qid}</Text>
            {info.fastestCompletions?.map((p) => (
              <View style={styles.cardRow} key={`${qid}-fast-${p.userId}`}>
                <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
                  <Avatar name={p.username} size={40} />
                  <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
                    {p.username}
                  </Text>
                </View>
                <Text style={styles.stat}>{p.timeSeconds}s</Text>
              </View>
            ))}
            {info.mostCreative?.map((p) => (
              <View style={styles.cardRow} key={`${qid}-creative-${p.userId}`}>
                <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
                  <Avatar name={p.username} size={40} />
                  <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
                    {p.username}
                  </Text>
                </View>
                <Text style={styles.stat}>{p.votes} votes</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Streaks */}
      <View style={styles.section}>
        <SectionTitle>Streak Leaders</SectionTitle>
        <View style={styles.cardRow}>
          <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
            Current: {streakLeaders.currentLongest?.username}
          </Text>
          <Text style={styles.stat}>{streakLeaders.currentLongest?.days}d</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
            All-time: {streakLeaders.allTimeLongest?.username}
          </Text>
          <Text style={styles.stat}>{streakLeaders.allTimeLongest?.days}d</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <SectionTitle>Recent Activity (7 days)</SectionTitle>
        {recentActivity.last7Days.map((p, idx) => (
          <View style={styles.cardRow} key={`recent-${p.userId}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
              <Avatar name={p.username} size={40} />
              <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
                {p.username}
              </Text>
            </View>
            <Text style={styles.stat}>{p.activityCount}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070717' },
  loading: { color: '#9AA4B2', padding: 20 },
  section: {
    marginBottom: 12,
    backgroundColor: '#0F1724',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  podiumContainer: { marginBottom: 12 },
  podiumTitle: { color: '#ffd166', fontWeight: '900', fontSize: 16, marginBottom: 8 },
  podiumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  podiumItem: { flex: 1, alignItems: 'center', padding: 8, marginHorizontal: 6 },
  champion: { transform: [{ translateY: -6 }] },
  podiumName: { color: '#fff', fontWeight: '800', marginTop: 8, maxWidth: 96 },
  podiumStat: { color: '#9EE493', fontWeight: '900', marginTop: 4 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  sectionTitle: { color: '#ffd166', fontSize: 16, fontWeight: '900', marginBottom: 6 },
  subTitle: { color: '#9AA4B2', fontWeight: '700' },
  player: { color: '#fff', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  stat: { color: '#9EE493', fontWeight: '900' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  avatar: { justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#071028', fontWeight: '900' },
  city: { color: '#a6e3e9', fontWeight: '800' },
  seasonName: { color: '#ffd166', fontWeight: '800' },
  smallText: { color: '#9AA4B2', fontSize: 12 },
});
