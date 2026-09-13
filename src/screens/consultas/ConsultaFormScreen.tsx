import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, CabecalhoTela, SeletorOpcoes, Carregando } from '../../components/ui';
import { ListaSelecionavel } from '../../components/consultas/ListaSelecionavel';
import { SeletorHorario } from '../../components/consultas/SeletorHorario';
import { CLINICAS, VETERINARIOS } from '../../constants/atendimento';
import { useCriarConsulta, useAtualizarConsulta } from '../../hooks/useConsultas';
import { usePets, ErroValidacao } from '../../hooks/usePets';
import { useTheme } from '../../contexts/ThemeContext';
import { mascaraData, dataBrParaIso, isoParaDataBr } from '../../utils/date';
import { emojiDaRaca } from '../../constants/racas';
import { Typography, Spacing } from '../../theme';
import type { AppScreenProps } from '../../navigation/types';
import type { ConsultaFormulario, Erros, Opcao, StatusConsulta } from '../../types';

const STATUS: Opcao[] = [
  { id: 'agendada', nome: 'Agendada' },
  { id: 'concluida', nome: 'Concluída' },
  { id: 'cancelada', nome: 'Cancelada' },
];

export default function ConsultaFormScreen({ navigation, route }: AppScreenProps<'ConsultaForm'>) {
  const { cores } = useTheme();
  const insets = useSafeAreaInsets();

  const { modo, consulta: consultaExistente, petPreSelecionado } = route.params;
  const editando = modo === 'editar' && !!consultaExistente;

  const { data: pets = [], isLoading: carregandoPets } = usePets();

  const [form, setForm] = useState<ConsultaFormulario>(
    editando
      ? {
          petId: consultaExistente.petId,
          petNome: consultaExistente.petNome,
          data: isoParaDataBr(consultaExistente.data),
          horario: consultaExistente.horario,
          clinica: consultaExistente.clinica,
          veterinario: consultaExistente.veterinario,
          motivo: consultaExistente.motivo,
          status: consultaExistente.status,
          observacoes: consultaExistente.observacoes,
        }
      : {
          petId: petPreSelecionado?.id ?? '',
          petNome: petPreSelecionado?.nome ?? '',
          data: '', horario: '', clinica: '', veterinario: '',
          motivo: '', status: 'agendada', observacoes: '',
        },
  );

  // IDs internos dos seletores de clínica e veterinário. Ao editar uma
  // consulta já existente, tenta casar o nome salvo com um item da lista
  // atual -- se não achar (ex.: dado antigo, de antes deste seletor
  // existir), fica sem nada marcado, mas o texto original em form.clinica/
  // form.veterinario continua intacto até o usuário escolher outra opção.
  const [clinicaId, setClinicaId] = useState<string>(
    () => CLINICAS.find((c) => c.nome === consultaExistente?.clinica)?.id ?? '',
  );
  const [veterinarioId, setVeterinarioId] = useState<string>(
    () => VETERINARIOS.find((v) => v.nome === consultaExistente?.veterinario)?.id ?? '',
  );

  const [erros, setErros] = useState<Erros>({});

  const criarConsulta = useCriarConsulta();
  const atualizarConsulta = useAtualizarConsulta();
  const salvando = criarConsulta.isPending || atualizarConsulta.isPending;

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
    // A troca de clínica invalida o horário escolhido antes (a disponibilidade
    // simulada depende da combinação clínica + veterinário + data).
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
    if (erro instanceof ErroValidacao) setErros(erro.erros);
    else Alert.alert('Não foi possível salvar', erro.message);
  }

  function salvar() {
    setErros({});

    const aoDarCerto = () => {
      Alert.alert('Tudo certo!', editando ? 'Consulta atualizada.' : 'Consulta agendada com sucesso.');
      navigation.goBack();
    };

    if (editando) {
      atualizarConsulta.mutate(
        { id: consultaExistente.id, dados: form },
        { onSuccess: aoDarCerto, onError: tratarErro },
      );
    } else {
      criarConsulta.mutate(form, { onSuccess: aoDarCerto, onError: tratarErro });
    }
  }

  const opcoesPets: Opcao[] = pets.map((pet) => ({
    id: String(pet.id),
    nome: pet.nome,
    emoji: emojiDaRaca(pet.raca, pet.especie),
  }));

  const dataIsoAtual = dataBrParaIso(form.data);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CabecalhoTela
        titulo={editando ? 'Editar consulta' : 'Nova consulta'}
        subtitulo={editando ? consultaExistente.motivo : 'Agende o atendimento do seu pet'}
        onVoltar={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: insets.bottom + Spacing.xxl }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {carregandoPets ? (
          <Carregando mensagem="Carregando seus pets..." />
        ) : opcoesPets.length === 0 ? (
          <Text style={[estilos.aviso, { color: cores.textSecondary }]}>
            Você ainda não tem pets cadastrados. Cadastre um pet antes de agendar uma consulta.
          </Text>
        ) : (
          <SeletorOpcoes
            label="Pet"
            opcoes={opcoesPets}
            valor={form.petId}
            onSelecionar={selecionarPet}
            erro={erros.petId}
          />
        )}

        <ListaSelecionavel
          label="Clínica"
          itens={CLINICAS.map((c) => ({ id: c.id, titulo: c.nome, subtitulo: c.endereco }))}
          valor={clinicaId}
          onSelecionar={selecionarClinica}
          erro={erros.clinica}
        />

        <ListaSelecionavel
          label="Veterinário"
          itens={VETERINARIOS.map((v) => ({ id: v.id, titulo: v.nome, subtitulo: v.especialidade }))}
          valor={veterinarioId}
          onSelecionar={selecionarVeterinario}
          erro={erros.veterinario}
        />

        <Input
          label="Data"
          valor={form.data}
          onMudar={alterarData}
          placeholder="DD/MM/AAAA"
          icone="calendar-outline"
          tipo="numeric"
          maxLength={10}
          erro={erros.data}
        />

        <SeletorHorario
          dataIso={dataIsoAtual}
          clinicaId={clinicaId}
          veterinarioId={veterinarioId}
          valor={form.horario}
          onSelecionar={(horario) => alterar('horario', horario)}
          erro={erros.horario}
        />

        <Input
          label="Motivo"
          valor={form.motivo}
          onMudar={(v) => alterar('motivo', v)}
          placeholder="Ex.: Consulta de rotina, vacinação, retorno..."
          icone="clipboard-outline"
          erro={erros.motivo}
        />

        <SeletorOpcoes<StatusConsulta>
          label="Status"
          opcoes={STATUS}
          valor={form.status}
          onSelecionar={(id) => alterar('status', id)}
          erro={erros.status}
        />

        <Input
          label="Observações"
          valor={form.observacoes}
          onMudar={(v) => alterar('observacoes', v)}
          placeholder="Sintomas, recomendações, exames solicitados..."
          icone="document-text-outline"
          multiline
          numeroLinhas={4}
        />

        <Button
          titulo={editando ? 'Salvar alterações' : 'Agendar consulta'}
          onPress={salvar}
          carregando={salvando}
          desabilitado={opcoesPets.length === 0}
          tamanho="lg"
          style={{ marginTop: Spacing.sm }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  aviso: { fontSize: Typography.bodySmall, lineHeight: 21, marginBottom: Spacing.lg },
});