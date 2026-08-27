import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';

/** Erro já traduzido para o usuário. `status` permite decisões nos módulos de API. */
export class ErroApi extends Error {
    status?: number;

    constructor(mensagem: string, status?: number) {
        super(mensagem);
        this.name = 'ErroApi';
        this.status = status;
    }
}

export const api = axios.create({
    baseURL: ENV.API_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

let tokenAtual: string | null = null;

export function definirTokenAuth(token: string | null): void {
    tokenAtual = token;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (tokenAtual) {
        config.headers.Authorization = `Bearer ${tokenAtual}`;
    }
    return config;
});

api.interceptors.response.use(
    (resposta) => resposta,
    (erro: AxiosError) => {
        const status = erro.response?.status;
        let mensagem = 'Não foi possível conectar ao servidor. Verifique sua internet.';

        if (erro.code === 'ECONNABORTED') mensagem = 'O servidor demorou demais para responder.';
        else if (status === 400) mensagem = 'Os dados enviados são inválidos.';
        else if (status === 401) mensagem = 'Sua sessão expirou. Faça login novamente.';
        else if (status === 403) mensagem = 'Você não tem permissão para esta ação.';
        else if (status === 404) mensagem = 'Registro não encontrado.';
        else if (status !== undefined && status >= 500) mensagem = 'Erro no servidor. Tente novamente em instantes.';

        return Promise.reject(new ErroApi(mensagem, status));
    },
);