import React, { type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing } from '../../theme';

interface CabecalhoTelaProps {
    titulo: string;
    subtitulo?: string;
    onVoltar?: () => void;
    acaoDireita?: ReactNode;
}

export function CabecalhoTela({ titulo, subtitulo, onVoltar, acaoDireita }: CabecalhoTelaProps) {
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                estilos.container,
                {
                    backgroundColor: cores.surface,
                    borderBottomColor: cores.borderLight,
                    paddingTop: insets.top + Spacing.sm,
                },
            ]}
        >
            {!!onVoltar && (
                <TouchableOpacity onPress={onVoltar} style={estilos.voltar} hitSlop={12}>
                    <Ionicons name="chevron-back" size={24} color={cores.text} />
                </TouchableOpacity>
            )}

            <View style={{ flex: 1 }}>
                <Text style={[estilos.titulo, { color: cores.text }]} numberOfLines={1}>{titulo}</Text>
                {!!subtitulo && (
                    <Text style={[estilos.subtitulo, { color: cores.textSecondary }]} numberOfLines={1}>
                        {subtitulo}
                    </Text>
                )}
            </View>

            {acaoDireita}
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
        paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1,
    },
    voltar: { marginLeft: -6 },
    titulo: { fontSize: Typography.h2, fontWeight: '800' },
    subtitulo: { fontSize: Typography.caption, marginTop: 2 },
});