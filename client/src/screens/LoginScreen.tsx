import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';

export function LoginScreen({ onLogin }: { onLogin: (user: { id: string; name: string; level: string }) => void }) {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('محمد');

  const handleLogin = () => {
    if (email && password) {
      onLogin({
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: isRegister ? name : 'محمد فرعون',
        level: 'VIP',
      });
    }
  };

  return (
    <LinearGradient colors={['#0a0e1f', '#121939', '#1b1d4c']} style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Max132</Text>
          <Text style={styles.subtitle}>{isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</Text>
        </View>

        {isRegister && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>الاسم</Text>
            <View style={styles.inputWrap}>
              <TextInput value={name} onChangeText={setName} placeholder="أدخل اسمك" placeholderTextColor="#9ca3af" style={styles.input} />
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <View style={styles.inputWrap}>
            <Mail size={18} color="#9ca3af" />
            <TextInput value={email} onChangeText={setEmail} placeholder="your@email.com" placeholderTextColor="#9ca3af" style={styles.inputField} keyboardType="email-address" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>كلمة المرور</Text>
          <View style={styles.inputWrap}>
            <Lock size={18} color="#9ca3af" />
            <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#9ca3af" style={styles.inputField} secureTextEntry={!showPassword} />
            <Pressable onPress={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}</Pressable>
          </View>
        </View>

        <Pressable style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>{isRegister ? 'إنشاء حساب' : 'دخول'}</Text>
          <ArrowRight size={18} color="#fff" />
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{isRegister ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}</Text>
          <Pressable onPress={() => setIsRegister(!isRegister)}>
            <Text style={styles.linkText}>{isRegister ? 'دخول' : 'إنشاء حساب'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 40, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { color: '#fff', fontSize: 42, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: '#cbd5e1', fontSize: 16 },
  inputGroup: { marginBottom: 20 },
  label: { color: '#e2e8f0', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  input: { flex: 1, color: '#fff', fontSize: 16 },
  inputField: { flex: 1, color: '#fff', fontSize: 16, marginHorizontal: 10 },
  loginBtn: { backgroundColor: '#ec4899', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
  loginText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 },
  footerText: { color: '#9ca3af', fontSize: 14 },
  linkText: { color: '#ec4899', fontSize: 14, fontWeight: '600' },
});
