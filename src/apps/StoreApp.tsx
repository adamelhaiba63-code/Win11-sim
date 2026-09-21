import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';
import { AppDefinition } from '../types';

interface StoreAppItem extends AppDefinition {
  rating: number;
  reviewsCount: string;
  downloads: string;
  description: string;
}

const STORE_CATALOG: StoreAppItem[] = [
  {
    id: 'stickynotes',
    name: 'Sticky Notes',
    nameAr: 'الملاحظات الملصقة',
    icon: 'copy-outline',
    iconType: 'Ionicons',
    iconColor: '#FFB900',
    category: 'productivity',
    rating: 4.8,
    reviewsCount: '24K',
    downloads: '10M+',
    description: 'دون أفكارك وملاحظاتك السريعة وثبتها مباشرة على سطح مكتب جهازك.',
  },
  {
    id: 'calculator',
    name: 'Windows Calculator',
    nameAr: 'حاسبة ويندوز الذكية',
    icon: 'calculator-outline',
    iconType: 'Ionicons',
    iconColor: '#0078D4',
    category: 'utilities',
    rating: 4.9,
    reviewsCount: '150K',
    downloads: '50M+',
    description: 'حاسبة علمية متطورة مع سجل تاريخ العمليات الحسابية والتحويلات.',
  },
  {
    id: 'games',
    name: 'Xbox Games Hub',
    nameAr: 'مركز ألعاب ويندوز',
    icon: 'game-controller-outline',
    iconType: 'Ionicons',
    iconColor: '#107C41',
    category: 'entertainment',
    rating: 4.7,
    reviewsCount: '88K',
    downloads: '25M+',
    description: 'العب كاسحة الألغام و Tic-Tac-Toe وغيرها من ألعاب التسلية الكلاسيكية.',
  },
  {
    id: 'mediaplayer',
    name: 'Windows Media Player',
    nameAr: 'مشغل الموسيقى الحديث',
    icon: 'play-circle-outline',
    iconType: 'Ionicons',
    iconColor: '#E3008C',
    category: 'entertainment',
    rating: 4.6,
    reviewsCount: '32K',
    downloads: '15M+',
    description: 'استمع لأعذب المقاطع مع مؤثرات التردد الصوتي البصرية وتصميم Mica الرائع.',
  },
];

export const StoreApp: React.FC = () => {
  const { settings, installStoreApp, apps } = useSystem();
  const [installingId, setInstallingId] = useState<string | null>(null);

  const isDark = settings.theme === 'dark';

  const handleInstall = (item: StoreAppItem) => {
    setInstallingId(item.id);
    setTimeout(() => {
      installStoreApp(item);
      setInstallingId(null);
    }, 1200);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }]}>
      {/* Store Banner */}
      <View
        style={[
          styles.banner,
          {
            backgroundColor: settings.accentColor,
          },
        ]}
      >
        <Ionicons name="bag-handle" size={32} color="#FFF" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.bannerTitle}>Microsoft Store لـ Windows 11</Text>
          <Text style={styles.bannerSub}>
            اكتشف أفضل التطبيقات والألعاب والأدوات المصممة خصيصاً لجهازك.
          </Text>
        </View>
      </View>

      {/* Catalog List */}
      <ScrollView contentContainerStyle={styles.catalogScroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionHeading, { color: isDark ? '#FFF' : '#111' }]}>
          أبرز التطبيقات المميزة
        </Text>

        {STORE_CATALOG.map((item) => {
          const isInstalled = apps.some((a) => a.id === item.id);
          const isInstalling = installingId === item.id;

          return (
            <View
              key={item.id}
              style={[
                styles.appCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F8F8F8',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                },
              ]}
            >
              <View style={[styles.appIconWrap, { backgroundColor: item.iconColor }]}>
                <Ionicons name={item.icon as any} size={24} color="#FFF" />
              </View>

              <View style={styles.appInfo}>
                <Text style={[styles.appName, { color: isDark ? '#FFF' : '#111' }]}>
                  {item.nameAr}
                </Text>
                <Text numberOfLines={2} style={[styles.appDesc, { color: isDark ? '#AAA' : '#666' }]}>
                  {item.description}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.metaText, { color: isDark ? '#CCC' : '#555' }]}>
                    {item.rating} ({item.reviewsCount})
                  </Text>
                  <Text style={[styles.metaText, { color: isDark ? '#888' : '#777', marginLeft: 8 }]}>
                    • {item.downloads} تنزيل
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.installBtn,
                  isInstalled
                    ? { backgroundColor: isDark ? '#383838' : '#E0E0E0' }
                    : { backgroundColor: settings.accentColor },
                ]}
                onPress={() => !isInstalled && handleInstall(item)}
                disabled={isInstalled || isInstalling}
              >
                {isInstalling ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text
                    style={[
                      styles.installBtnText,
                      { color: isInstalled ? (isDark ? '#AAA' : '#555') : '#FFF' },
                    ]}
                  >
                    {isInstalled ? 'مثبّت' : 'تثبيت'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bannerSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  catalogScroll: {
    padding: 14,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  appIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 13,
    fontWeight: '600',
  },
  appDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  metaText: {
    fontSize: 10,
  },
  installBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  installBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
