import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { noteColors, colorPickerOptions } from '../theme';
import type { NoteColor } from '../types';
import { useTheme } from '../hooks/useTheme';

interface Props {
  selected: NoteColor;
  onSelect: (color: NoteColor) => void;
}

export default function ColorPicker({ selected, onSelect }: Props) {
  const { isDark } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {colorPickerOptions.map((color) => {
        const bg = isDark ? noteColors[color].dark : noteColors[color].light;
        const isSelected = selected === color;

        return (
          <TouchableOpacity
            key={color}
            onPress={() => onSelect(color)}
            style={[
              styles.swatch,
              { backgroundColor: bg },
              isSelected && styles.selectedSwatch,
            ]}
          >
            {isSelected && (
              <MaterialCommunityIcons name="check" size={16} color={isDark ? '#fff' : '#333'} />
            )}
            {color === 'default' && !isSelected && (
              <View style={styles.defaultInner} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 8, gap: 10 },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSwatch: { borderWidth: 2.5, borderColor: '#555' },
  defaultInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
});
