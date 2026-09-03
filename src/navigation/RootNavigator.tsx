import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, type Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function RootNavigator() {
    const { autenticado, carregandoSessao } = useAuth();
    const { cores, escuro, carregando: carregandoTema } = useTheme();

    // Splash enquanto o Firebase restaura a sessão salva no AsyncStorage.
    if (carregandoSessao || carregandoTema) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.background }}>
                <ActivityIndicator size="large" color={cores.primary} />
            </View>
        );
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