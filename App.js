import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './context/AppContext';
import CustomSplash from './components/CustomSplash';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/MainScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileMenuScreen from './screens/ProfileMenuScreen';
import AdminScreen from './screens/admin/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <CustomSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#6b1a1a" />
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Producto" component={ProductDetailScreen} />
          <Stack.Screen name="Carrito" component={CartScreen} />
          <Stack.Screen name="Pago" component={PaymentScreen} />
          <Stack.Screen name="Pedidos" component={OrdersScreen} />
          <Stack.Screen name="OpcionesPerfil" component={ProfileMenuScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
