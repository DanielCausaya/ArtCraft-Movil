import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail] = useState('muselen10@gmail.com');
  const [password, setPassword] = useState('********');

  const onLogin = () => {
    const res = login(email, password);
    if (res.ok) {
      navigation.reset({
        index: 0,
        routes: [{ name: res.role === 'admin' ? 'Admin' : 'Main' }],
      });
    } else {
      Alert.alert('Error', res.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBE9D0" />
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>
        Iniciar sesión para descubrir lo mejor de nuestras artesanías
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => Alert.alert('Recuperar', 'Se envió un correo de recuperación (simulado).')}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.or}>— O continúa con —</Text>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            const res = login('google@user.com', 'google');
            navigation.reset({ index: 0, routes: [{ name: res.role === 'admin' ? 'Admin' : 'Main' }] });
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="logo-google" size={18} color="#4a1008" />
            <Text style={styles.googleText}>Google</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5C89A', padding: 20, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#8c1d0d', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#4a1008', marginBottom: 20 },
  card: { backgroundColor: '#E8853D', borderRadius: 16, padding: 16 },
  label: { color: '#4a1008', fontWeight: 'bold', marginTop: 8 },
  input: { backgroundColor: '#FBE9D0', borderRadius: 10, padding: 12, marginTop: 4 },
  link: { color: '#4a1008', fontStyle: 'italic', marginTop: 8, fontSize: 12 },
  button: { backgroundColor: '#F5C89A', borderRadius: 20, padding: 12, marginTop: 16, alignItems: 'center' },
  buttonText: { color: '#8c1d0d', fontWeight: 'bold' },
  or: { textAlign: 'center', color: '#4a1008', marginVertical: 12, fontSize: 12 },
  googleButton: { backgroundColor: '#FBE9D0', borderRadius: 20, padding: 10, alignItems: 'center' },
  googleText: { color: '#4a1008', fontWeight: 'bold' },
  registerText: { textAlign: 'center', marginTop: 20, color: '#8c1d0d', fontWeight: 'bold' },
});
