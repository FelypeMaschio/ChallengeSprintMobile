import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { consultasApi, type ConsultaPayload } from '../api/consultasApi';
import { useAuth } from '../contexts/AuthContext';
import { validarConsulta } from '../validation/consultaValidation';
import { dataBrParaIso, ehFuturoOuHoje } from '../utils/date';
import { ErroValidacao } from './usePets';
import type { Consulta, ConsultaFormulario } from '../types';

export const chavesConsultas = {
    raiz: ['consultas'] as const,
    lista: (tutorId?: string) => ['consultas', 'lista', tutorId] as const,
    detalhe: (id: string) => ['consultas', 'detalhe', id] as const,
};

function prepararPayload(dados: ConsultaFormulario, tutorId: string): ConsultaPayload {
    return {
        tutorId,
        petId: dados.petId,
        petNome: dados.petNome ?? '',
        data: dataBrParaIso(dados.data),
        horario: dados.horario.trim(),
        clinica: dados.clinica.trim(),
        veterinario: dados.veterinario.trim(),
        motivo: dados.motivo.trim(),
        status: dados.status,
        observacoes: dados.observacoes?.trim() ?? '',
    };
}

/* ----------------------------- LEITURA ----------------------------- */

export function useConsultas(): UseQueryResult<Consulta[], Error> {
    const { usuario } = useAuth();
    const tutorId = usuario?.uid;

    return useQuery({
        queryKey: chavesConsultas.lista(tutorId),
        queryFn: () => consultasApi.listar(tutorId as string),
        enabled: !!tutorId,
        // Ordena aqui, e não na tela.
        select: (consultas) =>
            [...consultas].sort((a, b) => `${b.data} ${b.horario}`.localeCompare(`${a.data} ${a.horario}`)),
    });
}

/** Reaproveita o cache da listagem: sem requisição extra. */
export function useConsultasDoPet(petId: string): UseQueryResult<Consulta[], Error> {
    const { usuario } = useAuth();
    const tutorId = usuario?.uid;

    return useQuery({
        queryKey: chavesConsultas.lista(tutorId),
        queryFn: () => consultasApi.listar(tutorId as string),
        enabled: !!tutorId && !!petId,
        select: (consultas) => consultas.filter((c) => String(c.petId) === String(petId)),
    });
}

/* ----------------------------- ESCRITA ----------------------------- */

export function useCriarConsulta() {
    const clienteQuery = useQueryClient();
    const { usuario } = useAuth();

    return useMutation<Consulta, Error, ConsultaFormulario>({
        mutationFn: async (dados) => {
            const erros = validarConsulta(dados);
            if (Object.keys(erros).length > 0) throw new ErroValidacao(erros);
            return consultasApi.criar(prepararPayload(dados, usuario?.uid ?? ''));
        },
        onSuccess: () => clienteQuery.invalidateQueries({ queryKey: chavesConsultas.raiz }),
    });
}

export function useAtualizarConsulta() {
    const clienteQuery = useQueryClient();
    const { usuario } = useAuth();

    return useMutation<Consulta, Error, { id: string; dados: ConsultaFormulario }>({
        mutationFn: async ({ id, dados }) => {
            const erros = validarConsulta(dados);
            if (Object.keys(erros).length > 0) throw new ErroValidacao(erros);
            return consultasApi.atualizar(id, prepararPayload(dados, usuario?.uid ?? ''));
        },
        onSuccess: () => clienteQuery.invalidateQueries({ queryKey: chavesConsultas.raiz }),
    });
}

/** Alteração rápida de status direto da listagem — também é UPDATE na API. */
export function useAlterarStatusConsulta() {
    const clienteQuery = useQueryClient();

    return useMutation<Consulta, Error, { consulta: Consulta; novoStatus: Consulta['status'] }>({
        mutationFn: ({ consulta, novoStatus }) => {
            const { id, ...resto } = consulta;
            return consultasApi.atualizar(id, { ...resto, status: novoStatus });
        },
        onSuccess: () => clienteQuery.invalidateQueries({ queryKey: chavesConsultas.raiz }),
    });
}

export function useRemoverConsulta() {
    const clienteQuery = useQueryClient();

    return useMutation<string, Error, string>({
        mutationFn: (id) => consultasApi.remover(id),
        onSuccess: () => clienteQuery.invalidateQueries({ queryKey: chavesConsultas.raiz }),
    });
}

/* --------------------------- DERIVADOS ----------------------------- */

export interface ResumoProximas {
    proximas: Consulta[];
    totalAgendadas: number;
    isLoading: boolean;
    isError: boolean;
}

export function useProximasConsultas(limite = 3): ResumoProximas {
    const { data: consultas = [], isLoading, isError } = useConsultas();

    const proximas = consultas
        .filter((c) => c.status === 'agendada' && ehFuturoOuHoje(c.data))
        .sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`))
        .slice(0, limite);

    return {
        proximas,
        totalAgendadas: consultas.filter((c) => c.status === 'agendada').length,
        isLoading,
        isError,
    };
}