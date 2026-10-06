import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FloatingTabBar from '../Components/Navigation/FloatingTabBar';
import HomeScreen from '../Screens/Home/HomeScreen';
import ProductsScreen from '../Screens/Products/ProductsScreen';
import CartScreen from '../Screens/Cart/CartScreen';
import OrdersScreen from '../Screens/Orders/OrdersScreen';
import InvoicesScreen from '../Screens/Invoices/InvoicesScreen';
import SettingsScreen from '../Screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <FloatingTabBar {...props} />}
    // paddingBottom para que el contenido no quede debajo del tab bar flotante
    sceneContainerStyle={{ paddingBottom: 88 }}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen component={HomeScreen}     name="Home"     />
    <Tab.Screen component={ProductsScreen} name="Products" />
    {/* Cart registrado para navigation.navigate('Cart') pero oculto de la barra */}
    <Tab.Screen component={CartScreen}     name="Cart"     />
    <Tab.Screen component={OrdersScreen}   name="Orders"   />
    <Tab.Screen component={InvoicesScreen} name="Invoices" />
    <Tab.Screen component={SettingsScreen} name="Settings" />
  </Tab.Navigator>
);

export default TabNavigator;
