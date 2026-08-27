import React, { useState } from 'react';
import {
    View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, CabecalhoTela } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import type { AuthScreenProps } from '../../navigation/types';
import type { DadosCadastro } from '../../validation/authValidation';
import type { Erros } from '../../types';

const FORM_VAZIO: DadosCadastro = { nome: '', email: '', senha: '', confirmarSenha: '' };

export default function CadastroScreen({ navigation }: AuthScreenProps<'Cadastro'>) {
    const { cadastrar, processando } = useAuth();
    const { cores } = useTheme();

    const [form, setForm] = useState<DadosCadastro>(FORM_VAZIO);
    const [erros, setErros] = useState<Erros>({});

    function alterar(campo: keyof DadosCadastro, valor: string) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    }

    async function aoCadastrar() {
        const resultado = await cadastrar(form);
        setErros(resultado.erros);
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: cores.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <CabecalhoTela titulo="Criar conta" onVoltar={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={{ padding: Spacing.lg }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={[estilos.subtitulo, { color: cores.textSecondary }]}>
                    Cadastre-se para gerenciar os pets da sua casa em um só lugar.
                </Text>

                {!!erros.geral && (
                    <View style={[estilos.alerta, { backgroundColor: cores.dangerLight }]}>
                        <Ionicons name="alert-circle" size={18} color={cores.danger} />
                        <Text style={[estilos.alertaTexto, { color: cores.danger }]}>{erros.geral}</Text>
                    </View>
                )}

                <Input
                    label="Nome completo"
                    valor={form.nome}
                    onMudar={(v) => alterar('nome', v)}
                    placeholder="Como podemos te chamar?"
                    icone="person-outline"
                    autoCapitalize="words"
                    erro={erros.nome}
                />

                <Input
                    label="E-mail"
                    valor={form.email}
                    onMudar={(v) => alterar('email', v)}
                    placeholder="voce@email.com"
                    icone="mail-outline"
                    tipo="email-address"
                    autoCapitalize="none"
                    erro={erros.email}
                />

                <Input
                    label="Senha"
                    valor={form.senha}
                    onMudar={(v) => alterar('senha', v)}
                    placeholder="Mínimo de 6 caracteres"
                    icone="lock-closed-outline"
                    senha
                    erro={erros.senha}
                />

                <Input
                    label="Confirmar senha"
                    valor={form.confirmarSenha}
                    onMudar={(v) => alterar('confirmarSenha', v)}
                    placeholder="Repita a senha"
                    icone="lock-closed-outline"
                    senha
                    erro={erros.confirmarSenha}
                />

                <Button
                    titulo="Criar minha conta"
                    onPress={() => void aoCadastrar()}
                    carregando={processando}
                    tamanho="lg"
                    style={{ marginTop: Spacing.sm }}
                />

                <TouchableOpacity style={estilos.rodape} onPress={() => navigation.goBack()}>
                    <Text style={[estilos.rodapeTexto, { color: cores.textSecondary }]}>
                        Já tem conta? <Text style={{ color: cores.primary, fontWeight: '700' }}>Entrar</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    subtitulo: { fontSize: Typography.bodySmall, marginBottom: Spacing.lg, lineHeight: 20 },
    alerta: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        padding: Spacing.sm, borderRadius: Radius.sm, marginBottom: Spacing.md,
    },
    alertaTexto: { fontSize: Typography.bodySmall, flex: 1, fontWeight: '500' },
    rodape: { marginTop: Spacing.lg, alignItems: 'center' },
    rodapeTexto: { fontSize: Typography.bodySmall },
});