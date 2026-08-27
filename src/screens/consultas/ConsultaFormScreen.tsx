import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, CabecalhoTela, SeletorOpcoes, Carregando } from '../../components/ui';
import { useCriarConsulta, useAtualizarConsulta } from '../../hooks/useConsultas';
import { usePets, ErroValidacao } from '../../hooks/usePets';
import { useTheme } from '../../contexts/ThemeContext';
import { mascaraData, mascaraHora, isoParaDataBr } from '../../utils/date';
import { emojiDaRaca } from '../../constants/racas';
import { Typography, Spacing } from '../../theme';
import type { AppScreenProps } from '../../navigation/types';
import type { ConsultaFormulario, Erros, Opcao, StatusConsulta } from '../../types';

const STATUS: Opcao[] = [
    { id: 'agendada', nome: 'Agendada' },
    { id: 'concluida', nome: 'Concluída' },
    { id: 'cancelada', nome: 'Cancelada' },
];

export default function ConsultaFormScreen({ navigation, route }: AppScreenProps<'ConsultaForm'>) {
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    const { modo, consulta: consultaExistente, petPreSelecionado } = route.params;
    const editando = modo === 'editar' && !!consultaExistente;

    const { data: pets = [], isLoading: carregandoPets } = usePets();

    const [form, setForm] = useState<ConsultaFormulario>(
        editando
            ? {
                petId: consultaExistente.petId,
                petNome: consultaExistente.petNome,
                data: isoParaDataBr(consultaExistente.data),
                horario: consultaExistente.horario,
                clinica: consultaExistente.clinica,
                veterinario: consultaExistente.veterinario,
                motivo: consultaExistente.motivo,
                status: consultaExistente.status,
                observacoes: consultaExistente.observacoes,
            }
            : {
                petId: petPreSelecionado?.id ?? '',
                petNome: petPreSelecionado?.nome ?? '',
                data: '', horario: '', clinica: '', veterinario: '',
                motivo: '', status: 'agendada', observacoes: '',
            },
    );
    const [erros, setErros] = useState<Erros>({});

    const criarConsulta = useCriarConsulta();
    const atualizarConsulta = useAtualizarConsulta();
    const salvando = criarConsulta.isPending || atualizarConsulta.isPending;

    function alterar<K extends keyof ConsultaFormulario>(campo: K, valor: ConsultaFormulario[K]) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
        if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
    }

    function selecionarPet(id: string) {
        const pet = pets.find((p) => String(p.id) === String(id));
        setForm((atual) => ({ ...atual, petId: id, petNome: pet?.nome ?? '' }));
        if (erros.petId) setErros((atual) => ({ ...atual, petId: undefined }));
    }

    function tratarErro(erro: Error) {
        if (erro instanceof ErroValidacao) setErros(erro.erros);
        else Alert.alert('Não foi possível salvar', erro.message);
    }

    function salvar() {
        setErros({});

        const aoDarCerto = () => {
            Alert.alert('Tudo certo!', editando ? 'Consulta atualizada.' : 'Consulta agendada com sucesso.');
            navigation.goBack();
        };

        if (editando) {
            atualizarConsulta.mutate(
                { id: consultaExistente.id, dados: form },
                { onSuccess: aoDarCerto, onError: tratarErro },
            );
        } else {
            criarConsulta.mutate(form, { onSuccess: aoDarCerto, onError: tratarErro });
        }
    }

    const opcoesPets: Opcao[] = pets.map((pet) => ({
        id: String(pet.id),
        nome: pet.nome,
        emoji: emojiDaRaca(pet.raca, pet.especie),
    }));

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: cores.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <CabecalhoTela
                titulo={editando ? 'Editar consulta' : 'Nova consulta'}
                subtitulo={editando ? consultaExistente.motivo : 'Agende o atendimento do seu pet'}
                onVoltar={() => navigation.goBack()}
            />

            <ScrollView
                contentContainerStyle={{ padding: Spacing.lg, paddingBottom: insets.bottom + Spacing.xxl }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {carregandoPets ? (
                    <Carregando mensagem="Carregando seus pets..." />
                ) : opcoesPets.length === 0 ? (
                    <Text style={[estilos.aviso, { color: cores.textSecondary }]}>
                        Você ainda não tem pets cadastrados. Cadastre um pet antes de agendar uma consulta.
                    </Text>
                ) : (
                    <SeletorOpcoes
                        label="Pet"
                        opcoes={opcoesPets}
                        valor={form.petId}
                        onSelecionar={selecionarPet}
                        erro={erros.petId}
                    />
                )}

                <Input
                    label="Data"
                    valor={form.data}
                    onMudar={(v) => alterar('data', mascaraData(v))}
                    placeholder="DD/MM/AAAA"
                    icone="calendar-outline"
                    tipo="numeric"
                    maxLength={10}
                    erro={erros.data}
                />

                <Input
                    label="Horário"
                    valor={form.horario}
                    onMudar={(v) => alterar('horario', mascaraHora(v))}
                    placeholder="HH:MM"
                    icone="time-outline"
                    tipo="numeric"
                    maxLength={5}
                    erro={erros.horario}
                />

                <Input
                    label="Clínica"
                    valor={form.clinica}
                    onMudar={(v) => alterar('clinica', v)}
                    placeholder="Ex.: Clyvo Vet — Unidade Paulista"
                    icone="business-outline"
                    autoCapitalize="words"
                    erro={erros.clinica}
                />

                <Input
                    label="Veterinário"
                    valor={form.veterinario}
                    onMudar={(v) => alterar('veterinario', v)}
                    placeholder="Ex.: Dra. Marina Alves"
                    icone="medkit-outline"
                    autoCapitalize="words"
                    erro={erros.veterinario}
                />

                <Input
                    label="Motivo"
                    valor={form.motivo}
                    onMudar={(v) => alterar('motivo', v)}
                    placeholder="Ex.: Consulta de rotina, vacinação, retorno..."
                    icone="clipboard-outline"
                    erro={erros.motivo}
                />

                <SeletorOpcoes<StatusConsulta>
                    label="Status"
                    opcoes={STATUS}
                    valor={form.status}
                    onSelecionar={(id) => alterar('status', id)}
                    erro={erros.status}
                />

                <Input
                    label="Observações"
                    valor={form.observacoes}
                    onMudar={(v) => alterar('observacoes', v)}
                    placeholder="Sintomas, recomendações, exames solicitados..."
                    icone="document-text-outline"
                    multiline
                    numeroLinhas={4}
                />

                <Button
                    titulo={editando ? 'Salvar alterações' : 'Agendar consulta'}
                    onPress={salvar}
                    carregando={salvando}
                    desabilitado={opcoesPets.length === 0}
                    tamanho="lg"
                    style={{ marginTop: Spacing.sm }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    aviso: { fontSize: Typography.bodySmall, lineHeight: 21, marginBottom: Spacing.lg },
});