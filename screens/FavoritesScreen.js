import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '../data/mock';
import { useApp } from '../context/AppContext';

export default function FavoritesScreen({ navigation }) {
  const { products, favorites, toggleFavorite } = useApp();
  const favProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6b1a1a" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis favoritos</Text>
      </View>

      <FlatList
        data={favProducts}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#8c1d0d' }}>
            Aún no tienes favoritos. ¡Toca el corazón de algún producto!
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Producto', { product: item })}>
            <View style={styles.image}>
              <Image source={item.image} style={{ width: 70, height: 70, borderRadius: 8 }} />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text style={styles.name}>{item.name} Wayuu</Text>
              <Text style={styles.price}>{formatCOP(item.price)}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Ionicons name="heart" size={20} color="#8c1d0d" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBE9D0' },
  header: { backgroundColor: '#6b1a1a', paddingTop: 40, paddingBottom: 14, paddingHorizontal: 16 },
  headerTitle: { color: '#FBE9D0', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#E8853D', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center' },
  image: { width: 80, height: 80, backgroundColor: '#d4580b', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  name: { color: '#4a1008', fontWeight: 'bold' },
  price: { color: '#8c1d0d', fontWeight: 'bold' },
});
