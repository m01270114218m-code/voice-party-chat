import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, Users, Zap, Music } from 'lucide-react-native';

export function CreateRoomScreen({ onBack, onCreate }: { onBack: () => void; onCreate: (roomId: string) => void }) {
  const [roomName, setRoomName] = useState('');
  const [topic, setTopic] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [category, setCategory] = useState('gaming');

  const categories = [
    { id: 'gaming', name: 'العاب', icon: '🎮' },
    { id: 'music', name: 'موسيقى', icon: '🎵' },
    { id: 'talk', name: 'حوار', icon: '💬' },
    { id: 'study', name: 'دراسة', icon: '📚' },
  ];

  const handleCreate = () => {
    if (roomName.trim()) {
      const newRoomId = `room-${Date.now()}`;
      onCreate(newRoomId);
    }
  };

  return (
    <LinearGradient colors={['#0a0e1f', '#121939', '#1b1d4c']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={20} color="#fff" />
        </Pressable>
        <Text style={styles.title}>إنشاء غرفة جديدة</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اسم الغرفة</Text>
          <View style={styles.inputWrap}>
            <TextInput value={roomName} onChangeText={setRoomName} placeholder="أدخل اسم الغرفة" placeholderTextColor="#9ca3af" style={styles.input} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الموضوع</Text>
          <View style={styles.inputWrap}>
            <TextInput value={topic} onChangeText={setTopic} placeholder="مثال: PUBG Squad" placeholderTextColor="#9ca3af" style={styles.input} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ا��فئة</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <Pressable key={cat.id} style={[styles.categoryBtn, category === cat.id && styles.categoryActive]} onPress={() => setCategory(cat.id)}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryName, category === cat.id && styles.categoryNameActive]}>{cat.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.privacyRow}>
            <View style={styles.privacyInfo}>
              <Lock size={20} color="#ec4899" />
              <View>
                <Text style={styles.privacyLabel}>غرفة خاصة</Text>
                <Text style={styles.privacyDesc}>السماح للدعوات فقط</Text>
              </View>
            </View>
            <Pressable style={[styles.toggle, isPrivate && styles.toggleOn]} onPress={() => setIsPrivate(!isPrivate)}>
              <View style={[styles.toggleDot, isPrivate && styles.toggleDotOn]} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإحصائيات</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Users size={20} color="#3b82f6" />
              <Text style={styles.statText}>عدد الأعضاء</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statBox}>
              <Music size={20} color="#8b5cf6" />
              <Text style={styles.statText}>المدة</Text>
              <Text style={styles.statValue}>0min</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.createBtn} onPress={handleCreate}>
          <Zap size={20} color="#fff" />
          <Text style={styles.createBtnText}>إنشاء الغرفة الآن</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: '#fff', fontSize: 22, fontWeight: '800' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingVertical: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { color: '#e2e8f0', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  inputWrap: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  input: { color: '#fff', fontSize: 16 },
  categoryGrid: { flexDirection: 'row', gap: 12 },
  categoryBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  categoryActive: { backgroundColor: 'rgba(236,72,153,0.2)', borderColor: '#ec4899' },
  categoryIcon: { fontSize: 24, marginBottom: 4 },
  categoryName: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  categoryNameActive: { color: '#fff' },
  privacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  privacyInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  privacyLabel: { color: '#fff', fontSize: 16, fontWeight: '700' },
  privacyDesc: { color: '#9ca3af', fontSize: 12 },
  toggle: { width: 50, height: 28, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 2 },
  toggleOn: { backgroundColor: '#ec4899' },
  toggleDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' },
  toggleDotOn: { marginLeft: 22 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 12, alignItems: 'center' },
  statText: { color: '#9ca3af', fontSize: 12, marginVertical: 4 },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '800' },
  createBtn: { backgroundColor: '#ec4899', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 },
  createBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
