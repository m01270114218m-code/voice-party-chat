import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, Headphones, Sparkles, Users, Mic, MessageSquareText, Settings, UserRound } from 'lucide-react-native';
import { featuredRooms } from '../mock';

export function HomeScreen({
  onJoinRoom,
  onOpenProfile,
  onOpenChat,
  onOpenSettings,
}: {
  onJoinRoom: (roomId: string) => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
  onOpenSettings: () => void;
}) {
  const [search, setSearch] = useState('');
  const [roomName, setRoomName] = useState('');

  const filteredRooms = featuredRooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase()) || room.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.signal}>٤٢٪</Text>
        <View style={styles.statusPart}>
          <View style={styles.statusBox} />
          <Text style={styles.statusText}>KB/S</Text>
        </View>
        <Text style={styles.time}>١:٠٥</Text>
      </View>

      <View style={styles.headerRow}>
        <View style={styles.searchWrap}>
          <Search size={20} color="#fff" />
          <TextInput value={search} onChangeText={setSearch} placeholder="بحث" placeholderTextColor="#b6bfd0" style={styles.input} />
        </View>
        <Pressable style={styles.iconBtn} onPress={onOpenProfile}><UserRound size={18} color="#111827" /></Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#f5d4eb', '#d6c3ff']} style={styles.heroBanner}>
          <Text style={styles.heroText}>مكافآت</Text>
          <Text style={styles.heroText}>الشحن</Text>
        </LinearGradient>

        <View style={styles.gridRow}>
          {filteredRooms.slice(0, 2).map((room) => (
            <Pressable key={room.id} onPress={() => onJoinRoom(room.id)} style={[styles.roomCard, { backgroundColor: room.color }]}>
              <LinearGradient colors={[room.color, room.accent]} style={styles.roomGradient}>
                <View style={styles.roomHeader}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>{room.live ? 'LIVE' : 'OFF'}</Text>
                </View>
                <Text style={styles.roomTitle}>{room.name}</Text>
                <Text style={styles.roomMembers}>{room.members} members</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        <View style={styles.createPanel}>
          <TextInput value={roomName} onChangeText={setRoomName} placeholder="اسم الغرفة" placeholderTextColor="#b6bfd0" style={styles.createInput} />
          <Pressable style={styles.createButton} onPress={() => roomName.trim() && onJoinRoom('room-custom')}>
            <Text style={styles.createText}>إنشاء غرفة</Text>
          </Pressable>
        </View>

        <View style={styles.listSection}>
          {filteredRooms.map((room) => (
            <Pressable key={room.id} style={styles.listItem} onPress={() => onJoinRoom(room.id)}>
              <View style={[styles.listAvatar, { backgroundColor: room.color }]}>
                <Headphones size={18} color="#fff" />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{room.name}</Text>
                <Text style={styles.listTopic}>{room.topic}</Text>
              </View>
              <View style={styles.memberPill}><Users size={12} color="#fff" /><Text style={styles.memberText}>{room.members}</Text></View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <Pressable style={styles.tabBtn} onPress={onOpenSettings}><Settings size={20} color="#111827" /></Pressable>
        <Pressable style={styles.tabBtnActive} onPress={() => onJoinRoom('room-1')}><Mic size={20} color="#fff" /></Pressable>
        <Pressable style={styles.tabBtn} onPress={onOpenChat}><MessageSquareText size={20} color="#111827" /></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 14, paddingTop: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  signal: { color: '#fff', fontSize: 16, fontWeight: '700' },
  statusPart: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusBox: { width: 42, height: 18, backgroundColor: '#f4f4f4', borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 12 },
  time: { color: '#fff', fontWeight: '700', fontSize: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  input: { flex: 1, color: '#fff', fontSize: 14 },
  iconBtn: { width: 42, height: 42, backgroundColor: '#f5d9f7', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  heroBanner: { minHeight: 130, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  heroText: { color: '#1f2937', fontSize: 34, fontWeight: '900', letterSpacing: 1 },
  gridRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  roomCard: { flex: 1, height: 180, borderRadius: 22, overflow: 'hidden' },
  roomGradient: { flex: 1, borderRadius: 22, padding: 14, justifyContent: 'space-between' },
  roomHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, backgroundColor: '#f00', borderRadius: 4 },
  liveText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  roomTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  roomMembers: { color: '#fff', fontSize: 12, opacity: 0.9 },
  createPanel: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: 12, marginBottom: 18 },
  createInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', marginBottom: 10 },
  createButton: { backgroundColor: '#ec4899', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  createText: { color: '#fff', fontWeight: '800' },
  listSection: { gap: 10, marginBottom: 80 },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: 12, gap: 12 },
  listAvatar: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  listInfo: { flex: 1 },
  listName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  listTopic: { color: '#cbd5e1', fontSize: 12 },
  memberPill: { backgroundColor: '#ec4899', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  memberText: { color: '#fff', fontWeight: '700', fontSize: 11 },
  tabBar: { position: 'absolute', bottom: 14, left: 18, right: 18, height: 70, backgroundColor: '#f7f7f7', borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' },
  tabBtn: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  tabBtnActive: { width: 68, height: 68, borderRadius: 22, backgroundColor: '#ec4899', alignItems: 'center', justifyContent: 'center', marginTop: -18 },
});
