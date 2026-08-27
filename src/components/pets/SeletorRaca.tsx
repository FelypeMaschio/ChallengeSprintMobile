import React, { useMemo, useState } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import { racasPorEspecie } from '../../constants/racas';
import type { EspecieId, Raca } from '../../types';

interface SeletorRacaProps {
    especie: EspecieId;
    valor: string;
    onSelecionar: (nome: string) => void;
    erro?: string;
}

/** Campo que abre um modal com busca e cards de raça. */
export function SeletorRaca({ especie, valor, onSelecionar, erro }: SeletorRacaProps) {
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    const [aberto, setAberto] = useState(false);
    const [busca, setBusca] = useState('');

    const lista = useMemo<Raca[]>(() => {
        const todas = racasPorEspecie(especie);
        const termo = busca.trim().toLowerCase();
        if (!termo) return todas;
        return todas.filter((r) => r.nome.toLowerCase().includes(termo));
    }, [especie, busca]);

    function selecionar(raca: Raca) {
        onSelecionar(raca.nome);
        setBusca('');
        setAberto(false);
    }

    return (
        <View style={{ marginBottom: Spacing.md }}>
            <Text style={[estilos.label, { color: cores.text }]}>Raça</Text>

            <TouchableOpacity
                onPress={() => setAberto(true)}
                activeOpacity={0.8}
                style={[
                    estilos.campo,
                    { backgroundColor: cores.surfaceAlt, borderColor: erro ? cores.danger : cores.border },
                ]}
            >
                <Text style={[estilos.campoTexto, { color: valor ? cores.text : cores.textTertiary }]}>
                    {valor || 'Escolha a raça mais parecida com o seu pet'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={cores.textTertiary} />
            </TouchableOpacity>

            {!!erro && <Text style={[estilos.erro, { color: cores.danger }]}>{erro}</Text>}

            <Modal visible={aberto} animationType="slide" onRequestClose={() => setAberto(false)}>
                <View style={{ flex: 1, backgroundColor: cores.background, paddingTop: insets.top }}>
                    <View style={[estilos.cabecalho, { borderBottomColor: cores.borderLight }]}>
                        <TouchableOpacity onPress={() => setAberto(false)} hitSlop={12}>
                            <Ionicons name="close" size={26} color={cores.text} />
                        </TouchableOpacity>
                        <Text style={[estilos.tituloModal, { color: cores.text }]}>Escolha a raça</Text>
                        <View style={{ width: 26 }} />
                    </View>

                    <View style={[estilos.busca, { backgroundColor: cores.surfaceAlt, borderColor: cores.border }]}>
                        <Ionicons name="search" size={18} color={cores.textTertiary} />
                        <TextInput
                            style={[estilos.buscaInput, { color: cores.text }]}
                            value={busca}
                            onChangeText={setBusca}
                            placeholder="Buscar raça..."
                            placeholderTextColor={cores.textTertiary}
                            autoCorrect={false}
                        />
                        {!!busca && (
                            <TouchableOpacity onPress={() => setBusca('')} hitSlop={10}>
                                <Ionicons name="close-circle" size={18} color={cores.textTertiary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={lista}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ gap: Spacing.sm }}
                        contentContainerStyle={{
                            padding: Spacing.md, gap: Spacing.sm, paddingBottom: insets.bottom + Spacing.lg,
                        }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Text style={[estilos.vazio, { color: cores.textSecondary }]}>
                                Nenhuma raça encontrada. Selecione &quot;Outra raça&quot;.
                            </Text>
                        }
                        renderItem={({ item }) => {
                            const ativo = item.nome === valor;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => selecionar(item)}
                                    style={[
                                        estilos.cardRaca,
                                        {
                                            backgroundColor: ativo ? cores.primaryLight : cores.surface,
                                            borderColor: ativo ? cores.primary : cores.borderLight,
                                        },
                                    ]}
                                >
                                    <Text style={estilos.emoji}>{item.emoji}</Text>
                                    <Text style={[estilos.nomeRaca, { color: cores.text }]} numberOfLines={2}>
                                        {item.nome}
                                    </Text>
                                    <Text style={[estilos.tracoRaca, { color: cores.textSecondary }]} numberOfLines={2}>
                                        {item.traco}
                                    </Text>
                                    <View style={[estilos.porte, { backgroundColor: cores.borderLight }]}>
                                        <Text style={[estilos.porteTexto, { color: cores.textSecondary }]}>
                                            Porte {item.porte}
                                        </Text>
                                    </View>
                                    {ativo && (
                                        <Ionicons name="checkmark-circle" size={20} color={cores.primary} style={estilos.check} />
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
}

const estilos = StyleSheet.create({
    label: { fontSize: Typography.bodySmall, fontWeight: '600', marginBottom: 6 },
    campo: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 50, paddingHorizontal: Spacing.md, borderRadius: Radius.sm, borderWidth: 1.5,
    },
    campoTexto: { fontSize: Typography.body, flex: 1 },
    erro: { fontSize: Typography.caption, marginTop: 4 },
    cabecalho: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1,
    },
    tituloModal: { fontSize: Typography.h3, fontWeight: '800' },
    busca: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        margin: Spacing.md, marginBottom: 0, paddingHorizontal: Spacing.md,
        height: 46, borderRadius: Radius.sm, borderWidth: 1.5,
    },
    buscaInput: { flex: 1, fontSize: Typography.body },
    cardRaca: { flex: 1, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, minHeight: 148 },
    emoji: { fontSize: 30 },
    nomeRaca: { fontSize: Typography.bodySmall, fontWeight: '700', marginTop: 6 },
    tracoRaca: { fontSize: Typography.caption, marginTop: 2, lineHeight: 16 },
    porte: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
    porteTexto: { fontSize: Typography.tiny, fontWeight: '600' },
    check: { position: 'absolute', top: 10, right: 10 },
    vazio: { textAlign: 'center', paddingVertical: Spacing.xl, fontSize: Typography.bodySmall },
});