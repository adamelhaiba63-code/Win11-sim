import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { WindowState } from '../../types';
import { useSystem } from '../../context/SystemContext';

interface WindowContainerProps {
  window: WindowState;
  children: React.ReactNode;
}

export const WindowContainer: React.FC<WindowContainerProps> = ({ window, children }) => {
  const {
    activeWindowId,
    bringToFront,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    updateWindowPosition,
    settings,
    lang,
  } = useSystem();

  const isFocused = activeWindowId === window.id;
  const isDark = settings.theme === 'dark';
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Dragging support for floating mode
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !window.isMaximized,
      onPanResponderGrant: () => {
        bringToFront(window.id);
      },
      onPanResponderMove: (_, gestureState) => {
        if (window.isMaximized) return;
        const newX = Math.max(0, Math.min(screenWidth - 100, window.position.x + gestureState.dx));
        const newY = Math.max(30, Math.min(screenHeight - 120, window.position.y + gestureState.dy));
        updateWindowPosition(window.id, { x: newX, y: newY });
      },
    })
  ).current;

  if (window.isMinimized) {
    return null;
  }

  const title = lang === 'ar' ? window.titleAr : window.title;

  return (
    <View
      onStartShouldSetResponder={() => {
        bringToFront(window.id);
        return false;
      }}
      style={[
        styles.windowBase,
        {
          zIndex: window.zIndex,
          backgroundColor: isDark ? '#202020' : '#F9F9F9',
          borderColor: isFocused
            ? settings.accentColor
            : isDark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(0, 0, 0, 0.15)',
        },
        window.isMaximized
          ? styles.maximizedStyle
          : [
              styles.floatingStyle,
              {
                top: window.position.y,
                left: window.position.x,
              },
            ],
      ]}
    >
      {/* Title Bar */}
      <View
        {...panResponder.panHandlers}
        style={[
          styles.titleBar,
          {
            backgroundColor: isDark ? '#1F1F1F' : '#EFEFEF',
            borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
      >
        <View style={styles.titleLeft}>
          <Ionicons
            name={(window.icon as any) || 'apps'}
            size={16}
            color={settings.accentColor}
            style={{ marginRight: 6 }}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.titleText,
              { color: isDark ? '#FFF' : '#111' },
            ]}
          >
            {title}
          </Text>
        </View>

        {/* Window Controls: Minimize, Maximize/Restore, Close */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => minimizeWindow(window.id)}
            activeOpacity={0.6}
          >
            <Ionicons name="remove" size={16} color={isDark ? '#DDD' : '#444'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => maximizeWindow(window.id)}
            activeOpacity={0.6}
          >
            <Ionicons
              name={window.isMaximized ? 'contract-outline' : 'expand-outline'}
              size={14}
              color={isDark ? '#DDD' : '#444'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, styles.closeBtn]}
            onPress={() => closeWindow(window.id)}
            activeOpacity={0.6}
          >
            <Ionicons name="close" size={16} color={isDark ? '#DDD' : '#444'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* App Body Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  windowBase: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20,
  },
  maximizedStyle: {
    top: 30,
    left: 4,
    right: 4,
    bottom: 52,
    borderRadius: 8,
  },
  floatingStyle: {
    width: 330,
    height: 480,
  },
  titleBar: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    borderBottomWidth: 1,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    height: '100%',
  },
  controlBtn: {
    width: 38,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    // Windows 11 red hover styling
  },
  content: {
    flex: 1,
  },
});
