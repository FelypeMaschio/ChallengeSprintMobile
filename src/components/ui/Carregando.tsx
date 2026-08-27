import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing } from '../../theme';

interface CarregandoProps {
    mensagem?: string;
    tela?: boolean;
}

export function Carregando({ mensagem = 'Carregando...', tela = false }: CarregandoProps) {
    const { cores } = useTheme();

    return (
        <View style={[estilos.container, tela ? { flex: 1, backgroundColor: cores.background } : null]}>
            <ActivityIndicator size="large" color={cores.primary} />
            <Text style={[estilos.texto, { color: cores.textSecondary }]}>{mensagem}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl },
    texto: { fontSize: Typography.bodySmall, marginTop: Spacing.sm },
});