import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { Consulta, Pet } from '../types';

/** Abas do fluxo autenticado. `undefined` = a rota não recebe parâmetros. */
export type TabParamList = {
    Home: undefined;
    Pets: undefined;
    Consultas: undefined;
    Perfil: undefined;
};

/** Rotas do fluxo autenticado (stack). */
export type AppStackParamList = {
    Tabs: NavigatorScreenParams<TabParamList> | undefined;
    PetDetalhe: { petId: string };
    PetForm: { modo: 'criar' | 'editar'; pet?: Pet };
    ConsultaForm: {
        modo: 'criar' | 'editar';
        consulta?: Consulta;
        petPreSelecionado?: { id: string; nome: string };
    };
    Sobre: undefined;
};

/** Rotas do fluxo público. */
export type AuthStackParamList = {
    Login: undefined;
    Cadastro: undefined;
};

/** Props tipadas para telas do stack autenticado. */
export type AppScreenProps<T extends keyof AppStackParamList> =
    NativeStackScreenProps<AppStackParamList, T>;

/** Props tipadas para telas do fluxo público. */
export type AuthScreenProps<T extends keyof AuthStackParamList> =
    NativeStackScreenProps<AuthStackParamList, T>;

/**
 * Props para telas dentro das abas. O CompositeScreenProps é o que permite
 * navegar de uma aba para uma rota do stack (ex.: Pets -> PetDetalhe) com tipo correto.
 */
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    NativeStackScreenProps<AppStackParamList>
>;

/** Deixa o useNavigation() tipado em qualquer lugar do app, sem generic manual. */
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace ReactNavigation {
        interface RootParamList extends AppStackParamList, AuthStackParamList { }
    }
}