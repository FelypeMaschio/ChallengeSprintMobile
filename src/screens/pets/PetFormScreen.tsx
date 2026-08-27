import React, { useState } from 'react';
import {
    View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, CabecalhoTela, SeletorOpcoes } from '../../components/ui';
import { SeletorRaca } from '../../components/pets/SeletorRaca';
import { SeletorFotoPet } from '../../components/pets/SeletorFotoPet';
import { useCriarPet, useAtualizarPet, ErroValidacao } from '../../hooks/usePets';
import { useTheme } from '../../contexts/ThemeContext';
import { ESPECIES, emojiDaRaca } from '../../constants/racas';
import { mascaraData, isoParaDataBr } from '../../utils/date';
import { Typography, Spacing, Radius } from '../../theme';
import type { AppScreenProps } from '../../navigation/types';
import type { EspecieId, Erros, Opcao, PetFormulario, Sexo } from '../../types';

const SEXOS: Opcao[] = [
    { id: 'Macho', nome: 'Macho', emoji: '♂️' },
    { id: 'Fêmea', nome: 'Fêmea', emoji: '♀️' },
];

const FORM_VAZIO: PetFormulario = {
    nome: '', especie: 'cachorro', raca: '', sexo: '',
    dataNascimento: '', peso: '', castrado: false, foto: '', observacoes: '',
};

export default function PetFormScreen({ navigation, route }: AppScreenProps<'PetForm'>) {
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    const { modo, pet: petExistente } = route.params;
    const editando = modo === 'editar' && !!petExistente;

    const [form, setForm] = useState<PetFormulario>(
        editando
            ? {
                nome: petExistente.nome,
                especie: petExistente.especie,
                raca: petExistente.raca,
                sexo: petExistente.sexo,
                dataNascimento: isoParaDataBr(petExistente.dataNascimento),
                peso: String(petExistente.peso ?? ''),
                castrado: petExistente.castrado,
                foto: petExistente.foto,
                observacoes: petExistente.observacoes,
            }
            : FORM_VAZIO,
    );
    const [erros, setErros] = useState<Erros>({});

    const criarPet = useCriarPet();
    const atualizarPet = useAtualizarPet();
    const salvando = criarPet.isPending || atualizarPet.isPending;

    function alterar<K extends keyof PetFormulario>(campo: K, valor: PetFormulario[K]) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
        if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
    }

    function tratarErro(erro: Error) {
        // Erro de validação traz o mapa por campo; erro de rede vira alerta.
        if (erro instanceof ErroValidacao) setErros(erro.erros);
        else Alert.alert('Não foi possível salvar', erro.message);
    }

    function salvar() {
        setErros({});

        const aoDarCerto = () => {
            Alert.alert('Tudo certo!', editando ? 'Pet atualizado com sucesso.' : 'Pet cadastrado com sucesso.');
            navigation.goBack();
        };

        if (editando) {
            atualizarPet.mutate({ id: petExistente.id, dados: form }, { onSuccess: aoDarCerto, onError: tratarErro });
        } else {
            criarPet.mutate(form, { onSuccess: aoDarCerto, onError: tratarErro });
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: cores.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <CabecalhoTela
                titulo={editando ? 'Editar pet' : 'Novo pet'}
                subtitulo={editando ? petExistente.nome : 'Conte um pouco sobre ele'}
                onVoltar={() => navigation.goBack()}
            />

            <ScrollView
                contentContainerStyle={{ padding: Spacing.lg, paddingBottom: insets.bottom + Spacing.xxl }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <SeletorFotoPet
                    foto={form.foto}
                    onMudarFoto={(uri) => alterar('foto', uri)}
                    emojiFallback={emojiDaRaca(form.raca, form.especie)}
                />

                <Input
                    label="Nome do pet"
                    valor={form.nome}
                    onMudar={(v) => alterar('nome', v)}
                    placeholder="Ex.: Thor"
                    icone="pricetag-outline"
                    autoCapitalize="words"
                    erro={erros.nome}
                />

                <SeletorOpcoes<EspecieId>
                    label="Espécie"
                    opcoes={ESPECIES}
                    valor={form.especie}
                    onSelecionar={(id) => {
                        setForm((atual) => ({ ...atual, especie: id, raca: '' }));
                    }}
                    erro={erros.especie}
                />

                <SeletorRaca
                    especie={form.especie}
                    valor={form.raca}
                    onSelecionar={(nome) => alterar('raca', nome)}
                    erro={erros.raca}
                />

                <SeletorOpcoes<Sexo>
                    label="Sexo"
                    opcoes={SEXOS}
                    valor={form.sexo}
                    onSelecionar={(id) => alterar('sexo', id)}
                    erro={erros.sexo}
                />

                <Input
                    label="Data de nascimento"
                    valor={form.dataNascimento}
                    onMudar={(v) => alterar('dataNascimento', mascaraData(v))}
                    placeholder="DD/MM/AAAA"
                    icone="calendar-outline"
                    tipo="numeric"
                    maxLength={10}
                    erro={erros.dataNascimento}
                />

                <Input
                    label="Peso (kg)"
                    valor={form.peso}
                    onMudar={(v) => alterar('peso', v)}
                    placeholder="Ex.: 12.5"
                    icone="barbell-outline"
                    tipo="decimal-pad"
                    erro={erros.peso}
                />

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => alterar('castrado', !form.castrado)}
                    style={[estilos.checkbox, { backgroundColor: cores.surfaceAlt, borderColor: cores.border }]}
                >
                    <View
                        style={[
                            estilos.marcador,
                            {
                                backgroundColor: form.castrado ? cores.primary : 'transparent',
                                borderColor: form.castrado ? cores.primary : cores.textTertiary,
                            },
                        ]}
                    >
                        {form.castrado && <Ionicons name="checkmark" size={15} color={cores.textInverse} />}
                    </View>
                    <Text style={[estilos.checkboxTexto, { color: cores.text }]}>Pet castrado</Text>
                </TouchableOpacity>

                <Input
                    label="Observações"
                    valor={form.observacoes}
                    onMudar={(v) => alterar('observacoes', v)}
                    placeholder="Alergias, medicamentos de uso contínuo, comportamento..."
                    icone="document-text-outline"
                    multiline
                    numeroLinhas={4}
                />

                <Button
                    titulo={editando ? 'Salvar alterações' : 'Cadastrar pet'}
                    onPress={salvar}
                    carregando={salvando}
                    tamanho="lg"
                    style={{ marginTop: Spacing.sm }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    checkbox: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
        padding: Spacing.md, borderRadius: Radius.sm, borderWidth: 1.5, marginBottom: Spacing.md,
    },
    marcador: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    checkboxTexto: { fontSize: Typography.body, fontWeight: '500' },
});