/**
 * Dados de agenda usados no formulário de consulta.
 *
 * A "disponibilidade" dos horários é SIMULADA no cliente, de forma
 * determinística (mesma data + clínica + veterinário sempre geram o mesmo
 * resultado) — o backend ainda não tem uma tabela de agenda real. Isso é
 * intencional: o objetivo é a experiência de escolher um horário livre,
 * como numa clínica de verdade, sem exigir uma API nova agora.
 */

export interface Clinica {
  id: string;
  nome: string;
  endereco: string;
}

export interface Veterinario {
  id: string;
  nome: string;
  especialidade: string;
  /** Cada veterinário atende numa única clínica -- assim como no projeto
   * anterior (mock.ts), evita mostrar um médico disponível numa unidade
   * onde ele não trabalha. */
  clinicaId: string;
}

export const CLINICAS: Clinica[] = [
  { id: 'paulista', nome: 'Clyvo Vet — Unidade Paulista', endereco: 'Av. Paulista, 1200 — São Paulo/SP' },
  { id: 'pinheiros', nome: 'Clyvo Vet — Unidade Pinheiros', endereco: 'R. dos Pinheiros, 850 — São Paulo/SP' },
  { id: 'moema', nome: 'Clyvo Vet — Unidade Moema', endereco: 'Av. Ibirapuera, 2450 — São Paulo/SP' },
];

export const VETERINARIOS: Veterinario[] = [
  { id: 'marina', nome: 'Dra. Marina Alves', especialidade: 'Clínica geral', clinicaId: 'paulista' },
  { id: 'ricardo', nome: 'Dr. Ricardo Souza', especialidade: 'Cirurgia', clinicaId: 'paulista' },
  { id: 'camila', nome: 'Dra. Camila Duarte', especialidade: 'Dermatologia', clinicaId: 'pinheiros' },
  { id: 'bruno', nome: 'Dr. Bruno Ferreira', especialidade: 'Cardiologia', clinicaId: 'pinheiros' },
  { id: 'juliana', nome: 'Dra. Juliana Ramos', especialidade: 'Oncologia', clinicaId: 'moema' },
  { id: 'paulo', nome: 'Dr. Paulo Oliveira', especialidade: 'Ortopedia', clinicaId: 'moema' },
];

/** Veterinários que atendem numa clínica específica. */
export function veterinariosDaClinica(clinicaId: string): Veterinario[] {
  return VETERINARIOS.filter((v) => v.clinicaId === clinicaId);
}

/** Horários de atendimento: 08:00 às 18:00, a cada 30 minutos. */
export const HORARIOS_DISPONIVEIS: string[] = (() => {
  const horarios: string[] = [];
  for (let minutos = 8 * 60; minutos <= 18 * 60; minutos += 30) {
    const hora = String(Math.floor(minutos / 60)).padStart(2, '0');
    const min = String(minutos % 60).padStart(2, '0');
    horarios.push(`${hora}:${min}`);
  }
  return horarios;
})();

function hashDeterministico(texto: string): number {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash * 31 + texto.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Devolve, para a combinação data + clínica + veterinário, quais horários
 * já estão ocupados. Determinístico: a mesma combinação sempre gera o
 * mesmo resultado — não muda a cada vez que a tela é aberta.
 */
export function gerarDisponibilidade(
  dataIso: string,
  clinicaId: string,
  veterinarioId: string,
): Record<string, boolean> {
  const semente = hashDeterministico(`${dataIso}|${clinicaId}|${veterinarioId}`);
  const disponibilidade: Record<string, boolean> = {};

  HORARIOS_DISPONIVEIS.forEach((horario, indice) => {
    const valor = (semente + indice * 17) % 5;
    disponibilidade[horario] = valor !== 0 && valor !== 1;
  });

  return disponibilidade;
}