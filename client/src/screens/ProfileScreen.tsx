import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Crown, Gift, Shield, Coins, Sparkles, ArrowLeft } from 'lucide-react-native';

export function ProfileScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}><ArrowLeft size={18} color="#fff" /></Pressable>
        <Text style={styles.title}>حسابي</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>م</Text></View>
        <Text style={styles.name}>محمد فرعون</Text>
        <Text style={styles.id}>ID: 6858895</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}><Coins size={18} color="#fff" /><Text style={styles.statText}>0</Text></View>
        <View style={styles.statBox}><Gift size={18} color="#fff" /><Text style={styles.statText}>0</Text></View>
        <View style={styles.statBox}><Sparkles size={18} color="#fff" /><Text style={styles.statText}>VIP</Text></View>
      </View>

      <ScrollView style={styles.list}>
        {[
          ['المستوى', 'VIP'],
          ['المتجر', 'اعلان'],
          ['المكافآت', 'مفتوح'],
          ['الهدية', '0'],
          ['الملف الشخصي', 'تعديل'],
          ['الأمان', 'مؤمن'],
        ].map(([label, value], index) => (
          <View key={index} style={styles.rowItem}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2f7',
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1f1f2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  profileCard: {
    backgroundColor: '#e7e2e8',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#ef476f',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  id: {
    fontSize: 15,
    color: '#4b5563',
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  list: {
    flex: 1,
    gap: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 8,
  },
  rowLabel: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  rowValue: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '600',
  },
});
