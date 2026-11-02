import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Erros } from '../types';

/** Estado e envio do login. Em caso de sucesso o RootNavigator troca de stack sozinho. */
export function useLoginForm() {
    const { entrar, processando } = useAuth();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erros, setErros] = useState<Erros>({});

    async function enviar() {
        const resultado = await entrar({ email, senha });
        setErros(resultado.erros);
    }

    return { email, setEmail, senha, setSenha, erros, processando, enviar };
}
