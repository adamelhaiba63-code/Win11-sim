import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../../context/SystemContext';

export const RebootScreen: React.FC = () => {
  const { t } = useSystem();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0078D4" />
      <Text style={styles.rebootText}>{t('restarting')}</Text>
    </View>
  );
};

export const ShutdownScreen: React.FC = () => {
  const { powerOnSystem, t } = useSystem();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.powerOnBtn}
        onPress={powerOnSystem}
        activeOpacity={0.7}
      >
        <Ionicons name="power" size={42} color="#0078D4" />
      </TouchableOpacity>
      <Text style={styles.powerOnText}>{t('powerOn')}</Text>
      <Text style={styles.powerOnSub}>انقر على زر الطاقة لتشغيل جهاز Windows 11</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  rebootText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '500',
  },
  powerOnBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#0078D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  powerOnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  powerOnSub: {
    color: '#888888',
    fontSize: 12,
    marginTop: 6,
  },
});
