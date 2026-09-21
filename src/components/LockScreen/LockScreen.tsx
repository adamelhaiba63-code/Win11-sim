import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../../context/SystemContext';

export const LockScreen: React.FC = () => {
  const { unlockScreen, settings, t } = useSystem();
  const [showPinPad, setShowPinPad] = useState(false);
  const [pin, setPin] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = (now.getHours() % 12 || 12).toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      setCurrentDate(`${days[now.getDay()]}، ${now.getDate()} ${months[now.getMonth()]}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    unlockScreen();
  };

  return (
    <TouchableWithoutFeedback onPress={() => !showPinPad && setShowPinPad(true)}>
      <View style={styles.container}>
        {/* Background dark sapphire gradient */}
        <View style={styles.bgGradient} />

        {!showPinPad ? (
          /* Idle Clock State */
          <View style={styles.clockArea}>
            <Text style={styles.clockTime}>{currentTime}</Text>
            <Text style={styles.clockDate}>{currentDate}</Text>

            <View style={styles.swipePrompt}>
              <Ionicons name="chevron-up" size={24} color="#FFF" />
              <Text style={styles.swipeText}>{t('swipeOrClickToUnlock')}</Text>
            </View>
          </View>
        ) : (
          /* PIN / Sign In State */
          <View style={styles.signInCard}>
            <View style={[styles.avatar, { backgroundColor: settings.accentColor }]}>
              <Ionicons name="person" size={38} color="#FFF" />
            </View>
            <Text style={styles.userName}>{t('user')}</Text>

            <TouchableOpacity
              style={[styles.signInBtn, { backgroundColor: settings.accentColor }]}
              onPress={handleUnlock}
            >
              <Text style={styles.signInBtnText}>{t('signIn')}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowPinPad(false)} style={styles.backBtn}>
              <Text style={styles.backBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lock Screen Bottom Tray */}
        <View style={styles.bottomTray}>
          <Ionicons name="wifi" size={18} color="#FFF" />
          <Ionicons name="battery-charging" size={18} color="#107C41" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    justifyContent: 'space-between',
    padding: 24,
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A1329',
  },
  clockArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  clockTime: {
    fontSize: 76,
    fontWeight: '300',
    color: '#FFF',
    letterSpacing: 2,
  },
  clockDate: {
    fontSize: 18,
    color: '#E0E0E0',
    marginTop: 6,
    fontWeight: '400',
  },
  swipePrompt: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  swipeText: {
    color: '#FFF',
    fontSize: 13,
    marginTop: 4,
    opacity: 0.85,
  },
  signInCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  signInBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  backBtn: {
    marginTop: 18,
    padding: 8,
  },
  backBtnText: {
    color: '#AAA',
    fontSize: 13,
  },
  bottomTray: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
});
