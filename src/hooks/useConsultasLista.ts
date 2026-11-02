import { useMemo, useState } from 'react';
import { useConsultas, useAlterarStatusConsulta, useRemoverConsulta } from './useConsultas';
import type { Consulta, StatusConsulta } from '../types';

export type FiltroConsultas = StatusConsulta | 'todas';

interface Parametros {
    aoFalhar: (mensagem: string) => void;
}

/** Filtro, conclusão e exclusão da listagem de consultas. A tela só desenha. */
export function useConsultasLista({ aoFalhar }: Parametros) {
    const consultasQuery = useConsultas();
    const alterarStatus = useAlterarStatusConsulta();
    const removerConsulta = useRemoverConsulta();

    const [filtro, setFiltro] = useState<FiltroConsultas>('todas');

    const consultas = consultasQuery.data ?? [];

    const visiveis = useMemo(
        () => (filtro === 'todas' ? consultas : consultas.filter((c) => c.status === filtro)),
        [consultas, filtro],
    );

    function concluir(consulta: Consulta) {
        alterarStatus.mutate(
            { consulta, novoStatus: 'concluida' },
            { onError: (erro) => aoFalhar(erro.message) },
        );
    }

    function excluir(consulta: Consulta) {
        removerConsulta.mutate(consulta.id, { onError: (erro) => aoFalhar(erro.message) });
    }

    return {
        consultas, visiveis, filtro, setFiltro,
        isLoading: consultasQuery.isLoading,
        isError: consultasQuery.isError,
        error: consultasQuery.error,
        isRefetching: consultasQuery.isRefetching,
        recarregar: consultasQuery.refetch,
        concluir, excluir,
    };
}
