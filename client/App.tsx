import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeScreen } from './src/screens/HomeScreen';
import { RoomScreen } from './src/screens/RoomScreen';
import { palette } from './src/theme';

export default function App() {
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('room-1');

  const activeScreen = useMemo(
    () => (joinedRoom ? <RoomScreen roomId={selectedRoomId} onBack={() => setJoinedRoom(false)} /> : <HomeScreen onJoinRoom={(roomId) => {
      setSelectedRoomId(roomId);
      setJoinedRoom(true);
    }} />),
    [joinedRoom, selectedRoomId]
  );

  return (
    <LinearGradient colors={palette.bgGradient} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>{activeScreen}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
