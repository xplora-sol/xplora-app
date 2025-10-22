import { ThemedText } from "@/components/themed-text";
import { GameColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Platform, StyleSheet, View } from "react-native";

interface UserStatsOverlayProps {
  level?: number;
  keyCount?: number;
  avatarUrl?: string;
}

export function UserStatsOverlay({
  level = 5,
  keyCount = 3,
  avatarUrl = "https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg",
}: UserStatsOverlayProps) {
  const levelProgress = 3; // 3 out of 5
  const maxLevel = 5;

  return (
    <View style={styles.container}>
      {/* Top Row - Avatar and Stats */}
      <View style={styles.topRow}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>

        {/* Level Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[GameColors.accent, GameColors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressFill,
                { width: `${(levelProgress / maxLevel) * 100}%` },
              ]}
            />
            <ThemedText style={styles.progressText}>
              {levelProgress}/{maxLevel}
            </ThemedText>
          </View>
        </View>

        {/* Key Count */}
        <View style={styles.keyBadge}>
          <ThemedText style={styles.keyIcon}>🔑</ThemedText>
          <ThemedText style={styles.keyText}>{keyCount}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(30, 35, 55, 0.9)",
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: GameColors.accent,
    overflow: "hidden",
    backgroundColor: "#1A1A2E",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
    zIndex: 1,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Menlo-Bold" : "monospace",
  },
  keyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 53, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  keyIcon: {
    fontSize: 12,
  },
  keyText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "Menlo-Bold" : "monospace",
  },
});
