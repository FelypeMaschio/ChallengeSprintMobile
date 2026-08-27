import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Badge, Carregando, ErroApi, type VarianteBadge } from '../../components/ui';
import { usePet, useRemoverPet } from '../../hooks/usePets';
import { useConsultasDoPet } from '../../hooks/useConsultas';
import { useTheme } from '../../contexts/ThemeContext';
import { emojiDaRaca } from '../../constants/racas';
import { calcularIdade, isoParaDataBr } from '../../utils/date';
import { Typography, Spacing, Radius } from '../../theme';
import { ROTAS } from '../../navigation/routes';
import type { AppScreenProps } from '../../navigation/types';
import type { NomeIcone, StatusConsulta } from '../../types';

const VARIANTE_STATUS: Record<StatusConsulta, VarianteBadge> = {
    agendada: 'info', concluida: 'success', cancelada: 'danger',
};

export default function PetDetalheScreen({ navigation, route }: AppScreenProps<'PetDetalhe'>) {
    const { petId } = route.params;
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    const { data: pet, isLoading, isError, error, refetch } = usePet(petId);
    const { data: consultas = [] } = useConsultasDoPet(petId);
    const removerPet = useRemoverPet();

    function confirmarExclusao() {
        if (!pet) return;

        Alert.alert(
            'Excluir pet',
            `Tem certeza que deseja excluir ${pet.nome}? Esta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () =>
                        removerPet.mutate(petId, {
                            onSuccess: () => navigation.goBack(),
                            onError: (erro) => Alert.alert('Erro ao excluir', erro.message),
                        }),
                },
            ],
        );
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: cores.background, justifyContent: 'center' }}>
                <Carregando mensagem="Carregando pet..." />
            </View>
        );
    }

    if (isError || !pet) {
        return (
            <View style={{ flex: 1, backgroundColor: cores.background, justifyContent: 'center' }}>
                <ErroApi mensagem={error?.message} onTentarNovamente={() => void refetch()} />
            </View>
        );
    }

    const infos: { icone: NomeIcone; rotulo: string; valor: string }[] = [
        { icone: 'calendar-outline', rotulo: 'Idade', valor: calcularIdade(pet.dataNascimento) },
        { icone: 'barbell-outline', rotulo: 'Peso', valor: `${pet.peso} kg` },
        { icone: 'male-female-outline', rotulo: 'Sexo', valor: pet.sexo || '—' },
        { icone: 'gift-outline', rotulo: 'Nascimento', valor: isoParaDataBr(pet.dataNascimento) },
    ];

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: cores.background }}
            contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
            showsVerticalScrollIndicator={false}
        >
            <LinearGradient
                colors={cores.gradiente}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[estilos.topo, { paddingTop: insets.top + Spacing.sm }]}
            >
                <View style={estilos.barraTopo}>
                    <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
                        <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate(ROTAS.PET_FORM, { modo: 'editar', pet })}
                        hitSlop={12}
                    >
                        <Ionicons name="create-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <View style={estilos.avatar}>
                    {pet.foto ? (
                        <Image source={{ uri: pet.foto }} style={estilos.imagem} />
                    ) : (
                        <Text style={estilos.emoji}>{emojiDaRaca(pet.raca, pet.especie)}</Text>
                    )}
                </View>

                <Text style={estilos.nome}>{pet.nome}</Text>
                <Text style={estilos.raca}>{pet.raca}</Text>

                {pet.castrado && (
                    <View style={estilos.selo}>
                        <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
                        <Text style={estilos.seloTexto}>Castrado</Text>
                    </View>
                )}
            </LinearGradient>

            <View style={{ padding: Spacing.md, marginTop: -Spacing.lg }}>
                <Card>
                    <View style={estilos.grade}>
                        {infos.map((info) => (
                            <View key={info.rotulo} style={estilos.item}>
                                <Ionicons name={info.icone} size={18} color={cores.primary} />
                                <Text style={[estilos.itemRotulo, { color: cores.textSecondary }]}>{info.rotulo}</Text>
                                <Text style={[estilos.itemValor, { color: cores.text }]}>{info.valor}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {!!pet.observacoes && (
                    <Card>
                        <Text style={[estilos.tituloSecao, { color: cores.text }]}>Observações</Text>
                        <Text style={[estilos.observacoes, { color: cores.textSecondary }]}>{pet.observacoes}</Text>
                    </Card>
                )}

                <Card>
                    <View style={estilos.cabecalhoSecao}>
                        <Text style={[estilos.tituloSecao, { color: cores.text }]}>Consultas</Text>
                        <Badge texto={String(consultas.length)} variante="primary" />
                    </View>

                    {consultas.length === 0 ? (
                        <Text style={[estilos.vazio, { color: cores.textSecondary }]}>
                            Nenhuma consulta registrada para {pet.nome}.
                        </Text>
                    ) : (
                        consultas.slice(0, 4).map((consulta) => (
                            <View key={consulta.id} style={[estilos.linhaConsulta, { borderTopColor: cores.borderLight }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[estilos.motivo, { color: cores.text }]} numberOfLines={1}>
                                        {consulta.motivo}
                                    </Text>
                                    <Text style={[estilos.detalhe, { color: cores.textSecondary }]}>
                                        {isoParaDataBr(consulta.data)} · {consulta.horario} · {consulta.clinica}
                                    </Text>
                                </View>
                                <Badge texto={consulta.status} variante={VARIANTE_STATUS[consulta.status]} />
                            </View>
                        ))
                    )}

                    <Button
                        titulo="Agendar consulta"
                        variante="secundario"
                        tamanho="sm"
                        onPress={() =>
                            navigation.navigate(ROTAS.CONSULTA_FORM, {
                                modo: 'criar',
                                petPreSelecionado: { id: pet.id, nome: pet.nome },
                            })
                        }
                        style={{ marginTop: Spacing.md }}
                    />
                </Card>

                <Button
                    titulo="Excluir pet"
                    variante="perigo"
                    onPress={confirmarExclusao}
                    carregando={removerPet.isPending}
                    style={{ marginTop: Spacing.md }}
                />
            </View>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    topo: {
        alignItems: 'center', paddingBottom: Spacing.xl, paddingHorizontal: Spacing.md,
        borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl,
    },
    barraTopo: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
    avatar: {
        width: 108, height: 108, borderRadius: Radius.full,
        backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', borderWidth: 3, borderColor: 'rgba(255,255,255,0.55)',
    },
    imagem: { width: '100%', height: '100%' },
    emoji: { fontSize: 46 },
    nome: { fontSize: Typography.h1, fontWeight: '800', color: '#FFFFFF', marginTop: Spacing.sm },
    raca: { fontSize: Typography.bodySmall, color: 'rgba(255,255,255,0.9)' },
    selo: {
        flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8,
        backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full,
    },
    seloTexto: { color: '#FFFFFF', fontSize: Typography.tiny, fontWeight: '700' },
    grade: { flexDirection: 'row', flexWrap: 'wrap' },
    item: { width: '50%', paddingVertical: Spacing.sm },
    itemRotulo: { fontSize: Typography.caption, marginTop: 4 },
    itemValor: { fontSize: Typography.body, fontWeight: '700', marginTop: 1 },
    cabecalhoSecao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
    tituloSecao: { fontSize: Typography.h3, fontWeight: '700' },
    observacoes: { fontSize: Typography.bodySmall, lineHeight: 21, marginTop: 4 },
    vazio: { fontSize: Typography.bodySmall, paddingVertical: Spacing.sm },
    linhaConsulta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, borderTopWidth: 1 },
    motivo: { fontSize: Typography.bodySmall, fontWeight: '600' },
    detalhe: { fontSize: Typography.caption, marginTop: 2 },
});