import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../../context/SystemContext';

export const ContextMenu: React.FC = () => {
  const {
    contextMenu,
    closeContextMenu,
    t,
    settings,
    updateSettings,
    openApp,
    addStickyNote,
    createFile,
    showNotification,
  } = useSystem();

  if (!contextMenu || !contextMenu.visible) return null;

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Clamp menu so it does not spill outside screen
  const menuWidth = 220;
  const menuHeight = 280;
  const posX = Math.min(Math.max(10, contextMenu.x), screenWidth - menuWidth - 10);
  const posY = Math.min(Math.max(40, contextMenu.y), screenHeight - menuHeight - 60);

  const isDark = settings.theme === 'dark';

  const handleRefresh = () => {
    closeContextMenu();
    showNotification(t('refresh'), 'تم تحديث سطح المكتب بنجاح');
  };

  const handleToggleIconSize = () => {
    const nextSize =
      settings.iconSize === 'medium' ? 'large' : settings.iconSize === 'large' ? 'small' : 'medium';
    updateSettings({ iconSize: nextSize });
    closeContextMenu();
  };

  const handleNewFolder = () => {
    createFile('مجلد جديد', 'folder', null);
    closeContextMenu();
  };

  const handleNewDoc = () => {
    createFile('مستند جديد.txt', 'txt', null, 'ملاحظات جديدة...');
    closeContextMenu();
  };

  const handleNewSticky = () => {
    addStickyNote();
    closeContextMenu();
  };

  const handlePersonalize = () => {
    openApp('settings');
    closeContextMenu();
  };

  return (
    <TouchableWithoutFeedback onPress={closeContextMenu}>
      <View style={StyleSheet.absoluteFillObject}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.menu,
              {
                top: posY,
                left: posX,
                backgroundColor: isDark ? 'rgba(32, 32, 32, 0.94)' : 'rgba(245, 245, 245, 0.94)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
              },
            ]}
          >
            <TouchableOpacity style={styles.item} onPress={handleToggleIconSize}>
              <Ionicons name="grid-outline" size={16} color={isDark ? '#E0E0E0' : '#333'} />
              <Text style={[styles.itemText, { color: isDark ? '#FFF' : '#111' }]}>
                {t('view')}: {settings.iconSize === 'large' ? t('largeIcons') : settings.iconSize === 'small' ? t('smallIcons') : t('mediumIcons')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleRefresh}>
              <Ionicons name="refresh-outline" size={16} color={isDark ? '#E0E0E0' : '#333'} />
              <Text style={[styles.itemText, { color: isDark ? '#FFF' : '#111' }]}>{t('refresh')}</Text>
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]} />

            <TouchableOpacity style={styles.item} onPress={handleNewFolder}>
              <Ionicons name="folder-outline" size={16} color="#F2C811" />
              <Text style={[styles.itemText, { color: isDark ? '#FFF' : '#111' }]}>{t('newFolder')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleNewDoc}>
              <Ionicons name="document-text-outline" size={16} color="#0078D4" />
              <Text style={[styles.itemText, { color: isDark ? '#FFF' : '#111' }]}>{t('newTextDoc')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleNewSticky}>
              <Ionicons name="copy-outline" size={16} color="#FFB900" />
              <Text style={[styles.itemText, { color: isDark ? '#FFF' : '#111' }]}>{t('newStickyNote')}</Text>
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]} />

            <TouchableOpacity style={styles.item} onPress={handlePersonalize}>
              <Ionicons name="color-palette-outline" size={16} color={settings.accentColor} />
              <Text style={[styles.itemText, { color: isDark ? '#FFF' : '#111' }]}>{t('personalize')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    width: 220,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 9999,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  itemText: {
    fontSize: 13,
    fontWeight: '400',
    flex: 1,
  },
  separator: {
    height: 1,
    marginVertical: 4,
    marginHorizontal: 8,
  },
});
