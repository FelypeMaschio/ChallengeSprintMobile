import React from 'react';
import {
    View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, CabecalhoTela, SeletorOpcoes } from '../../components/ui';
import { SeletorRaca } from '../../components/pets/SeletorRaca';
import { SeletorFotoPet } from '../../components/pets/SeletorFotoPet';
import { usePetForm } from '../../hooks/usePetForm';
import { useTheme } from '../../contexts/ThemeContext';
import { ESPECIES, emojiDaRaca } from '../../constants/racas';
import { mascaraData } from '../../utils/date';
import { Typography, Spacing, Radius } from '../../theme';
import type { AppScreenProps } from '../../navigation/types';
import type { EspecieId, Opcao, Sexo } from '../../types';

const SEXOS: Opcao[] = [
    { id: 'Macho', nome: 'Macho', emoji: '♂️' },
    { id: 'Fêmea', nome: 'Fêmea', emoji: '♀️' },
];

export default function PetFormScreen({ navigation, route }: AppScreenProps<'PetForm'>) {
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    const { modo, pet: petExistente } = route.params;

    // Estado, validação e envio vivem no hook. A tela só desenha e decide como avisar o usuário.
    const { form, erros, editando, salvando, alterar, alterarEspecie, salvar } = usePetForm({
        petExistente: modo === 'editar' ? petExistente : undefined,
        aoConcluir: (mensagem) => {
            Alert.alert('Tudo certo!', mensagem);
            navigation.goBack();
        },
        aoFalhar: (titulo, mensagem) => Alert.alert(titulo, mensagem),
    });

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: cores.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <CabecalhoTela
                titulo={editando ? 'Editar pet' : 'Novo pet'}
                subtitulo={editando ? petExistente?.nome : 'Conte um pouco sobre ele'}
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
                    onSelecionar={alterarEspecie}
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