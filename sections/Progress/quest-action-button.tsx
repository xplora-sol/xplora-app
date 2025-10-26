import { ThemedText } from '@/components/themed-text';
import { getActionIcon } from '@/utils/quest-helpers';

import { StyleSheet, TouchableOpacity } from 'react-native';

interface QuestActionButtonProps {
  actionType: string;
  actionLabel: string;
  color: string;
  disabled: boolean;
  onPress: () => void;
}

export function QuestActionButton({
  actionType,
  actionLabel,
  color,
  disabled,
  onPress,
}: QuestActionButtonProps) {
  return (
    <TouchableOpacity disabled={disabled} style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <ThemedText type="defaultSemiBold" style={styles.buttonText}>
        {getActionIcon(actionType)} {actionLabel}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
  },
});
