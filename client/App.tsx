import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeScreen } from './src/screens/HomeScreen';
import { RoomScreen } from './src/screens/RoomScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { palette } from './src/theme';

export type ScreenName = 'welcome' | 'home' | 'room' | 'profile' | 'chat' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('welcome');
  const [selectedRoomId, setSelectedRoomId] = useState('room-1');

  const rendered = useMemo(() => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            onJoinRoom={(roomId) => {
              setSelectedRoomId(roomId);
              setScreen('room');
            }}
            onOpenProfile={() => setScreen('profile')}
            onOpenChat={() => setScreen('chat')}
            onOpenSettings={() => setScreen('settings')}
          />
        );
      case 'room':
        return <RoomScreen roomId={selectedRoomId} onBack={() => setScreen('home')} onOpenChat={() => setScreen('chat')} />;
      case 'profile':
        return <ProfileScreen onBack={() => setScreen('home')} />;
      case 'chat':
        return <ChatScreen onBack={() => setScreen('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setScreen('home')} />;
      default:
        return <WelcomeScreen onStart={() => setScreen('home')} />;
    }
  }, [screen, selectedRoomId]);

  return (
    <LinearGradient colors={palette.bgGradient} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>{rendered}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
});
