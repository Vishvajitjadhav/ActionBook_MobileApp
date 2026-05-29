import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme as usePaperTheme } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import ArchiveScreen from '../screens/ArchiveScreen';
import EditNoteScreen from '../screens/EditNoteScreen';
import type { RootStackParamList, BottomTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function TabNavigator() {
  const theme = usePaperTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
          elevation: 8,
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            Home: 'home-outline',
            Archive: 'archive-outline',
          };
          return (
            <MaterialCommunityIcons
              name={(icons[route.name] ?? 'circle') as never}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Archive" component={ArchiveScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const theme = usePaperTheme();

  return (
    <NavigationContainer
      theme={{
        dark: theme.dark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.onSurface,
          border: theme.colors.surfaceVariant,
          notification: theme.colors.error,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="EditNote"
          component={EditNoteScreen}
          options={{ presentation: 'card', animationEnabled: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
