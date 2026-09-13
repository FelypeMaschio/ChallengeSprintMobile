import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import { HORARIOS_DISPONIVEIS, gerarDisponibilidade } from '../../constants/atendimento';

interface SeletorHorarioProps {
  /** Data no formato AAAA-MM-DD. Vazio = ainda não dá pra calcular disponibilidade. */
  dataIso: string;
  clinicaId: string;
  veterinarioId: string;
  valor: string;
  onSelecionar: (horario: string) => void;
  erro?: string;
}

/** Grade de horários — desabilitada até que data, clínica e veterinário estejam
 * escolhidos, e com os horários já ocupados simulados riscados. */
export function SeletorHorario({
  dataIso,
  clinicaId,
  veterinarioId,
  valor,
  onSelecionar,
  erro,
}: SeletorHorarioProps) {
  const { cores } = useTheme();

  const prontoParaEscolher = !!dataIso && !!clinicaId && !!veterinarioId;

  const disponibilidade = useMemo(() => {
    if (!prontoParaEscolher) return {};
    return gerarDisponibilidade(dataIso, clinicaId, veterinarioId);
  }, [dataIso, clinicaId, veterinarioId, prontoParaEscolher]);

  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={[estilos.label, { color: cores.text }]}>Horário</Text>

      {!prontoParaEscolher ? (
        <View style={[estilos.aviso, { backgroundColor: cores.surfaceAlt, borderColor: cores.border }]}>
          <Text style={[estilos.avisoTexto, { color: cores.textSecondary }]}>
            Escolha a clínica, o veterinário e a data para ver os horários disponíveis.
          </Text>
        </View>
      ) : (
        <View style={estilos.grade}>
          {HORARIOS_DISPONIVEIS.map((horario) => {
            const ocupado = disponibilidade[horario] === false;
            const ativo = horario === valor;

            return (
              <TouchableOpacity
                key={horario}
                disabled={ocupado}
                activeOpacity={0.8}
                onPress={() => onSelecionar(horario)}
                style={[
                  estilos.chip,
                  {
                    backgroundColor: ativo ? cores.primary : ocupado ? cores.borderLight : cores.surfaceAlt,
                    borderColor: ativo ? cores.primary : cores.border,
                    opacity: ocupado ? 0.5 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    estilos.chipTexto,
                    { color: ativo ? cores.textInverse : ocupado ? cores.textTertiary : cores.text },
                    ocupado && estilos.chipTextoOcupado,
                  ]}
                >
                  {horario}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {!!erro && <Text style={[estilos.erroTexto, { color: cores.danger }]}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  label: { fontSize: Typography.bodySmall, fontWeight: '600', marginBottom: 8 },
  aviso: { padding: Spacing.md, borderRadius: Radius.sm, borderWidth: 1.5 },
  avisoTexto: { fontSize: Typography.bodySmall, lineHeight: 20 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    borderRadius: Radius.full, borderWidth: 1.5, minWidth: 74, alignItems: 'center',
  },
  chipTexto: { fontSize: Typography.bodySmall, fontWeight: '600' },
  chipTextoOcupado: { textDecorationLine: 'line-through' },
  erroTexto: { fontSize: Typography.caption, marginTop: 4 },
});