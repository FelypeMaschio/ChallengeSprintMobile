import React, { type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Radius, Spacing, Sombra } from '../../theme';

interface CardProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    semSombra?: boolean;
}

export function Card({ children, style, semSombra = false }: CardProps) {
    const { cores, escuro } = useTheme();

    return (
        <View
            style={[
                estilos.card,
                { backgroundColor: cores.surface, borderColor: cores.borderLight },
                !semSombra && !escuro ? Sombra.card : null,
                escuro ? { borderWidth: 1 } : null,
                style,
            ]}
        >
            {children}
        </View>
    );
}

const estilos = StyleSheet.create({
    card: { borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm },
});