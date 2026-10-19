import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Diálogo de confirmación propio (no usa Alert, que en web no se muestra).
 * Pasa showCancel={false} para usarlo como aviso de un solo botón.
 */
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  destructive = true,
  showCancel = true,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.actions}>
            {showCancel && (
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.confirmBtn, destructive && styles.confirmDestructive]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FBE9D0',
    borderRadius: 18,
    padding: 20,
  },
  title: { color: '#4a1008', fontSize: 17, fontWeight: 'bold' },
  message: { color: '#4a1008', fontSize: 13, marginTop: 8, lineHeight: 19 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F5D7B8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: { color: '#4a1008', fontWeight: 'bold' },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#8c1d0d',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmDestructive: { backgroundColor: '#8c1d0d' },
  confirmText: { color: '#FBE9D0', fontWeight: 'bold' },
});
