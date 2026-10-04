import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ArrowLeft, Coins, Gift, Sparkles, BellRing, ShieldCheck, MessageSquareText, UserCog } from 'lucide-react-native';

export function ChatScreen({ onBack }: { onBack: () => void }) {
  const chatMessages = [
    { id: 'c1', user: 'Ammar', text: 'Welcome everyone 💜' },
    { id: 'c2', user: 'You', text: 'Let’s vibe together!', mine: true },
    { id: 'c3', user: 'Sara', text: 'This room is amazing!' },
    { id: 'c4', user: 'Yousef', text: 'I am in!' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}><ArrowLeft size={18} color="#fff" /></Pressable>
        <Text style={styles.title}>Chat</Text>
        <Pressable style={styles.backBtn}><BellRing size={18} color="#fff" /></Pressable>
      </View>

      <ScrollView style={styles.chatList}>
        {chatMessages.map((msg) => (
          <View key={msg.id} style={[styles.bubble, msg.mine && styles.mine]}>
            <Text style={styles.user}>{msg.user}</Text>
            <Text style={styles.text}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <Text style={styles.inputPlaceholder}>اكتب رسالة...</Text>
        <Pressable style={styles.send}><MessageSquareText size={18} color="#fff" /></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1226', paddingHorizontal: 16, paddingTop: 48 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  backBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  chatList: { flex: 1 },
  bubble: { maxWidth: '80%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 12, marginBottom: 12 },
  mine: { alignSelf: 'flex-end', backgroundColor: 'rgba(139,92,246,0.24)' },
  user: { color: '#cbd5e1', fontSize: 10, marginBottom: 4 },
  text: { color: '#fff', fontSize: 14 },
  inputBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f5f5f5', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14 },
  inputPlaceholder: { color: '#374151', fontSize: 14, flex: 1 },
  send: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ec4899', alignItems: 'center', justifyContent: 'center' },
});
