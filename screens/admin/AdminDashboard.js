import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { formatCOP } from '../../data/mock';

const ESTADOS = ['En camino', 'Entregado', 'Cancelado'];

export default function AdminDashboard() {
  const { products, categories, orders, users } = useApp();

  const activos = orders.filter((o) => o.status !== 'Cancelado');
  const ingresos = activos.reduce((s, o) => s + o.total, 0);

  const porEstado = ESTADOS.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));
  const maxEstado = Math.max(1, ...porEstado.map((e) => e.count));

  const vendidos = {};
  activos.forEach((o) =>
    o.items.forEach((it) => {
      vendidos[it.product.name] = (vendidos[it.product.name] || 0) + it.qty;
    })
  );
  const top = Object.entries(vendidos).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const stats = [
    { icon: 'cube', label: 'Productos', value: String(products.length) },
    { icon: 'albums', label: 'Categorías', value: String(categories.length) },
    { icon: 'receipt', label: 'Pedidos', value: String(orders.length) },
    { icon: 'people', label: 'Usuarios', value: String(users.length) },
  ];

  const estadoColor = (s) => (s === 'Entregado' ? '#2b7a0b' : s === 'Cancelado' ? '#8c1d0d' : '#d4580b');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={styles.ingresoCard}>
        <Text style={styles.ingresoLabel}>Ingresos (sin cancelados)</Text>
        <Text style={styles.ingresoValue}>{formatCOP(ingresos)}</Text>
        <Text style={styles.ingresoSub}>
          {activos.length} pedido{activos.length === 1 ? '' : 's'} activo{activos.length === 1 ? '' : 's'}
        </Text>
      </View>

      <View style={styles.grid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Ionicons name={s.icon} size={20} color="#8c1d0d" />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pedidos por estado</Text>
        {porEstado.map((e) => (
          <View key={e.status} style={styles.estadoRow}>
            <Text style={styles.estadoLabel}>{e.status}</Text>
            <View style={styles.barraBg}>
              <View
                style={[
                  styles.barra,
                  { width: `${(e.count / maxEstado) * 100}%`, backgroundColor: estadoColor(e.status) },
                ]}
              />
            </View>
            <Text style={styles.estadoCount}>{e.count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productos más vendidos</Text>
        {top.length === 0 ? (
          <Text style={styles.vacio}>Aún no hay ventas registradas.</Text>
        ) : (
          top.map(([name, qty], i) => (
            <View key={name} style={styles.topRow}>
              <Text style={styles.topRank}>{i + 1}</Text>
              <Text style={styles.topName} numberOfLines={1}>{name}</Text>
              <Text style={styles.topQty}>{qty} und.</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimos pedidos</Text>
        {orders.slice(0, 3).map((o) => (
          <View key={o.id} style={styles.pedidoRow}>
            <View>
              <Text style={styles.pedidoId}>Pedido {o.id}</Text>
              <Text style={styles.pedidoCliente}>{o.customer || 'Cliente'} · {o.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.pedidoTotal}>{formatCOP(o.total)}</Text>
              <Text style={[styles.pedidoEstado, { color: estadoColor(o.status) }]}>{o.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBE9D0' },
  ingresoCard: { backgroundColor: '#6b1a1a', borderRadius: 16, padding: 18 },
  ingresoLabel: { color: '#d4a574', fontSize: 12 },
  ingresoValue: { color: '#FBE9D0', fontSize: 26, fontWeight: 'bold', marginTop: 4 },
  ingresoSub: { color: '#d4a574', fontSize: 12, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    flexGrow: 1, flexBasis: '45%', backgroundColor: '#E8853D', borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  statValue: { color: '#4a1008', fontSize: 22, fontWeight: 'bold', marginTop: 6 },
  statLabel: { color: '#4a1008', fontSize: 12 },
  section: { backgroundColor: '#F5D7B8', borderRadius: 12, padding: 14 },
  sectionTitle: { color: '#4a1008', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  estadoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  estadoLabel: { color: '#4a1008', fontSize: 12, width: 80 },
  barraBg: { flex: 1, height: 10, backgroundColor: '#FBE9D0', borderRadius: 5, overflow: 'hidden' },
  barra: { height: 10, borderRadius: 5 },
  estadoCount: { color: '#4a1008', fontSize: 12, fontWeight: 'bold', width: 20, textAlign: 'right' },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  topRank: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#8c1d0d',
    color: '#FBE9D0', fontSize: 12, fontWeight: 'bold', textAlign: 'center', lineHeight: 22,
  },
  topName: { flex: 1, color: '#4a1008', fontSize: 13 },
  topQty: { color: '#8c1d0d', fontSize: 12, fontWeight: 'bold' },
  vacio: { color: '#8c1d0d', fontSize: 12, fontStyle: 'italic' },
  pedidoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FBE9D0', borderRadius: 10, padding: 10, marginBottom: 8,
  },
  pedidoId: { color: '#4a1008', fontWeight: 'bold', fontSize: 13 },
  pedidoCliente: { color: '#8c1d0d', fontSize: 11 },
  pedidoTotal: { color: '#4a1008', fontWeight: 'bold', fontSize: 13 },
  pedidoEstado: { fontSize: 11, fontWeight: 'bold' },
});
