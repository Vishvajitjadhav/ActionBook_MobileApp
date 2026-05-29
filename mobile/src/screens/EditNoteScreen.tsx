import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Appbar, useTheme as usePaperTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { createNote, updateNote, deleteNote } from '../api/notesApi';
import ColorPicker from '../components/ColorPicker';
import { noteColors } from '../theme';
import type { NoteColor, RootStackParamList } from '../types';
import { useTheme } from '../hooks/useTheme';

type NavProp = StackNavigationProp<RootStackParamList, 'EditNote'>;
type RoutePropType = RouteProp<RootStackParamList, 'EditNote'>;

export default function EditNoteScreen() {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavProp>();
  const { isDark } = useTheme();
  const paperTheme = usePaperTheme();

  const existingNote = route.params?.note;

  const [title, setTitle] = useState(existingNote?.title ?? '');
  const [body, setBody] = useState(existingNote?.body ?? '');
  const [color, setColor] = useState<NoteColor>(existingNote?.color ?? 'default');
  const [isPinned, setIsPinned] = useState(existingNote?.isPinned ?? false);
  const savedRef = useRef(false);

  const bg = isDark ? noteColors[color].dark : noteColors[color].light;
  const textColor = isDark ? '#e8eaed' : '#202124';
  const placeholderColor = isDark ? '#9aa0a6' : '#80868b';

  const handleSave = async () => {
    if (savedRef.current) return;
    if (!title.trim() && !body.trim()) return;
    savedRef.current = true;

    try {
      if (existingNote) {
        await updateNote(existingNote._id, { title, body, color, isPinned });
      } else {
        await createNote({ title, body, color, isPinned });
      }
    } catch {
      savedRef.current = false;
    }
  };

  const handleBack = async () => {
    await handleSave();
    navigation.goBack();
  };

  const handleArchive = async () => {
    if (existingNote) {
      await updateNote(existingNote._id, { isArchived: true });
    }
    savedRef.current = true;
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete note', 'This will permanently delete this note.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (existingNote) {
            await deleteNote(existingNote._id);
          }
          savedRef.current = true;
          navigation.goBack();
        },
      },
    ]);
  };

  // Save when navigating away via hardware back (Android)
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      await handleSave();
    });
    return unsubscribe;
  }, [title, body, color, isPinned]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Appbar.Header style={{ backgroundColor: bg, elevation: 0 }}>
        <Appbar.BackAction onPress={handleBack} color={textColor} />
        <Appbar.Content title="" />
        <Appbar.Action
          icon={isPinned ? 'pin' : 'pin-outline'}
          onPress={() => setIsPinned((p) => !p)}
          color={isPinned ? paperTheme.colors.primary : textColor}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={placeholderColor}
          multiline
          style={[styles.titleInput, { color: textColor }]}
        />
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Note"
          placeholderTextColor={placeholderColor}
          multiline
          style={[styles.bodyInput, { color: textColor }]}
          autoFocus={!existingNote}
        />
      </ScrollView>

      <View style={[styles.toolbar, { backgroundColor: bg }]}>
        <ColorPicker selected={color} onSelect={setColor} />
        <View style={styles.toolbarActions}>
          {existingNote && (
            <TouchableOpacity onPress={handleArchive} style={styles.toolBtn}>
              <MaterialCommunityIcons name="archive-outline" size={22} color={placeholderColor} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleDelete} style={styles.toolBtn}>
            <MaterialCommunityIcons name="delete-outline" size={22} color={placeholderColor} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 12,
    padding: 0,
    textAlignVertical: 'top',
  },
  bodyInput: {
    fontSize: 15,
    lineHeight: 22,
    padding: 0,
    textAlignVertical: 'top',
    minHeight: 200,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  toolbarActions: { flexDirection: 'row', paddingRight: 8 },
  toolBtn: { padding: 10 },
});
