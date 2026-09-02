import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../Constants/theme';
import HomeScreen from '../Screens/Home/HomeScreen';
import ProductsScreen from '../Screens/Products/ProductsScreen';
import CartScreen from '../Screens/Cart/CartScreen';
import OrdersScreen from '../Screens/Orders/OrdersScreen';
import InvoicesScreen from '../Screens/Invoices/InvoicesScreen';
import SettingsScreen from '../Screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // Configuración de la barra
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 0,
          elevation: 10,
          height: 80, // Aumentamos la altura para acomodar el ícono y el texto manual
          paddingTop: 8,
          paddingBottom: 12,
        },
        // Dibujamos manualmente el ícono y el texto
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Products') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Orders') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Invoices') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';

          // Este componente se dibuja manualmente para evitar el error de "String cannot be cast to Double"
          return (
            <>
              <Ionicons name={iconName} size={24} color={focused ? COLORS.primary : COLORS.textSecondary} />
              <Text 
                style={{
                  fontSize: 12,
                  marginTop: 2,
                  color: focused ? COLORS.primary : COLORS.textSecondary,
                  fontWeight: focused ? '700' : '400',
                }}
              >
                {route.name === 'Home' ? 'Inicio' :
                 route.name === 'Products' ? 'Productos' :
                 route.name === 'Cart' ? 'Carrito' :
                 route.name === 'Orders' ? 'Pedidos' :
                 route.name === 'Invoices' ? 'Facturas' :
                 route.name === 'Settings' ? 'Ajustes' : ''}
              </Text>
            </>
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Products" component={ProductsScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Invoices" component={InvoicesScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: () => null }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;