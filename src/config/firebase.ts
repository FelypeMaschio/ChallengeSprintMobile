import { initializeApp, getApps, getApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { initializeAuth, getAuth, type Auth, type Persistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDSsV5xTeMXdniC1N_FhwXVjSMI0nmiSQI',
    authDomain: 'clyvo-vet.firebaseapp.com',
    projectId: 'clyvo-vet',
    storageBucket: 'clyvo-vet.firebasestorage.app',
    messagingSenderId: '881309064335',
    appId: '1:881309064335:android:7fc661424d79b227baa4fa',
};

/**
 * O Firebase exporta `getReactNativePersistence` em runtime no bundle React Native,
 * mas não a declara nos tipos publicados. Esta ponte tipada fecha a lacuna
 * sem `any` solto e sem `@ts-ignore`.
 */
type AuthComPersistenciaRN = {
    getReactNativePersistence(storage: unknown): Persistence;
};

const getReactNativePersistence = (firebaseAuth as unknown as AuthComPersistenciaRN)
    .getReactNativePersistence;

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// A persistência em AsyncStorage faz a sessão sobreviver ao fechar e reabrir o app.
let authInstance: Auth;
try {
    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch {
    // Em hot reload o auth já foi inicializado — reaproveita a instância existente.
    authInstance = getAuth(app);
}

export const auth = authInstance;
export default app;