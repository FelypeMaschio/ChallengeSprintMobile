import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Badge, type VarianteBadge } from '../ui';
import { Typography, Spacing, Radius, Sombra } from '../../theme';
import { isoParaDataBr } from '../../utils/date';
import type { Consulta, StatusConsulta } from '../../types';

const ROTULOS: Record<StatusConsulta, string> = {
    agendada: 'Agendada', concluida: 'Concluída', cancelada: 'Cancelada',
};

const VARIANTES: Record<StatusConsulta, VarianteBadge> = {
    agendada: 'info', concluida: 'success', cancelada: 'danger',
};

interface ConsultaCardProps {
    consulta: Consulta;
    onEditar: () => void;
    onConcluir: () => void;
    onExcluir: () => void;
}

export function ConsultaCard({ consulta, onEditar, onConcluir, onExcluir }: ConsultaCardProps) {
    const { cores, escuro } = useTheme();
    const agendada = consulta.status === 'agendada';
    const dataBr = isoParaDataBr(consulta.data);

    return (
        <View
            style={[
                estilos.card,
                { backgroundColor: cores.surface, borderColor: cores.borderLight },
                !escuro ? Sombra.card : null,
                escuro ? { borderWidth: 1 } : null,
            ]}
        >
            <View style={estilos.topo}>
                <View style={[estilos.dataBox, { backgroundColor: cores.primaryLight }]}>
                    <Text style={[estilos.dia, { color: cores.primary }]}>{dataBr.slice(0, 2) || '--'}</Text>
                    <Text style={[estilos.mes, { color: cores.primary }]}>{dataBr.slice(3, 5) || '--'}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={[estilos.motivo, { color: cores.text }]} numberOfLines={1}>{consulta.motivo}</Text>
                    <Text style={[estilos.pet, { color: cores.textSecondary }]} numberOfLines={1}>
                        {consulta.petNome || 'Pet'} · {consulta.horario}
                    </Text>
                    <Text style={[estilos.local, { color: cores.textTertiary }]} numberOfLines={1}>
                        {consulta.clinica} — {consulta.veterinario}
                    </Text>
                </View>

                <Badge texto={ROTULOS[consulta.status]} variante={VARIANTES[consulta.status]} />
            </View>

            <View style={[estilos.acoes, { borderTopColor: cores.borderLight }]}>
                {agendada && (
                    <TouchableOpacity style={estilos.acao} onPress={onConcluir} activeOpacity={0.7}>
                        <Ionicons name="checkmark-circle-outline" size={17} color={cores.success} />
                        <Text style={[estilos.acaoTexto, { color: cores.success }]}>Concluir</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={estilos.acao} onPress={onEditar} activeOpacity={0.7}>
                    <Ionicons name="create-outline" size={17} color={cores.primary} />
                    <Text style={[estilos.acaoTexto, { color: cores.primary }]}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={estilos.acao} onPress={onExcluir} activeOpacity={0.7}>
                    <Ionicons name="trash-outline" size={17} color={cores.danger} />
                    <Text style={[estilos.acaoTexto, { color: cores.danger }]}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    card: { borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm },
    topo: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
    dataBox: { width: 52, height: 56, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
    dia: { fontSize: Typography.h3, fontWeight: '800', lineHeight: 22 },
    mes: { fontSize: Typography.tiny, fontWeight: '700' },
    motivo: { fontSize: Typography.h4, fontWeight: '700' },
    pet: { fontSize: Typography.caption, marginTop: 2 },
    local: { fontSize: Typography.caption, marginTop: 1 },
    acoes: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1 },
    acao: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    acaoTexto: { fontSize: Typography.caption, fontWeight: '600' },
});