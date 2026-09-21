import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSystem } from '../../context/SystemContext';
import { AppDefinition } from '../../types';

export const Taskbar: React.FC = () => {
  const {
    settings,
    windows,
    activeWindowId,
    apps,
    openApp,
    minimizeWindow,
    bringToFront,
    minimizeAll,
    isStartMenuOpen,
    toggleStartMenu,
    toggleWidgets,
    toggleActionCenter,
    toggleSearch,
    isWidgetsOpen,
    isActionCenterOpen,
    isSearchOpen,
  } = useSystem();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'م' : 'ص';
      const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
      setCurrentTime(`${formattedHours}:${minutes} ${ampm}`);

      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      setCurrentDate(`${year}/${month}/${day}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDark = settings.theme === 'dark';

  // Apps pinned to taskbar or currently open
  const pinnedApps = apps.filter((a) => a.pinnedToTaskbar);
  const openAppIds = windows.map((w) => w.appId);
  const allTaskbarAppIds = Array.from(new Set([...pinnedApps.map((a) => a.id), ...openAppIds]));
  const taskbarApps = allTaskbarAppIds
    .map((id) => apps.find((a) => a.id === id))
    .filter(Boolean) as AppDefinition[];

  const handleAppPress = (appId: string) => {
    const matchingWindow = windows.find((w) => w.appId === appId);
    if (!matchingWindow) {
      openApp(appId as any);
      return;
    }

    if (matchingWindow.id === activeWindowId && !matchingWindow.isMinimized) {
      minimizeWindow(matchingWindow.id);
    } else {
      bringToFront(matchingWindow.id);
    }
  };

  const renderIcon = (app: AppDefinition) => {
    const size = 20;
    if (app.id === 'explorer') {
      return <Ionicons name="folder" size={size} color="#FFCA28" />;
    }
    if (app.iconType === 'Ionicons') {
      return <Ionicons name={app.icon as any} size={size} color={app.iconColor} />;
    }
    if (app.iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={app.icon as any} size={size} color={app.iconColor} />;
    }
    return <MaterialIcons name={app.icon as any} size={size} color={app.iconColor} />;
  };

  return (
    <View
      style={[
        styles.taskbar,
        {
          backgroundColor: isDark ? 'rgba(32, 32, 32, 0.90)' : 'rgba(243, 243, 243, 0.90)',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        },
      ]}
    >
      {/* Centered or Left aligned main apps tray */}
      <View
        style={[
          styles.mainSection,
          settings.taskbarAlignment === 'left' ? styles.alignLeft : styles.alignCenter,
        ]}
      >
        {/* Start Button */}
        <TouchableOpacity
          onPress={toggleStartMenu}
          activeOpacity={0.7}
          style={[styles.taskItem, isStartMenuOpen && styles.activeItem]}
        >
          <View style={styles.startLogoWrap}>
            <View style={styles.startLogoRow}>
              <View style={[styles.startSquare, { backgroundColor: '#00adef' }]} />
              <View style={[styles.startSquare, { backgroundColor: '#00adef' }]} />
            </View>
            <View style={styles.startLogoRow}>
              <View style={[styles.startSquare, { backgroundColor: '#00adef' }]} />
              <View style={[styles.startSquare, { backgroundColor: '#00adef' }]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Windows Search */}
        <TouchableOpacity
          onPress={toggleSearch}
          activeOpacity={0.7}
          style={[styles.taskItem, isSearchOpen && styles.activeItem]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={isDark ? '#E0E0E0' : '#444'}
          />
        </TouchableOpacity>

        {/* Widgets Panel Toggle */}
        <TouchableOpacity
          onPress={toggleWidgets}
          activeOpacity={0.7}
          style={[styles.taskItem, isWidgetsOpen && styles.activeItem]}
        >
          <MaterialCommunityIcons
            name="view-dashboard-outline"
            size={19}
            color={isDark ? '#E0E0E0' : '#444'}
          />
        </TouchableOpacity>

        {/* Apps Icons in Taskbar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.appsScroll}
        >
          {taskbarApps.map((app) => {
            const isRunning = openAppIds.includes(app.id);
            const isOpenAndFocused =
              isRunning && windows.find((w) => w.appId === app.id)?.id === activeWindowId;

            return (
              <TouchableOpacity
                key={app.id}
                onPress={() => handleAppPress(app.id)}
                activeOpacity={0.7}
                style={[
                  styles.taskItem,
                  isOpenAndFocused && styles.activeItem,
                ]}
              >
                {renderIcon(app)}
                {/* Active Indicator Bar underneath */}
                {isRunning && (
                  <View
                    style={[
                      styles.indicatorBar,
                      {
                        backgroundColor: isOpenAndFocused ? settings.accentColor : '#888',
                        width: isOpenAndFocused ? 14 : 6,
                      },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* System Tray (Right / Action area) */}
      <View style={styles.systemTray}>
        {/* Quick Settings pill: Wifi + Sound + Battery */}
        <TouchableOpacity
          onPress={toggleActionCenter}
          activeOpacity={0.7}
          style={[
            styles.quickSettingsPill,
            isActionCenterOpen && styles.activeItem,
          ]}
        >
          <Ionicons
            name={settings.wifiEnabled ? 'wifi' : 'wifi-outline'}
            size={14}
            color={settings.wifiEnabled ? (isDark ? '#FFF' : '#111') : '#888'}
          />
          <Ionicons
            name={settings.systemVolume > 0 ? 'volume-medium' : 'volume-mute'}
            size={14}
            color={isDark ? '#FFF' : '#111'}
          />
          <View style={styles.batteryWrap}>
            <Ionicons name="battery-charging" size={15} color="#107C41" />
          </View>
        </TouchableOpacity>

        {/* Clock & Date */}
        <TouchableOpacity
          onPress={toggleActionCenter}
          activeOpacity={0.7}
          style={styles.clockPill}
        >
          <Text style={[styles.clockText, { color: isDark ? '#FFF' : '#111' }]}>
            {currentTime}
          </Text>
          <Text style={[styles.dateText, { color: isDark ? '#AAA' : '#666' }]}>
            {currentDate}
          </Text>
        </TouchableOpacity>

        {/* Show Desktop sliver */}
        <TouchableOpacity
          onPress={minimizeAll}
          activeOpacity={0.5}
          style={[
            styles.showDesktopSliver,
            { borderLeftColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    zIndex: 9990,
  },
  mainSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  alignCenter: {
    justifyContent: 'center',
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  appsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskItem: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginHorizontal: 1,
    position: 'relative',
  },
  activeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  indicatorBar: {
    position: 'absolute',
    bottom: 2,
    height: 3,
    borderRadius: 2,
  },
  startLogoWrap: {
    width: 18,
    height: 18,
    justifyContent: 'space-between',
  },
  startLogoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startSquare: {
    width: 8,
    height: 8,
    borderRadius: 1.5,
  },
  systemTray: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    gap: 3,
  },
  quickSettingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 5,
  },
  batteryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockPill: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  clockText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 9,
  },
  showDesktopSliver: {
    width: 6,
    height: '60%',
    borderLeftWidth: 1,
    marginLeft: 2,
  },
});
