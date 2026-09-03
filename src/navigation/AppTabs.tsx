import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ROTAS } from './routes';
import type { TabParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme';
import type { NomeIcone } from '../types';

import HomeScreen from '../screens/home/HomeScreen';
import PetsListScreen from '../screens/pets/PetsListScreen';
import ConsultasListScreen from '../screens/consultas/ConsultasListScreen';
import PerfilScreen from '../screens/perfil/PerfilScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONES: Record<keyof TabParamList, [NomeIcone, NomeIcone]> = {
    Home: ['home', 'home-outline'],
    Pets: ['paw', 'paw-outline'],
    Consultas: ['calendar', 'calendar-outline'],
    Perfil: ['person', 'person-outline'],
};

export default function AppTabs() {
    const { cores } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: cores.primary,
                tabBarInactiveTintColor: cores.textTertiary,
                tabBarStyle: {
                    backgroundColor: cores.surface,
                    borderTopColor: cores.borderLight,
                    height: 64,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: { fontSize: Typography.tiny, fontWeight: '600' },
                tabBarIcon: ({ focused, color, size }) => {
                    const [cheio, vazado] = ICONES[route.name];
                    return <Ionicons name={focused ? cheio : vazado} size={size ?? 22} color={color} />;
                },
            })}
        >
            <Tab.Screen name={ROTAS.HOME} component={HomeScreen} options={{ title: 'Início' }} />
            <Tab.Screen name={ROTAS.PETS} component={PetsListScreen} options={{ title: 'Meus Pets' }} />
            <Tab.Screen name={ROTAS.CONSULTAS} component={ConsultasListScreen} options={{ title: 'Consultas' }} />
            <Tab.Screen name={ROTAS.PERFIL} component={PerfilScreen} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
}