import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../features/dashboard/DashboardScreen';
import AddHabitScreen from '../features/habits/AddHabitScreen';
import SimulationScreen from '../features/simulation/SimulationScreen';
import ProfileScreen from '../features/onboarding/ProfileScreen';
import { colors, fontFamilies } from '../theme';

export type RootTabParamList = {
  Accueil: undefined;
  Ajouter: undefined;
  Simuler: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Accueil: '🧾',
  Ajouter: '➕',
  Simuler: '🔮',
  Profil: '🙂',
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.mintDeep,
          tabBarInactiveTintColor: colors.inkSoft,
          tabBarStyle: {
            backgroundColor: colors.paper,
            borderTopColor: colors.paperDim,
          },
          tabBarLabelStyle: {
            fontFamily: fontFamilies.ui.medium,
            fontSize: 12,
          },
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>{TAB_ICONS[route.name]}</Text>
          ),
        })}
      >
        <Tab.Screen name="Accueil" component={DashboardScreen} />
        <Tab.Screen name="Ajouter" component={AddHabitScreen} />
        <Tab.Screen name="Simuler" component={SimulationScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
