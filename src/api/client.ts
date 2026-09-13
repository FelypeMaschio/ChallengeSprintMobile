import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { auth } from '../config/firebase';

/** Erro já traduzido para o usuário. `campos` traz o detalhe por campo que o
 * backend devolveu (quando existir), em vez de só uma mensagem genérica. */
export class ErroApi extends Error {
  status?: number;
  campos?: Record<string, string>;

  constructor(mensagem: string, status?: number, campos?: Record<string, string>) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.campos = campos;
  }
}

export const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const usuario = auth.currentUser;
  if (usuario) {
    config.headers.Authorization = `Bearer ${await usuario.getIdToken()}`;
  }
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro: AxiosError<{ mensagem?: string; campos?: Record<string, string> }>) => {
    const status = erro.response?.status;
    const corpo = erro.response?.data;

    let mensagem = corpo?.mensagem ?? 'Não foi possível conectar ao servidor. Verifique sua internet.';

    if (erro.code === 'ECONNABORTED') mensagem = 'O servidor demorou demais para responder.';
    else if (!corpo?.mensagem && status === 400) mensagem = 'Os dados enviados são inválidos.';
    else if (!corpo?.mensagem && status === 401) mensagem = 'Sua sessão expirou. Faça login novamente.';
    else if (!corpo?.mensagem && status === 403) mensagem = 'Você não tem permissão para esta ação.';
    else if (!corpo?.mensagem && status === 404) mensagem = 'Registro não encontrado.';
    else if (!corpo?.mensagem && status !== undefined && status >= 500) mensagem = 'Erro no servidor. Tente novamente em instantes.';

    return Promise.reject(new ErroApi(mensagem, status, corpo?.campos));
  },
);