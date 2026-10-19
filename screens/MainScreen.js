import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import CatalogScreen from './CatalogScreen';
import FavoritesScreen from './FavoritesScreen';
import ProfileScreen from './ProfileScreen';
import { useApp } from '../context/AppContext';

const tabs = [
  { key: 'Inicio', icon: 'home', component: HomeScreen },
  { key: 'Catálogo', icon: 'grid', component: CatalogScreen },
  { key: 'Favoritos', icon: 'heart', component: FavoritesScreen },
  { key: 'Perfil', icon: 'person', component: ProfileScreen },
];

export default function MainScreen({ navigation }) {
  const { cart } = useApp();
  const [tab, setTab] = useState('Inicio');
  const Active = tabs.find((t) => t.key === tab).component;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Active navigation={navigation} setTab={setTab} />

        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Carrito')}>
          <Ionicons name="cart" size={24} color="#FBE9D0" />
          {cartCount > 0 && (
            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((t) => (
          <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
            <Ionicons name={t.icon} size={22} color={tab === t.key ? '#FBE9D0' : '#d4a574'} />
            <Text style={tab === t.key ? styles.labelActive : styles.label}>{t.key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8c1d0d',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  fabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#d4580b',
    borderWidth: 2,
    borderColor: '#FBE9D0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  fabBadgeText: { color: '#FBE9D0', fontSize: 11, fontWeight: 'bold' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#6b1a1a',
    paddingVertical: 8,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#8c1d0d',
  },
  tabItem: { flex: 1, alignItems: 'center' },
  label: { color: '#d4a574', fontSize: 11 },
  labelActive: { color: '#FBE9D0', fontSize: 11, fontWeight: 'bold' },
});
