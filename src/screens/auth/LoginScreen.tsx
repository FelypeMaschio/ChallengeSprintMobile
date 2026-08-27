import React, { useState } from 'react';
import {
    View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import { ROTAS } from '../../navigation/routes';
import type { AuthScreenProps } from '../../navigation/types';
import type { Erros } from '../../types';

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
    const { entrar, processando } = useAuth();
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erros, setErros] = useState<Erros>({});

    async function aoEntrar() {
        const resultado = await entrar({ email, senha });
        setErros(resultado.erros);
        // Em caso de sucesso não navegamos: o RootNavigator troca de stack sozinho.
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: cores.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={cores.gradiente}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[estilos.topo, { paddingTop: insets.top + Spacing.xl }]}
                >
                    <View style={estilos.logo}>
                        <Ionicons name="paw" size={34} color="#FFFFFF" />
                    </View>
                    <Text style={estilos.marca}>Clyvo Vet</Text>
                    <Text style={estilos.slogan}>O cuidado do seu pet, sempre com você</Text>
                </LinearGradient>

                <View style={[estilos.form, { backgroundColor: cores.background }]}>
                    <Text style={[estilos.titulo, { color: cores.text }]}>Bem-vindo de volta</Text>
                    <Text style={[estilos.subtitulo, { color: cores.textSecondary }]}>
                        Entre para acompanhar a saúde dos seus pets
                    </Text>

                    {!!erros.geral && (
                        <View style={[estilos.alerta, { backgroundColor: cores.dangerLight }]}>
                            <Ionicons name="alert-circle" size={18} color={cores.danger} />
                            <Text style={[estilos.alertaTexto, { color: cores.danger }]}>{erros.geral}</Text>
                        </View>
                    )}

                    <Input
                        label="E-mail"
                        valor={email}
                        onMudar={setEmail}
                        placeholder="voce@email.com"
                        icone="mail-outline"
                        tipo="email-address"
                        autoCapitalize="none"
                        erro={erros.email}
                    />

                    <Input
                        label="Senha"
                        valor={senha}
                        onMudar={setSenha}
                        placeholder="Sua senha"
                        icone="lock-closed-outline"
                        senha
                        erro={erros.senha}
                    />

                    <Button
                        titulo="Entrar"
                        onPress={() => void aoEntrar()}
                        carregando={processando}
                        tamanho="lg"
                        style={{ marginTop: Spacing.sm }}
                    />

                    <TouchableOpacity style={estilos.rodape} onPress={() => navigation.navigate(ROTAS.CADASTRO)}>
                        <Text style={[estilos.rodapeTexto, { color: cores.textSecondary }]}>
                            Ainda não tem conta?{' '}
                            <Text style={{ color: cores.primary, fontWeight: '700' }}>Criar conta</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    topo: {
        paddingBottom: Spacing.xxl, paddingHorizontal: Spacing.lg, alignItems: 'center',
        borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl,
    },
    logo: {
        width: 68, height: 68, borderRadius: Radius.full,
        backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center',
    },
    marca: { fontSize: Typography.display, fontWeight: '800', color: '#FFFFFF', marginTop: Spacing.sm },
    slogan: { fontSize: Typography.bodySmall, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    form: {
        flex: 1, padding: Spacing.lg, marginTop: -Spacing.lg,
        borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
    },
    titulo: { fontSize: Typography.h1, fontWeight: '800' },
    subtitulo: { fontSize: Typography.bodySmall, marginTop: 4, marginBottom: Spacing.lg },
    alerta: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        padding: Spacing.sm, borderRadius: Radius.sm, marginBottom: Spacing.md,
    },
    alertaTexto: { fontSize: Typography.bodySmall, flex: 1, fontWeight: '500' },
    rodape: { marginTop: Spacing.lg, alignItems: 'center' },
    rodapeTexto: { fontSize: Typography.bodySmall },
});