import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { isoParaDataBr } from '../utils/date';
import type { Consulta } from '../types';

/**
 * Notificações LOCAIS do Clyvo Vet, sempre geradas a partir de uma consulta real
 * (a que o tutor acabou de agendar ou que veio da API):
 *
 *  - confirmação: dispara logo após o tutor agendar a consulta;
 *  - lembrete: agendado para ANTECEDENCIA_LEMBRETE_MIN minutos antes do horário.
 *
 * Tocar em qualquer uma abre a consulta (ver hooks/useNotificacoes.ts).
 * Nada aqui toca na tela: este arquivo é a camada de serviço.
 */

export const CANAL_CONSULTAS = 'consultas';
export const ANTECEDENCIA_LEMBRETE_MIN = 30;

/** Dados que viajam dentro da notificação e voltam quando o usuário toca nela. */
export interface DadosNotificacaoConsulta {
    consultaId: string;
}

// Com o app aberto, a notificação também aparece (banner + lista).
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const idLembrete = (consultaId: string) => `consulta-${consultaId}-lembrete`;

/** 'AAAA-MM-DD' + 'HH:MM' (hora local do aparelho). Nulo se o dado vier inválido. */
function dataHoraDaConsulta(consulta: Consulta): Date | null {
    const dia = consulta.data?.slice(0, 10);
    const hora = consulta.horario?.slice(0, 5);
    if (!dia || !hora) return null;
    const resultado = new Date(`${dia}T${hora}:00`);
    return Number.isNaN(resultado.getTime()) ? null : resultado;
}

/** Cria o canal (Android) e pede a permissão. Devolve se pode notificar. */
export async function prepararNotificacoes(): Promise<boolean> {
    try {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync(CANAL_CONSULTAS, {
                name: 'Consultas',
                importance: Notifications.AndroidImportance.HIGH,
            });
        }
        const atual = await Notifications.getPermissionsAsync();
        if (atual.granted) return true;
        const pedido = await Notifications.requestPermissionsAsync();
        return pedido.granted;
    } catch {
        return false;
    }
}

export async function cancelarLembrete(consultaId: string): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(idLembrete(consultaId));
    } catch {
        // cancelar algo que não existe não é erro para o usuário
    }
}

export async function cancelarTodosLembretes(): Promise<void> {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
        // idem
    }
}

/**
 * (Re)agenda o lembrete da consulta. Idempotente: pode ser chamada a cada
 * sincronização, pois o identificador fixo substitui o agendamento anterior.
 * Consulta que não está "agendada" ou que já passou não tem lembrete.
 */
export async function agendarLembrete(consulta: Consulta): Promise<void> {
    await cancelarLembrete(consulta.id);
    if (consulta.status !== 'agendada') return;

    const horario = dataHoraDaConsulta(consulta);
    if (!horario) return;

    const quando = new Date(horario.getTime() - ANTECEDENCIA_LEMBRETE_MIN * 60_000);
    if (quando.getTime() <= Date.now()) return;

    const dados: DadosNotificacaoConsulta = { consultaId: consulta.id };
    try {
        await Notifications.scheduleNotificationAsync({
            identifier: idLembrete(consulta.id),
            content: {
                title: 'Lembrete de consulta',
                body: `${consulta.petNome || 'Seu pet'} tem consulta às ${consulta.horario} com ${consulta.veterinario}.`,
                data: { ...dados },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: quando,
                channelId: CANAL_CONSULTAS,
            },
        });
    } catch {
        // falha ao notificar não pode quebrar o fluxo de agendamento
    }
}

/** Evento real: o tutor acabou de agendar. Confirma na hora e agenda o lembrete. */
export async function notificarConsultaAgendada(consulta: Consulta): Promise<void> {
    if (consulta.status === 'agendada') {
        const dados: DadosNotificacaoConsulta = { consultaId: consulta.id };
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Consulta agendada',
                    body: `${consulta.petNome || 'Seu pet'}: ${isoParaDataBr(consulta.data)} às ${consulta.horario}, ${consulta.clinica}.`,
                    data: { ...dados },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: 1,
                    channelId: CANAL_CONSULTAS,
                },
            });
        } catch {
            // idem
        }
    }
    await agendarLembrete(consulta);
}

/** Mantém os lembretes do aparelho iguais ao que existe na API. */
export async function sincronizarLembretes(consultas: Consulta[]): Promise<void> {
    await Promise.all(consultas.map((consulta) => agendarLembrete(consulta)));
}

/** Lê o consultaId de uma notificação tocada; nulo se não for de consulta. */
export function consultaIdDaNotificacao(
    dados: Record<string, unknown> | undefined,
): string | null {
    const id = dados?.consultaId;
    return typeof id === 'string' && id.length > 0 ? id : null;
}
