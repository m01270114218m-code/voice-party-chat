import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ArrowLeft, Coins, Gift, Sparkles, Crown, Heart, Share2 } from 'lucide-react-native';

export function ProfileScreen({ onBack, onOpenVIP, user }: { onBack: () => void; onOpenVIP: () => void; user: any }) {
  const stats = [
    { label: 'الذهب', value: '2,450', icon: Coins, color: '#fbbf24' },
    { label: 'الهدايا', value: '128', icon: Gift, color: '#ec4899' },
    { label: 'المستوى', value: 'VIP', icon: Crown, color: '#a78bfa' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={18} color="#fff" />
        </Pressable>
        <Text style={styles.title}>حسابي</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>م</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'محمد فرعون'}</Text>
          <Text style={styles.id}>ID: 6858895</Text>
          <View style={styles.vipBadge}>
            <Crown size={14} color="#fff" />
            <Text style={styles.vipText}>VIP المستوى</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <View key={i} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Icon size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionCard} onPress={onOpenVIP}>
            <Sparkles size={24} color="#fbbf24" />
            <Text style={styles.actionText}>الترقية</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <Heart size={24} color="#ec4899" />
            <Text style={styles.actionText}>المفضلة</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <Share2 size={24} color="#3b82f6" />
            <Text style={styles.actionText}>شارك</Text>
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>الإعدادات</Text>
          {[
            { label: 'البيانات الشخصية', value: 'تعديل' },
            { label: 'الخصوصية', value: 'آمن' },
            { label: 'الإشعارات', value: 'مفعل' },
            { label: 'الحساب', value: 'نشط' },
          ].map((item, i) => (
            <View key={i} style={styles.menuItem}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1226', paddingHorizontal: 16, paddingTop: 48 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#fff' },
  spacer: { width: 40 },
  scroll: { flex: 1 },
  profileCard: { backgroundColor: 'rgba(139,92,246,0.15)', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#8b5cf6' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#8b5cf6', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '900' },
  name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  id: { fontSize: 14, color: '#cbd5e1', marginBottom: 12 },
  vipBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fbbf24', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  vipText: { color: '#111827', fontWeight: '700', fontSize: 12 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 12, alignItems: 'center' },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { color: '#fff', fontWeight: '800', fontSize: 16, marginBottom: 2 },
  statLabel: { color: '#9ca3af', fontSize: 11 },
  actionsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, paddingVertical: 16, alignItems: 'center', gap: 8 },
  actionText: { color: '#e2e8f0', fontSize: 12, fontWeight: '600' },
  menuSection: { marginBottom: 24 },
  menuTitle: { color: '#e2e8f0', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8 },
  menuLabel: { color: '#fff', fontSize: 15, fontWeight: '600' },
  menuValue: { color: '#9ca3af', fontSize: 13 },
});
