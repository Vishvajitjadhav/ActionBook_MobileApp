import React, { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Appbar,
  FAB,
  Text,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { fetchNotes } from '../api/notesApi';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';
import type { Note, RootStackParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

type NavProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavProp>();
  const { isDark, toggleTheme } = useTheme();
  const paperTheme = usePaperTheme();

  const load = async (query?: string) => {
    try {
      const data = await fetchNotes(query);
      setNotes(data);
    } catch {
      // silent — no network/server errors shown to user during load
    }
  };

  useFocusEffect(
    useCallback(() => {
      load(searchQuery || undefined);
    }, [searchQuery])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await load(searchQuery || undefined);
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    load(text || undefined);
  };

  const handleCloseSearch = () => {
    setSearchVisible(false);
    setSearchQuery('');
    load();
  };

  const pinned = notes.filter((n) => n.isPinned);
  const others = notes.filter((n) => !n.isPinned);

  type ListSection =
    | { type: 'header'; label: string; key: string }
    | { type: 'row'; left: Note | null; right: Note | null; key: string };

  const buildRows = (items: Note[]): ListSection[] => {
    const rows: ListSection[] = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push({
        type: 'row',
        left: items[i] ?? null,
        right: items[i + 1] ?? null,
        key: `row-${items[i]._id}`,
      });
    }
    return rows;
  };

  const listData: ListSection[] = [
    ...(pinned.length > 0
      ? [
          { type: 'header' as const, label: 'PINNED', key: 'h-pinned' },
          ...buildRows(pinned),
          { type: 'header' as const, label: 'OTHERS', key: 'h-others' },
        ]
      : []),
    ...buildRows(others),
  ];

  const renderItem = ({ item }: { item: ListSection }) => {
    if (item.type === 'header') {
      return (
        <Text
          variant="labelSmall"
          style={[styles.sectionHeader, { color: paperTheme.colors.onSurfaceVariant }]}
        >
          {item.label}
        </Text>
      );
    }
    return (
      <View style={styles.row}>
        <View style={styles.col}>
          {item.left ? (
            <NoteCard
              note={item.left}
              onPress={() => navigation.navigate('EditNote', { note: item.left! })}
            />
          ) : (
            <View style={styles.col} />
          )}
        </View>
        <View style={styles.col}>
          {item.right ? (
            <NoteCard
              note={item.right}
              onPress={() => navigation.navigate('EditNote', { note: item.right! })}
            />
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      {searchVisible ? (
        <View style={[styles.searchBar, { backgroundColor: paperTheme.colors.surface }]}>
          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color={paperTheme.colors.onSurfaceVariant}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search your notes"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            autoFocus
            style={[styles.searchInput, { color: paperTheme.colors.onSurface }]}
          />
          <TouchableOpacity onPress={handleCloseSearch} style={styles.searchClose}>
            <MaterialCommunityIcons
              name="close"
              size={22}
              color={paperTheme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Appbar.Header>
          <Appbar.Content title="Action Book" titleStyle={styles.appTitle} />
          <Appbar.Action icon="magnify" onPress={() => setSearchVisible(true)} />
          <Appbar.Action
            icon={isDark ? 'weather-sunny' : 'weather-night'}
            onPress={toggleTheme}
          />
        </Appbar.Header>
      )}

      {notes.length === 0 && !searchQuery ? (
        <EmptyState
          icon="lightbulb-outline"
          title="Notes you add appear here"
          subtitle="Tap the + button to create your first note"
        />
      ) : notes.length === 0 && searchQuery ? (
        <EmptyState icon="magnify" title="No matching notes" />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: paperTheme.colors.primary }]}
        color="#fff"
        onPress={() => navigation.navigate('EditNote', {})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appTitle: { fontWeight: '700', fontSize: 20 },
  list: { padding: 4, paddingBottom: 80 },
  row: { flexDirection: 'row', flex: 1 },
  col: { flex: 1 },
  sectionHeader: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: Platform.OS === 'android' ? 40 : 54,
    marginBottom: 4,
    borderRadius: 28,
    paddingHorizontal: 12,
    height: 52,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  searchClose: { padding: 4 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    borderRadius: 16,
  },
});
