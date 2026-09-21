import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';
import { WALLPAPERS } from '../constants/wallpapers';

export const PhotosApp: React.FC = () => {
  const { settings, updateSettings, showNotification } = useSystem();
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const isDark = settings.theme === 'dark';

  const handleSetWallpaper = (wp: any) => {
    updateSettings({ wallpaperId: wp.id });
    showNotification('معرض الصور', `تم تعيين صورة "${wp.nameAr}" كخلفية لسطح المكتب!`);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? '#252525' : '#F6F6F6',
            borderBottomColor: isDark ? '#333' : '#E0E0E0',
          },
        ]}
      >
        <Ionicons name="images-outline" size={17} color={settings.accentColor} />
        <Text style={[styles.title, { color: isDark ? '#FFF' : '#111' }]}>معرض الصور والخلفيات</Text>
      </View>

      <ScrollView contentContainerStyle={styles.galleryGrid}>
        {WALLPAPERS.map((wp) => (
          <TouchableOpacity
            key={wp.id}
            style={[
              styles.photoCard,
              {
                backgroundColor: isDark ? '#2A2A2A' : '#F3F3F3',
                borderColor: settings.wallpaperId === wp.id ? settings.accentColor : 'transparent',
              },
            ]}
            onPress={() => setSelectedPhoto(wp)}
          >
            {/* Visual Canvas Representation */}
            <View style={[styles.photoCanvas, { backgroundColor: wp.thumbnail }]}>
              <View
                style={[
                  styles.glowShape,
                  { backgroundColor: wp.colors[wp.colors.length - 1] || '#0078D4' },
                ]}
              />
            </View>

            <View style={styles.cardMeta}>
              <Text numberOfLines={1} style={[styles.photoName, { color: isDark ? '#FFF' : '#111' }]}>
                {wp.nameAr}
              </Text>
              <TouchableOpacity
                onPress={() => handleSetWallpaper(wp)}
                style={[styles.setWpBtn, { backgroundColor: settings.accentColor }]}
              >
                <Text style={styles.setWpBtnText}>تعيين كخلفية</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detail Preview Modal */}
      {selectedPhoto && (
        <View
          style={[
            styles.previewOverlay,
            { backgroundColor: isDark ? 'rgba(0,0,0,0.92)' : 'rgba(255,255,255,0.95)' },
          ]}
        >
          <View style={styles.previewHeader}>
            <Text style={[styles.previewTitle, { color: isDark ? '#FFF' : '#111' }]}>
              {selectedPhoto.nameAr}
            </Text>
            <TouchableOpacity onPress={() => setSelectedPhoto(null)}>
              <Ionicons name="close" size={24} color={isDark ? '#FFF' : '#111'} />
            </TouchableOpacity>
          </View>

          <View style={[styles.previewCanvas, { backgroundColor: selectedPhoto.thumbnail }]}>
            <View
              style={[
                styles.previewOrb,
                { backgroundColor: selectedPhoto.colors[selectedPhoto.colors.length - 1] },
              ]}
            />
          </View>

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: settings.accentColor }]}
              onPress={() => {
                handleSetWallpaper(selectedPhoto);
                setSelectedPhoto(null);
              }}
            >
              <Ionicons name="image" size={16} color="#FFF" />
              <Text style={styles.applyBtnText}>تعيين كخلفية الشاشة الآن</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  galleryGrid: {
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoCard: {
    width: '48%',
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  photoCanvas: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  glowShape: {
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.75,
  },
  cardMeta: {
    padding: 8,
    gap: 6,
  },
  photoName: {
    fontSize: 11,
    fontWeight: '600',
  },
  setWpBtn: {
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  setWpBtnText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '600',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    zIndex: 100,
    justifyContent: 'space-between',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  previewCanvas: {
    flex: 1,
    borderRadius: 12,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewOrb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.85,
  },
  previewActions: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
