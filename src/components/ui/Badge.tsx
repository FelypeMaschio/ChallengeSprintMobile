import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Radius } from '../../theme';

export type VarianteBadge = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
    texto: string;
    variante?: VarianteBadge;
    style?: StyleProp<ViewStyle>;
}

export function Badge({ texto, variante = 'default', style }: BadgeProps) {
    const { cores } = useTheme();

    const variantes: Record<VarianteBadge, { bg: string; txt: string }> = {
        primary: { bg: cores.primaryLight, txt: cores.primary },
        success: { bg: cores.successLight, txt: cores.success },
        warning: { bg: cores.warningLight, txt: cores.warning },
        danger: { bg: cores.dangerLight, txt: cores.danger },
        info: { bg: cores.infoLight, txt: cores.info },
        default: { bg: cores.borderLight, txt: cores.textSecondary },
    };

    const v = variantes[variante];

    return (
        <View style={[estilos.badge, { backgroundColor: v.bg }, style]}>
            <Text style={[estilos.texto, { color: v.txt }]}>{texto}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, alignSelf: 'flex-start' },
    texto: { fontSize: Typography.tiny, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});