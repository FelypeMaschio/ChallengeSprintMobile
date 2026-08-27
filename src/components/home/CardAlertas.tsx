import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Carregando } from '../ui';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import type { Cores } from '../../theme';
import type { Alerta } from '../../types';

const CORES_POR_PRIORIDADE: Record<0 | 1 | 2, { fundo: keyof Cores; texto: keyof Cores }> = {
    0: { fundo: 'dangerLight', texto: 'danger' },
    1: { fundo: 'warningLight', texto: 'warning' },
    2: { fundo: 'infoLight', texto: 'info' },
};

interface CardAlertasProps {
    alertas: Alerta[];
    total: number;
    carregando: boolean;
    onAbrirAlerta: (alerta: Alerta) => void;
}

export function CardAlertas({ alertas, total, carregando, onAbrirAlerta }: CardAlertasProps) {
    const { cores } = useTheme();

    if (carregando) {
        return (
            <Card>
                <Carregando mensagem="Verificando o cuidado dos seus pets..." />
            </Card>
        );
    }

    // Nada pendente também é informação: o tutor precisa saber que está em dia.
    if (total === 0) {
        return (
            <Card>
                <View style={estilos.emDia}>
                    <View style={[estilos.icone, { backgroundColor: cores.successLight }]}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={cores.success} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[estilos.titulo, { color: cores.text }]}>Tudo em dia</Text>
                        <Text style={[estilos.detalhe, { color: cores.textSecondary }]}>
                            Nenhum pet precisa de atenção no momento.
                        </Text>
                    </View>
                </View>
            </Card>
        );
    }

    return (
        <Card>
            <View style={estilos.cabecalho}>
                <Text style={[estilos.tituloSecao, { color: cores.text }]}>Precisa de atenção</Text>
                <View style={[estilos.contador, { backgroundColor: cores.dangerLight }]}>
                    <Text style={[estilos.contadorTexto, { color: cores.danger }]}>{total}</Text>
                </View>
            </View>

            {alertas.map((alerta) => {
                const paleta = CORES_POR_PRIORIDADE[alerta.prioridade];
                const corFundo = cores[paleta.fundo] as string;
                const corTexto = cores[paleta.texto] as string;

                return (
                    <TouchableOpacity
                        key={alerta.id}
                        activeOpacity={0.75}
                        onPress={() => onAbrirAlerta(alerta)}
                        style={[estilos.linha, { borderTopColor: cores.borderLight }]}
                    >
                        <View style={[estilos.icone, { backgroundColor: corFundo }]}>
                            <Ionicons name={alerta.icone} size={18} color={corTexto} />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={[estilos.titulo, { color: cores.text }]} numberOfLines={1}>
                                {alerta.titulo}
                            </Text>
                            <Text style={[estilos.detalhe, { color: cores.textSecondary }]} numberOfLines={2}>
                                {alerta.detalhe}
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward" size={18} color={cores.textTertiary} />
                    </TouchableOpacity>
                );
            })}
        </Card>
    );
}

const estilos = StyleSheet.create({
    cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
    tituloSecao: { fontSize: Typography.h3, fontWeight: '700' },
    contador: { minWidth: 24, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full, alignItems: 'center' },
    contadorTexto: { fontSize: Typography.caption, fontWeight: '800' },
    linha: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, borderTopWidth: 1 },
    emDia: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    icone: { width: 38, height: 38, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    titulo: { fontSize: Typography.bodySmall, fontWeight: '700' },
    detalhe: { fontSize: Typography.caption, marginTop: 2, lineHeight: 17 },
});