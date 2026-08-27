import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Badge, Carregando, ErroApi } from '../../components/ui';
import { CardAlertas } from '../../components/home/CardAlertas';
import { useResumoPets, usePets } from '../../hooks/usePets';
import { useProximasConsultas, useConsultas } from '../../hooks/useConsultas';
import { useAlertas } from '../../hooks/useAlertas';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { emojiDaRaca } from '../../constants/racas';
import { isoParaDataBr } from '../../utils/date';
import { Typography, Spacing, Radius } from '../../theme';
import { ROTAS } from '../../navigation/routes';
import type { TabScreenProps } from '../../navigation/types';
import type { NomeIcone } from '../../types';

function saudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
}

export default function HomeScreen({ navigation }: TabScreenProps<'Home'>) {
    const { usuario } = useAuth();
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    const { total, pets, isLoading: carregandoPets, isError: erroPets } = useResumoPets();
    const { proximas, totalAgendadas, isLoading: carregandoConsultas } = useProximasConsultas(3);
    const { alertas, total: totalAlertas, isLoading: carregandoAlertas } = useAlertas(3);

    const { refetch: recarregarPets, isRefetching: recarregandoPets } = usePets();
    const { refetch: recarregarConsultas } = useConsultas();

    function recarregarTudo() {
        void recarregarPets();
        void recarregarConsultas();
    }

    const atalhos: { icone: NomeIcone; rotulo: string; acao: () => void }[] = [
        { icone: 'add-circle-outline', rotulo: 'Novo pet', acao: () => navigation.navigate(ROTAS.PET_FORM, { modo: 'criar' }) },
        { icone: 'calendar-outline', rotulo: 'Agendar', acao: () => navigation.navigate(ROTAS.CONSULTA_FORM, { modo: 'criar' }) },
        { icone: 'paw-outline', rotulo: 'Meus pets', acao: () => navigation.navigate(ROTAS.PETS) },
        { icone: 'information-circle-outline', rotulo: 'Sobre', acao: () => navigation.navigate(ROTAS.SOBRE) },
    ];

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: cores.background }}
            contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={recarregandoPets} onRefresh={recarregarTudo} tintColor={cores.primary} />
            }
        >
            <LinearGradient
                colors={cores.gradiente}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[estilos.topo, { paddingTop: insets.top + Spacing.lg }]}
            >
                <Text style={estilos.saudacao}>{saudacao()},</Text>
                <Text style={estilos.nome}>{usuario?.nome ?? 'Tutor'}</Text>

                <View style={estilos.metricas}>
                    <View style={estilos.metrica}>
                        <Text style={estilos.metricaValor}>{carregandoPets ? '—' : total}</Text>
                        <Text style={estilos.metricaRotulo}>Pets</Text>
                    </View>
                    <View style={estilos.divisor} />
                    <View style={estilos.metrica}>
                        <Text style={estilos.metricaValor}>{carregandoConsultas ? '—' : totalAgendadas}</Text>
                        <Text style={estilos.metricaRotulo}>Agendadas</Text>
                    </View>
                    <View style={estilos.divisor} />
                    <View style={estilos.metrica}>
                        <Text style={estilos.metricaValor}>{carregandoConsultas ? '—' : proximas.length}</Text>
                        <Text style={estilos.metricaRotulo}>Próximas</Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={{ padding: Spacing.md, marginTop: -Spacing.lg }}>
                <CardAlertas
                    alertas={alertas}
                    total={totalAlertas}
                    carregando={carregandoAlertas}
                    onAbrirAlerta={(alerta) => {
                        // Tocar num alerta abre a ação que o resolve, não uma tela informativa.
                        if (alerta.consulta) {
                            navigation.navigate(ROTAS.CONSULTA_FORM, { modo: 'editar', consulta: alerta.consulta });
                        } else if (alerta.pet) {
                            navigation.navigate(ROTAS.CONSULTA_FORM, {
                                modo: 'criar',
                                petPreSelecionado: { id: alerta.pet.id, nome: alerta.pet.nome },
                            });
                        }
                    }}
                />

                <Card>
                    <Text style={[estilos.tituloSecao, { color: cores.text }]}>Acesso rápido</Text>
                    <View style={estilos.atalhos}>
                        {atalhos.map((atalho) => (
                            <TouchableOpacity key={atalho.rotulo} style={estilos.atalho} onPress={atalho.acao} activeOpacity={0.75}>
                                <View style={[estilos.atalhoIcone, { backgroundColor: cores.primaryLight }]}>
                                    <Ionicons name={atalho.icone} size={22} color={cores.primary} />
                                </View>
                                <Text style={[estilos.atalhoTexto, { color: cores.textSecondary }]} numberOfLines={1}>
                                    {atalho.rotulo}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>

                <Card>
                    <View style={estilos.cabecalhoSecao}>
                        <Text style={[estilos.tituloSecao, { color: cores.text }]}>Próximas consultas</Text>
                        <TouchableOpacity onPress={() => navigation.navigate(ROTAS.CONSULTAS)}>
                            <Text style={[estilos.link, { color: cores.primary }]}>Ver todas</Text>
                        </TouchableOpacity>
                    </View>

                    {carregandoConsultas ? (
                        <Carregando mensagem="Carregando agenda..." />
                    ) : proximas.length === 0 ? (
                        <Text style={[estilos.vazio, { color: cores.textSecondary }]}>
                            Nenhuma consulta agendada. Que tal marcar um check-up?
                        </Text>
                    ) : (
                        proximas.map((consulta) => (
                            <TouchableOpacity
                                key={consulta.id}
                                style={[estilos.linha, { borderTopColor: cores.borderLight }]}
                                onPress={() => navigation.navigate(ROTAS.CONSULTA_FORM, { modo: 'editar', consulta })}
                                activeOpacity={0.75}
                            >
                                <View style={[estilos.pontoData, { backgroundColor: cores.primaryLight }]}>
                                    <Text style={[estilos.pontoTexto, { color: cores.primary }]}>
                                        {isoParaDataBr(consulta.data).slice(0, 5)}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[estilos.linhaTitulo, { color: cores.text }]} numberOfLines={1}>
                                        {consulta.motivo}
                                    </Text>
                                    <Text style={[estilos.linhaSub, { color: cores.textSecondary }]} numberOfLines={1}>
                                        {consulta.petNome} · {consulta.horario} · {consulta.clinica}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={cores.textTertiary} />
                            </TouchableOpacity>
                        ))
                    )}
                </Card>

                <Card>
                    <View style={estilos.cabecalhoSecao}>
                        <Text style={[estilos.tituloSecao, { color: cores.text }]}>Seus pets</Text>
                        <TouchableOpacity onPress={() => navigation.navigate(ROTAS.PETS)}>
                            <Text style={[estilos.link, { color: cores.primary }]}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>

                    {carregandoPets ? (
                        <Carregando mensagem="Carregando pets..." />
                    ) : erroPets ? (
                        <ErroApi
                            mensagem="Não conseguimos carregar seus pets."
                            onTentarNovamente={() => void recarregarPets()}
                        />
                    ) : pets.length === 0 ? (
                        <Text style={[estilos.vazio, { color: cores.textSecondary }]}>
                            Cadastre seu primeiro pet para começar.
                        </Text>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
                            {pets.map((pet) => (
                                <TouchableOpacity
                                    key={pet.id}
                                    activeOpacity={0.85}
                                    onPress={() => navigation.navigate(ROTAS.PET_DETALHE, { petId: pet.id })}
                                    style={[estilos.petMini, { backgroundColor: cores.surfaceAlt, borderColor: cores.borderLight }]}
                                >
                                    <Text style={estilos.petEmoji}>{emojiDaRaca(pet.raca, pet.especie)}</Text>
                                    <Text style={[estilos.petNome, { color: cores.text }]} numberOfLines={1}>{pet.nome}</Text>
                                    <Badge texto={pet.especie} variante="primary" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </Card>
            </View>
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    topo: {
        paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl,
        borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl,
    },
    saudacao: { fontSize: Typography.body, color: 'rgba(255,255,255,0.9)' },
    nome: { fontSize: Typography.h1, fontWeight: '800', color: '#FFFFFF' },
    metricas: {
        flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg,
        backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: Radius.md, paddingVertical: Spacing.md,
    },
    metrica: { flex: 1, alignItems: 'center' },
    metricaValor: { fontSize: Typography.h2, fontWeight: '800', color: '#FFFFFF' },
    metricaRotulo: { fontSize: Typography.tiny, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
    divisor: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)' },
    tituloSecao: { fontSize: Typography.h3, fontWeight: '700' },
    cabecalhoSecao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
    link: { fontSize: Typography.caption, fontWeight: '700' },
    vazio: { fontSize: Typography.bodySmall, paddingVertical: Spacing.sm, lineHeight: 20 },
    atalhos: { flexDirection: 'row', marginTop: Spacing.md },
    atalho: { flex: 1, alignItems: 'center', gap: 6 },
    atalhoIcone: { width: 48, height: 48, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    atalhoTexto: { fontSize: Typography.tiny, fontWeight: '600' },
    linha: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, borderTopWidth: 1 },
    pontoData: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: Radius.xs },
    pontoTexto: { fontSize: Typography.caption, fontWeight: '800' },
    linhaTitulo: { fontSize: Typography.bodySmall, fontWeight: '600' },
    linhaSub: { fontSize: Typography.caption, marginTop: 2 },
    petMini: { width: 108, padding: Spacing.sm, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', gap: 4 },
    petEmoji: { fontSize: 28 },
    petNome: { fontSize: Typography.bodySmall, fontWeight: '700' },
});