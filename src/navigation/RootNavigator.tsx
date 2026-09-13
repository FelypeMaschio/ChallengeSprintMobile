import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, type Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SplashScreen } from '../screens/SplashScreen';

const TEMPO_MINIMO_SPLASH_MS = 1200;

export default function RootNavigator() {
    const { autenticado, carregandoSessao } = useAuth();
    const { cores, escuro, carregando: carregandoTema } = useTheme();

    // Garante que a splash fique visível por um tempo mínimo, mesmo quando o
    // Firebase restaura a sessão muito rápido (o que faria ela aparecer e
    // sumir tão rápido que pareceria que nunca existiu).
    const [tempoMinimoPassou, setTempoMinimoPassou] = useState(false);

    useEffect(() => {
        const temporizador = setTimeout(() => setTempoMinimoPassou(true), TEMPO_MINIMO_SPLASH_MS);
        return () => clearTimeout(temporizador);
    }, []);

    const aindaCarregando = carregandoSessao || carregandoTema || !tempoMinimoPassou;

    if (aindaCarregando) {
        return <SplashScreen />;
    }

    const base = escuro ? DarkTheme : DefaultTheme;

    const temaNavegacao: Theme = {
        ...base,
        colors: {
            ...base.colors,
            primary: cores.primary,
            background: cores.background,
            card: cores.surface,
            text: cores.text,
            border: cores.border,
        },
    };

    return (
        <NavigationContainer theme={temaNavegacao}>
            <StatusBar style={escuro ? 'light' : 'dark'} />
            {autenticado ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
