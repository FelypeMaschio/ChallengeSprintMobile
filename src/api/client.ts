import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { auth } from '../config/firebase';

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
  timeout: 60000, // Render Free hiberna: a 1ª requisição pode levar até 60s
  headers: { 'Content-Type': 'application/json' },
});

// Anexa o token do Firebase em toda requisição. getIdToken() renova sozinho
// quando o token está perto de expirar — o token dura só 1 hora, então NÃO dá
// para guardar um valor fixo: precisa buscar auth.currentUser a cada chamada.
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const usuario = auth.currentUser;
  if (usuario) {
    config.headers.Authorization = `Bearer ${await usuario.getIdToken()}`;
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