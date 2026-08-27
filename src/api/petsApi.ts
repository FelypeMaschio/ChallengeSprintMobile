import { api, ErroApi } from './client';
import type { Pet } from '../types';

const RECURSO = '/pets';

/** Corpo enviado à API: um Pet sem o id, que o servidor gera. */
export type PetPayload = Omit<Pet, 'id'>;

export const petsApi = {
    async listar(tutorId: string): Promise<Pet[]> {
        try {
            const { data } = await api.get<Pet[]>(RECURSO, { params: { tutorId } });
            return Array.isArray(data) ? data : [];
        } catch (erro) {
            if (erro instanceof ErroApi && erro.status === 404) return [];
            throw erro;
        }
    },

    async buscarPorId(id: string): Promise<Pet> {
        const { data } = await api.get<Pet>(`${RECURSO}/${id}`);
        return data;
    },

    async criar(pet: PetPayload): Promise<Pet> {
        const { data } = await api.post<Pet>(RECURSO, pet);
        return data;
    },

    async atualizar(id: string, pet: PetPayload): Promise<Pet> {
        const { data } = await api.put<Pet>(`${RECURSO}/${id}`, pet);
        return data;
    },

    async remover(id: string): Promise<string> {
        await api.delete(`${RECURSO}/${id}`);
        return id;
    },
};