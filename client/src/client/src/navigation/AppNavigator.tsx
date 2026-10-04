import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function AppNavigator() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Max132 App Navigator</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1020',
  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
});
