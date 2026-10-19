import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '../data/mock';
import { useApp } from '../context/AppContext';

export default function CatalogScreen({ navigation }) {
  const { products, favorites, toggleFavorite } = useApp();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6b1a1a" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catálogo</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ gap: 12, paddingVertical: 16 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay productos en el catálogo.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Producto', { product: item })}
          >
            <View style={styles.image}>
              <Image source={item.image} style={{ width: '100%', height: 90, borderRadius: 10 }} />
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{formatCOP(item.price)}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{ alignSelf: 'flex-end' }}>
              <Ionicons name={favorites.includes(item.id) ? 'heart' : 'heart-outline'} size={18} color="#8c1d0d" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBE9D0' },
  header: { backgroundColor: '#6b1a1a', paddingTop: 40, paddingBottom: 14, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#FBE9D0', fontSize: 20, fontWeight: 'bold' },
  vacio: { textAlign: 'center', marginTop: 40, color: '#8c1d0d', paddingHorizontal: 30 },
  card: { flex: 1, backgroundColor: '#E8853D', borderRadius: 12, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  image: { height: 90, backgroundColor: '#d4580b', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { color: '#4a1008', fontWeight: 'bold', fontSize: 14 },
  price: { color: '#8c1d0d', fontWeight: 'bold', marginTop: 2 },
});
