import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSystem } from '../../context/SystemContext';
import { WALLPAPERS } from '../../constants/wallpapers';

export const WallpaperView: React.FC = () => {
  const { settings } = useSystem();
  const currentWallpaper = WALLPAPERS.find((w) => w.id === settings.wallpaperId) || WALLPAPERS[0];

  const colors = currentWallpaper.colors;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Base background layer */}
      <View style={[styles.base, { backgroundColor: colors[0] }]} />

      {/* Organic Bloom Layers simulating Windows 11 Flow/Bloom ribbons */}
      <View
        style={[
          styles.bloomBlob1,
          {
            backgroundColor: colors[1] || '#142a5a',
            opacity: settings.theme === 'dark' ? 0.8 : 0.7,
          },
        ]}
      />
      <View
        style={[
          styles.bloomBlob2,
          {
            backgroundColor: colors[2] || '#103982',
            opacity: 0.75,
          },
        ]}
      />
      <View
        style={[
          styles.bloomBlob3,
          {
            backgroundColor: colors[3] || '#0078d4',
            opacity: 0.85,
          },
        ]}
      />
      {colors[4] && (
        <View
          style={[
            styles.bloomBlob4,
            {
              backgroundColor: colors[4],
              opacity: 0.6,
            },
          ]}
        />
      )}

      {/* Subtle overlay gradient vignette */}
      <View
        style={[
          styles.vignette,
          {
            backgroundColor:
              settings.theme === 'dark' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.15)',
          },
        ]}
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
  },
  bloomBlob1: {
    position: 'absolute',
    top: height * 0.15,
    left: width * 0.05,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    transform: [{ scaleX: 1.3 }, { scaleY: 0.8 }, { rotate: '-25deg' }],
  },
  bloomBlob2: {
    position: 'absolute',
    top: height * 0.25,
    right: width * -0.1,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    transform: [{ scaleX: 0.9 }, { scaleY: 1.4 }, { rotate: '35deg' }],
  },
  bloomBlob3: {
    position: 'absolute',
    top: height * 0.32,
    left: width * 0.12,
    width: width * 0.76,
    height: width * 0.76,
    borderRadius: (width * 0.76) / 2,
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }, { rotate: '15deg' }],
  },
  bloomBlob4: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.22,
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    transform: [{ scaleX: 1.2 }, { scaleY: 0.9 }, { rotate: '-10deg' }],
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
  },
});
