import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../../context/SystemContext';

export const ActionCenter: React.FC = () => {
  const {
    isActionCenterOpen,
    closeActionCenter,
    settings,
    updateSettings,
    openApp,
    t,
  } = useSystem();

  const [isPlaying, setIsPlaying] = useState(false);

  if (!isActionCenterOpen) return null;

  const isDark = settings.theme === 'dark';

  const toggleWifi = () => updateSettings({ wifiEnabled: !settings.wifiEnabled });
  const toggleBluetooth = () => updateSettings({ bluetoothEnabled: !settings.bluetoothEnabled });
  const toggleAirplane = () => {
    const next = !settings.airplaneMode;
    updateSettings({
      airplaneMode: next,
      wifiEnabled: next ? false : settings.wifiEnabled,
      bluetoothEnabled: next ? false : settings.bluetoothEnabled,
    });
  };
  const toggleNightLight = () => updateSettings({ nightLight: !settings.nightLight });
  const toggleBatterySaver = () => updateSettings({ batterySaver: !settings.batterySaver });

  const handleBrightnessChange = (delta: number) => {
    const next = Math.max(0.3, Math.min(1, Number((settings.screenBrightness + delta).toFixed(2))));
    updateSettings({ screenBrightness: next });
  };

  const handleVolumeChange = (delta: number) => {
    const next = Math.max(0, Math.min(1, Number((settings.systemVolume + delta).toFixed(2))));
    updateSettings({ systemVolume: next });
  };

  return (
    <TouchableWithoutFeedback onPress={closeActionCenter}>
      <View style={StyleSheet.absoluteFillObject}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.panel,
              {
                backgroundColor: isDark ? 'rgba(32, 32, 32, 0.96)' : 'rgba(245, 245, 245, 0.96)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)',
              },
            ]}
          >
            {/* Header: Action Center title & settings shortcut */}
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#111' }]}>
                {t('actionCenter')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  closeActionCenter();
                  openApp('settings');
                }}
                style={styles.settingsIcon}
              >
                <Ionicons name="settings-outline" size={17} color={isDark ? '#FFF' : '#333'} />
              </TouchableOpacity>
            </View>

            {/* Quick Toggles Grid (3x2) */}
            <View style={styles.togglesGrid}>
              {/* Wi-Fi */}
              <TouchableOpacity
                onPress={toggleWifi}
                style={[
                  styles.toggleBtn,
                  settings.wifiEnabled && { backgroundColor: settings.accentColor },
                  !settings.wifiEnabled && {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                <Ionicons
                  name={settings.wifiEnabled ? 'wifi' : 'wifi-outline'}
                  size={18}
                  color={settings.wifiEnabled ? '#FFF' : isDark ? '#CCC' : '#555'}
                />
                <Text
                  style={[
                    styles.toggleLabel,
                    { color: settings.wifiEnabled ? '#FFF' : isDark ? '#CCC' : '#444' },
                  ]}
                  numberOfLines={1}
                >
                  {settings.wifiEnabled ? 'Wi-Fi متصل' : 'Wi-Fi معطل'}
                </Text>
              </TouchableOpacity>

              {/* Bluetooth */}
              <TouchableOpacity
                onPress={toggleBluetooth}
                style={[
                  styles.toggleBtn,
                  settings.bluetoothEnabled && { backgroundColor: settings.accentColor },
                  !settings.bluetoothEnabled && {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                <Ionicons
                  name="bluetooth"
                  size={18}
                  color={settings.bluetoothEnabled ? '#FFF' : isDark ? '#CCC' : '#555'}
                />
                <Text
                  style={[
                    styles.toggleLabel,
                    { color: settings.bluetoothEnabled ? '#FFF' : isDark ? '#CCC' : '#444' },
                  ]}
                  numberOfLines={1}
                >
                  {settings.bluetoothEnabled ? 'بلوتوث يعمل' : 'بلوتوث معطل'}
                </Text>
              </TouchableOpacity>

              {/* Airplane Mode */}
              <TouchableOpacity
                onPress={toggleAirplane}
                style={[
                  styles.toggleBtn,
                  settings.airplaneMode && { backgroundColor: settings.accentColor },
                  !settings.airplaneMode && {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                <Ionicons
                  name="airplane"
                  size={18}
                  color={settings.airplaneMode ? '#FFF' : isDark ? '#CCC' : '#555'}
                />
                <Text
                  style={[
                    styles.toggleLabel,
                    { color: settings.airplaneMode ? '#FFF' : isDark ? '#CCC' : '#444' },
                  ]}
                  numberOfLines={1}
                >
                  {t('airplaneMode')}
                </Text>
              </TouchableOpacity>

              {/* Night Light */}
              <TouchableOpacity
                onPress={toggleNightLight}
                style={[
                  styles.toggleBtn,
                  settings.nightLight && { backgroundColor: '#D83B01' },
                  !settings.nightLight && {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                <Ionicons
                  name={settings.nightLight ? 'moon' : 'moon-outline'}
                  size={18}
                  color={settings.nightLight ? '#FFF' : isDark ? '#CCC' : '#555'}
                />
                <Text
                  style={[
                    styles.toggleLabel,
                    { color: settings.nightLight ? '#FFF' : isDark ? '#CCC' : '#444' },
                  ]}
                  numberOfLines={1}
                >
                  {t('nightLight')}
                </Text>
              </TouchableOpacity>

              {/* Battery Saver */}
              <TouchableOpacity
                onPress={toggleBatterySaver}
                style={[
                  styles.toggleBtn,
                  settings.batterySaver && { backgroundColor: '#107C41' },
                  !settings.batterySaver && {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                <Ionicons
                  name={settings.batterySaver ? 'leaf' : 'leaf-outline'}
                  size={18}
                  color={settings.batterySaver ? '#FFF' : isDark ? '#CCC' : '#555'}
                />
                <Text
                  style={[
                    styles.toggleLabel,
                    { color: settings.batterySaver ? '#FFF' : isDark ? '#CCC' : '#444' },
                  ]}
                  numberOfLines={1}
                >
                  {t('batterySaver')}
                </Text>
              </TouchableOpacity>

              {/* Dark Mode toggle */}
              <TouchableOpacity
                onPress={() =>
                  updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
                }
                style={[
                  styles.toggleBtn,
                  settings.theme === 'dark' && { backgroundColor: settings.accentColor },
                  settings.theme !== 'dark' && {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                <Ionicons
                  name={settings.theme === 'dark' ? 'contrast' : 'sunny-outline'}
                  size={18}
                  color="#FFF"
                />
                <Text style={[styles.toggleLabel, { color: '#FFF' }]} numberOfLines={1}>
                  {settings.theme === 'dark' ? t('darkMode') : t('lightMode')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Brightness Slider */}
            <View style={styles.sliderRow}>
              <TouchableOpacity onPress={() => handleBrightnessChange(-0.1)}>
                <Ionicons name="sunny-outline" size={17} color={isDark ? '#AAA' : '#666'} />
              </TouchableOpacity>
              <View
                style={[
                  styles.sliderTrack,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#DDD' },
                ]}
              >
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${settings.screenBrightness * 100}%`,
                      backgroundColor: settings.accentColor,
                    },
                  ]}
                />
              </View>
              <TouchableOpacity onPress={() => handleBrightnessChange(0.1)}>
                <Ionicons name="sunny" size={17} color={settings.accentColor} />
              </TouchableOpacity>
              <Text style={[styles.pctText, { color: isDark ? '#CCC' : '#555' }]}>
                {Math.round(settings.screenBrightness * 100)}%
              </Text>
            </View>

            {/* Volume Slider */}
            <View style={styles.sliderRow}>
              <TouchableOpacity onPress={() => handleVolumeChange(-0.1)}>
                <Ionicons name="volume-mute-outline" size={17} color={isDark ? '#AAA' : '#666'} />
              </TouchableOpacity>
              <View
                style={[
                  styles.sliderTrack,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#DDD' },
                ]}
              >
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${settings.systemVolume * 100}%`,
                      backgroundColor: settings.accentColor,
                    },
                  ]}
                />
              </View>
              <TouchableOpacity onPress={() => handleVolumeChange(0.1)}>
                <Ionicons name="volume-high" size={17} color={settings.accentColor} />
              </TouchableOpacity>
              <Text style={[styles.pctText, { color: isDark ? '#CCC' : '#555' }]}>
                {Math.round(settings.systemVolume * 100)}%
              </Text>
            </View>

            {/* Mini Media Player widget */}
            <View
              style={[
                styles.mediaCard,
                {
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                },
              ]}
            >
              <View style={[styles.mediaThumb, { backgroundColor: settings.accentColor }]}>
                <Ionicons name="musical-notes" size={18} color="#FFF" />
              </View>
              <View style={styles.mediaInfo}>
                <Text
                  numberOfLines={1}
                  style={[styles.mediaTrack, { color: isDark ? '#FFF' : '#111' }]}
                >
                  Windows 11 Lofi Ambience
                </Text>
                <Text style={[styles.mediaArtist, { color: isDark ? '#AAA' : '#666' }]}>
                  Fluent Soundscape
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsPlaying((p) => !p)}
                style={[styles.playBtn, { backgroundColor: settings.accentColor }]}
              >
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={16} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Battery Footer */}
            <View style={styles.batteryFooter}>
              <View style={styles.batteryLeft}>
                <Ionicons name="battery-charging" size={17} color="#107C41" />
                <Text style={[styles.batteryPct, { color: isDark ? '#FFF' : '#111' }]}>
                  94% {t('charging')}
                </Text>
              </View>
              <Text style={[styles.batteryTime, { color: isDark ? '#AAA' : '#666' }]}>
                متبقي 4 ساعات و 20 دقيقة
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const { width } = Dimensions.get('window');
const panelWidth = Math.min(width * 0.94, 380);

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 54,
    right: 10,
    width: panelWidth,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 30,
    zIndex: 9995,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingsIcon: {
    padding: 4,
  },
  togglesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  toggleBtn: {
    width: (panelWidth - 32 - 16) / 3,
    height: 58,
    borderRadius: 8,
    padding: 8,
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 8,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
  pctText: {
    fontSize: 11,
    width: 34,
    textAlign: 'right',
  },
  mediaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  mediaThumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaInfo: {
    flex: 1,
  },
  mediaTrack: {
    fontSize: 12,
    fontWeight: '600',
  },
  mediaArtist: {
    fontSize: 10,
    marginTop: 1,
  },
  playBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  batteryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batteryPct: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  batteryTime: {
    fontSize: 10,
  },
});
