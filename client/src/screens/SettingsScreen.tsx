import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ArrowLeft, BellRing, Sparkles, ShieldCheck, UserCog } from 'lucide-react-native';

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const settings = [
    'الإشعارات',
    'الخصوصية',
    'الأمان',
    'الصوت',
    'اللغة',
    'النسخة',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}><ArrowLeft size={18} color="#fff" /></Pressable>
        <Text style={styles.title}>الإعدادات</Text>
        <Pressable style={styles.backBtn}><ShieldCheck size={18} color="#fff" /></Pressable>
      </View>

      <ScrollView style={styles.list}>
        {settings.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item}</Text>
            <Text style={styles.value}>{index % 2 === 0 ? 'مفعل' : 'إعدادات'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1226', paddingHorizontal: 18, paddingTop: 48 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  list: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14, marginBottom: 10 },
  label: { color: '#fff', fontSize: 16 },
  value: { color: '#cbd5e1', fontSize: 12 },
});
