import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../Constants/theme';
import HomeScreen from '../Screens/Home/HomeScreen';
import ProductsScreen from '../Screens/Products/ProductsScreen';
import CartScreen from '../Screens/Cart/CartScreen';
import OrdersScreen from '../Screens/Orders/OrdersScreen';
import InvoicesScreen from '../Screens/Invoices/InvoicesScreen';
import SettingsScreen from '../Screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const tabData = {
  Home: { icon: 'home-outline', label: 'Inicio' },
  Products: { icon: 'grid-outline', label: 'Productos' },
  Orders: { icon: 'receipt-outline', label: 'Pedidos' },
  Invoices: { icon: 'document-text-outline', label: 'Facturas' },
  Settings: { icon: 'settings-outline', label: 'Perfil' },
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => {
      const item = tabData[route.name] || { icon: 'cart-outline', label: 'Carrito' };
      return {
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 0,
          elevation: 12,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: COLORS.shadowDark,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabel: () => null,
        tabBarIcon: ({ focused }) => (
          <>
            <Ionicons
              color={focused ? COLORS.primary : COLORS.textSecondary}
              name={focused ? item.icon.replace('-outline', '') : item.icon}
              size={22}
            />
            <Text style={{ color: focused ? COLORS.primary : COLORS.textSecondary, fontSize: 10, fontWeight: focused ? '800' : '600', marginTop: 3 }}>
              {item.label}
            </Text>
          </>
        ),
      };
    }}
  >
    <Tab.Screen component={HomeScreen} name="Home" />
    <Tab.Screen component={ProductsScreen} name="Products" />
    {/* Cart sigue registrado para navigation.navigate('Cart'), pero no aparece en el menú inferior. */}
    <Tab.Screen component={CartScreen} name="Cart" options={{ tabBarButton: () => null }} />
    <Tab.Screen component={OrdersScreen} name="Orders" />
    <Tab.Screen component={InvoicesScreen} name="Invoices" />
    <Tab.Screen component={SettingsScreen} name="Settings" />
  </Tab.Navigator>
);

export default TabNavigator;
