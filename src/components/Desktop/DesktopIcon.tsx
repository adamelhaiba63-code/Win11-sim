import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AppDefinition } from '../../types';
import { useSystem } from '../../context/SystemContext';

interface DesktopIconProps {
  app: AppDefinition;
  onPress: () => void;
  isRunning?: boolean;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ app, onPress, isRunning }) => {
  const { lang, settings } = useSystem();
  const [isPressed, setIsPressed] = useState(false);

  const title = lang === 'ar' ? app.nameAr : app.name;

  const renderIcon = () => {
    const size = settings.iconSize === 'large' ? 38 : settings.iconSize === 'small' ? 28 : 32;

    if (app.id === 'explorer') {
      return (
        <View style={styles.folderIconWrap}>
          <Ionicons name="folder" size={size} color="#FFCA28" />
          <View style={styles.folderBadge}>
            <View style={{ width: 6, height: 4, backgroundColor: '#0078D4', borderRadius: 1 }} />
          </View>
        </View>
      );
    }

    if (app.id === 'recyclebin') {
      return <Ionicons name="trash-outline" size={size} color="#E0E0E0" />;
    }

    if (app.iconType === 'Ionicons') {
      return <Ionicons name={app.icon as any} size={size} color={app.iconColor} />;
    }
    if (app.iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={app.icon as any} size={size} color={app.iconColor} />;
    }
    return <MaterialIcons name={app.icon as any} size={size} color={app.iconColor} />;
  };

  const isLightWallpaper = settings.wallpaperId.includes('light');
  const textColor = isLightWallpaper ? '#111827' : '#FFFFFF';
  const textShadowColor = isLightWallpaper ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.85)';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.container,
        isPressed && styles.pressed,
        isRunning && styles.running,
      ]}
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <Text
        numberOfLines={2}
        style={[
          styles.label,
          {
            color: textColor,
            textShadowColor,
            fontSize: settings.iconSize === 'large' ? 12 : settings.iconSize === 'small' ? 10 : 11,
          },
        ]}
      >
        {title}
      </Text>
      {isRunning && <View style={[styles.runningDot, { backgroundColor: settings.accentColor }]} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 76,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginVertical: 6,
    padding: 6,
    borderRadius: 8,
  },
  pressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  running: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderIconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderBadge: {
    position: 'absolute',
    bottom: 4,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    padding: 1,
  },
  label: {
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  runningDot: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 3,
    borderRadius: 2,
  },
});
