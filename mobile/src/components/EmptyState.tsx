import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme as usePaperTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = 'lightbulb-outline', title, subtitle }: Props) {
  const theme = usePaperTheme();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={icon as never}
        size={80}
        color={theme.colors.onSurfaceVariant}
        style={styles.icon}
      />
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  icon: { opacity: 0.5, marginBottom: 16 },
  title: { textAlign: 'center', fontWeight: '600', marginBottom: 8 },
  subtitle: { textAlign: 'center', opacity: 0.7 },
});
