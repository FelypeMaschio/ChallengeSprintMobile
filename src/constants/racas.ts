import type { EspecieId, Raca } from '../types';

export interface Especie {
    id: EspecieId;
    nome: string;
    emoji: string;
}

export const ESPECIES: Especie[] = [
    { id: 'cachorro', nome: 'Cachorro', emoji: '🐶' },
    { id: 'gato', nome: 'Gato', emoji: '🐱' },
    { id: 'ave', nome: 'Ave', emoji: '🐦' },
    { id: 'roedor', nome: 'Roedor', emoji: '🐹' },
    { id: 'outro', nome: 'Outro', emoji: '🐾' },
];

export const RACAS: Raca[] = [
    { id: 'srd-c', nome: 'Vira-lata (SRD)', especie: 'cachorro', porte: 'Variado', emoji: '🐕', traco: 'Companheiro e resistente' },
    { id: 'labrador', nome: 'Labrador Retriever', especie: 'cachorro', porte: 'Grande', emoji: '🦮', traco: 'Dócil e brincalhão' },
    { id: 'golden', nome: 'Golden Retriever', especie: 'cachorro', porte: 'Grande', emoji: '🐕‍🦺', traco: 'Gentil e leal' },
    { id: 'poodle', nome: 'Poodle', especie: 'cachorro', porte: 'Pequeno', emoji: '🐩', traco: 'Inteligente e ativo' },
    { id: 'shihtzu', nome: 'Shih Tzu', especie: 'cachorro', porte: 'Pequeno', emoji: '🐶', traco: 'Afetuoso e caseiro' },
    { id: 'yorkshire', nome: 'Yorkshire Terrier', especie: 'cachorro', porte: 'Pequeno', emoji: '🐕', traco: 'Corajoso e agitado' },
    { id: 'bulldog-frances', nome: 'Bulldog Francês', especie: 'cachorro', porte: 'Pequeno', emoji: '🐶', traco: 'Calmo e grudento' },
    { id: 'pug', nome: 'Pug', especie: 'cachorro', porte: 'Pequeno', emoji: '🐶', traco: 'Sociável e tranquilo' },
    { id: 'pastor-alemao', nome: 'Pastor Alemão', especie: 'cachorro', porte: 'Grande', emoji: '🐕‍🦺', traco: 'Protetor e obediente' },
    { id: 'rottweiler', nome: 'Rottweiler', especie: 'cachorro', porte: 'Grande', emoji: '🐕', traco: 'Forte e territorial' },
    { id: 'beagle', nome: 'Beagle', especie: 'cachorro', porte: 'Médio', emoji: '🐕', traco: 'Farejador e curioso' },
    { id: 'border-collie', nome: 'Border Collie', especie: 'cachorro', porte: 'Médio', emoji: '🐕', traco: 'Muito inteligente' },
    { id: 'husky', nome: 'Husky Siberiano', especie: 'cachorro', porte: 'Grande', emoji: '🐺', traco: 'Enérgico e falante' },
    { id: 'dachshund', nome: 'Dachshund (Salsicha)', especie: 'cachorro', porte: 'Pequeno', emoji: '🌭', traco: 'Teimoso e divertido' },
    { id: 'pinscher', nome: 'Pinscher', especie: 'cachorro', porte: 'Pequeno', emoji: '🐕', traco: 'Alerta e vigilante' },
    { id: 'chihuahua', nome: 'Chihuahua', especie: 'cachorro', porte: 'Pequeno', emoji: '🐕', traco: 'Apegado ao tutor' },
    { id: 'maltes', nome: 'Maltês', especie: 'cachorro', porte: 'Pequeno', emoji: '🐩', traco: 'Dócil e elegante' },
    { id: 'lhasa', nome: 'Lhasa Apso', especie: 'cachorro', porte: 'Pequeno', emoji: '🐶', traco: 'Independente' },
    { id: 'spitz', nome: 'Spitz Alemão (Lulu)', especie: 'cachorro', porte: 'Pequeno', emoji: '🦊', traco: 'Vivaz e atento' },
    { id: 'boxer', nome: 'Boxer', especie: 'cachorro', porte: 'Grande', emoji: '🐕', traco: 'Brincalhão e leal' },
    { id: 'pitbull', nome: 'American Pit Bull', especie: 'cachorro', porte: 'Médio', emoji: '🐕', traco: 'Atlético e afetuoso' },
    { id: 'cocker', nome: 'Cocker Spaniel', especie: 'cachorro', porte: 'Médio', emoji: '🐕', traco: 'Alegre e sociável' },
    { id: 'schnauzer', nome: 'Schnauzer', especie: 'cachorro', porte: 'Médio', emoji: '🐕', traco: 'Companheiro e alerta' },
    { id: 'akita', nome: 'Akita', especie: 'cachorro', porte: 'Grande', emoji: '🐕', traco: 'Fiel e reservado' },
    { id: 'shiba', nome: 'Shiba Inu', especie: 'cachorro', porte: 'Médio', emoji: '🦊', traco: 'Independente e limpo' },
    { id: 'weimaraner', nome: 'Weimaraner', especie: 'cachorro', porte: 'Grande', emoji: '🐕', traco: 'Ativo e apegado' },

    { id: 'srd-g', nome: 'Vira-lata (SRD)', especie: 'gato', porte: 'Médio', emoji: '🐈', traco: 'Adaptável e esperto' },
    { id: 'siames', nome: 'Siamês', especie: 'gato', porte: 'Médio', emoji: '🐈', traco: 'Comunicativo' },
    { id: 'persa', nome: 'Persa', especie: 'gato', porte: 'Médio', emoji: '🐈', traco: 'Calmo e caseiro' },
    { id: 'maine', nome: 'Maine Coon', especie: 'gato', porte: 'Grande', emoji: '🐈', traco: 'Gigante gentil' },
    { id: 'angora', nome: 'Angorá', especie: 'gato', porte: 'Médio', emoji: '🐈', traco: 'Brincalhão' },
    { id: 'bengal', nome: 'Bengal', especie: 'gato', porte: 'Médio', emoji: '🐆', traco: 'Muito ativo' },
    { id: 'ragdoll', nome: 'Ragdoll', especie: 'gato', porte: 'Grande', emoji: '🐈', traco: 'Relaxado e dócil' },
    { id: 'sphynx', nome: 'Sphynx', especie: 'gato', porte: 'Médio', emoji: '🐈', traco: 'Carente e quente' },
    { id: 'britishsh', nome: 'British Shorthair', especie: 'gato', porte: 'Médio', emoji: '🐈', traco: 'Tranquilo' },

    { id: 'calopsita', nome: 'Calopsita', especie: 'ave', porte: 'Pequeno', emoji: '🦜', traco: 'Cantora e social' },
    { id: 'periquito', nome: 'Periquito', especie: 'ave', porte: 'Pequeno', emoji: '🦜', traco: 'Ativo e curioso' },
    { id: 'hamster', nome: 'Hamster', especie: 'roedor', porte: 'Pequeno', emoji: '🐹', traco: 'Noturno' },
    { id: 'coelho', nome: 'Coelho', especie: 'roedor', porte: 'Pequeno', emoji: '🐰', traco: 'Sensível e dócil' },
    { id: 'porquinho', nome: 'Porquinho-da-índia', especie: 'roedor', porte: 'Pequeno', emoji: '🐹', traco: 'Sociável' },
    { id: 'outro', nome: 'Outra raça', especie: 'outro', porte: 'Variado', emoji: '🐾', traco: 'Único como o seu pet' },
];

export function racasPorEspecie(especieId: EspecieId): Raca[] {
    return RACAS.filter((r) => r.especie === especieId);
}

export function buscarRacaPorNome(nome: string): Raca | null {
    if (!nome) return null;
    return RACAS.find((r) => r.nome.toLowerCase() === nome.toLowerCase()) ?? null;
}

export function emojiDaRaca(nome: string, especieId: EspecieId): string {
    const raca = buscarRacaPorNome(nome);
    if (raca) return raca.emoji;
    return ESPECIES.find((e) => e.id === especieId)?.emoji ?? '🐾';
}