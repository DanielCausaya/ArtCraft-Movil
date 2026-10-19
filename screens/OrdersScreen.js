import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, Image,
} from 'react-native';
import { formatCOP } from '../data/mock';
import { useApp } from '../context/AppContext';

const tabs = [
  { label: 'Todos', status: null },
  { label: 'En camino', status: 'En camino' },
  { label: 'Entregados', status: 'Entregado' },
  { label: 'Cancelados', status: 'Cancelado' },
];

const statusColor = (s) => (s === 'Entregado' ? '#2b7a0b' : s === 'Cancelado' ? '#8c1d0d' : '#d4580b');

export default function OrdersScreen({ navigation }) {
  const { orders } = useApp();
  const [tab, setTab] = useState(0);

  const filtrados = tabs[tab].status
    ? orders.filter((o) => o.status === tabs[tab].status)
    : orders;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6b1a1a" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <Text style={{ fontSize: 20, color: '#FBE9D0' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis pedidos</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.tabsRow}>
        {tabs.map((t, i) => (
          <TouchableOpacity
            key={t.label}
            style={[styles.tabBtn, i === tab && styles.tabBtnActive]}
            onPress={() => setTab(i)}
          >
            <Text style={i === tab ? styles.tabActive : styles.tab}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 60, color: '#8c1d0d' }}>
            {orders.length === 0
              ? 'Aún no tienes pedidos. ¡Compra algo!'
              : 'No tienes pedidos en esta categoría.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.title}>Pedido {item.id}</Text>
              <Text style={[styles.status, { color: statusColor(item.status) }]}>{item.status} ›</Text>
            </View>
            <Text style={styles.date}>{item.date}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              {item.items.map((it) => (
                <View key={it.product.id} style={styles.thumb}>
                  <Image source={it.product.image} style={{ width: 36, height: 36, borderRadius: 6 }} />
                </View>
              ))}
              <Text style={styles.total}>{formatCOP(item.total)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBE9D0' },
  header: { backgroundColor: '#6b1a1a', paddingTop: 40, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#FBE9D0', fontSize: 18, fontWeight: 'bold' },
  card: { backgroundColor: '#E8853D', borderRadius: 12, padding: 14 },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 8,
    flexWrap: 'wrap',
  },
  tabBtn: {
    backgroundColor: '#F5D7B8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabBtnActive: { backgroundColor: '#8c1d0d' },
  tab: { color: '#8c1d0d', fontSize: 12 },
  tabActive: { color: '#FBE9D0', fontSize: 12, fontWeight: 'bold' },
  title: { color: '#4a1008', fontWeight: 'bold' },
  status: { fontWeight: 'bold' },
  date: { color: '#4a1008', fontSize: 12 },
  thumb: { width: 44, height: 44, backgroundColor: '#d4580b', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  total: { marginLeft: 'auto', color: '#4a1008', fontWeight: 'bold', alignSelf: 'center' },
});
