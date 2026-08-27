import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import { Button } from './Button';

interface ErroApiProps {
    mensagem?: string;
    onTentarNovamente?: () => void;
}

/** Exibido sempre que uma query do TanStack Query falha. */
export function ErroApi({ mensagem, onTentarNovamente }: ErroApiProps) {
    const { cores } = useTheme();

    return (
        <View style={estilos.container}>
            <View style={[estilos.circulo, { backgroundColor: cores.dangerLight }]}>
                <Ionicons name="cloud-offline-outline" size={34} color={cores.danger} />
            </View>

            <Text style={[estilos.titulo, { color: cores.text }]}>Algo deu errado</Text>
            <Text style={[estilos.mensagem, { color: cores.textSecondary }]}>
                {mensagem ?? 'Não foi possível carregar os dados.'}
            </Text>

            {!!onTentarNovamente && (
                <Button
                    titulo="Tentar novamente"
                    variante="secundario"
                    onPress={onTentarNovamente}
                    style={{ marginTop: Spacing.md, paddingHorizontal: Spacing.xl }}
                />
            )}
        </View>
    );
}

const estilos = StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: Spacing.xl, paddingHorizontal: Spacing.lg },
    circulo: { width: 74, height: 74, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
    titulo: { fontSize: Typography.h3, fontWeight: '700' },
    mensagem: { fontSize: Typography.bodySmall, textAlign: 'center', marginTop: 6, lineHeight: 20 },
});