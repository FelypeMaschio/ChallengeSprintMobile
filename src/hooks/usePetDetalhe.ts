import { usePet, useRemoverPet } from './usePets';
import { useConsultasDoPet } from './useConsultas';

interface Parametros {
    petId: string;
    aoExcluir: () => void;
    aoFalhar: (mensagem: string) => void;
}

/** Dados do pet, as consultas dele e a exclusão. A tela só desenha. */
export function usePetDetalhe({ petId, aoExcluir, aoFalhar }: Parametros) {
    const petQuery = usePet(petId);
    const { data: consultas = [] } = useConsultasDoPet(petId);
    const removerPet = useRemoverPet();

    function excluir() {
        removerPet.mutate(petId, {
            onSuccess: aoExcluir,
            onError: (erro) => aoFalhar(erro.message),
        });
    }

    return {
        pet: petQuery.data,
        isLoading: petQuery.isLoading,
        isError: petQuery.isError,
        error: petQuery.error,
        recarregar: petQuery.refetch,
        consultas,
        excluindo: removerPet.isPending,
        excluir,
    };
}
