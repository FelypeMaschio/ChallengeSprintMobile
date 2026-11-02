import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { DadosCadastro } from '../validation/authValidation';
import type { Erros } from '../types';

const FORM_VAZIO: DadosCadastro = { nome: '', email: '', senha: '', confirmarSenha: '' };

/** Estado e envio do cadastro. Em caso de sucesso o RootNavigator troca de stack sozinho. */
export function useCadastroForm() {
    const { cadastrar, processando } = useAuth();

    const [form, setForm] = useState<DadosCadastro>(FORM_VAZIO);
    const [erros, setErros] = useState<Erros>({});

    function alterar(campo: keyof DadosCadastro, valor: string) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    }

    async function enviar() {
        const resultado = await cadastrar(form);
        setErros(resultado.erros);
    }

    return { form, erros, processando, alterar, enviar };
}
