import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Badge } from '../ui';
import { Typography, Spacing, Radius, Sombra } from '../../theme';
import { emojiDaRaca } from '../../constants/racas';
import { calcularIdade } from '../../utils/date';
import type { Pet } from '../../types';

interface PetCardProps {
    pet: Pet;
    onPress: () => void;
}

export function PetCard({ pet, onPress }: PetCardProps) {
    const { cores, escuro } = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={[
                estilos.card,
                { backgroundColor: cores.surface, borderColor: cores.borderLight },
                !escuro ? Sombra.card : null,
                escuro ? { borderWidth: 1 } : null,
            ]}
        >
            <View style={[estilos.avatar, { backgroundColor: cores.primaryLight }]}>
                {pet.foto ? (
                    <Image source={{ uri: pet.foto }} style={estilos.imagem} />
                ) : (
                    <Text style={estilos.emoji}>{emojiDaRaca(pet.raca, pet.especie)}</Text>
                )}
            </View>

            <View style={{ flex: 1 }}>
                <Text style={[estilos.nome, { color: cores.text }]} numberOfLines={1}>{pet.nome}</Text>
                <Text style={[estilos.raca, { color: cores.textSecondary }]} numberOfLines={1}>{pet.raca}</Text>

                <View style={estilos.tags}>
                    <Badge texto={calcularIdade(pet.dataNascimento)} variante="primary" />
                    <Badge texto={`${pet.peso} kg`} variante="info" />
                    {pet.castrado && <Badge texto="Castrado" variante="success" />}
                </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color={cores.textTertiary} />
        </TouchableOpacity>
    );
}

const estilos = StyleSheet.create({
    card: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
        padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.sm,
    },
    avatar: {
        width: 62, height: 62, borderRadius: Radius.full,
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    imagem: { width: '100%', height: '100%' },
    emoji: { fontSize: 28 },
    nome: { fontSize: Typography.h4, fontWeight: '700' },
    raca: { fontSize: Typography.caption, marginTop: 1 },
    tags: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
});