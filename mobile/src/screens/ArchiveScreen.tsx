import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Appbar, FAB, Text, useTheme as usePaperTheme } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { fetchArchivedNotes, deleteNote, updateNote } from '../api/notesApi';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';
import type { Note, RootStackParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

type NavProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function ArchiveScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavProp>();
  const { isDark, toggleTheme } = useTheme();
  const paperTheme = usePaperTheme();

  const load = async () => {
    try {
      const data = await fetchArchivedNotes();
      setNotes(data);
    } catch {
      // silent
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handlePress = (note: Note) => {
    Alert.alert(
      note.title || 'Note',
      'What do you want to do?',
      [
        {
          text: 'Unarchive',
          onPress: async () => {
            await updateNote(note._id, { isArchived: false });
            load();
          },
        },
        {
          text: 'Delete permanently',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Delete', 'Delete this note permanently?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  await deleteNote(note._id);
                  load();
                },
              },
            ]);
          },
        },
        { text: 'Edit', onPress: () => navigation.navigate('EditNote', { note }) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderNote = ({ item, index }: { item: Note; index: number }) => {
    const isLeftColumn = index % 2 === 0;
    return (
      <View style={[styles.column, isLeftColumn ? styles.leftCol : styles.rightCol]}>
        <NoteCard note={item} onPress={() => handlePress(item)} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Archive" />
        <Appbar.Action
          icon={isDark ? 'weather-sunny' : 'weather-night'}
          onPress={toggleTheme}
        />
      </Appbar.Header>

      {notes.length === 0 ? (
        <EmptyState
          icon="archive-outline"
          title="No archived notes"
          subtitle="Notes you archive will appear here"
        />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item._id}
          renderItem={renderNote}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 4 },
  column: { flex: 1 },
  leftCol: { marginRight: 2 },
  rightCol: { marginLeft: 2 },
});
