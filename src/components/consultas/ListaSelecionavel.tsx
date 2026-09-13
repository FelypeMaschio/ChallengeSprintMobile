import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';

export interface ItemSelecionavel {
  id: string;
  titulo: string;
  subtitulo?: string;
}

interface ListaSelecionavelProps {
  label: string;
  itens: ItemSelecionavel[];
  valor: string;
  onSelecionar: (id: string) => void;
  erro?: string;
}

/** Cartões verticais de escolha única, com título e subtítulo — usado para
 * clínica e veterinário no formulário de consulta. */
export function ListaSelecionavel({ label, itens, valor, onSelecionar, erro }: ListaSelecionavelProps) {
  const { cores } = useTheme();

  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={[estilos.label, { color: cores.text }]}>{label}</Text>

      {itens.map((item) => {
        const ativo = item.id === valor;
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            onPress={() => onSelecionar(item.id)}
            style={[
              estilos.cartao,
              {
                backgroundColor: ativo ? cores.primaryLight : cores.surfaceAlt,
                borderColor: ativo ? cores.primary : cores.border,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[estilos.titulo, { color: cores.text }]}>{item.titulo}</Text>
              {!!item.subtitulo && (
                <Text style={[estilos.subtitulo, { color: cores.textSecondary }]}>{item.subtitulo}</Text>
              )}
            </View>
            <Ionicons
              name={ativo ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={ativo ? cores.primary : cores.textTertiary}
            />
          </TouchableOpacity>
        );
      })}

      {!!erro && <Text style={[estilos.erro, { color: cores.danger }]}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  label: { fontSize: Typography.bodySmall, fontWeight: '600', marginBottom: 8 },
  cartao: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, marginBottom: Spacing.sm,
  },
  titulo: { fontSize: Typography.body, fontWeight: '700' },
  subtitulo: { fontSize: Typography.caption, marginTop: 2 },
  erro: { fontSize: Typography.caption, marginTop: 2 },
});