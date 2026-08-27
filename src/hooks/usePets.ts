import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { petsApi, type PetPayload } from '../api/petsApi';
import { useAuth } from '../contexts/AuthContext';
import { validarPet } from '../validation/petValidation';
import { dataBrParaIso } from '../utils/date';
import type { Erros, Pet, PetFormulario, EspecieId } from '../types';

/** Chaves de cache centralizadas — nada de string mágica espalhada. */
export const chavesPets = {
    raiz: ['pets'] as const,
    lista: (tutorId?: string) => ['pets', 'lista', tutorId] as const,
    detalhe: (id: string) => ['pets', 'detalhe', id] as const,
};

/** Erro de validação: carrega o mapa de erros por campo até a tela. */
export class ErroValidacao extends Error {
    erros: Erros;

    constructor(erros: Erros) {
        super('Existem campos inválidos no formulário.');
        this.name = 'ErroValidacao';
        this.erros = erros;
    }
}

function prepararPayload(dados: PetFormulario, tutorId: string): PetPayload {
    return {
        tutorId,
        nome: dados.nome.trim(),
        especie: dados.especie,
        raca: dados.raca.trim(),
        sexo: dados.sexo,
        dataNascimento: dataBrParaIso(dados.dataNascimento),
        peso: dados.peso.replace(',', '.'),
        castrado: dados.castrado,
        foto: dados.foto ?? '',
        observacoes: dados.observacoes?.trim() ?? '',
    };
}

/* ----------------------------- LEITURA ----------------------------- */

export function usePets(): UseQueryResult<Pet[], Error> {
    const { usuario } = useAuth();
    const tutorId = usuario?.uid;

    return useQuery({
        queryKey: chavesPets.lista(tutorId),
        queryFn: () => petsApi.listar(tutorId as string),
        enabled: !!tutorId,
    });
}

export function usePet(id: string): UseQueryResult<Pet, Error> {
    return useQuery({
        queryKey: chavesPets.detalhe(id),
        queryFn: () => petsApi.buscarPorId(id),
        enabled: !!id,
    });
}

/* ----------------------------- ESCRITA ----------------------------- */

export function useCriarPet() {
    const clienteQuery = useQueryClient();
    const { usuario } = useAuth();

    return useMutation<Pet, Error, PetFormulario>({
        mutationFn: async (dados) => {
            const erros = validarPet(dados);
            if (Object.keys(erros).length > 0) throw new ErroValidacao(erros);
            return petsApi.criar(prepararPayload(dados, usuario?.uid ?? ''));
        },
        // invalidateQueries = a lista se atualiza sozinha, sem useState.
        onSuccess: () => clienteQuery.invalidateQueries({ queryKey: chavesPets.raiz }),
    });
}

export function useAtualizarPet() {
    const clienteQuery = useQueryClient();
    const { usuario } = useAuth();

    return useMutation<Pet, Error, { id: string; dados: PetFormulario }>({
        mutationFn: async ({ id, dados }) => {
            const erros = validarPet(dados);
            if (Object.keys(erros).length > 0) throw new ErroValidacao(erros);
            return petsApi.atualizar(id, prepararPayload(dados, usuario?.uid ?? ''));
        },
        onSuccess: (pet) => {
            void clienteQuery.invalidateQueries({ queryKey: chavesPets.raiz });
            clienteQuery.setQueryData(chavesPets.detalhe(pet.id), pet);
        },
    });
}

export function useRemoverPet() {
    const clienteQuery = useQueryClient();

    return useMutation<string, Error, string>({
        mutationFn: (id) => petsApi.remover(id),
        onSuccess: () => clienteQuery.invalidateQueries({ queryKey: chavesPets.raiz }),
    });
}

/* --------------------------- DERIVADOS ----------------------------- */

export interface ResumoPets {
    total: number;
    porEspecie: Partial<Record<EspecieId, number>>;
    pets: Pet[];
    isLoading: boolean;
    isError: boolean;
}

/** Estatísticas para a Home. Regra de negócio fora da tela. */
export function useResumoPets(): ResumoPets {
    const { data: pets = [], isLoading, isError } = usePets();

    const porEspecie = pets.reduce<Partial<Record<EspecieId, number>>>((acumulado, pet) => {
        acumulado[pet.especie] = (acumulado[pet.especie] ?? 0) + 1;
        return acumulado;
    }, {});

    return { total: pets.length, porEspecie, pets, isLoading, isError };
}