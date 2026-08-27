import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { temaClaro, temaEscuro, type Cores } from '../theme';

const CHAVE_TEMA = '@clyvo:tema';

type Esquema = 'light' | 'dark';

interface ThemeContextValor {
    esquema: Esquema;
    escuro: boolean;
    cores: Cores;
    carregando: boolean;
    alternarTema: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValor | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const esquemaDoSistema = useColorScheme();
    const [esquema, setEsquema] = useState<Esquema>('light');
    const [carregando, setCarregando] = useState(true);

    // Restaura a preferência salva; se nunca escolheu, segue o sistema.
    useEffect(() => {
        void (async () => {
            try {
                const salvo = await AsyncStorage.getItem(CHAVE_TEMA);
                if (salvo === 'light' || salvo === 'dark') setEsquema(salvo);
                else setEsquema(esquemaDoSistema === 'dark' ? 'dark' : 'light');
            } catch {
                setEsquema('light');
            } finally {
                setCarregando(false);
            }
        })();
    }, [esquemaDoSistema]);

    const valor = useMemo<ThemeContextValor>(() => {
        async function alternarTema() {
            const novo: Esquema = esquema === 'light' ? 'dark' : 'light';
            setEsquema(novo);
            try {
                await AsyncStorage.setItem(CHAVE_TEMA, novo);
            } catch {
                // preferência de tema não é crítica — segue com o valor em memória
            }
        }

        return {
            esquema,
            escuro: esquema === 'dark',
            cores: esquema === 'dark' ? temaEscuro : temaClaro,
            carregando,
            alternarTema,
        };
    }, [esquema, carregando]);

    return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValor {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme precisa estar dentro de <ThemeProvider>');
    return ctx;
}