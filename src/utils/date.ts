export function mascaraData(valor: string): string {
    const numeros = String(valor).replace(/\D/g, '').slice(0, 8);
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

export function mascaraHora(valor: string): string {
    const numeros = String(valor).replace(/\D/g, '').slice(0, 4);
    if (numeros.length <= 2) return numeros;
    return `${numeros.slice(0, 2)}:${numeros.slice(2)}`;
}

/** 'DD/MM/AAAA' -> 'AAAA-MM-DD' (formato usado na API). */
export function dataBrParaIso(dataBr: string): string {
    const numeros = String(dataBr ?? '').replace(/\D/g, '');
    if (numeros.length !== 8) return '';
    return `${numeros.slice(4, 8)}-${numeros.slice(2, 4)}-${numeros.slice(0, 2)}`;
}

/** 'AAAA-MM-DD' -> 'DD/MM/AAAA' (formato de exibição). */
export function isoParaDataBr(iso: string): string {
    if (!iso) return '';
    const [ano, mes, dia] = String(iso).split('-');
    if (!ano || !mes || !dia) return '';
    return `${dia}/${mes}/${ano}`;
}

export function calcularIdade(dataIso: string): string {
    if (!dataIso) return '—';

    const nascimento = new Date(`${dataIso}T00:00:00`);
    if (Number.isNaN(nascimento.getTime())) return '—';

    const dias = Math.floor((Date.now() - nascimento.getTime()) / 86400000);
    if (dias < 30) return `${dias} dia${dias === 1 ? '' : 's'}`;

    const meses = Math.floor(dias / 30);
    if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;

    const anos = Math.floor(meses / 12);
    const resto = meses % 12;
    return resto === 0 ? `${anos} ano${anos === 1 ? '' : 's'}` : `${anos}a ${resto}m`;
}

export function ehFuturoOuHoje(dataIso: string): boolean {
    if (!dataIso) return false;
    const alvo = new Date(`${dataIso}T00:00:00`);
    if (Number.isNaN(alvo.getTime())) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return alvo >= hoje;
}

/** Dias entre uma data 'AAAA-MM-DD' e hoje. Negativo = passado. */
export function diasAte(dataIso: string): number | null {
    if (!dataIso) return null;
    const alvo = new Date(`${dataIso}T00:00:00`);
    if (Number.isNaN(alvo.getTime())) return null;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return Math.round((alvo.getTime() - hoje.getTime()) / 86400000);
}