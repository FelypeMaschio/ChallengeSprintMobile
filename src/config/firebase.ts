import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { initializeAuth, getAuth, type Auth, type Persistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDaiw2EHxR_v34iFXeXsjOSmVOouR_6g9c',
    authDomain: 'clyvo-vet.firebaseapp.com',
    projectId: 'clyvo-vet',
    storageBucket: 'clyvo-vet.firebasestorage.app',
    messagingSenderId: '881309064335',
    appId: '1:881309064335:web:068af435ed52af74baa4fa',
};

/**
 * O Firebase exporta `getReactNativePersistence` em runtime no bundle React Native,
 * mas não a declara nos tipos publicados. Esta ponte tipada fecha a lacuna
 * sem `any` solto e sem `@ts-ignore`.
 */
type AuthComPersistenciaRN = {
    getReactNativePersistence?: (storage: unknown) => Persistence;
};

const getReactNativePersistence = (firebaseAuth as unknown as AuthComPersistenciaRN)
    .getReactNativePersistence;

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Cria o Auth com a sessão persistida no AsyncStorage: é isso que faz o usuário
 * continuar logado depois de fechar e reabrir o app (o token fica no aparelho).
 *
 * Nenhuma falha é engolida em silêncio. Sem persistência explícita o Firebase
 * guarda a sessão só em memória, e o app pediria login a cada abertura.
 */
function criarAuth(): Auth {
    // Na web (expo start --web) o próprio Firebase usa IndexedDB/localStorage.
    if (Platform.OS === 'web') return getAuth(app);

    if (!getReactNativePersistence) {
        throw new Error(
            'Firebase Auth: getReactNativePersistence não encontrado. ' +
            'Verifique a versão do pacote "firebase" e se o bundle é o de React Native.',
        );
    }

    try {
        return initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    } catch (erro) {
        // Único erro aceitável aqui: o Fast Refresh re-executa este módulo e o Auth
        // já existe (com a persistência configurada na primeira execução).
        // Qualquer outro erro é relançado, nunca vira uma sessão só em memória.
        const codigo = (erro as { code?: string }).code;
        if (codigo === 'auth/already-initialized') return getAuth(app);
        throw erro;
    }
}

export const auth: Auth = criarAuth();
export default app;
