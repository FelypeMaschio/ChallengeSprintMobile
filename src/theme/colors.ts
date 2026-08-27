const marca = {
    primary: '#6C3BFF',
    primaryDark: '#4B1FD6',
    secondary: '#FF7A59',
    gradiente: ['#6C3BFF', '#9B6BFF'] as readonly [string, string],
};

export const temaClaro = {
    ...marca,
    primaryLight: '#EDE9FF',
    success: '#10B981', successLight: '#D1FAE5',
    warning: '#F59E0B', warningLight: '#FEF3C7',
    danger: '#EF4444', dangerLight: '#FEE2E2',
    info: '#3B82F6', infoLight: '#DBEAFE',
    background: '#F5F7FB', surface: '#FFFFFF', surfaceAlt: '#F9FAFB',
    text: '#111827', textSecondary: '#6B7280', textTertiary: '#9CA3AF', textInverse: '#FFFFFF',
    border: '#E5E7EB', borderLight: '#F3F4F6', overlay: 'rgba(17,24,39,0.45)',
};

export type Cores = typeof temaClaro;

export const temaEscuro: Cores = {
    ...marca,
    primary: '#9B6BFF',
    primaryLight: '#2A2140',
    success: '#34D399', successLight: '#12312A',
    warning: '#FBBF24', warningLight: '#3A2E12',
    danger: '#F87171', dangerLight: '#3B1B1B',
    info: '#60A5FA', infoLight: '#16263F',
    background: '#0F1117', surface: '#181B24', surfaceAlt: '#20242F',
    text: '#F3F4F6', textSecondary: '#9CA3AF', textTertiary: '#6B7280', textInverse: '#FFFFFF',
    border: '#2A2F3C', borderLight: '#20242F', overlay: 'rgba(0,0,0,0.6)',
};