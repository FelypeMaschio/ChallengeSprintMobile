import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, CabecalhoTela, Badge } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { ENV } from '../../config/env';
import { Typography, Spacing, Radius, type Cores } from '../../theme';
import type { AppScreenProps } from '../../navigation/types';

const INTEGRANTES = [
    { rm: '562156', nome: 'Pedro Henrique dos Santos Costa' },
    { rm: '565269', nome: 'Eduardo Augusto de Oliveira Souza' },
    { rm: '564673', nome: 'Fellipe Costa de Oliveira' },
    { rm: '563009', nome: 'Felype Ferreira Maschio' },
    { rm: '563304', nome: 'Gustavo Vieira de Matos' },
];

const TECNOLOGIAS = [
    'React Native', 'TypeScript', 'Expo', 'React Navigation',
    'TanStack Query', 'Axios', 'Firebase Auth', 'Context API',
];

export default function SobreScreen({ navigation }: AppScreenProps<'Sobre'>) {
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: cores.background }}>
            <CabecalhoTela titulo="Sobre o app" onVoltar={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={{ padding: Spacing.md, paddingBottom: insets.bottom + Spacing.xxl }}
                showsVerticalScrollIndicator={false}
            >
                <Card>
                    <View style={estilos.identidade}>
                        <View style={[estilos.logo, { backgroundColor: cores.primaryLight }]}>
                            <Ionicons name="paw" size={30} color={cores.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[estilos.marca, { color: cores.text }]}>Clyvo Vet</Text>
                            <Text style={[estilos.slogan, { color: cores.textSecondary }]}>
                                Jornada contínua de cuidado do pet
                            </Text>
                        </View>
                    </View>

                    <View style={[estilos.versoes, { borderTopColor: cores.borderLight }]}>
                        <Linha rotulo="Versão" valor={ENV.APP_VERSION} cores={cores} />
                        <Linha rotulo="Entrega" valor={ENV.SPRINT} cores={cores} />
                        <Linha rotulo="Commit" valor={ENV.COMMIT_HASH} cores={cores} />
                    </View>
                </Card>

                <Card>
                    <Text style={[estilos.tituloSecao, { color: cores.text }]}>O problema</Text>
                    <Text style={[estilos.texto, { color: cores.textSecondary }]}>
                        Tutores perdem o histórico de saúde dos seus pets em papéis, mensagens e memória.
                        Vacinas atrasam, retornos são esquecidos e cada clínica guarda um pedaço da informação.
                        O Clyvo Vet centraliza pets, consultas e histórico em um só lugar e avisa o tutor
                        antes que o cuidado atrase.
                    </Text>
                </Card>

                <Card>
                    <Text style={[estilos.tituloSecao, { color: cores.text }]}>Tecnologias</Text>
                    <View style={estilos.tags}>
                        {TECNOLOGIAS.map((tecnologia) => (
                            <Badge key={tecnologia} texto={tecnologia} variante="primary" />
                        ))}
                    </View>
                </Card>

                <Card>
                    <Text style={[estilos.tituloSecao, { color: cores.text }]}>Equipe</Text>
                    {INTEGRANTES.map((integrante) => (
                        <View key={integrante.rm} style={[estilos.integrante, { borderTopColor: cores.borderLight }]}>
                            <View style={[estilos.rm, { backgroundColor: cores.primaryLight }]}>
                                <Text style={[estilos.rmTexto, { color: cores.primary }]}>{integrante.rm}</Text>
                            </View>
                            <Text style={[estilos.integranteNome, { color: cores.text }]} numberOfLines={1}>
                                {integrante.nome}
                            </Text>
                        </View>
                    ))}
                </Card>
            </ScrollView>
        </View>
    );
}

function Linha({ rotulo, valor, cores }: { rotulo: string; valor: string; cores: Cores }) {
    return (
        <View style={estilos.linha}>
            <Text style={[estilos.linhaRotulo, { color: cores.textSecondary }]}>{rotulo}</Text>
            <Text style={[estilos.linhaValor, { color: cores.text }]}>{valor}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    identidade: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    logo: { width: 58, height: 58, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    marca: { fontSize: Typography.h2, fontWeight: '800' },
    slogan: { fontSize: Typography.caption, marginTop: 2 },
    versoes: { marginTop: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1 },
    linha: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    linhaRotulo: { fontSize: Typography.bodySmall },
    linhaValor: { fontSize: Typography.bodySmall, fontWeight: '700' },
    tituloSecao: { fontSize: Typography.h3, fontWeight: '700', marginBottom: Spacing.sm },
    texto: { fontSize: Typography.bodySmall, lineHeight: 21 },
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    integrante: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, borderTopWidth: 1 },
    rm: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: Radius.xs },
    rmTexto: { fontSize: Typography.caption, fontWeight: '800' },
    integranteNome: { fontSize: Typography.bodySmall, fontWeight: '500', flex: 1 },
});