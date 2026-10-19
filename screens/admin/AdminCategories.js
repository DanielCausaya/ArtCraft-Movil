import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { imageLibrary } from '../../data/mock';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function AdminCategories() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useApp();
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState(imageLibrary[0].image);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);

  const openNew = () => {
    setId(null);
    setName('');
    setImage(imageLibrary[0].image);
    setError('');
    setVisible(true);
  };

  const openEdit = (c) => {
    setId(c.id);
    setName(c.name);
    setImage(c.image);
    setError('');
    setVisible(true);
  };

  const save = () => {
    if (!name.trim()) return setError('Ingresa el nombre de la categoría');
    const duplicada = categories.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== id
    );
    if (duplicada) return setError('Ya existe una categoría con ese nombre');
    if (id) updateCategory(id, name.trim(), image);
    else addCategory(name.trim(), image);
    setVisible(false);
  };

  const remove = (c) => {
    const usados = products.filter((p) => p.category === c.name).length;
    const otras = categories.filter((x) => x.id !== c.id);
    const destino = otras.length > 0 ? otras[0].name : 'Sin categoría';
    setPending({ category: c, usados, destino });
  };

  const confirmRemove = () => {
    if (pending) {
      deleteCategory(pending.category.id, pending.usados > 0 ? pending.destino : null);
    }
    setPending(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.count}>{categories.length} categorías</Text>
        <TouchableOpacity style={styles.addButton} onPress={openNew}>
          <Ionicons name="add" size={18} color="#FBE9D0" />
          <Text style={styles.addText}>Nueva</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={styles.vacio}>No hay categorías. Crea la primera con "+ Nueva".</Text>}
        renderItem={({ item }) => {
          const cantidad = products.filter((p) => p.category === item.name).length;
          return (
            <View style={styles.card}>
              <Image source={item.image} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>{cantidad} producto{cantidad === 1 ? '' : 's'}</Text>
              </View>
              <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
                <Ionicons name="pencil" size={18} color="#8c1d0d" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => remove(item)}>
                <Ionicons name="trash" size={18} color="#8c1d0d" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <Modal visible={visible} animationType="fade" transparent onRequestClose={() => setVisible(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{id ? 'Editar categoría' : 'Nueva categoría'}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={22} color="#4a1008" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ej. Tejidos"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Imagen</Text>
            <View style={styles.imageGrid}>
              {imageLibrary.map((img) => {
                const on = image === img.image;
                return (
                  <TouchableOpacity
                    key={img.id}
                    style={[styles.imagePick, on && styles.imagePickOn]}
                    onPress={() => setImage(img.image)}
                  >
                    <Image source={img.image} style={styles.imageThumb} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.saveBtn} onPress={save}>
              <Text style={styles.saveText}>{id ? 'Guardar cambios' : 'Crear categoría'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={!!pending}
        title="Eliminar categoría"
        message={
          pending
            ? pending.usados > 0
              ? `"${pending.category.name}" tiene ${pending.usados} producto${pending.usados === 1 ? '' : 's'}. Se moverán a la categoría "${pending.destino}".`
              : `¿Seguro que quieres eliminar la categoría "${pending.category.name}"?`
            : ''
        }
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
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#E8853D', borderRadius: 12, padding: 12,
  },
  thumb: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#d4580b' },
  name: { color: '#4a1008', fontWeight: 'bold', fontSize: 15 },
  sub: { color: '#8c1d0d', fontSize: 12, marginTop: 2 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#FBE9D0',
    alignItems: 'center', justifyContent: 'center',
  },
  vacio: { textAlign: 'center', marginTop: 40, color: '#8c1d0d' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FBE9D0', borderRadius: 20, padding: 18 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: '#4a1008', fontSize: 17, fontWeight: 'bold' },
  label: { color: '#4a1008', fontWeight: 'bold', marginTop: 12, fontSize: 13 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginTop: 6, fontSize: 14, color: '#333' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  imagePick: {
    width: 46, height: 46, borderRadius: 10, overflow: 'hidden',
    borderWidth: 2, borderColor: 'transparent',
  },
  imagePickOn: { borderColor: '#8c1d0d' },
  imageThumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  error: { color: '#8c1d0d', fontWeight: 'bold', fontSize: 12, marginTop: 10 },
  saveBtn: { backgroundColor: '#8c1d0d', borderRadius: 10, padding: 14, marginTop: 16, alignItems: 'center' },
  saveText: { color: '#FBE9D0', fontWeight: 'bold' },
});
