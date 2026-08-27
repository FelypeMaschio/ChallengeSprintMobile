import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    type KeyboardTypeOptions, type StyleProp, type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Radius, Spacing } from '../../theme';
import type { NomeIcone } from '../../types';

interface InputProps {
    label?: string;
    valor: string;
    onMudar: (texto: string) => void;
    placeholder?: string;
    erro?: string;
    tipo?: KeyboardTypeOptions;
    senha?: boolean;
    icone?: NomeIcone;
    multiline?: boolean;
    numeroLinhas?: number;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    maxLength?: number;
    editavel?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function Input({
    label,
    valor,
    onMudar,
    placeholder,
    erro,
    tipo = 'default',
    senha = false,
    icone,
    multiline = false,
    numeroLinhas = 3,
    autoCapitalize,
    maxLength,
    editavel = true,
    style,
}: InputProps) {
    const { cores } = useTheme();
    const [focado, setFocado] = useState(false);
    const [verSenha, setVerSenha] = useState(false);

    const corBorda = erro ? cores.danger : focado ? cores.primary : cores.border;

    return (
        <View style={[{ marginBottom: Spacing.md }, style]}>
            {!!label && <Text style={[estilos.label, { color: cores.text }]}>{label}</Text>}

            <View
                style={[
                    estilos.caixa,
                    { backgroundColor: focado ? cores.surface : cores.surfaceAlt, borderColor: corBorda },
                    multiline ? { height: 44 + numeroLinhas * 20, alignItems: 'flex-start' } : null,
                ]}
            >
                {!!icone && (
                    <Ionicons
                        name={icone}
                        size={18}
                        color={focado ? cores.primary : cores.textTertiary}
                        style={[{ marginRight: 8 }, multiline ? { marginTop: 15 } : null]}
                    />
                )}

                <TextInput
                    style={[
                        estilos.input,
                        { color: cores.text },
                        multiline ? { height: '100%', paddingVertical: Spacing.sm, textAlignVertical: 'top' } : null,
                    ]}
                    value={valor}
                    onChangeText={onMudar}
                    placeholder={placeholder}
                    placeholderTextColor={cores.textTertiary}
                    keyboardType={tipo}
                    secureTextEntry={senha && !verSenha}
                    multiline={multiline}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                    editable={editavel}
                    onFocus={() => setFocado(true)}
                    onBlur={() => setFocado(false)}
                />

                {senha && (
                    <TouchableOpacity onPress={() => setVerSenha((v) => !v)} style={{ padding: 4 }}>
                        <Ionicons
                            name={verSenha ? 'eye-off-outline' : 'eye-outline'}
                            size={18}
                            color={cores.textTertiary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {!!erro && <Text style={[estilos.erro, { color: cores.danger }]}>{erro}</Text>}
        </View>
    );
}

const estilos = StyleSheet.create({
    label: { fontSize: Typography.bodySmall, fontWeight: '600', marginBottom: 6 },
    caixa: {
        flexDirection: 'row', alignItems: 'center',
        borderRadius: Radius.sm, borderWidth: 1.5, paddingHorizontal: Spacing.md,
    },
    input: { flex: 1, height: 50, fontSize: Typography.body },
    erro: { fontSize: Typography.caption, marginTop: 4 },
});