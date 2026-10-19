import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { formatCOP } from '../../data/mock';
import ConfirmDialog from '../../components/ConfirmDialog';

const STATUSES = ['En camino', 'Entregado', 'Cancelado'];

const estadoColor = (s) => (s === 'Entregado' ? '#2b7a0b' : s === 'Cancelado' ? '#8c1d0d' : '#d4580b');

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();
  const [pending, setPending] = useState(null);

  const setStatus = (order, status) => {
    if (order.status === status) return;
    if (status === 'Cancelado') setPending(order);
    else updateOrderStatus(order.id, status);
  };

  const confirmCancel = () => {
    if (pending) updateOrderStatus(pending.id, 'Cancelado');
    setPending(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.count}>{orders.length} pedidos</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={styles.vacio}>Aún no hay pedidos en el sistema.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.id}>Pedido {item.id}</Text>
                <Text style={styles.meta}>{item.customer || 'Cliente'} · {item.date}</Text>
              </View>
              <Text style={styles.total}>{formatCOP(item.total)}</Text>
            </View>

            <View style={styles.items}>
              {item.items.map((it, i) => (
                <View key={String(it.product.id) + i} style={styles.thumb}>
                  <Image source={it.product.image} style={{ width: 34, height: 34, borderRadius: 6 }} />
                  <Text style={styles.qty}>x{it.qty}</Text>
                </View>
              ))}
            </View>

            <View style={styles.statusRow}>
              {STATUSES.map((s) => {
                const on = item.status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusChip, on && { backgroundColor: estadoColor(s) }]}
                    onPress={() => setStatus(item, s)}
                  >
                    <Text style={[styles.statusText, on && { color: '#FBE9D0', fontWeight: 'bold' }]}>{s}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      />

      <ConfirmDialog
        visible={!!pending}
        title="Cancelar pedido"
        message={pending ? `¿Seguro que quieres cancelar el pedido ${pending.id}?` : ''}
        confirmText="Sí, cancelar"
        cancelText="No"
        onCancel={() => setPending(null)}
        onConfirm={confirmCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBE9D0' },
  toolbar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  count: { color: '#4a1008', fontWeight: 'bold' },
  card: { backgroundColor: '#E8853D', borderRadius: 12, padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  id: { color: '#4a1008', fontWeight: 'bold', fontSize: 14 },
  meta: { color: '#4a1008', fontSize: 12, marginTop: 2 },
  total: { color: '#4a1008', fontWeight: 'bold', fontSize: 14 },
  items: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  thumb: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#d4580b', borderRadius: 8, padding: 4,
  },
  qty: { color: '#FBE9D0', fontSize: 11, fontWeight: 'bold' },
  statusRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statusChip: {
    flex: 1, backgroundColor: '#FBE9D0', borderRadius: 16,
    paddingVertical: 7, alignItems: 'center',
  },
  statusText: { color: '#8c1d0d', fontSize: 11 },
  vacio: { textAlign: 'center', marginTop: 40, color: '#8c1d0d' },
});
