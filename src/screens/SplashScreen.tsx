import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../theme';

/** Exibida enquanto o Firebase restaura a sessão salva no AsyncStorage. */
export function SplashScreen() {
  const { cores } = useTheme();

  return (
    <View style={[estilos.container, { backgroundColor: cores.primary }]}>
      <View style={estilos.logo}>
        <Ionicons name="paw" size={44} color="#FFFFFF" />
      </View>

      <Text style={estilos.marca}>Clyvo Vet</Text>
      <Text style={estilos.slogan}>O cuidado do seu pet, sempre com você</Text>

      <ActivityIndicator size="small" color="#FFFFFF" style={{ marginTop: Spacing.xl }} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marca: {
    fontSize: Typography.display,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: Spacing.md,
  },
  slogan: {
    fontSize: Typography.bodySmall,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
});