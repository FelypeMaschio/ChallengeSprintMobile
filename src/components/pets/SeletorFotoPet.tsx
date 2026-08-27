import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';

interface SeletorFotoPetProps {
    foto: string;
    onMudarFoto: (uri: string) => void;
    emojiFallback?: string;
}

export function SeletorFotoPet({ foto, onMudarFoto, emojiFallback = '🐾' }: SeletorFotoPetProps) {
    const { cores } = useTheme();

    async function escolherDaGaleria() {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissao.granted) {
            Alert.alert('Permissão necessária', 'Autorize o acesso à galeria para escolher uma foto.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
        });

        if (!resultado.canceled) onMudarFoto(resultado.assets[0].uri);
    }

    async function tirarFoto() {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
            Alert.alert('Permissão necessária', 'Autorize o acesso à câmera para tirar uma foto.');
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
        });

        if (!resultado.canceled) onMudarFoto(resultado.assets[0].uri);
    }

    return (
        <View style={estilos.container}>
            <View style={[estilos.avatar, { backgroundColor: cores.primaryLight, borderColor: cores.primary }]}>
                {foto ? (
                    <Image source={{ uri: foto }} style={estilos.imagem} />
                ) : (
                    <Text style={estilos.emoji}>{emojiFallback}</Text>
                )}
            </View>

            <View style={estilos.acoes}>
                <TouchableOpacity
                    onPress={() => void tirarFoto()}
                    style={[estilos.botao, { backgroundColor: cores.surface, borderColor: cores.border }]}
                    activeOpacity={0.8}
                >
                    <Ionicons name="camera-outline" size={18} color={cores.primary} />
                    <Text style={[estilos.botaoTexto, { color: cores.primary }]}>Câmera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => void escolherDaGaleria()}
                    style={[estilos.botao, { backgroundColor: cores.surface, borderColor: cores.border }]}
                    activeOpacity={0.8}
                >
                    <Ionicons name="images-outline" size={18} color={cores.primary} />
                    <Text style={[estilos.botaoTexto, { color: cores.primary }]}>Galeria</Text>
                </TouchableOpacity>

                {!!foto && (
                    <TouchableOpacity
                        onPress={() => onMudarFoto('')}
                        style={[estilos.botao, { backgroundColor: cores.dangerLight, borderColor: cores.dangerLight }]}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="trash-outline" size={18} color={cores.danger} />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={[estilos.dica, { color: cores.textTertiary }]}>
                Sem foto? O ícone da raça escolhida aparece aqui.
            </Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: { alignItems: 'center', marginBottom: Spacing.lg },
    avatar: {
        width: 118, height: 118, borderRadius: Radius.full, borderWidth: 3,
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    imagem: { width: '100%', height: '100%' },
    emoji: { fontSize: 52 },
    acoes: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
    botao: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: Spacing.md, paddingVertical: 9,
        borderRadius: Radius.full, borderWidth: 1.5,
    },
    botaoTexto: { fontSize: Typography.bodySmall, fontWeight: '600' },
    dica: { fontSize: Typography.caption, marginTop: Spacing.sm },
});