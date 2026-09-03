import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROTAS } from './routes';
import type { AppStackParamList } from './types';
import AppTabs from './AppTabs';

import PetFormScreen from '../screens/pets/PetFormScreen';
import PetDetalheScreen from '../screens/pets/PetDetalheScreen';
import ConsultaFormScreen from '../screens/consultas/ConsultaFormScreen';
import SobreScreen from '../screens/sobre/SobreScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

/** Rotas acessíveis SOMENTE com usuário autenticado. */
export default function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name={ROTAS.TABS} component={AppTabs} />
            <Stack.Screen name={ROTAS.PET_DETALHE} component={PetDetalheScreen} />
            <Stack.Screen name={ROTAS.PET_FORM} component={PetFormScreen} />
            <Stack.Screen name={ROTAS.CONSULTA_FORM} component={ConsultaFormScreen} />
            <Stack.Screen name={ROTAS.SOBRE} component={SobreScreen} />
        </Stack.Navigator>
    );
}