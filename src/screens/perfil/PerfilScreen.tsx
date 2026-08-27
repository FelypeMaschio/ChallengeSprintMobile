import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Button, CabecalhoTela } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useResumoPets } from '../../hooks/usePets';
import { useConsultas } from '../../hooks/useConsultas';
import { Typography, Spacing, Radius } from '../../theme';
import { ROTAS } from '../../navigation/routes';
import type { TabScreenProps } from '../../navigation/types';

export default function PerfilScreen({ navigation }: TabScreenProps<'Perfil'>) {
    const { usuario, sair, processando } = useAuth();
    const { cores, escuro, alternarTema } = useTheme();
    const insets = useSafeAreaInsets();

    const { total: totalPets } = useResumoPets();
    const { data: consultas = [] } = useConsultas();

    function confirmarLogout() {
        Alert.alert('Sair da conta', 'Você precisará entrar novamente para acessar seus dados.', [
            { text: 'Cancelar', style: 'cancel' },
            // Ao sair, o RootNavigator desmonta o stack protegido automaticamente.
            { text: 'Sair', style: 'destructive', onPress: () => void sair() },
        ]);
    }

    const iniciais = (usuario?.nome ?? 'T')
        .split(' ')
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase();

    return (
        <View style={{ flex: 1, backgroundColor: cores.background }}>
            <CabecalhoTela titulo="Perfil" subtitulo="Sua conta e preferências" />

            <ScrollView
                contentContainerStyle={{ padding: Spacing.md, paddingBottom: insets.bottom + Spacing.xxl }}
                showsVerticalScrollIndicator={false}
            >
                <Card>
                    <View style={estilos.identidade}>
                        <View style={[estilos.avatar, { backgroundColor: cores.primary }]}>
                            <Text style={estilos.iniciais}>{iniciais}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[estilos.nome, { color: cores.text }]} numberOfLines={1}>{usuario?.nome}</Text>
                            <Text style={[estilos.email, { color: cores.textSecondary }]} numberOfLines={1}>
                                {usuario?.email}
                            </Text>
                        </View>
                    </View>

                    <View style={[estilos.estatisticas, { borderTopColor: cores.borderLight }]}>
                        <View style={estilos.estatistica}>
                            <Text style={[estilos.estatisticaValor, { color: cores.primary }]}>{totalPets}</Text>
                            <Text style={[estilos.estatisticaRotulo, { color: cores.textSecondary }]}>Pets</Text>
                        </View>
                        <View style={estilos.estatistica}>
                            <Text style={[estilos.estatisticaValor, { color: cores.primary }]}>{consultas.length}</Text>
                            <Text style={[estilos.estatisticaRotulo, { color: cores.textSecondary }]}>Consultas</Text>
                        </View>
                        <View style={estilos.estatistica}>
                            <Text style={[estilos.estatisticaValor, { color: cores.primary }]}>
                                {consultas.filter((c) => c.status === 'concluida').length}
                            </Text>
                            <Text style={[estilos.estatisticaRotulo, { color: cores.textSecondary }]}>Concluídas</Text>
                        </View>
                    </View>
                </Card>

                <Card>
                    <Text style={[estilos.tituloSecao, { color: cores.text }]}>Preferências</Text>

                    <View style={estilos.opcao}>
                        <View style={estilos.opcaoEsquerda}>
                            <View style={[estilos.opcaoIcone, { backgroundColor: cores.primaryLight }]}>
                                <Ionicons name={escuro ? 'moon' : 'sunny'} size={18} color={cores.primary} />
                            </View>
                            <View>
                                <Text style={[estilos.opcaoTitulo, { color: cores.text }]}>Tema escuro</Text>
                                <Text style={[estilos.opcaoSub, { color: cores.textSecondary }]}>
                                    {escuro ? 'Ativado' : 'Desativado'}
                                </Text>
                            </View>
                        </View>

                        <Switch
                            value={escuro}
                            onValueChange={() => void alternarTema()}
                            trackColor={{ false: cores.border, true: cores.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <TouchableOpacity
                        style={[estilos.opcao, { borderTopColor: cores.borderLight, borderTopWidth: 1 }]}
                        onPress={() => navigation.navigate(ROTAS.SOBRE)}
                        activeOpacity={0.75}
                    >
                        <View style={estilos.opcaoEsquerda}>
                            <View style={[estilos.opcaoIcone, { backgroundColor: cores.infoLight }]}>
                                <Ionicons name="information-circle-outline" size={18} color={cores.info} />
                            </View>
                            <View>
                                <Text style={[estilos.opcaoTitulo, { color: cores.text }]}>Sobre o app</Text>
                                <Text style={[estilos.opcaoSub, { color: cores.textSecondary }]}>
                                    Versão, equipe e tecnologias
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={cores.textTertiary} />
                    </TouchableOpacity>
                </Card>

                <Button
                    titulo="Sair da conta"
                    variante="perigo"
                    onPress={confirmarLogout}
                    carregando={processando}
                    style={{ marginTop: Spacing.sm }}
                />
            </ScrollView>
        </View>
    );
}

const estilos = StyleSheet.create({
    identidade: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    avatar: { width: 62, height: 62, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    iniciais: { color: '#FFFFFF', fontSize: Typography.h2, fontWeight: '800' },
    nome: { fontSize: Typography.h3, fontWeight: '700' },
    email: { fontSize: Typography.bodySmall, marginTop: 2 },
    estatisticas: { flexDirection: 'row', marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1 },
    estatistica: { flex: 1, alignItems: 'center' },
    estatisticaValor: { fontSize: Typography.h2, fontWeight: '800' },
    estatisticaRotulo: { fontSize: Typography.caption, marginTop: 2 },
    tituloSecao: { fontSize: Typography.h3, fontWeight: '700', marginBottom: Spacing.sm },
    opcao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md },
    opcaoEsquerda: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
    opcaoIcone: { width: 38, height: 38, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    opcaoTitulo: { fontSize: Typography.body, fontWeight: '600' },
    opcaoSub: { fontSize: Typography.caption, marginTop: 1 },
});