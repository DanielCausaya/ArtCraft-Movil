import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, TextInput, FlatList, Image, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCOP } from '../data/mock';
import { useApp } from '../context/AppContext';

export default function HomeScreen({ navigation, setTab }) {
  const { products, categories } = useApp();
  const [searchText, setSearchText] = useState('');
  const destacados = products.slice(0, 4);

  const q = searchText.trim().toLowerCase();
  const resultados = q
    ? products.filter((p) =>
        [p.name, p.category, p.description].some((v) => v && v.toLowerCase().includes(q))
      )
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6b1a1a" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Art Craft</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar artesanías..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity style={styles.searchClear} onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#8c1d0d" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.searchButton} onPress={() => Keyboard.dismiss()}>
            <Ionicons name="search" size={18} color="#FBE9D0" />
          </TouchableOpacity>
        </View>

        {q ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Resultados</Text>
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Text style={styles.sectionLink}>LIMPIAR</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.resultCount}>
              {resultados.length} artesanía{resultados.length === 1 ? '' : 's'} para “{searchText.trim()}”
            </Text>

            {resultados.length === 0 ? (
              <Text style={styles.noResult}>
                No encontramos artesanías con esa búsqueda. Prueba con otra palabra.
              </Text>
            ) : (
              <View style={styles.resultsGrid}>
                {resultados.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.resultCard}
                    onPress={() => navigation.navigate('Producto', { product: item })}
                  >
                    <Image source={item.image} style={styles.resultImage} />
                    <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.resultPrice}>{formatCOP(item.price)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>Artesanías{'\n'}que cuentan{'\n'}historia</Text>
              <TouchableOpacity style={styles.heroButton} onPress={() => setTab('Catálogo')}>
                <Text style={styles.heroButtonText}>Ver opciones</Text>
              </TouchableOpacity>
              <Image
                source={require('../assets/images/MochilasInicio.png')}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categorías</Text>
                <TouchableOpacity onPress={() => setTab('Catálogo')}>
                  <Text style={styles.sectionLink}>VER TODAS</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={categories}
                keyExtractor={(i) => i.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.categoryCard} onPress={() => setTab('Catálogo')}>
                    <View style={styles.categoryImage}>
                      <Image source={item.image} style={{ width: 50, height: 50, resizeMode: 'cover', borderRadius: 8 }} />
                    </View>
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Destacados</Text>
              <FlatList
                horizontal
                data={destacados}
                keyExtractor={(i) => i.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('Producto', { product: item })}>
                    <View style={styles.productImage}>
                      <Image source={item.image} style={{ width: 120, height: 100, borderRadius: 10 }} />
                    </View>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{formatCOP(item.price)}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBE9D0' },
  header: { backgroundColor: '#6b1a1a', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 40, paddingBottom: 12, paddingHorizontal: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerLogo: { width: 34, height: 34 },
  headerTitle: { color: '#FBE9D0', fontSize: 20, fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#6b1a1a' },
  searchInput: { flex: 1, height: 42, backgroundColor: '#fff', borderRadius: 21, paddingHorizontal: 16, fontSize: 14, color: '#333' },
  searchClear: { height: 42, justifyContent: 'center', paddingHorizontal: 6 },
  searchButton: { width: 42, height: 42, backgroundColor: '#8c1d0d', borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  searchButtonText: { fontSize: 16 },
  heroSection: { backgroundColor: '#6b1a1a', marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 20 },
  heroTitle: { color: '#FBE9D0', fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginBottom: 16 },
  heroButton: { backgroundColor: '#d4580b', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'flex-start' },
  heroButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  heroImage: { width: '100%', aspectRatio: 888 / 281, marginTop: 16 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#4a1008', fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  sectionLink: { color: '#8c1d0d', fontSize: 13, fontWeight: 'bold' },
  categoryCard: { width: 110, backgroundColor: '#8c1d0d', borderRadius: 12, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  categoryImage: { width: 70, height: 70, backgroundColor: '#d4580b', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryName: { color: '#FBE9D0', fontSize: 13, fontWeight: 'bold' },
  productCard: { width: 150, backgroundColor: '#8c1d0d', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  productImage: { width: '100%', height: 100, backgroundColor: '#d4580b', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  productName: { color: '#FBE9D0', fontSize: 14, fontWeight: 'bold' },
  productPrice: { color: '#ffc26a', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  resultCount: { color: '#8c1d0d', fontSize: 12, marginBottom: 12 },
  noResult: { color: '#4a1008', fontSize: 13, fontStyle: 'italic', lineHeight: 20 },
  resultsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  resultCard: {
    width: '47%', flexGrow: 1,
    backgroundColor: '#8c1d0d', borderRadius: 12, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4,
  },
  resultImage: { width: '100%', height: 100, borderRadius: 10, backgroundColor: '#d4580b', marginBottom: 8 },
  resultName: { color: '#FBE9D0', fontSize: 14, fontWeight: 'bold' },
  resultPrice: { color: '#ffc26a', fontSize: 15, fontWeight: 'bold', marginTop: 4 },
});
