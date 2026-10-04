import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeScreen } from './src/screens/HomeScreen';
import { RoomScreen } from './src/screens/RoomScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { VIPScreen } from './src/screens/VIPScreen';
import { CreateRoomScreen } from './src/screens/CreateRoomScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { palette } from './src/theme';

export type ScreenName = 'splash' | 'login' | 'home' | 'room' | 'profile' | 'vip' | 'createroom' | 'chat' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('splash');
  const [selectedRoomId, setSelectedRoomId] = useState('room-1');
  const [user, setUser] = useState<{ id: string; name: string; level: string } | null>(null);

  const rendered = useMemo(() => {
    switch (screen) {
      case 'splash':
        return <WelcomeScreen onStart={() => setScreen('login')} />;
      case 'login':
        return (
          <LoginScreen
            onLogin={(userData) => {
              setUser(userData);
              setScreen('home');
            }}
          />
        );
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
            onCreateRoom={() => setScreen('createroom')}
            user={user}
          />
        );
      case 'room':
        return <RoomScreen roomId={selectedRoomId} onBack={() => setScreen('home')} onOpenChat={() => setScreen('chat')} />;
      case 'profile':
        return <ProfileScreen onBack={() => setScreen('home')} onOpenVIP={() => setScreen('vip')} user={user} />;
      case 'vip':
        return <VIPScreen onBack={() => setScreen('profile')} />;
      case 'createroom':
        return (
          <CreateRoomScreen
            onBack={() => setScreen('home')}
            onCreate={(roomId) => {
              setSelectedRoomId(roomId);
              setScreen('room');
            }}
          />
        );
      case 'chat':
        return <ChatScreen onBack={() => setScreen('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setScreen('home')} onLogout={() => setScreen('login')} />;
      default:
        return <WelcomeScreen onStart={() => setScreen('login')} />;
    }
  }, [screen, selectedRoomId, user]);

  return (
    <LinearGradient colors={palette.bgGradient} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea}>{rendered}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
});
