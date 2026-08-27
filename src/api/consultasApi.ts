import { api, ErroApi } from './client';
import type { Consulta } from '../types';

const RECURSO = '/consultas';

export type ConsultaPayload = Omit<Consulta, 'id'>;

export const consultasApi = {
    async listar(tutorId: string): Promise<Consulta[]> {
        try {
            const { data } = await api.get<Consulta[]>(RECURSO, { params: { tutorId } });
            return Array.isArray(data) ? data : [];
        } catch (erro) {
            if (erro instanceof ErroApi && erro.status === 404) return [];
            throw erro;
        }
    },

    async buscarPorId(id: string): Promise<Consulta> {
        const { data } = await api.get<Consulta>(`${RECURSO}/${id}`);
        return data;
    },

    async criar(consulta: ConsultaPayload): Promise<Consulta> {
        const { data } = await api.post<Consulta>(RECURSO, consulta);
        return data;
    },

    async atualizar(id: string, consulta: ConsultaPayload): Promise<Consulta> {
        const { data } = await api.put<Consulta>(`${RECURSO}/${id}`, consulta);
        return data;
    },

    async remover(id: string): Promise<string> {
        await api.delete(`${RECURSO}/${id}`);
        return id;
    },
};