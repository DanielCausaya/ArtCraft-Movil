import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const tabs = [
  { key: 'Resumen', icon: 'stats-chart', component: AdminDashboard },
  { key: 'Productos', icon: 'cube', component: AdminProducts },
  { key: 'Categorías', icon: 'albums', component: AdminCategories },
  { key: 'Pedidos', icon: 'receipt', component: AdminOrders },
  { key: 'Usuarios', icon: 'people', component: AdminUsers },
];

export default function AdminScreen({ navigation }) {
  const { user, logout } = useApp();
  const [tab, setTab] = useState('Resumen');
  const Active = tabs.find((t) => t.key === tab).component;

  const goStore = () => navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  const onLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#6b1a1a" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panel de administrador</Text>
          <Text style={styles.headerUser}>{user?.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={goStore}>
            <Ionicons name="storefront-outline" size={22} color="#FBE9D0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <Ionicons name="log-out-outline" size={22} color="#FBE9D0" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Active navigation={navigation} />
      </View>

      <View style={styles.tabBar}>
        {tabs.map((t) => (
          <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
            <Ionicons name={t.icon} size={20} color={tab === t.key ? '#FBE9D0' : '#d4a574'} />
            <Text style={tab === t.key ? styles.labelActive : styles.label}>{t.key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6b1a1a',
    paddingTop: 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#FBE9D0', fontSize: 18, fontWeight: 'bold' },
  headerUser: { color: '#d4a574', fontSize: 12, marginTop: 2 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#6b1a1a',
    paddingVertical: 8,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#8c1d0d',
  },
  tabItem: { flex: 1, alignItems: 'center' },
  label: { color: '#d4a574', fontSize: 10, marginTop: 2 },
  labelActive: { color: '#FBE9D0', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
});
