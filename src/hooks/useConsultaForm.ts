import { useState } from 'react';
import { useCriarConsulta, useAtualizarConsulta } from './useConsultas';
import { usePets, ErroValidacao } from './usePets';
import { ErroApi } from '../api/client';
import { CLINICAS, VETERINARIOS, veterinariosDaClinica } from '../constants/atendimento';
import { emojiDaRaca } from '../constants/racas';
import { mascaraData, dataBrParaIso, isoParaDataBr } from '../utils/date';
import type { Consulta, ConsultaFormulario, Erros, Opcao } from '../types';

interface Parametros {
    consultaExistente?: Consulta;
    petPreSelecionado?: { id: string; nome: string };
    /** A tela decide como avisar o usuário (Alert, toast...). O hook só avisa que acabou. */
    aoConcluir: (mensagem: string) => void;
    aoFalhar: (titulo: string, mensagem: string) => void;
}

function formularioInicial(
    consulta?: Consulta,
    pet?: { id: string; nome: string },
): ConsultaFormulario {
    if (consulta) {
        return {
            petId: consulta.petId,
            petNome: consulta.petNome,
            data: isoParaDataBr(consulta.data),
            horario: consulta.horario,
            clinica: consulta.clinica,
            veterinario: consulta.veterinario,
            motivo: consulta.motivo,
            status: consulta.status,
            observacoes: consulta.observacoes,
        };
    }
    return {
        petId: pet?.id ?? '',
        petNome: pet?.nome ?? '',
        data: '', horario: '', clinica: '', veterinario: '',
        motivo: '', status: 'agendada', observacoes: '',
    };
}

/**
 * Todo o estado e a regra do formulário de consulta. A tela só desenha.
 *
 * O backend guarda clínica e veterinário como texto; os ids internos
 * (clinicaId / veterinarioId) existem só para os seletores da tela.
 */
export function useConsultaForm({ consultaExistente, petPreSelecionado, aoConcluir, aoFalhar }: Parametros) {
    const editando = !!consultaExistente;

    const { data: pets = [], isLoading: carregandoPets } = usePets();
    const criarConsulta = useCriarConsulta();
    const atualizarConsulta = useAtualizarConsulta();

    const [form, setForm] = useState<ConsultaFormulario>(() =>
        formularioInicial(consultaExistente, petPreSelecionado),
    );
    const [erros, setErros] = useState<Erros>({});

    // Ao editar, tenta casar o nome salvo com um item da lista atual. Dado antigo
    // que não casar fica sem marcação, mas o texto original continua no form.
    const [clinicaId, setClinicaId] = useState<string>(
        () => CLINICAS.find((c) => c.nome === consultaExistente?.clinica)?.id ?? '',
    );
    const [veterinarioId, setVeterinarioId] = useState<string>(
        () => VETERINARIOS.find((v) => v.nome === consultaExistente?.veterinario)?.id ?? '',
    );

    const veterinariosDisponiveis = clinicaId ? veterinariosDaClinica(clinicaId) : [];

    const opcoesPets: Opcao[] = pets.map((pet) => ({
        id: String(pet.id),
        nome: pet.nome,
        emoji: emojiDaRaca(pet.raca, pet.especie),
    }));

    function alterar<K extends keyof ConsultaFormulario>(campo: K, valor: ConsultaFormulario[K]) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
        if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
    }

    function selecionarPet(id: string) {
        const pet = pets.find((p) => String(p.id) === String(id));
        setForm((atual) => ({ ...atual, petId: id, petNome: pet?.nome ?? '' }));
        if (erros.petId) setErros((atual) => ({ ...atual, petId: undefined }));
    }

    function selecionarClinica(id: string) {
        setClinicaId(id);
        const clinica = CLINICAS.find((c) => c.id === id);
        if (clinica) alterar('clinica', clinica.nome);

        // Trocar de clínica invalida o médico (se ele não atende lá) e o horário,
        // já que a disponibilidade depende dos três juntos.
        const medicoAindaValido = veterinariosDaClinica(id).some((v) => v.id === veterinarioId);
        if (!medicoAindaValido) {
            setVeterinarioId('');
            alterar('veterinario', '');
        }
        alterar('horario', '');
    }

    function selecionarVeterinario(id: string) {
        setVeterinarioId(id);
        const veterinario = VETERINARIOS.find((v) => v.id === id);
        if (veterinario) alterar('veterinario', veterinario.nome);
        alterar('horario', '');
    }

    function alterarData(valor: string) {
        alterar('data', mascaraData(valor));
        alterar('horario', '');
    }

    function tratarErro(erro: Error) {
        if (erro instanceof ErroValidacao) {
            setErros(erro.erros);
            return;
        }
        // Se o backend detalhou por campo, mostra ao lado do campo certo.
        if (erro instanceof ErroApi && erro.campos && Object.keys(erro.campos).length > 0) {
            setErros(erro.campos);
            aoFalhar('Verifique os campos destacados', erro.message);
            return;
        }
        aoFalhar('Não foi possível salvar', erro.message);
    }

    function salvar() {
        setErros({});
        const opcoes = {
            onSuccess: () => aoConcluir(editando ? 'Consulta atualizada.' : 'Consulta agendada com sucesso.'),
            onError: tratarErro,
        };

        if (consultaExistente) {
            atualizarConsulta.mutate({ id: consultaExistente.id, dados: form }, opcoes);
        } else {
            criarConsulta.mutate(form, opcoes);
        }
    }

    return {
        form, erros, editando,
        opcoesPets, carregandoPets,
        clinicaId, veterinarioId, veterinariosDisponiveis,
        dataIso: dataBrParaIso(form.data),
        salvando: criarConsulta.isPending || atualizarConsulta.isPending,
        alterar, alterarData, selecionarPet, selecionarClinica, selecionarVeterinario, salvar,
    };
}
