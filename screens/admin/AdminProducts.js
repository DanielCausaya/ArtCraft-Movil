import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { formatCOP, imageLibrary } from '../../data/mock';
import ConfirmDialog from '../../components/ConfirmDialog';

const emptyForm = {
  id: null,
  name: '',
  price: '',
  category: '',
  description: '',
  image: imageLibrary[0].image,
};

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useApp();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);

  const openNew = () => {
    setForm({ ...emptyForm, category: categories[0]?.name || '' });
    setError('');
    setVisible(true);
  };

  const openEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      price: String(p.price),
      category: p.category,
      description: p.description || '',
      image: p.image,
    });
    setError('');
    setVisible(true);
  };

  const save = () => {
    if (!form.name.trim()) return setError('Ingresa el nombre del producto');
    const price = parseInt(form.price, 10);
    if (!price || price <= 0) return setError('Ingresa un precio válido');
    const data = {
      name: form.name.trim(),
      price,
      category: form.category || categories[0]?.name || 'General',
      description: form.description.trim(),
      image: form.image,
    };
    if (form.id) updateProduct(form.id, data);
    else addProduct(data);
    setVisible(false);
  };

  const remove = (p) => setPending(p);

  const confirmRemove = () => {
    if (pending) deleteProduct(pending.id);
    setPending(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.count}>{products.length} productos</Text>
        <TouchableOpacity style={styles.addButton} onPress={openNew}>
          <Ionicons name="add" size={18} color="#FBE9D0" />
          <Text style={styles.addText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={styles.vacio}>No hay productos. Crea el primero con "+ Nuevo".</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.price}>{formatCOP(item.price)}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
              <Ionicons name="pencil" size={18} color="#8c1d0d" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => remove(item)}>
              <Ionicons name="trash" size={18} color="#8c1d0d" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBg}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{form.id ? 'Editar producto' : 'Nuevo producto'}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={22} color="#4a1008" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(t) => setForm({ ...form, name: t })}
                placeholder="Ej. Cántaro artesanal"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Precio (COP)</Text>
              <TextInput
                style={styles.input}
                value={form.price}
                onChangeText={(t) => setForm({ ...form, price: t.replace(/[^0-9]/g, '') })}
                keyboardType="numeric"
                placeholder="Ej. 80000"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Categoría</Text>
              <View style={styles.chips}>
                {categories.map((c) => {
                  const on = form.category === c.name;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.chip, on && styles.chipOn]}
                      onPress={() => setForm({ ...form, category: c.name })}
                    >
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>{c.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
                value={form.description}
                onChangeText={(t) => setForm({ ...form, description: t })}
                placeholder="Describe la artesanía..."
                placeholderTextColor="#999"
                multiline
              />

              <Text style={styles.label}>Imagen</Text>
              <View style={styles.imageGrid}>
                {imageLibrary.map((img) => {
                  const on = form.image === img.image;
                  return (
                    <TouchableOpacity
                      key={img.id}
                      style={[styles.imagePick, on && styles.imagePickOn]}
                      onPress={() => setForm({ ...form, image: img.image })}
                    >
                      <Image source={img.image} style={styles.imageThumb} />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity style={styles.saveBtn} onPress={save}>
                <Text style={styles.saveText}>{form.id ? 'Guardar cambios' : 'Crear producto'}</Text>
              </TouchableOpacity>
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ConfirmDialog
        visible={!!pending}
        title="Eliminar producto"
        message={pending ? `¿Seguro que quieres eliminar "${pending.name}"? Esta acción no se puede deshacer.` : ''}
        onCancel={() => setPending(null)}
        onConfirm={confirmRemove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBE9D0' },
  toolbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4,
  },
  count: { color: '#4a1008', fontWeight: 'bold' },
  addButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#8c1d0d', borderRadius: 20, paddingVertical: 7, paddingHorizontal: 14,
  },
  addText: { color: '#FBE9D0', fontWeight: 'bold', fontSize: 13 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#E8853D', borderRadius: 12, padding: 10,
  },
  thumb: { width: 56, height: 56, borderRadius: 8, backgroundColor: '#d4580b' },
  name: { color: '#4a1008', fontWeight: 'bold', fontSize: 14 },
  price: { color: '#8c1d0d', fontWeight: 'bold', fontSize: 13, marginTop: 2 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: '#FBE9D0', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2, marginTop: 4,
  },
  badgeText: { color: '#8c1d0d', fontSize: 10, fontWeight: 'bold' },
  iconBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#FBE9D0',
    alignItems: 'center', justifyContent: 'center',
  },
  vacio: { textAlign: 'center', marginTop: 40, color: '#8c1d0d' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#FBE9D0', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 18, maxHeight: '88%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { color: '#4a1008', fontSize: 17, fontWeight: 'bold' },
  label: { color: '#4a1008', fontWeight: 'bold', marginTop: 12, fontSize: 13 },
  input: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12, marginTop: 6,
    fontSize: 14, color: '#333',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: {
    backgroundColor: '#F5D7B8', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#d4a574',
  },
  chipOn: { backgroundColor: '#8c1d0d', borderColor: '#8c1d0d' },
  chipText: { color: '#4a1008', fontSize: 12 },
  chipTextOn: { color: '#FBE9D0', fontWeight: 'bold' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  imagePick: {
    width: 54, height: 54, borderRadius: 10, overflow: 'hidden',
    borderWidth: 2, borderColor: 'transparent',
  },
  imagePickOn: { borderColor: '#8c1d0d' },
  imageThumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  error: { color: '#8c1d0d', fontWeight: 'bold', fontSize: 12, marginTop: 10 },
  saveBtn: {
    backgroundColor: '#8c1d0d', borderRadius: 10, padding: 14, marginTop: 16, alignItems: 'center',
  },
  saveText: { color: '#FBE9D0', fontWeight: 'bold' },
});
