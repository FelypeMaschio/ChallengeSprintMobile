import type { Erros } from '../types';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface DadosLogin {
    email: string;
    senha: string;
}

export interface DadosCadastro extends DadosLogin {
    nome: string;
    confirmarSenha: string;
}

export function validarLogin({ email, senha }: DadosLogin): Erros {
    const erros: Erros = {};

    if (!email?.trim()) erros.email = 'Informe seu e-mail.';
    else if (!REGEX_EMAIL.test(email.trim())) erros.email = 'E-mail em formato inválido.';

    if (!senha) erros.senha = 'Informe sua senha.';

    return erros;
}

export function validarCadastro({ nome, email, senha, confirmarSenha }: DadosCadastro): Erros {
    const erros: Erros = {};

    if (!nome?.trim()) erros.nome = 'Informe seu nome.';
    else if (nome.trim().length < 3) erros.nome = 'O nome precisa ter ao menos 3 caracteres.';

    if (!email?.trim()) erros.email = 'Informe seu e-mail.';
    else if (!REGEX_EMAIL.test(email.trim())) erros.email = 'E-mail em formato inválido.';

    if (!senha) erros.senha = 'Crie uma senha.';
    else if (senha.length < 6) erros.senha = 'A senha precisa ter no mínimo 6 caracteres.';

    if (!confirmarSenha) erros.confirmarSenha = 'Confirme a senha.';
    else if (senha !== confirmarSenha) erros.confirmarSenha = 'As senhas não conferem.';

    return erros;
}