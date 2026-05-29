import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { noteColors } from '../theme';
import type { Note } from '../types';
import { useTheme } from '../hooks/useTheme';

interface Props {
  note: Note;
  onPress: () => void;
}

export default function NoteCard({ note, onPress }: Props) {
  const { isDark } = useTheme();
  const bg = isDark ? noteColors[note.color].dark : noteColors[note.color].light;
  const textColor = isDark ? '#e8eaed' : '#202124';
  const subTextColor = isDark ? '#9aa0a6' : '#5f6368';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.card, { backgroundColor: bg }]}>
      {note.isPinned && (
        <View style={styles.pinIcon}>
          <MaterialCommunityIcons name="pin" size={14} color={subTextColor} />
        </View>
      )}
      {note.title ? (
        <Text
          variant="titleSmall"
          numberOfLines={3}
          style={[styles.title, { color: textColor }]}
        >
          {note.title}
        </Text>
      ) : null}
      {note.body ? (
        <Text
          variant="bodySmall"
          numberOfLines={8}
          style={[styles.body, { color: subTextColor }]}
        >
          {note.body}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    minHeight: 80,
  },
  pinIcon: { position: 'absolute', top: 8, right: 8 },
  title: { fontWeight: '600', marginBottom: 6, marginRight: 14 },
  body: { lineHeight: 18 },
});
