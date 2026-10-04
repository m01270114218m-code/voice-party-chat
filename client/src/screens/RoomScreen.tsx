import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mic, MicOff, MessageSquareText, Users, Gift, Volume2, ShieldCheck, Crown, Heart, Camera } from 'lucide-react-native';
import { messages, participantList } from '../mock';

export function RoomScreen({ roomId, onBack, onOpenChat }: { roomId: string; onBack: () => void; onOpenChat: () => void }) {
  const [micOn, setMicOn] = useState(true);
  const [input, setInput] = useState('');
  const activeRoom = useMemo(() => ({ id: roomId, name: 'Gaming Lounge', topic: 'PUBG Squad' }), [roomId]);

  return (
    <LinearGradient colors={['#0b1032', '#1e2a74', '#1b1950']} style={styles.screen}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backBtn}><ArrowLeft size={20} color="#fff" /></Pressable>
        <View style={styles.titleWrap}><Text style={styles.title}>{activeRoom.name}</Text><Text style={styles.subtitle}>{activeRoom.topic}</Text></View>
        <Pressable style={styles.iconBtn}><ShieldCheck size={18} color="#fff" /></Pressable>
      </View>

      <View style={styles.statsRow}><Text style={styles.statusBadge}>LIVE</Text><Text style={styles.metaText}>{participantList.length} listeners</Text></View>

      <View style={styles.memberGrid}>
        {participantList.map((person, index) => (
          <View key={person.id} style={styles.memberCard}>
            <View style={[styles.avatar, { backgroundColor: person.color }]}>{person.name.slice(0, 2).toUpperCase()}</View>
            <Text style={styles.memberName}>{person.name}</Text>
            {index === 0 && <View style={styles.rankChip}><Crown size={12} color="#fff" /></View>}
          </View>
        ))}
      </View>

      <View style={styles.chatPanel}>
        <View style={styles.chatHeader}><Text style={styles.chatTitle}>Chat</Text><Users size={18} color="#fff" /></View>
        <ScrollView>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.messageBubble, msg.mine && styles.mine]}>
              <Text style={styles.userLabel}>{msg.user}</Text>
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.bottomBar}>
        <Pressable style={[styles.control, micOn ? styles.micOn : styles.micOff]} onPress={() => setMicOn((v) => !v)}>
          {micOn ? <Mic size={18} color="#fff" /> : <MicOff size={18} color="#fff" />}
        </Pressable>
        <Pressable style={styles.control}><Gift size={18} color="#fff" /></Pressable>
        <Pressable style={styles.control}><Volume2 size={18} color="#fff" /></Pressable>
        <Pressable style={styles.control} onPress={onOpenChat}><MessageSquareText size={18} color="#fff" /></Pressable>
        <Pressable style={styles.control}><Camera size={18} color="#fff" /></Pressable>
      </View>

      <View style={styles.sendBar}>
        <Text style={styles.sendInput}>{input || 'اكتب رسالة...'}</Text>
        <Pressable style={styles.sendBtn} onPress={() => setInput('مرحبا بالعالم')}><Heart size={18} color="#fff" /></Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 48, paddingHorizontal: 14, paddingBottom: 30 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  subtitle: { color: '#dbeafe', fontSize: 12 },
  iconBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#ec4899', color: '#fff', fontWeight: '800', fontSize: 12 },
  metaText: { color: '#d1d5db', fontSize: 12 },
  memberGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, marginBottom: 16 },
  memberCard: { width: '22%', alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' },
  avatar: { width: 68, height: 68, borderRadius: 35, alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: 18, marginBottom: 8 },
  memberName: { color: '#fff', fontSize: 12 },
  rankChip: { position: 'absolute', top: 0, right: 10, backgroundColor: '#f59e0b', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  chatPanel: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 22, padding: 12, marginBottom: 12 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  chatTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  messageBubble: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 10, marginBottom: 10, maxWidth: '80%' },
  mine: { alignSelf: 'flex-end', backgroundColor: 'rgba(139,92,246,0.22)' },
  userLabel: { color: '#d1d5db', fontSize: 10, marginBottom: 3 },
  messageText: { color: '#fff', fontSize: 12 },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  control: { width: 50, height: 50, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  micOn: { backgroundColor: '#22c55e' },
  micOff: { backgroundColor: '#ef4444' },
  sendBar: { backgroundColor: '#f5f5f5', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sendInput: { color: '#1f2937', fontSize: 14, flex: 1 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ec4899', alignItems: 'center', justifyContent: 'center' },
});
