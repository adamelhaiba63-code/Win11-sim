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
import { useSystem } from '../../context/SystemContext';
import { AppDefinition } from '../../types';

export const SearchOverlay: React.FC = () => {
  const {
    isSearchOpen,
    closeSearch,
    apps,
    openApp,
    settings,
    lang,
    t,
  } = useSystem();

  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const isDark = settings.theme === 'dark';

  const results = apps.filter((a) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.nameAr.toLowerCase().includes(q);
  });

  const handleLaunch = (appId: any) => {
    openApp(appId);
    closeSearch();
  };

  return (
    <TouchableWithoutFeedback onPress={closeSearch}>
      <View style={StyleSheet.absoluteFillObject}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.box,
              {
                backgroundColor: isDark ? 'rgba(32, 32, 32, 0.97)' : 'rgba(246, 246, 246, 0.97)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
              },
            ]}
          >
            {/* Search Input */}
            <View
              style={[
                styles.searchHeader,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFF',
                  borderColor: isDark ? '#444' : '#DDD',
                },
              ]}
            >
              <Ionicons name="search" size={18} color={settings.accentColor} style={{ marginHorizontal: 8 }} />
              <TextInput
                style={[styles.input, { color: isDark ? '#FFF' : '#111' }]}
                placeholder={t('typeToSearch')}
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={query}
                onChangeText={setQuery}
                autoFocus
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <Ionicons name="close-circle" size={17} color="#888" style={{ marginRight: 8 }} />
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Filter tabs */}
            <View style={styles.tabsRow}>
              <View style={[styles.tabChip, { backgroundColor: settings.accentColor }]}>
                <Text style={styles.activeTabText}>الكل (All)</Text>
              </View>
              <View style={[styles.tabChip, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]}>
                <Text style={[styles.inactiveTabText, { color: isDark ? '#BBB' : '#4B5563' }]}>التطبيقات</Text>
              </View>
              <View style={[styles.tabChip, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]}>
                <Text style={[styles.inactiveTabText, { color: isDark ? '#BBB' : '#4B5563' }]}>المستندات</Text>
              </View>
              <View style={[styles.tabChip, { backgroundColor: isDark ? '#333' : '#E5E7EB' }]}>
                <Text style={[styles.inactiveTabText, { color: isDark ? '#BBB' : '#4B5563' }]}>الويب</Text>
              </View>
            </View>

            {/* Results */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.resultsScroll}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#AAA' : '#666' }]}>
                {query.trim() ? 'أفضل النتائج' : 'أفضل التطبيقات المستخدمة'}
              </Text>

              {results.map((app) => (
                <TouchableOpacity
                  key={app.id}
                  style={[
                    styles.resultRow,
                    { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                  ]}
                  onPress={() => handleLaunch(app.id)}
                >
                  <View style={[styles.appBadge, { backgroundColor: app.bgColor || '#333' }]}>
                    <Ionicons name={(app.icon as any) || 'apps'} size={18} color="#FFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.resultTitle, { color: isDark ? '#FFF' : '#111' }]}>
                      {lang === 'ar' ? app.nameAr : app.name}
                    </Text>
                    <Text style={[styles.resultSub, { color: isDark ? '#888' : '#777' }]}>
                      تطبيق ويندوز 11 • {app.category}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={isDark ? '#666' : '#999'} />
                </TouchableOpacity>
              ))}

              {query.trim().length > 0 && (
                <TouchableOpacity
                  style={[styles.webSearchRow, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}
                  onPress={() => {
                    openApp('edge');
                    closeSearch();
                  }}
                >
                  <Ionicons name="globe-outline" size={18} color={settings.accentColor} />
                  <Text style={[styles.webSearchText, { color: settings.accentColor }]}>
                    البحث في الويب عن: "{query}" عبر Microsoft Edge
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const { width } = Dimensions.get('window');
const boxWidth = Math.min(width * 0.94, 440);

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    bottom: 54,
    alignSelf: 'center',
    width: boxWidth,
    height: 480,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 30,
    zIndex: 9995,
    padding: 14,
    overflow: 'hidden',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  tabChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  activeTabText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  inactiveTabText: {
    fontSize: 11,
    fontWeight: '500',
  },
  resultsScroll: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 10,
  },
  appBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultSub: {
    fontSize: 10.5,
    marginTop: 1,
  },
  webSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  webSearchText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
});
