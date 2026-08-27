import React from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CabecalhoTela, Carregando, ErroApi, EstadoVazio } from '../../components/ui';
import { PetCard } from '../../components/pets/PetCard';
import { usePets } from '../../hooks/usePets';
import { useTheme } from '../../contexts/ThemeContext';
import { Spacing, Radius } from '../../theme';
import { ROTAS } from '../../navigation/routes';
import type { TabScreenProps } from '../../navigation/types';

export default function PetsListScreen({ navigation }: TabScreenProps<'Pets'>) {
    const { cores } = useTheme();
    const insets = useSafeAreaInsets();

    // Todo o estado de rede vem do hook. A tela não conhece axios.
    const { data: pets = [], isLoading, isError, error, refetch, isRefetching } = usePets();

    function irParaCadastro() {
        navigation.navigate(ROTAS.PET_FORM, { modo: 'criar' });
    }

    function conteudoVazio() {
        if (isLoading) return <Carregando mensagem="Buscando seus pets..." />;
        if (isError) return <ErroApi mensagem={error?.message} onTentarNovamente={() => void refetch()} />;

        return (
            <EstadoVazio
                icone="paw-outline"
                titulo="Nenhum pet cadastrado"
                descricao="Cadastre seu primeiro pet para acompanhar consultas, vacinas e histórico de saúde."
                textoAcao="Cadastrar meu pet"
                onAcao={irParaCadastro}
            />
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: cores.background }}>
            <CabecalhoTela
                titulo="Meus Pets"
                subtitulo={pets.length > 0 ? `${pets.length} pet(s) cadastrado(s)` : 'Comece cadastrando um pet'}
                acaoDireita={
                    <TouchableOpacity
                        onPress={irParaCadastro}
                        style={[estilos.botaoAdicionar, { backgroundColor: cores.primary }]}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="add" size={22} color={cores.textInverse} />
                    </TouchableOpacity>
                }
            />

            <FlatList
                data={pets}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ padding: Spacing.md, paddingBottom: insets.bottom + Spacing.xxl }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={conteudoVazio()}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching && !isLoading}
                        onRefresh={() => void refetch()}
                        tintColor={cores.primary}
                    />
                }
                renderItem={({ item }) => (
                    <PetCard pet={item} onPress={() => navigation.navigate(ROTAS.PET_DETALHE, { petId: item.id })} />
                )}
            />
        </View>
    );
}

const estilos = StyleSheet.create({
    botaoAdicionar: { width: 40, height: 40, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
});