import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const items = [
  { label: 'Mis datos', icon: 'person-outline', section: 'data' },
  { label: 'Direcciones', icon: 'location-outline', section: 'direcciones' },
  { label: 'Métodos de pago', icon: 'card-outline', section: 'pagos' },
  { label: 'Notificaciones', icon: 'notifications-outline', section: 'notificaciones' },
  { label: 'Ayuda', icon: 'help-circle-outline', section: 'ayuda' },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useApp();

  const onLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6b1a1a" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={90} color="#FBE9D0" />
          <Text style={styles.name}>{user ? user.name : 'Invitado'}</Text>
          <Text style={styles.email}>{user ? user.email : 'sin sesión'}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OpcionesPerfil', { section: 'data' })}>
            <Text style={styles.edit}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16, gap: 10 }}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Pedidos')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="bag-handle-outline" size={20} color="#4a1008" />
              <Text style={[styles.rowText, { marginLeft: 8 }]}>Mis pedidos</Text>
            </View>
            <Text>›</Text>
          </TouchableOpacity>

          {user?.role === 'admin' && (
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Admin')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#8c1d0d" />
                <Text style={[styles.rowText, { color: '#8c1d0d', marginLeft: 8 }]}>Panel de administración</Text>
              </View>
              <Text>›</Text>
            </TouchableOpacity>
          )}

          {items.map((it) => (
            <TouchableOpacity key={it.label} style={styles.row} onPress={() => navigation.navigate('OpcionesPerfil', { section: it.section })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={it.icon} size={20} color="#4a1008" />
                <Text style={[styles.rowText, { marginLeft: 8 }]}>{it.label}</Text>
              </View>
              <Text>›</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.row} onPress={onLogout}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="log-out-outline" size={20} color="#8c1d0d" />
              <Text style={[styles.rowText, { color: '#8c1d0d', marginLeft: 8 }]}>Cerrar sesión</Text>
            </View>
            <Text>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBE9D0' },
  header: { backgroundColor: '#6b1a1a', paddingTop: 50, paddingBottom: 20, alignItems: 'center' },
  name: { color: '#FBE9D0', fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  email: { color: '#d4a574', fontSize: 13 },
  edit: { color: '#FBE9D0', fontStyle: 'italic', marginTop: 4 },
  row: { backgroundColor: '#F5D7B8', borderRadius: 10, padding: 14, flexDirection: 'row', justifyContent: 'space-between' },
  rowText: { color: '#4a1008', fontWeight: 'bold' },
});
