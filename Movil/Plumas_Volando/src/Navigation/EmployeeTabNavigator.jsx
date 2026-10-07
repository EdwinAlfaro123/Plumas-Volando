import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../Constants/theme';
import EmployeeOrdersScreen from '../Screens/Employee/EmployeeOrdersScreen';
import EmployeeSettingsScreen from '../Screens/Employee/EmployeeSettingsScreen';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
  EmployeeOrders:   { filled: 'receipt',  outline: 'receipt-outline',  label: 'Pedidos' },
  EmployeeSettings: { filled: 'person',   outline: 'person-outline',   label: 'Perfil'  },
};

const EmployeeTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom, 10) + 6 }]}>
      <View style={styles.shadowDark}>
        <View style={styles.shadowLight}>
          {state.routes.map((route, index) => {
            const cfg = TAB_CONFIG[route.name];
            if (!cfg) return null;
            const active = state.index === index;

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tab}
                onPress={() => navigation.navigate(route.name)}
                activeOpacity={0.75}
              >
                <View style={[styles.iconOuter, active && styles.iconOuterActive]}>
                  <View style={[styles.iconInner, active && styles.iconInnerActive]}>
                    <Ionicons
                      name={active ? cfg.filled : cfg.outline}
                      size={22}
                      color={active ? COLORS.primary : COLORS.textSecondary}
                    />
                  </View>
                </View>
                <Text style={[styles.label, active && styles.labelActive]}>{cfg.label}</Text>
                {active && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const EmployeeTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <EmployeeTabBar {...props} />}
    sceneContainerStyle={{ paddingBottom: 88 }}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen component={EmployeeOrdersScreen} name="EmployeeOrders" />
    <Tab.Screen component={EmployeeSettingsScreen} name="EmployeeSettings" />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
  },
  shadowDark: {
    borderRadius: 30,
    backgroundColor: COLORS.background,
    shadowColor: '#B8BAC8',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.85,
    shadowRadius: 12,
    elevation: 10,
  },
  shadowLight: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: COLORS.background,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconOuter: {
    width: 44,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: 40,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOuterActive: {
    backgroundColor: COLORS.background,
    shadowColor: '#B8BAC8',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  iconInnerActive: {
    backgroundColor: COLORS.background,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 3,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
});

export default EmployeeTabNavigator;
