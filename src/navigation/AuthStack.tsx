import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROTAS } from './routes';
import type { AuthStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import CadastroScreen from '../screens/auth/CadastroScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Rotas acessíveis SEM autenticação. */
export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name={ROTAS.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROTAS.CADASTRO} component={CadastroScreen} />
        </Stack.Navigator>
    );
}