import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSystem } from '../../context/SystemContext';
import { AppDefinition } from '../../types';

export const StartMenu: React.FC = () => {
  const {
    isStartMenuOpen,
    closeStartMenu,
    apps,
    openApp,
    t,
    lang,
    settings,
    lockScreen,
    restartSystem,
    shutdownSystem,
    files,
  } = useSystem();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAllApps, setShowAllApps] = useState(false);
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  if (!isStartMenuOpen) return null;

  const isDark = settings.theme === 'dark';

  const filteredApps = apps.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.nameAr.toLowerCase().includes(q)
    );
  });

  const renderIcon = (app: AppDefinition, size = 26) => {
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

  const handleAppClick = (appId: any) => {
    openApp(appId);
    closeStartMenu();
  };

  return (
    <TouchableWithoutFeedback onPress={closeStartMenu}>
      <View style={StyleSheet.absoluteFillObject}>
        <TouchableWithoutFeedback onPress={() => setShowPowerMenu(false)}>
          <View
            style={[
              styles.startContainer,
              {
                backgroundColor: isDark ? 'rgba(32, 32, 32, 0.96)' : 'rgba(245, 245, 245, 0.96)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)',
              },
            ]}
          >
            {/* Search Bar */}
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#DDD',
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={17}
                color={isDark ? '#BBB' : '#666'}
                style={{ marginHorizontal: 8 }}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: isDark ? '#FFF' : '#111' },
                ]}
                placeholder={t('typeToSearch')}
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#888" style={{ marginRight: 8 }} />
                </TouchableOpacity>
              )}
            </View>

            {/* Sub-Header: Pinned / All apps */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
                {showAllApps ? t('allApps') : t('pinned')}
              </Text>
              <TouchableOpacity
                onPress={() => setShowAllApps((v) => !v)}
                style={styles.toggleAllBtn}
              >
                <Text style={[styles.toggleAllText, { color: settings.accentColor }]}>
                  {showAllApps ? t('pinned') : `${t('allApps')} >`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Apps Grid or List */}
            <ScrollView style={styles.appsScroll} showsVerticalScrollIndicator={false}>
              {!showAllApps ? (
                <View style={styles.pinnedGrid}>
                  {filteredApps.map((app) => (
                    <TouchableOpacity
                      key={app.id}
                      style={styles.pinnedItem}
                      onPress={() => handleAppClick(app.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.pinnedIconWrap}>{renderIcon(app, 26)}</View>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.pinnedLabel,
                          { color: isDark ? '#EEE' : '#222' },
                        ]}
                      >
                        {lang === 'ar' ? app.nameAr : app.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.allAppsList}>
                  {filteredApps.map((app) => (
                    <TouchableOpacity
                      key={app.id}
                      style={styles.allAppRow}
                      onPress={() => handleAppClick(app.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.allAppIcon}>{renderIcon(app, 22)}</View>
                      <Text style={[styles.allAppText, { color: isDark ? '#FFF' : '#111' }]}>
                        {lang === 'ar' ? app.nameAr : app.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Recommended Section (Recent files) */}
              {!showAllApps && (
                <View style={styles.recommendedSection}>
                  <View style={styles.recommendedHeader}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
                      {t('recommended')}
                    </Text>
                    <Text style={[styles.moreText, { color: settings.accentColor }]}>
                      {t('more')} >
                    </Text>
                  </View>
                  <View style={styles.recGrid}>
                    {files.slice(0, 3).map((f) => (
                      <TouchableOpacity
                        key={f.id}
                        style={styles.recItem}
                        onPress={() => {
                          openApp('explorer');
                          closeStartMenu();
                        }}
                      >
                        <Ionicons
                          name={f.type === 'folder' ? 'folder' : 'document-text'}
                          size={18}
                          color={f.type === 'folder' ? '#FFCA28' : '#0078D4'}
                        />
                        <View style={{ flex: 1, marginHorizontal: 8 }}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.recItemTitle,
                              { color: isDark ? '#FFF' : '#111' },
                            ]}
                          >
                            {f.name}
                          </Text>
                          <Text style={[styles.recItemSub, { color: isDark ? '#888' : '#777' }]}>
                            {f.date}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Bottom Profile Bar & Power Menu */}
            <View
              style={[
                styles.bottomBar,
                {
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.05)',
                  borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                },
              ]}
            >
              <View style={styles.userSection}>
                <View style={[styles.avatar, { backgroundColor: settings.accentColor }]}>
                  <Ionicons name="person" size={16} color="#FFF" />
                </View>
                <Text style={[styles.userName, { color: isDark ? '#FFF' : '#111' }]}>
                  {t('user')}
                </Text>
              </View>

              {/* Power Button */}
              <TouchableOpacity
                onPress={() => setShowPowerMenu((v) => !v)}
                style={styles.powerBtn}
              >
                <Ionicons
                  name="power-outline"
                  size={19}
                  color={isDark ? '#FFF' : '#222'}
                />
              </TouchableOpacity>
            </View>

            {/* Power Options Popup Menu */}
            {showPowerMenu && (
              <View
                style={[
                  styles.powerPopup,
                  {
                    backgroundColor: isDark ? '#2B2B2B' : '#FFF',
                    borderColor: isDark ? '#444' : '#DDD',
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.powerOption}
                  onPress={() => {
                    setShowPowerMenu(false);
                    lockScreen();
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={16} color={isDark ? '#FFF' : '#111'} />
                  <Text style={[styles.powerOptText, { color: isDark ? '#FFF' : '#111' }]}>
                    {t('lock')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.powerOption}
                  onPress={() => {
                    setShowPowerMenu(false);
                    restartSystem();
                  }}
                >
                  <Ionicons name="reload-outline" size={16} color={isDark ? '#FFF' : '#111'} />
                  <Text style={[styles.powerOptText, { color: isDark ? '#FFF' : '#111' }]}>
                    {t('restart')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.powerOption}
                  onPress={() => {
                    setShowPowerMenu(false);
                    shutdownSystem();
                  }}
                >
                  <Ionicons name="power" size={16} color="#D83B01" />
                  <Text style={[styles.powerOptText, { color: '#D83B01' }]}>
                    {t('shutDown')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const { width } = Dimensions.get('window');
const menuWidth = Math.min(width * 0.94, 460);

const styles = StyleSheet.create({
  startContainer: {
    position: 'absolute',
    bottom: 54,
    alignSelf: 'center',
    width: menuWidth,
    height: 520,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 30,
    zIndex: 9995,
    overflow: 'hidden',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  toggleAllBtn: {
    padding: 4,
  },
  toggleAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appsScroll: {
    flex: 1,
    paddingHorizontal: 12,
  },
  pinnedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingBottom: 10,
  },
  pinnedItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  pinnedIconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pinnedLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  allAppsList: {
    paddingVertical: 4,
  },
  allAppRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 12,
  },
  allAppIcon: {
    width: 28,
    alignItems: 'center',
  },
  allAppText: {
    fontSize: 13,
    fontWeight: '500',
  },
  recommendedSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: 10,
    paddingBottom: 16,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  moreText: {
    fontSize: 12,
  },
  recGrid: {
    gap: 6,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(150, 150, 150, 0.08)',
  },
  recItemTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  recItemSub: {
    fontSize: 10,
    marginTop: 2,
  },
  bottomBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderTopWidth: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
  },
  powerBtn: {
    padding: 8,
    borderRadius: 6,
  },
  powerPopup: {
    position: 'absolute',
    bottom: 58,
    right: 18,
    width: 160,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 25,
    zIndex: 9999,
  },
  powerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  powerOptText: {
    fontSize: 12.5,
    fontWeight: '500',
  },
});
