import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowRight, Sparkles, Mic, Gift, MessageSquareText } from 'lucide-react-native';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Max132</Text>
      <Text style={styles.subtitle}>Live voice rooms and social club vibes</Text>

      <View style={styles.featureRow}>
        <FeatureItem icon={<Mic size={18} color="#fff" />} label="Voice rooms" />
        <FeatureItem icon={<MessageSquareText size={18} color="#fff" />} label="Chat" />
        <FeatureItem icon={<Gift size={18} color="#fff" />} label="Gifts" />
      </View>

      <Pressable style={styles.cta} onPress={onStart}>
        <Text style={styles.ctaText}>ابدأ الآن</Text>
        <ArrowRight size={18} color="#fff" />
      </Pressable>
    </View>
  );
}

function FeatureItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.featureBox}>
      <View style={styles.featureIcon}>{icon}</View>
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1020',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '900',
    marginBottom: 12,
  },
  subtitle: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  featureBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    minWidth: 90,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cta: {
    width: '100%',
    backgroundColor: '#ec4899',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
