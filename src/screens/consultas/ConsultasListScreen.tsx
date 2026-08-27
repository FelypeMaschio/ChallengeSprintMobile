import React, { useMemo, useState } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CabecalhoTela, Carregando, ErroApi, EstadoVazio, SeletorOpcoes } from '../../components/ui';
import { ConsultaCard } from '../../components/consultas/ConsultaCard';
import { useConsultas, useAlterarStatusConsulta, useRemoverConsulta } from '../../hooks/useConsultas';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Radius } from '../../theme';
import { ROTAS } from '../../navigation/routes';
import type { TabScreenProps } from '../../navigation/types';
import type { Consulta, Opcao, StatusConsulta } from '../../types';

type Filtro = StatusConsulta | 'todas';

const FILTROS: Opcao[] = [
    { id: 'todas', nome: 'Todas' },
    { id: 'agendada', nome: 'Agendadas' },
    { id: 'concluida', nome: 'Concluídas' },
    { id: 'cancelada', nome: 'Canceladas' },
];

export default function ConsultasListScreen({ navigation }: TabScreenProps<'Consultas'>) {
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();
    const [filtro, setFiltro] = useState<Filtro>('todas');

    const { data: consultas = [], isLoading, isError, error, refetch, isRefetching } = useConsultas();
    const alterarStatus = useAlterarStatusConsulta();
    const removerConsulta = useRemoverConsulta();

    const visiveis = useMemo(
        () => (filtro === 'todas' ? consultas : consultas.filter((c) => c.status === filtro)),
        [consultas, filtro],
    );

    function concluir(consulta: Consulta) {
        alterarStatus.mutate(
            { consulta, novoStatus: 'concluida' },
            { onError: (erro) => Alert.alert('Erro', erro.message) },
        );
    }

    function excluir(consulta: Consulta) {
        Alert.alert('Excluir consulta', `Excluir a consulta "${consulta.motivo}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: () =>
                    removerConsulta.mutate(consulta.id, { onError: (erro) => Alert.alert('Erro', erro.message) }),
            },
        ]);
    }

    function conteudoVazio() {
        if (isLoading) return <Carregando mensagem="Carregando consultas..." />;
        if (isError) return <ErroApi mensagem={error?.message} onTentarNovamente={() => void refetch()} />;

        return (
            <EstadoVazio
                icone="calendar-outline"
                titulo={filtro === 'todas' ? 'Nenhuma consulta ainda' : 'Nada neste filtro'}
                descricao={
                    filtro === 'todas'
                        ? 'Agende a primeira consulta e acompanhe tudo por aqui.'
                        : 'Tente outro filtro para ver mais consultas.'
                }
                textoAcao={filtro === 'todas' ? 'Agendar consulta' : undefined}
                onAcao={() => navigation.navigate(ROTAS.CONSULTA_FORM, { modo: 'criar' })}
            />
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: cores.background }}>
            <CabecalhoTela
                titulo="Consultas"
                subtitulo={`${consultas.length} registro(s)`}
                acaoDireita={
                    <TouchableOpacity
                        onPress={() => navigation.navigate(ROTAS.CONSULTA_FORM, { modo: 'criar' })}
                        style={[estilos.botaoAdicionar, { backgroundColor: cores.primary }]}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="add" size={22} color={cores.textInverse} />
                    </TouchableOpacity>
                }
            />

            <View style={{ paddingHorizontal: Spacing.md, paddingTop: Spacing.md }}>
                <SeletorOpcoes<Filtro> opcoes={FILTROS} valor={filtro} onSelecionar={setFiltro} />
            </View>

            <FlatList
                data={visiveis}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingHorizontal: Spacing.md, paddingBottom: insets.bottom + Spacing.xxl }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={conteudoVazio()}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching && !isLoading}
                        onRefresh={() => void refetch()}
                        tintColor={cores.primary}
                    />
                }
                renderItem={({ item }) => (
                    <ConsultaCard
                        consulta={item}
                        onConcluir={() => concluir(item)}
                        onEditar={() => navigation.navigate(ROTAS.CONSULTA_FORM, { modo: 'editar', consulta: item })}
                        onExcluir={() => excluir(item)}
                    />
                )}
            />
        </View>
    );
}

const estilos = StyleSheet.create({
    botaoAdicionar: { width: 40, height: 40, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
});