import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';

interface BookmarkItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

const BOOKMARKS: BookmarkItem[] = [
  { id: '1', name: 'Google', url: 'https://www.google.com', icon: 'logo-google', color: '#EA4335' },
  { id: '2', name: 'YouTube', url: 'https://www.youtube.com', icon: 'logo-youtube', color: '#FF0000' },
  { id: '3', name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'book-outline', color: '#000000' },
  { id: '4', name: 'GitHub', url: 'https://www.github.com', icon: 'logo-github', color: '#24292E' },
  { id: '5', name: 'Bing AI', url: 'https://www.bing.com', icon: 'chatbubbles-outline', color: '#008272' },
  { id: '6', name: 'MSN News', url: 'https://www.msn.com', icon: 'newspaper-outline', color: '#0078D4' },
];

export const EdgeApp: React.FC = () => {
  const { settings } = useSystem();
  const [urlInput, setUrlInput] = useState('https://www.bing.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.bing.com');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(1);
  const [history, setHistory] = useState<string[]>(['https://www.bing.com']);

  const isDark = settings.theme === 'dark';

  const navigateTo = (url: string) => {
    setUrlInput(url);
    setCurrentUrl(url);
    setHistory((prev) => [...prev, url]);
  };

  const handleSearchSubmit = () => {
    if (!urlInput.trim()) return;
    let target = urlInput.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
    }
    navigateTo(target);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }]}>
      {/* Edge Tab Bar */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: isDark ? '#181818' : '#E8E8E8',
            borderBottomColor: isDark ? '#333' : '#CCC',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 1 && {
              backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF',
              borderTopColor: '#0078D4',
            },
          ]}
          onPress={() => setActiveTab(1)}
        >
          <Ionicons name="compass-outline" size={14} color="#0078D4" />
          <Text
            numberOfLines={1}
            style={[styles.tabTitle, { color: isDark ? '#FFF' : '#111' }]}
          >
            {currentUrl.includes('bing') ? 'Bing: Search' : currentUrl.replace('https://www.', '')}
          </Text>
          <Ionicons name="close" size={13} color={isDark ? '#AAA' : '#666'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.newTabBtn}>
          <Ionicons name="add" size={16} color={isDark ? '#AAA' : '#666'} />
        </TouchableOpacity>
      </View>

      {/* Navigation & Address Bar */}
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: isDark ? '#202020' : '#F3F3F3',
            borderBottomColor: isDark ? '#333' : '#E0E0E0',
          },
        ]}
      >
        <TouchableOpacity style={styles.navIconBtn} onPress={() => navigateTo('https://www.bing.com')}>
          <Ionicons name="arrow-back" size={16} color={isDark ? '#DDD' : '#444'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIconBtn} onPress={() => navigateTo('https://www.bing.com')}>
          <Ionicons name="arrow-forward" size={16} color={isDark ? '#777' : '#BBB'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navIconBtn} onPress={() => navigateTo(currentUrl)}>
          <Ionicons name="reload" size={15} color={isDark ? '#DDD' : '#444'} />
        </TouchableOpacity>

        {/* Omnibox */}
        <View
          style={[
            styles.omnibox,
            {
              backgroundColor: isDark ? '#2E2E2E' : '#FFFFFF',
              borderColor: isDark ? '#444' : '#CCC',
            },
          ]}
        >
          <Ionicons name="lock-closed" size={13} color="#107C41" style={{ marginRight: 6 }} />
          <TextInput
            style={[styles.urlText, { color: isDark ? '#FFF' : '#111' }]}
            value={urlInput}
            onChangeText={setUrlInput}
            onSubmitEditing={handleSearchSubmit}
            selectTextOnFocus
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={handleSearchSubmit}>
            <Ionicons name="arrow-forward-circle" size={18} color="#0078D4" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navIconBtn}>
          <Ionicons name="star-outline" size={16} color={isDark ? '#DDD' : '#444'} />
        </TouchableOpacity>
      </View>

      {/* Web View Simulator */}
      <ScrollView style={styles.pageArea} contentContainerStyle={styles.pageContent}>
        {/* Speed Dial Home */}
        <View style={styles.bingHero}>
          <Text style={[styles.bingLogo, { color: settings.accentColor }]}>Microsoft Bing</Text>
          <View
            style={[
              styles.bingSearchBox,
              {
                backgroundColor: isDark ? '#2B2B2B' : '#FFF',
                borderColor: isDark ? '#444' : '#DDD',
              },
            ]}
          >
            <TextInput
              style={[styles.bingInput, { color: isDark ? '#FFF' : '#111' }]}
              placeholder="ابحث في الويب أو اسأل Copilot..."
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => navigateTo(`https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`)}
            />
            <TouchableOpacity
              onPress={() => navigateTo(`https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`)}
              style={styles.searchSubmit}
            >
              <Ionicons name="search" size={18} color="#0078D4" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Dial Bookmarks */}
        <Text style={[styles.sectionHeading, { color: isDark ? '#EEE' : '#222' }]}>
          المواقع الشائعة والمفضلة
        </Text>
        <View style={styles.bookmarksGrid}>
          {BOOKMARKS.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={[
                styles.bookmarkCard,
                {
                  backgroundColor: isDark ? '#2B2B2B' : '#F6F6F6',
                  borderColor: isDark ? '#3D3D3D' : '#E5E5E5',
                },
              ]}
              onPress={() => navigateTo(b.url)}
            >
              <View style={[styles.bmIconCircle, { backgroundColor: b.color }]}>
                <Ionicons name={b.icon as any} size={20} color="#FFF" />
              </View>
              <Text style={[styles.bmName, { color: isDark ? '#FFF' : '#111' }]}>{b.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Stories */}
        <Text style={[styles.sectionHeading, { color: isDark ? '#EEE' : '#222', marginTop: 20 }]}>
          أحدث الأخبار والمقالات (MSN)
        </Text>
        <View style={styles.newsGrid}>
          <TouchableOpacity
            style={[
              styles.newsCard,
              {
                backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9',
                borderColor: isDark ? '#3A3A3A' : '#E5E5E5',
              },
            ]}
            onPress={() => navigateTo('https://www.msn.com/ai-future-2026')}
          >
            <Ionicons name="sparkles" size={24} color="#0078D4" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.newsTitle, { color: isDark ? '#FFF' : '#111' }]}>
                ويندوز 11 يدمج مساعد Copilot الذكي في جميع أدوات النظام
              </Text>
              <Text style={[styles.newsDate, { color: isDark ? '#888' : '#777' }]}>
                MSN News • قبل ساعة
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.newsCard,
              {
                backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9',
                borderColor: isDark ? '#3A3A3A' : '#E5E5E5',
              },
            ]}
            onPress={() => navigateTo('https://www.msn.com/mobile-performance')}
          >
            <Ionicons name="speedometer-outline" size={24} color="#107C41" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.newsTitle, { color: isDark ? '#FFF' : '#111' }]}>
                تحسينات غير مسبوقة في سرعة استجابة التطبيقات وتوفير استهلاك البطارية
              </Text>
              <Text style={[styles.newsDate, { color: isDark ? '#888' : '#777' }]}>
                Tech Insights • قبل ساعتين
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderBottomWidth: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 30,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderTopWidth: 2,
    gap: 6,
    maxWidth: 160,
  },
  tabTitle: {
    fontSize: 11.5,
    fontWeight: '500',
    flex: 1,
  },
  newTabBtn: {
    padding: 6,
    marginLeft: 4,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    gap: 6,
  },
  navIconBtn: {
    padding: 6,
    borderRadius: 4,
  },
  omnibox: {
    flex: 1,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  urlText: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 2,
  },
  pageArea: {
    flex: 1,
  },
  pageContent: {
    padding: 16,
  },
  bingHero: {
    alignItems: 'center',
    marginVertical: 16,
  },
  bingLogo: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  bingSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  bingInput: {
    flex: 1,
    fontSize: 13,
  },
  searchSubmit: {
    padding: 6,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  bookmarksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bookmarkCard: {
    width: '31%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  bmIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  bmName: {
    fontSize: 11,
    fontWeight: '600',
  },
  newsGrid: {
    gap: 10,
  },
  newsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  newsTitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  newsDate: {
    fontSize: 10,
    marginTop: 3,
  },
});
