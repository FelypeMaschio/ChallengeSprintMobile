import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../theme';

const { width: LARGURA_TELA, height: ALTURA_TELA } = Dimensions.get('window');

/** Posições fixas das patinhas decorativas no fundo — discretas, atrás do conteúdo principal. */
const PATINHAS_DECORATIVAS = [
  { top: ALTURA_TELA * 0.12, left: LARGURA_TELA * 0.12, tamanho: 22, rotacao: '-15deg' },
  { top: ALTURA_TELA * 0.18, left: LARGURA_TELA * 0.78, tamanho: 28, rotacao: '20deg' },
  { top: ALTURA_TELA * 0.75, left: LARGURA_TELA * 0.15, tamanho: 26, rotacao: '10deg' },
  { top: ALTURA_TELA * 0.82, left: LARGURA_TELA * 0.72, tamanho: 20, rotacao: '-25deg' },
  { top: ALTURA_TELA * 0.45, left: LARGURA_TELA * 0.85, tamanho: 18, rotacao: '5deg' },
] as const;

/**
 * Exibida enquanto o Firebase restaura a sessão salva no AsyncStorage.
 * Usa só a Animated API nativa do React Native -- nenhuma dependência extra.
 */
export function SplashScreen() {
  const { cores } = useTheme();

  const logoEscala = useRef(new Animated.Value(0.6)).current;
  const logoOpacidade = useRef(new Animated.Value(0)).current;
  const marcaOpacidade = useRef(new Animated.Value(0)).current;
  const marcaTranslacao = useRef(new Animated.Value(12)).current;
  const sloganOpacidade = useRef(new Animated.Value(0)).current;
  const pulso = useRef(new Animated.Value(1)).current;
  const ponto1 = useRef(new Animated.Value(0.3)).current;
  const ponto2 = useRef(new Animated.Value(0.3)).current;
  const ponto3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Entrada: logo cresce e aparece, depois o nome, depois o slogan.
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoEscala, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacidade, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(marcaOpacidade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(marcaTranslacao, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(sloganOpacidade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Respiração contínua e sutil do círculo do logo.
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, {
          toValue: 1.08,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulso, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Três pontinhos de "carregando", cada um com um atraso diferente.
    const animarPonto = (valor: Animated.Value, atraso: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(atraso),
          Animated.timing(valor, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(valor, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          Animated.delay(800 - atraso),
        ]),
      );

    animarPonto(ponto1, 0).start();
    animarPonto(ponto2, 150).start();
    animarPonto(ponto3, 300).start();
  }, []);

  return (
    <LinearGradient
      colors={cores.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={estilos.container}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {PATINHAS_DECORATIVAS.map((patinha, indice) => (
          <Ionicons
            key={indice}
            name="paw"
            size={patinha.tamanho}
            color="rgba(255,255,255,0.12)"
            style={{
              position: 'absolute',
              top: patinha.top,
              left: patinha.left,
              transform: [{ rotate: patinha.rotacao }],
            }}
          />
        ))}
      </View>

      <View style={estilos.conteudo}>
        <Animated.View
          style={[
            estilos.logo,
            {
              opacity: logoOpacidade,
              transform: [{ scale: Animated.multiply(logoEscala, pulso) }],
            },
          ]}
        >
          <Ionicons name="paw" size={48} color="#FFFFFF" />
        </Animated.View>

        <Animated.Text
          style={[estilos.marca, { opacity: marcaOpacidade, transform: [{ translateY: marcaTranslacao }] }]}
        >
          Clyvo Vet
        </Animated.Text>

        <Animated.Text style={[estilos.slogan, { opacity: sloganOpacidade }]}>
          O cuidado do seu pet, sempre com você
        </Animated.Text>

        <View style={estilos.pontos}>
          <Animated.View style={[estilos.ponto, { opacity: ponto1 }]} />
          <Animated.View style={[estilos.ponto, { opacity: ponto2 }]} />
          <Animated.View style={[estilos.ponto, { opacity: ponto3 }]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  conteudo: { alignItems: 'center', paddingHorizontal: Spacing.lg },
  logo: {
    width: 104,
    height: 104,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  marca: {
    fontSize: Typography.display,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: Spacing.lg,
    letterSpacing: 0.3,
  },
  slogan: {
    fontSize: Typography.bodySmall,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    textAlign: 'center',
  },
  pontos: { flexDirection: 'row', gap: 8, marginTop: Spacing.xxl },
  ponto: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
});