export const Typography = {
    display: 34, h1: 28, h2: 22, h3: 18, h4: 16,
    body: 15, bodySmall: 14, caption: 12, tiny: 11,
} as const;

export const Radius = { xs: 8, sm: 12, md: 18, lg: 24, xl: 32, full: 9999 } as const;

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const Sombra = {
    card: {
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, shadowRadius: 16, elevation: 3,
    },
    forte: {
        shadowColor: '#6C3BFF', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25, shadowRadius: 20, elevation: 8,
    },
} as const;