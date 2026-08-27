import { usePets } from './usePets';
import { useConsultas } from './useConsultas';
import { diasAte } from '../utils/date';
import type { Alerta, Consulta, Pet } from '../types';

const JANELA_PROXIMA_DIAS = 7;
const LIMITE_SEM_ACOMPANHAMENTO_DIAS = 180;
const IDADE_FILHOTE_DIAS = 365;

/** Regras de acompanhamento. Ficam aqui, e não na tela. */
function gerarAlertas(pets: Pet[], consultas: Consulta[]): Alerta[] {
    const alertas: Alerta[] = [];

    // 1. Consultas agendadas cuja data já passou — o tutor esqueceu de dar baixa.
    consultas
        .filter((c) => c.status === 'agendada')
        .forEach((consulta) => {
            const dias = diasAte(consulta.data);
            if (dias === null) return;

            if (dias < 0) {
                alertas.push({
                    id: `atrasada-${consulta.id}`,
                    prioridade: 0,
                    tipo: 'atrasada',
                    icone: 'alert-circle-outline',
                    titulo: `${consulta.petNome || 'Pet'} tem consulta em aberto`,
                    detalhe: `${consulta.motivo} venceu há ${Math.abs(dias)} dia(s). Conclua ou reagende.`,
                    consulta,
                });
            } else if (dias <= JANELA_PROXIMA_DIAS) {
                alertas.push({
                    id: `proxima-${consulta.id}`,
                    prioridade: 1,
                    tipo: 'proxima',
                    icone: 'time-outline',
                    titulo: `${consulta.petNome || 'Pet'} tem consulta ${dias === 0 ? 'hoje' : `em ${dias} dia(s)`}`,
                    detalhe: `${consulta.motivo} · ${consulta.horario} · ${consulta.clinica}`,
                    consulta,
                });
            }
        });

    pets.forEach((pet) => {
        const doPet = consultas.filter((c) => String(c.petId) === String(pet.id));
        const idadeEmDias = -(diasAte(pet.dataNascimento) ?? 0);

        // 2. Pet sem nenhuma consulta registrada.
        if (doPet.length === 0) {
            const filhote = idadeEmDias > 0 && idadeEmDias < IDADE_FILHOTE_DIAS;
            alertas.push({
                id: `sem-consulta-${pet.id}`,
                prioridade: filhote ? 1 : 2,
                tipo: 'sem_consulta',
                icone: filhote ? 'medkit-outline' : 'calendar-outline',
                titulo: `${pet.nome} nunca passou por consulta`,
                detalhe: filhote
                    ? 'Filhote sem histórico. O ciclo de vacinação costuma começar às 6 semanas.'
                    : 'Agende um check-up para iniciar o histórico de saúde.',
                pet,
            });
            return;
        }

        // 3. Pet sem acompanhamento há muito tempo.
        const concluidas = doPet.filter((c) => c.status === 'concluida');
        if (concluidas.length === 0) return;

        const maisRecente = concluidas
            .map((c) => diasAte(c.data))
            .filter((d): d is number => d !== null)
            .sort((a, b) => b - a)[0];

        if (maisRecente !== undefined && -maisRecente > LIMITE_SEM_ACOMPANHAMENTO_DIAS) {
            const meses = Math.floor(-maisRecente / 30);
            alertas.push({
                id: `acompanhamento-${pet.id}`,
                prioridade: 2,
                tipo: 'sem_acompanhamento',
                icone: 'pulse-outline',
                titulo: `${pet.nome} está há ${meses} meses sem consulta`,
                detalhe: 'A recomendação para pets adultos é de ao menos um check-up anual.',
                pet,
            });
        }
    });

    return alertas.sort((a, b) => a.prioridade - b.prioridade);
}

export interface ResultadoAlertas {
    alertas: Alerta[];
    total: number;
    isLoading: boolean;
}

export function useAlertas(limite = 3): ResultadoAlertas {
    const { data: pets = [], isLoading: carregandoPets } = usePets();
    const { data: consultas = [], isLoading: carregandoConsultas } = useConsultas();

    const todos = gerarAlertas(pets, consultas);

    return {
        alertas: todos.slice(0, limite),
        total: todos.length,
        isLoading: carregandoPets || carregandoConsultas,
    };
}