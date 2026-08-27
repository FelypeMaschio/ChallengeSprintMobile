import type { Ionicons } from '@expo/vector-icons';

/** Nome válido de ícone do Ionicons — erro de digitação vira erro de compilação. */
export type NomeIcone = keyof typeof Ionicons.glyphMap;

export type EspecieId = 'cachorro' | 'gato' | 'ave' | 'roedor' | 'outro';
export type Sexo = 'Macho' | 'Fêmea';
export type StatusConsulta = 'agendada' | 'concluida' | 'cancelada';

/** Mapa de erros por campo. A chave 'geral' guarda erros que não pertencem a um campo. */
export type Erros = Record<string, string | undefined>;

export interface Usuario {
    uid: string;
    email: string | null;
    nome: string;
}

export interface Raca {
    id: string;
    nome: string;
    especie: EspecieId;
    porte: string;
    emoji: string;
    traco: string;
}

/** Pet como vem da API — sempre com id. */
export interface Pet {
    id: string;
    tutorId: string;
    nome: string;
    especie: EspecieId;
    raca: string;
    sexo: Sexo | '';
    dataNascimento: string;
    peso: string;
    castrado: boolean;
    foto: string;
    observacoes: string;
}

/** Dados do formulário de pet, antes de virar Pet. */
export interface PetFormulario {
    nome: string;
    especie: EspecieId;
    raca: string;
    sexo: Sexo | '';
    dataNascimento: string;
    peso: string;
    castrado: boolean;
    foto: string;
    observacoes: string;
}

export interface Consulta {
    id: string;
    tutorId: string;
    petId: string;
    petNome: string;
    data: string;
    horario: string;
    clinica: string;
    veterinario: string;
    motivo: string;
    status: StatusConsulta;
    observacoes: string;
}

export interface ConsultaFormulario {
    petId: string;
    petNome: string;
    data: string;
    horario: string;
    clinica: string;
    veterinario: string;
    motivo: string;
    status: StatusConsulta;
    observacoes: string;
}

export interface Alerta {
    id: string;
    prioridade: 0 | 1 | 2;
    tipo: 'atrasada' | 'proxima' | 'sem_consulta' | 'sem_acompanhamento';
    icone: NomeIcone;
    titulo: string;
    detalhe: string;
    consulta?: Consulta;
    pet?: Pet;
}

export interface Opcao {
    id: string;
    nome: string;
    emoji?: string;
}