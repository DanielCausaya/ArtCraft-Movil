import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';

export default function AdminUsers() {
  const { users, user, toggleUserActive } = useApp();

  const onToggle = (u) => {
    const res = toggleUserActive(u.id);
    if (!res.ok) Alert.alert('No permitido', res.error);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.count}>{users.length} usuarios</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => {
          const esAdmin = item.role === 'admin';
          const esYo = item.email === user?.email;
          return (
            <View style={[styles.card, !item.active && styles.cardOff]}>
              <View style={[styles.avatar, esAdmin && { backgroundColor: '#6b1a1a' }]}>
                <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  {esYo && <Text style={styles.yo}>(tú)</Text>}
                </View>
                <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                  <View style={[styles.badge, esAdmin && styles.badgeAdmin]}>
                    <Text style={[styles.badgeText, esAdmin && { color: '#FBE9D0' }]}>
                      {esAdmin ? 'Administrador' : 'Cliente'}
                    </Text>
                  </View>
                  <View style={[styles.badge, item.active ? styles.badgeOn : styles.badgeOff]}>
                    <Text style={styles.badgeText}>{item.active ? 'Activo' : 'Desactivado'}</Text>
                  </View>
                </View>
              </View>

              <Switch
                value={item.active}
                onValueChange={() => onToggle(item)}
                disabled={esYo}
                trackColor={{ false: '#d4a574', true: '#8c1d0d' }}
                thumbColor="#FBE9D0"
              />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBE9D0' },
  toolbar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  count: { color: '#4a1008', fontWeight: 'bold' },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#E8853D', borderRadius: 12, padding: 12,
  },
  cardOff: { opacity: 0.6 },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#d4580b',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#FBE9D0', fontSize: 18, fontWeight: 'bold' },
  name: { color: '#4a1008', fontWeight: 'bold', fontSize: 14 },
  yo: { color: '#8c1d0d', fontSize: 11, fontStyle: 'italic' },
  email: { color: '#4a1008', fontSize: 12 },
  badge: {
    backgroundColor: '#FBE9D0', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  badgeAdmin: { backgroundColor: '#6b1a1a' },
  badgeOn: { backgroundColor: '#d9f2cc' },
  badgeOff: { backgroundColor: '#f2cccc' },
  badgeText: { color: '#8c1d0d', fontSize: 10, fontWeight: 'bold' },
});
