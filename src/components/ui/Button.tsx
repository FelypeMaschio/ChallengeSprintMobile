import React, { type ReactNode } from 'react';
import {
    TouchableOpacity, Text, ActivityIndicator, View, StyleSheet,
    type StyleProp, type ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Radius, Spacing } from '../../theme';

type Variante = 'primario' | 'secundario' | 'perigo' | 'sucesso' | 'fantasma';
type Tamanho = 'sm' | 'md' | 'lg';

const ALTURAS: Record<Tamanho, number> = { sm: 40, md: 52, lg: 58 };
const FONTES: Record<Tamanho, number> = {
    sm: Typography.bodySmall, md: Typography.body, lg: Typography.h4,
};

interface ButtonProps {
    titulo: string;
    onPress: () => void;
    variante?: Variante;
    tamanho?: Tamanho;
    carregando?: boolean;
    desabilitado?: boolean;
    iconeEsquerda?: ReactNode;
    iconeDireita?: ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function Button({
    titulo,
    onPress,
    variante = 'primario',
    tamanho = 'md',
    carregando = false,
    desabilitado = false,
    iconeEsquerda,
    iconeDireita,
    style,
}: ButtonProps) {
    const { cores } = useTheme();

    const variantes: Record<Variante, { bg: string; txt: string; borda?: string }> = {
        primario: { bg: cores.primary, txt: cores.textInverse },
        secundario: { bg: 'transparent', txt: cores.primary, borda: cores.primary },
        perigo: { bg: cores.danger, txt: cores.textInverse },
        sucesso: { bg: cores.success, txt: cores.textInverse },
        fantasma: { bg: 'transparent', txt: cores.primary },
    };

    const v = variantes[variante];
    const inativo = desabilitado || carregando;

    return (
        <TouchableOpacity
            style={[
                estilos.base,
                { backgroundColor: v.bg, height: ALTURAS[tamanho] },
                v.borda ? { borderWidth: 1.5, borderColor: v.borda } : null,
                inativo ? estilos.inativo : null,
                style,
            ]}
            onPress={onPress}
            disabled={inativo}
            activeOpacity={0.82}
        >
            {carregando ? (
                <ActivityIndicator color={v.txt} size="small" />
            ) : (
                <View style={estilos.linha}>
                    {iconeEsquerda}
                    <Text style={[estilos.texto, { color: v.txt, fontSize: FONTES[tamanho] }]}>{titulo}</Text>
                    {iconeDireita}
                </View>
            )}
        </TouchableOpacity>
    );
}

const estilos = StyleSheet.create({
    base: {
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
    },
    linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    texto: { fontWeight: '700', letterSpacing: 0.2 },
    inativo: { opacity: 0.5 },
});