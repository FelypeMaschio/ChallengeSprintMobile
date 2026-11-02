import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useConsultas } from './useConsultas';
import {
    consultaIdDaNotificacao,
    prepararNotificacoes,
    sincronizarLembretes,
} from '../services/notificacoes';
import { Notifications } from '../services/notificacoesNativas';
import { ROTAS } from '../navigation/routes';

/** Fora do componente de propósito: sobrevive a logout/login e evita reabrir a mesma notificação. */
let ultimaNotificacaoTratada: string | null = null;

/**
 * Roda uma vez com o usuário logado: pede a permissão e, sempre que a lista de
 * consultas da API muda, deixa os lembretes do aparelho iguais a ela.
 */
export function useLembretesConsultas(): void {
    const { data: consultas } = useConsultas();

    useEffect(() => {
        void prepararNotificacoes();
    }, []);

    useEffect(() => {
        if (consultas) void sincronizarLembretes(consultas);
    }, [consultas]);
}

/** Sem o módulo nativo (Expo Go) não há resposta; a escolha é fixa por execução, então a ordem dos hooks não muda. */
const useUltimaRespostaNotificacao = Notifications
    ? Notifications.useLastNotificationResponse
    : () => null;

/**
 * Quando o usuário toca numa notificação (app aberto, em segundo plano ou fechado),
 * abre a consulta correspondente. Se ela não estiver mais na lista (foi excluída),
 * leva para a aba Consultas.
 */
export function useAbrirConsultaPelaNotificacao(): void {
    const navigation = useNavigation();
    const resposta = useUltimaRespostaNotificacao();
    const { data: consultas, isLoading } = useConsultas();

    useEffect(() => {
        if (!resposta || isLoading) return;
        if (resposta.actionIdentifier !== Notifications?.DEFAULT_ACTION_IDENTIFIER) return;

        const idDaNotificacao = resposta.notification.request.identifier;
        if (ultimaNotificacaoTratada === idDaNotificacao) return;
        ultimaNotificacaoTratada = idDaNotificacao;

        const consultaId = consultaIdDaNotificacao(resposta.notification.request.content.data);
        if (!consultaId) return;

        const consulta = consultas?.find((c) => c.id === consultaId);
        if (consulta) {
            navigation.navigate(ROTAS.CONSULTA_FORM, { modo: 'editar', consulta });
        } else {
            navigation.navigate(ROTAS.TABS, { screen: ROTAS.CONSULTAS });
        }
    }, [resposta, consultas, isLoading, navigation]);
}
