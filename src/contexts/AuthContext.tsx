import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { traduzirErroFirebase } from '../utils/firebaseErrors';
import { cancelarTodosLembretes } from '../services/notificacoes';
import { validarLogin, validarCadastro, type DadosLogin, type DadosCadastro } from '../validation/authValidation';
import type { Erros, Usuario } from '../types';

/** Toda operação de auth devolve o mesmo formato: a tela só decide o que exibir. */
export interface ResultadoAuth {
    ok: boolean;
    erros: Erros;
}

interface AuthContextValor {
    usuario: Usuario | null;
    autenticado: boolean;
    carregandoSessao: boolean;
    processando: boolean;
    entrar: (dados: DadosLogin) => Promise<ResultadoAuth>;
    cadastrar: (dados: DadosCadastro) => Promise<ResultadoAuth>;
    sair: () => Promise<ResultadoAuth>;
}

const AuthContext = createContext<AuthContextValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregandoSessao, setCarregandoSessao] = useState(true);
    const [processando, setProcessando] = useState(false);

    // Observa a sessão do Firebase: dispara no boot do app (já com a sessão lida do
    // AsyncStorage) e a cada login/logout. O callback é síncrono de propósito: o token
    // NÃO é buscado aqui. O interceptor do axios pede um token novo a cada requisição.
    // Buscar o token neste ponto, com rede lenta ou offline, travava a splash e
    // parecia que a sessão não tinha sido restaurada.
    useEffect(() => {
        const cancelar = onAuthStateChanged(auth, (usuarioFirebase) => {
            if (usuarioFirebase) {
                setUsuario({
                    uid: usuarioFirebase.uid,
                    email: usuarioFirebase.email,
                    nome: usuarioFirebase.displayName ?? 'Tutor',
                });
            } else {
                setUsuario(null);
            }
            setCarregandoSessao(false);
        });

        return cancelar;
    }, []);

    const valor = useMemo<AuthContextValor>(() => {
        async function entrar({ email, senha }: DadosLogin): Promise<ResultadoAuth> {
            const erros = validarLogin({ email, senha });
            if (Object.keys(erros).length > 0) return { ok: false, erros };

            setProcessando(true);
            try {
                await signInWithEmailAndPassword(auth, email.trim(), senha);
                return { ok: true, erros: {} };
            } catch (erro) {
                return { ok: false, erros: { geral: traduzirErroFirebase(erro) } };
            } finally {
                setProcessando(false);
            }
        }

        async function cadastrar(dados: DadosCadastro): Promise<ResultadoAuth> {
            const erros = validarCadastro(dados);
            if (Object.keys(erros).length > 0) return { ok: false, erros };

            setProcessando(true);
            try {
                const credencial = await createUserWithEmailAndPassword(auth, dados.email.trim(), dados.senha);
                await updateProfile(credencial.user, { displayName: dados.nome.trim() });
                setUsuario((atual) => (atual ? { ...atual, nome: dados.nome.trim() } : atual));
                return { ok: true, erros: {} };
            } catch (erro) {
                return { ok: false, erros: { geral: traduzirErroFirebase(erro) } };
            } finally {
                setProcessando(false);
            }
        }

        async function sair(): Promise<ResultadoAuth> {
            setProcessando(true);
            try {
                // Lembretes agendados são do usuário que está saindo.
                await cancelarTodosLembretes();
                await signOut(auth);
                return { ok: true, erros: {} };
            } catch (erro) {
                return { ok: false, erros: { geral: traduzirErroFirebase(erro) } };
            } finally {
                setProcessando(false);
            }
        }

        return {
            usuario,
            autenticado: !!usuario,
            carregandoSessao,
            processando,
            entrar,
            cadastrar,
            sair,
        };
    }, [usuario, carregandoSessao, processando]);

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValor {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
    return ctx;
}