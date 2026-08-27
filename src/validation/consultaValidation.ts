import type { Erros, ConsultaFormulario, StatusConsulta } from '../types';

export const STATUS_CONSULTA: StatusConsulta[] = ['agendada', 'concluida', 'cancelada'];

export function validarConsulta(dados: ConsultaFormulario): Erros {
    const erros: Erros = {};
    const { petId, data, horario, clinica, veterinario, motivo, status } = dados;

    if (!petId) erros.petId = 'Selecione o pet da consulta.';

    if (!data?.trim()) erros.data = 'Informe a data da consulta.';
    else if (!ehDataBrValida(data)) erros.data = 'Use o formato DD/MM/AAAA.';

    if (!horario?.trim()) erros.horario = 'Informe o horário.';
    else if (!ehHoraValida(horario)) erros.horario = 'Use o formato HH:MM (00:00 a 23:59).';

    if (!clinica?.trim()) erros.clinica = 'Informe a clínica.';
    else if (clinica.trim().length < 3) erros.clinica = 'Nome da clínica muito curto.';

    if (!veterinario?.trim()) erros.veterinario = 'Informe o veterinário responsável.';

    if (!motivo?.trim()) erros.motivo = 'Descreva o motivo da consulta.';
    else if (motivo.trim().length < 4) erros.motivo = 'Descreva o motivo com mais detalhes.';

    if (status && !STATUS_CONSULTA.includes(status)) erros.status = 'Status inválido.';

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

function ehHoraValida(hora: string): boolean {
    const partes = hora.split(':');
    if (partes.length !== 2) return false;

    const [h, m] = partes.map(Number);
    return Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59;
}