import type { Erros, PetFormulario } from '../types';

export function validarPet(dados: PetFormulario): Erros {
    const erros: Erros = {};
    const { nome, especie, raca, sexo, dataNascimento, peso } = dados;

    if (!nome?.trim()) erros.nome = 'Informe o nome do pet.';
    else if (nome.trim().length < 2) erros.nome = 'O nome precisa ter ao menos 2 caracteres.';

    if (!especie) erros.especie = 'Selecione a espécie.';
    if (!raca?.trim()) erros.raca = 'Selecione a raça.';
    if (!sexo) erros.sexo = 'Selecione o sexo.';

    if (!dataNascimento?.trim()) {
        erros.dataNascimento = 'Informe a data de nascimento.';
    } else if (!ehDataBrValida(dataNascimento)) {
        erros.dataNascimento = 'Use o formato DD/MM/AAAA.';
    } else if (ehDataFutura(dataNascimento)) {
        erros.dataNascimento = 'A data de nascimento não pode estar no futuro.';
    }

    if (!peso) {
        erros.peso = 'Informe o peso em kg.';
    } else {
        const numero = Number(peso.replace(',', '.'));
        if (Number.isNaN(numero) || numero <= 0) erros.peso = 'Peso inválido.';
        else if (numero > 120) erros.peso = 'Peso acima do esperado para um pet doméstico.';
    }

    return erros;
}

function ehDataBrValida(dataBr: string): boolean {
    const partes = dataBr.split('/');
    if (partes.length !== 3) return false;

    const [dia, mes, ano] = partes.map(Number);
    if (!dia || !mes || !ano || String(ano).length !== 4) return false;
    if (mes < 1 || mes > 12) return false;

    return dia >= 1 && dia <= new Date(ano, mes, 0).getDate();
}

function ehDataFutura(dataBr: string): boolean {
    const [dia, mes, ano] = dataBr.split('/').map(Number);
    const data = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    return data > hoje;
}