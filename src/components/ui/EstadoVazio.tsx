import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import { Button } from './Button';
import type { NomeIcone } from '../../types';

interface EstadoVazioProps {
    icone?: NomeIcone;
    titulo: string;
    descricao?: string;
    textoAcao?: string;
    onAcao?: () => void;
}

export function EstadoVazio({
    icone = 'paw-outline',
    titulo,
    descricao,
    textoAcao,
    onAcao,
}: EstadoVazioProps) {
    const { cores } = useTheme();

    return (
        <View style={estilos.container}>
            <View style={[estilos.circulo, { backgroundColor: cores.primaryLight }]}>
                <Ionicons name={icone} size={38} color={cores.primary} />
            </View>

            <Text style={[estilos.titulo, { color: cores.text }]}>{titulo}</Text>
            {!!descricao && <Text style={[estilos.descricao, { color: cores.textSecondary }]}>{descricao}</Text>}

            {!!textoAcao && !!onAcao && (
                <Button
                    titulo={textoAcao}
                    onPress={onAcao}
                    style={{ marginTop: Spacing.lg, paddingHorizontal: Spacing.xl }}
                />
            )}
        </View>
    );
}

const estilos = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.lg },
    circulo: { width: 84, height: 84, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
    titulo: { fontSize: Typography.h3, fontWeight: '700', textAlign: 'center' },
    descricao: { fontSize: Typography.bodySmall, textAlign: 'center', marginTop: 6, lineHeight: 20 },
});