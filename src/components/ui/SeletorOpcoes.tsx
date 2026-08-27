import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import type { Opcao } from '../../types';

interface SeletorOpcoesProps<T extends string> {
    label?: string;
    opcoes: readonly Opcao[];
    valor: T | '';
    onSelecionar: (id: T) => void;
    erro?: string;
}

/** Grupo de chips de escolha única (espécie, sexo, status, filtros...). */
export function SeletorOpcoes<T extends string>({
    label,
    opcoes,
    valor,
    onSelecionar,
    erro,
}: SeletorOpcoesProps<T>) {
    const { cores } = useTheme();

    return (
        <View style={{ marginBottom: Spacing.md }}>
            {!!label && <Text style={[estilos.label, { color: cores.text }]}>{label}</Text>}

            <View style={estilos.linha}>
                {opcoes.map((opcao) => {
                    const ativo = opcao.id === valor;
                    return (
                        <TouchableOpacity
                            key={opcao.id}
                            activeOpacity={0.85}
                            onPress={() => onSelecionar(opcao.id as T)}
                            style={[
                                estilos.chip,
                                {
                                    backgroundColor: ativo ? cores.primary : cores.surfaceAlt,
                                    borderColor: ativo ? cores.primary : cores.border,
                                },
                            ]}
                        >
                            {!!opcao.emoji && <Text style={estilos.emoji}>{opcao.emoji}</Text>}
                            <Text style={[estilos.texto, { color: ativo ? cores.textInverse : cores.textSecondary }]}>
                                {opcao.nome}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {!!erro && <Text style={[estilos.erro, { color: cores.danger }]}>{erro}</Text>}
        </View>
    );
}

const estilos = StyleSheet.create({
    label: { fontSize: Typography.bodySmall, fontWeight: '600', marginBottom: 8 },
    linha: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: Spacing.md, paddingVertical: 10,
        borderRadius: Radius.full, borderWidth: 1.5,
    },
    emoji: { fontSize: 15 },
    texto: { fontSize: Typography.bodySmall, fontWeight: '600' },
    erro: { fontSize: Typography.caption, marginTop: 4 },
});