import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Star, Sparkles, Gift, DollarSign, Zap } from 'lucide-react-native';

export function VIPScreen({ onBack }: { onBack: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'مجاني',
      features: ['الوصول الأساسي', 'دخول الغرف', 'نسخة محدودة من الشات'],
      color: '#3b82f6',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '29.99 ر.س',
      features: ['إنشاء غرف غير محدود', 'شات كامل', 'هدايا خاصة', 'شارة VIP'],
      color: '#8b5cf6',
      popular: true,
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '99.99 ر.س',
      features: ['كل مميزات Premium', 'أولوية في الدعم', 'كويتز شهري', 'ضعف الذهب'],
      color: '#f59e0b',
    },
  ];

  return (
    <LinearGradient colors={['#0a0e1f', '#121939', '#1b1d4c']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={20} color="#fff" />
        </Pressable>
        <Text style={styles.title}>الخطط والاشتراكات</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Sparkles size={32} color="#fbbf24" />
          <Text style={styles.bannerText}>الترقية الآن واستمتع بمميزات حصرية</Text>
        </View>

        {plans.map((plan) => (
          <Pressable key={plan.id} style={[styles.planCard, selectedPlan === plan.id && styles.planSelected, { borderColor: plan.color }]} onPress={() => setSelectedPlan(plan.id)}>
            <LinearGradient colors={[plan.color + '15', plan.color + '05']} style={styles.planGradient}>
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                  <Star size={12} color="#fff" />
                  <Text style={styles.popularText}>الأشهر</Text>
                </View>
              )}
              <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <View style={styles.features}>
                {plan.features.map((feature, i) => (
                  <View key={i} style={styles.featureRow}>
                    <View style={[styles.checkMark, { backgroundColor: plan.color }]} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <Pressable style={[styles.selectBtn, selectedPlan === plan.id && { backgroundColor: plan.color }]}>
                <Text style={styles.selectBtnText}>{selectedPlan === plan.id ? 'مختار' : 'اختر'}</Text>
              </Pressable>
            </LinearGradient>
          </Pressable>
        ))}

        <View style={styles.coinSection}>
          <View style={styles.coinHeader}>
            <DollarSign size={24} color="#fbbf24" />
            <Text style={styles.coinTitle}>شراء الذهب</Text>
          </View>

          <View style={styles.coinGrid}>
            {[50, 100, 500, 1000].map((amount) => (
              <Pressable key={amount} style={styles.coinCard}>
                <Text style={styles.coinAmount}>{amount}</Text>
                <Text style={styles.coinPrice}>{amount / 10}ر.س</Text>
              </Pressable>
            ))}
          </View>
        </View>
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
  banner: { backgroundColor: 'rgba(251,191,36,0.1)', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#fbbf24' },
  bannerText: { color: '#fbbf24', fontSize: 16, fontWeight: '700', marginTop: 8 },
  planCard: { borderRadius: 20, marginBottom: 16, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
  planSelected: { borderColor: '#ec4899' },
  planGradient: { padding: 20 },
  popularBadge: { alignSelf: 'flex-start', flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 8, gap: 4 },
  popularText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planName: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
  planPrice: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 16 },
  features: { marginBottom: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  checkMark: { width: 20, height: 20, borderRadius: 10 },
  featureText: { color: '#e2e8f0', fontSize: 14 },
  selectBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  selectBtnText: { color: '#fff', fontWeight: '700' },
  coinSection: { marginTop: 24, marginBottom: 24 },
  coinHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  coinTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  coinGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  coinCard: { flex: 1, minWidth: '45%', backgroundColor: 'rgba(139,92,246,0.2)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#8b5cf6' },
  coinAmount: { color: '#fbbf24', fontSize: 20, fontWeight: '900', marginBottom: 4 },
  coinPrice: { color: '#e2e8f0', fontSize: 12 },
});
