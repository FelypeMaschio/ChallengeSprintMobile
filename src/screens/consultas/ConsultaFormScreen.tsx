import React from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, CabecalhoTela, SeletorOpcoes, Carregando } from '../../components/ui';
import { ListaSelecionavel } from '../../components/consultas/ListaSelecionavel';
import { SeletorHorario } from '../../components/consultas/SeletorHorario';
import { CLINICAS } from '../../constants/atendimento';
import { useConsultaForm } from '../../hooks/useConsultaForm';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing } from '../../theme';
import type { AppScreenProps } from '../../navigation/types';
import type { Opcao, StatusConsulta } from '../../types';

const STATUS: Opcao[] = [
  { id: 'agendada', nome: 'Agendada' },
  { id: 'concluida', nome: 'Concluída' },
  { id: 'cancelada', nome: 'Cancelada' },
];

export default function ConsultaFormScreen({ navigation, route }: AppScreenProps<'ConsultaForm'>) {
  const { cores } = useTheme();
  const insets = useSafeAreaInsets();

  const { modo, consulta: consultaExistente, petPreSelecionado } = route.params;

  // Estado, validação e envio vivem no hook. A tela só desenha e decide como avisar o usuário.
  const {
    form, erros, editando, opcoesPets, carregandoPets,
    clinicaId, veterinarioId, veterinariosDisponiveis, dataIso: dataIsoAtual, salvando,
    alterar, alterarData, selecionarPet, selecionarClinica, selecionarVeterinario, salvar,
  } = useConsultaForm({
    consultaExistente: modo === 'editar' ? consultaExistente : undefined,
    petPreSelecionado,
    aoConcluir: (mensagem) => {
      Alert.alert('Tudo certo!', mensagem);
      navigation.goBack();
    },
    aoFalhar: (titulo, mensagem) => Alert.alert(titulo, mensagem),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CabecalhoTela
        titulo={editando ? 'Editar consulta' : 'Nova consulta'}
        subtitulo={editando ? consultaExistente?.motivo : 'Agende o atendimento do seu pet'}
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

        {!clinicaId ? (
          <Text style={[estilos.aviso, { color: cores.textSecondary }]}>
            Escolha a clínica para ver os veterinários que atendem nela.
          </Text>
        ) : (
          <ListaSelecionavel
            label="Veterinário"
            itens={veterinariosDisponiveis.map((v) => ({ id: v.id, titulo: v.nome, subtitulo: v.especialidade }))}
            valor={veterinarioId}
            onSelecionar={selecionarVeterinario}
            erro={erros.veterinario}
          />
        )}

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