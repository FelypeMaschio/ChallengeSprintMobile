import { useState } from 'react';
import { useCriarPet, useAtualizarPet, ErroValidacao } from './usePets';
import { isoParaDataBr } from '../utils/date';
import type { EspecieId, Erros, Pet, PetFormulario } from '../types';

interface Parametros {
    petExistente?: Pet;
    aoConcluir: (mensagem: string) => void;
    aoFalhar: (titulo: string, mensagem: string) => void;
}

const FORM_VAZIO: PetFormulario = {
    nome: '', especie: 'cachorro', raca: '', sexo: '',
    dataNascimento: '', peso: '', castrado: false, foto: '', observacoes: '',
};

function formularioInicial(pet?: Pet): PetFormulario {
    if (!pet) return FORM_VAZIO;
    return {
        nome: pet.nome,
        especie: pet.especie,
        raca: pet.raca,
        sexo: pet.sexo,
        dataNascimento: isoParaDataBr(pet.dataNascimento),
        peso: String(pet.peso ?? ''),
        castrado: pet.castrado,
        foto: pet.foto,
        observacoes: pet.observacoes,
    };
}

/** Estado, validação e envio do formulário de pet. A tela só desenha. */
export function usePetForm({ petExistente, aoConcluir, aoFalhar }: Parametros) {
    const editando = !!petExistente;
    const criarPet = useCriarPet();
    const atualizarPet = useAtualizarPet();

    const [form, setForm] = useState<PetFormulario>(() => formularioInicial(petExistente));
    const [erros, setErros] = useState<Erros>({});

    function alterar<K extends keyof PetFormulario>(campo: K, valor: PetFormulario[K]) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
        if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
    }

    /** Trocar de espécie zera a raça: a lista de raças é outra. */
    function alterarEspecie(especie: EspecieId) {
        setForm((atual) => ({ ...atual, especie, raca: '' }));
    }

    function tratarErro(erro: Error) {
        if (erro instanceof ErroValidacao) setErros(erro.erros);
        else aoFalhar('Não foi possível salvar', erro.message);
    }

    function salvar() {
        setErros({});
        const opcoes = {
            onSuccess: () => aoConcluir(editando ? 'Pet atualizado com sucesso.' : 'Pet cadastrado com sucesso.'),
            onError: tratarErro,
        };

        if (petExistente) {
            atualizarPet.mutate({ id: petExistente.id, dados: form }, opcoes);
        } else {
            criarPet.mutate(form, opcoes);
        }
    }

    return {
        form, erros, editando,
        salvando: criarPet.isPending || atualizarPet.isPending,
        alterar, alterarEspecie, salvar,
    };
}
