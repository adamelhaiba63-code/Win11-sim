import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  Text,
} from 'react-native';
import { WallpaperView } from './WallpaperView';
import { DesktopIcon } from './DesktopIcon';
import { ContextMenu } from './ContextMenu';
import { StickyNoteView } from './StickyNoteView';
import { useSystem } from '../../context/SystemContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export const Desktop: React.FC = () => {
  const {
    apps,
    openApp,
    windows,
    openContextMenu,
    closeContextMenu,
    stickyNotes,
    settings,
    notification,
  } = useSystem();

  const handleLongPress = (e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;
    openContextMenu(pageX, pageY);
  };

  const handleDesktopPress = () => {
    closeContextMenu();
  };

  const runningAppIds = new Set(windows.filter((w) => !w.isMinimized).map((w) => w.appId));

  // Only show apps that have desktop shortcuts
  const desktopApps = apps.filter((a) => a.desktopShortcut !== false);

  return (
    <View style={styles.container}>
      <WallpaperView />

      <TouchableWithoutFeedback
        onPress={handleDesktopPress}
        onLongPress={handleLongPress}
        delayLongPress={450}
      >
        <View style={styles.desktopArea}>
          <ScrollView
            contentContainerStyle={styles.iconsGrid}
            showsVerticalScrollIndicator={false}
          >
            {desktopApps.map((app) => (
              <DesktopIcon
                key={app.id}
                app={app}
                isRunning={runningAppIds.has(app.id)}
                onPress={() => openApp(app.id)}
              />
            ))}
          </ScrollView>

          {/* Sticky Notes rendered over desktop */}
          {stickyNotes.map((note) => (
            <StickyNoteView key={note.id} note={note} />
          ))}
        </View>
      </TouchableWithoutFeedback>

      {/* Windows 11 Toast Notification Banner */}
      {notification && (
        <View
          style={[
            styles.notificationToast,
            {
              backgroundColor:
                settings.theme === 'dark' ? 'rgba(32, 32, 32, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: settings.accentColor,
            },
          ]}
        >
          <View style={[styles.notifIcon, { backgroundColor: settings.accentColor }]}>
            <Ionicons name="notifications" size={16} color="#FFF" />
          </View>
          <View style={styles.notifContent}>
            <Text
              style={[
                styles.notifTitle,
                { color: settings.theme === 'dark' ? '#FFF' : '#111' },
              ]}
            >
              {notification.title}
            </Text>
            <Text
              style={[
                styles.notifDesc,
                { color: settings.theme === 'dark' ? '#BBB' : '#555' },
              ]}
              numberOfLines={2}
            >
              {notification.message}
            </Text>
          </View>
        </View>
      )}

      {/* Night Light amber/warm filter overlay */}
      {settings.nightLight && <View pointerEvents="none" style={styles.nightLightFilter} />}

      {/* Brightness Dimming overlay */}
      {settings.screenBrightness < 1 && (
        <View
          pointerEvents="none"
          style={[
            styles.brightnessDimmer,
            { opacity: (1 - settings.screenBrightness) * 0.75 },
          ]}
        />
      )}

      <ContextMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  desktopArea: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 8,
    paddingBottom: 60,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  notificationToast: {
    position: 'absolute',
    top: 50,
    right: 16,
    left: 16,
    maxWidth: 380,
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    zIndex: 99999,
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  notifDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  nightLightFilter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 170, 0, 0.16)',
    zIndex: 99990,
  },
  brightnessDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 99991,
  },
});
