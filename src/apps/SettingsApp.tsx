import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';
import { WALLPAPERS, ACCENT_COLORS } from '../constants/wallpapers';
import { soundManager } from '../utils/sound';

type SettingsSection = 'personalization' | 'system' | 'sound' | 'language' | 'update' | 'about';

export const SettingsApp: React.FC = () => {
  const { settings, updateSettings, t, lang, showNotification } = useSystem();
  const [activeSection, setActiveSection] = useState<SettingsSection>('personalization');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  const isDark = settings.theme === 'dark';

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setUpdateStatus(null);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateStatus('جهازك محدّث بأحدث إصدار من Windows 11 (24H2). كل الميزات تعمل بأعلى كفاءة.');
      soundManager.playSnap();
    }, 1800);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }]}>
      {/* Settings Navigation Sidebar */}
      <View
        style={[
          styles.sidebar,
          {
            backgroundColor: isDark ? '#181818' : '#F6F6F6',
            borderRightColor: isDark ? '#2E2E2E' : '#E5E5E5',
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.navItem, activeSection === 'personalization' && styles.navItemActive]}
          onPress={() => setActiveSection('personalization')}
        >
          <Ionicons
            name="color-palette-outline"
            size={18}
            color={activeSection === 'personalization' ? settings.accentColor : isDark ? '#BBB' : '#444'}
          />
          <Text
            style={[
              styles.navText,
              { color: isDark ? '#FFF' : '#111' },
              activeSection === 'personalization' && { color: settings.accentColor, fontWeight: '700' },
            ]}
          >
            {t('personalization')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeSection === 'system' && styles.navItemActive]}
          onPress={() => setActiveSection('system')}
        >
          <Ionicons
            name="hardware-chip-outline"
            size={18}
            color={activeSection === 'system' ? settings.accentColor : isDark ? '#BBB' : '#444'}
          />
          <Text
            style={[
              styles.navText,
              { color: isDark ? '#FFF' : '#111' },
              activeSection === 'system' && { color: settings.accentColor, fontWeight: '700' },
            ]}
          >
            {t('system')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeSection === 'sound' && styles.navItemActive]}
          onPress={() => setActiveSection('sound')}
        >
          <Ionicons
            name="volume-medium-outline"
            size={18}
            color={activeSection === 'sound' ? settings.accentColor : isDark ? '#BBB' : '#444'}
          />
          <Text
            style={[
              styles.navText,
              { color: isDark ? '#FFF' : '#111' },
              activeSection === 'sound' && { color: settings.accentColor, fontWeight: '700' },
            ]}
          >
            {t('sound')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeSection === 'language' && styles.navItemActive]}
          onPress={() => setActiveSection('language')}
        >
          <Ionicons
            name="globe-outline"
            size={18}
            color={activeSection === 'language' ? settings.accentColor : isDark ? '#BBB' : '#444'}
          />
          <Text
            style={[
              styles.navText,
              { color: isDark ? '#FFF' : '#111' },
              activeSection === 'language' && { color: settings.accentColor, fontWeight: '700' },
            ]}
          >
            {t('language')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeSection === 'update' && styles.navItemActive]}
          onPress={() => setActiveSection('update')}
        >
          <Ionicons
            name="sync-outline"
            size={18}
            color={activeSection === 'update' ? settings.accentColor : isDark ? '#BBB' : '#444'}
          />
          <Text
            style={[
              styles.navText,
              { color: isDark ? '#FFF' : '#111' },
              activeSection === 'update' && { color: settings.accentColor, fontWeight: '700' },
            ]}
          >
            Windows Update
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeSection === 'about' && styles.navItemActive]}
          onPress={() => setActiveSection('about')}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={activeSection === 'about' ? settings.accentColor : isDark ? '#BBB' : '#444'}
          />
          <Text
            style={[
              styles.navText,
              { color: isDark ? '#FFF' : '#111' },
              activeSection === 'about' && { color: settings.accentColor, fontWeight: '700' },
            ]}
          >
            {t('about')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Body */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Personalization Section */}
        {activeSection === 'personalization' && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.mainHeading, { color: isDark ? '#FFF' : '#111' }]}>
              {t('personalization')}
            </Text>
            <Text style={[styles.subHeading, { color: isDark ? '#AAA' : '#666' }]}>
              تخصيص خلفيات ويندوز 11، والألوان، ونمط شريط المهام والشفافية.
            </Text>

            {/* Wallpapers Showcase */}
            <Text style={[styles.blockTitle, { color: isDark ? '#FFF' : '#111' }]}>
              اختر خلفية سطح المكتب
            </Text>
            <View style={styles.wallpaperGrid}>
              {WALLPAPERS.map((wp) => {
                const isSelected = settings.wallpaperId === wp.id;
                return (
                  <TouchableOpacity
                    key={wp.id}
                    style={[
                      styles.wpCard,
                      { borderColor: isSelected ? settings.accentColor : isDark ? '#333' : '#DDD' },
                      isSelected && styles.wpCardActive,
                    ]}
                    onPress={() => {
                      updateSettings({ wallpaperId: wp.id });
                      showNotification('تخصيص المظهر', `تم تطبيق خلفية ${wp.nameAr}`);
                    }}
                  >
                    <View style={[styles.wpPreview, { backgroundColor: wp.thumbnail }]}>
                      <View
                        style={[
                          styles.wpOrb,
                          { backgroundColor: wp.colors[wp.colors.length - 1] || '#FFF' },
                        ]}
                      />
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[styles.wpName, { color: isDark ? '#EEE' : '#222' }]}
                    >
                      {lang === 'ar' ? wp.nameAr : wp.name}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: settings.accentColor }]}>
                        <Ionicons name="checkmark" size={12} color="#FFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Dark Mode Card */}
            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F7F7F7',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardSettingTitle, { color: isDark ? '#FFF' : '#111' }]}>
                  {t('theme')}
                </Text>
                <Text style={[styles.cardSettingDesc, { color: isDark ? '#AAA' : '#666' }]}>
                  {settings.theme === 'dark' ? t('darkMode') : t('lightMode')}
                </Text>
              </View>
              <Switch
                value={settings.theme === 'dark'}
                onValueChange={(val) => updateSettings({ theme: val ? 'dark' : 'light' })}
                thumbColor={settings.accentColor}
                trackColor={{ false: '#767577', true: settings.accentColor + '88' }}
              />
            </View>

            {/* Accent Color Chooser */}
            <Text style={[styles.blockTitle, { color: isDark ? '#FFF' : '#111', marginTop: 16 }]}>
              {t('accentColor')}
            </Text>
            <View style={styles.colorsRow}>
              {ACCENT_COLORS.map((color) => {
                const isSelected = settings.accentColor === color.hex;
                return (
                  <TouchableOpacity
                    key={color.hex}
                    onPress={() => updateSettings({ accentColor: color.hex })}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.hex },
                      isSelected && styles.colorCircleActive,
                    ]}
                  >
                    {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Taskbar Alignment */}
            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F7F7F7',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                  marginTop: 16,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardSettingTitle, { color: isDark ? '#FFF' : '#111' }]}>
                  {t('taskbarAlignment')}
                </Text>
                <Text style={[styles.cardSettingDesc, { color: isDark ? '#AAA' : '#666' }]}>
                  {settings.taskbarAlignment === 'center' ? t('center') : t('left')}
                </Text>
              </View>
              <View style={styles.segmentWrap}>
                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    settings.taskbarAlignment === 'center' && { backgroundColor: settings.accentColor },
                  ]}
                  onPress={() => updateSettings({ taskbarAlignment: 'center' })}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: settings.taskbarAlignment === 'center' ? '#FFF' : isDark ? '#BBB' : '#444' },
                    ]}
                  >
                    {t('center')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    settings.taskbarAlignment === 'left' && { backgroundColor: settings.accentColor },
                  ]}
                  onPress={() => updateSettings({ taskbarAlignment: 'left' })}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: settings.taskbarAlignment === 'left' ? '#FFF' : isDark ? '#BBB' : '#444' },
                    ]}
                  >
                    {t('left')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* System Section */}
        {activeSection === 'system' && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.mainHeading, { color: isDark ? '#FFF' : '#111' }]}>
              {t('system')}
            </Text>

            {/* Display Brightness Card */}
            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F7F7F7',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                  marginBottom: 12,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardSettingTitle, { color: isDark ? '#FFF' : '#111' }]}>
                  سطوع الشاشة ({Math.round(settings.screenBrightness * 100)}%)
                </Text>
                <Text style={[styles.cardSettingDesc, { color: isDark ? '#AAA' : '#666' }]}>
                  تحكم واقعي في إضاءة شاشة المحاكاة
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() =>
                    updateSettings({
                      screenBrightness: Math.max(0.3, settings.screenBrightness - 0.1),
                    })
                  }
                  style={styles.stepBtn}
                >
                  <Text style={{ color: isDark ? '#FFF' : '#111' }}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    updateSettings({
                      screenBrightness: Math.min(1.0, settings.screenBrightness + 0.1),
                    })
                  }
                  style={styles.stepBtn}
                >
                  <Text style={{ color: isDark ? '#FFF' : '#111' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Specs card */}
            <View
              style={[
                styles.specsCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F7F7F7',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                },
              ]}
            >
              <Text style={[styles.blockTitle, { color: isDark ? '#FFF' : '#111' }]}>
                {t('deviceSpecs')}
              </Text>
              <View style={styles.specRow}>
                <Text style={[styles.specKey, { color: isDark ? '#AAA' : '#666' }]}>اسم الجهاز:</Text>
                <Text style={[styles.specVal, { color: isDark ? '#FFF' : '#111' }]}>WIN11-MOBILE-PRO</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={[styles.specKey, { color: isDark ? '#AAA' : '#666' }]}>المعالج:</Text>
                <Text style={[styles.specVal, { color: isDark ? '#FFF' : '#111' }]}>
                  Snapdragon 8 Gen 3 Octa-Core @ 3.3 GHz
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={[styles.specKey, { color: isDark ? '#AAA' : '#666' }]}>الذاكرة العشوائية (RAM):</Text>
                <Text style={[styles.specVal, { color: isDark ? '#FFF' : '#111' }]}>16.0 GB</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={[styles.specKey, { color: isDark ? '#AAA' : '#666' }]}>التخزين الداخلي:</Text>
                <Text style={[styles.specVal, { color: isDark ? '#FFF' : '#111' }]}>256 GB NVMe SSD</Text>
              </View>
            </View>
          </View>
        )}

        {/* Sound Section */}
        {activeSection === 'sound' && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.mainHeading, { color: isDark ? '#FFF' : '#111' }]}>
              {t('sound')}
            </Text>
            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F7F7F7',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardSettingTitle, { color: isDark ? '#FFF' : '#111' }]}>
                  {t('soundEffects')}
                </Text>
                <Text style={[styles.cardSettingDesc, { color: isDark ? '#AAA' : '#666' }]}>
                  أصوات النقرات وقائمة ابدأ وتنبيهات النظام
                </Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(val) => updateSettings({ soundEnabled: val })}
                thumbColor={settings.accentColor}
                trackColor={{ false: '#767577', true: settings.accentColor + '88' }}
              />
            </View>
          </View>
        )}

        {/* Language Section */}
        {activeSection === 'language' && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.mainHeading, { color: isDark ? '#FFF' : '#111' }]}>
              {t('language')}
            </Text>
            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F7F7F7',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                  marginBottom: 10,
                },
              ]}
            >
              <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                onPress={() => updateSettings({ language: 'ar' })}
              >
                <View>
                  <Text style={[styles.cardSettingTitle, { color: isDark ? '#FFF' : '#111' }]}>
                    اللغة العربية (Windows 11 المعرب)
                  </Text>
                  <Text style={[styles.cardSettingDesc, { color: isDark ? '#AAA' : '#666' }]}>
                    واجهة باللغة العربية مع دعم كامل لاتجاه اليمين إلى اليسار
                  </Text>
                </View>
                {settings.language === 'ar' && (
                  <Ionicons name="checkmark-circle" size={22} color={settings.accentColor} />
                )}
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F7F7F7',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                },
              ]}
            >
              <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                onPress={() => updateSettings({ language: 'en' })}
              >
                <View>
                  <Text style={[styles.cardSettingTitle, { color: isDark ? '#FFF' : '#111' }]}>
                    English (United States)
                  </Text>
                  <Text style={[styles.cardSettingDesc, { color: isDark ? '#AAA' : '#666' }]}>
                    Windows 11 default English experience
                  </Text>
                </View>
                {settings.language === 'en' && (
                  <Ionicons name="checkmark-circle" size={22} color={settings.accentColor} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Windows Update Section */}
        {activeSection === 'update' && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.mainHeading, { color: isDark ? '#FFF' : '#111' }]}>
              Windows Update
            </Text>

            <View
              style={[
                styles.updateCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F7F7F7',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="checkmark-circle" size={32} color="#107C41" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.updateMainText, { color: isDark ? '#FFF' : '#111' }]}>
                    {t('upToDate')}
                  </Text>
                  <Text style={[styles.updateSubText, { color: isDark ? '#AAA' : '#666' }]}>
                    {t('lastChecked')}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.updateBtn, { backgroundColor: settings.accentColor }]}
                onPress={handleCheckUpdate}
                disabled={isCheckingUpdate}
              >
                {isCheckingUpdate ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.updateBtnText}>{t('checkForUpdates')}</Text>
                )}
              </TouchableOpacity>

              {updateStatus && (
                <Text style={[styles.updateResult, { color: '#107C41' }]}>{updateStatus}</Text>
              )}
            </View>
          </View>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <View style={styles.sectionWrap}>
            <Text style={[styles.mainHeading, { color: isDark ? '#FFF' : '#111' }]}>
              {t('about')}
            </Text>

            <View
              style={[
                styles.specsCard,
                {
                  backgroundColor: isDark ? '#272727' : '#F7F7F7',
                  borderColor: isDark ? '#383838' : '#E5E5E5',
                },
              ]}
            >
              <Text style={[styles.blockTitle, { color: isDark ? '#FFF' : '#111' }]}>
                {t('windowsSpecs')}
              </Text>
              <View style={styles.specRow}>
                <Text style={[styles.specKey, { color: isDark ? '#AAA' : '#666' }]}>{t('edition')}:</Text>
                <Text style={[styles.specVal, { color: isDark ? '#FFF' : '#111' }]}>
                  Windows 11 Pro Mobile
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={[styles.specKey, { color: isDark ? '#AAA' : '#666' }]}>{t('version')}:</Text>
                <Text style={[styles.specVal, { color: isDark ? '#FFF' : '#111' }]}>24H2</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={[styles.specKey, { color: isDark ? '#AAA' : '#666' }]}>بناء النظام:</Text>
                <Text style={[styles.specVal, { color: isDark ? '#FFF' : '#111' }]}>26100.1742</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={[styles.specKey, { color: isDark ? '#AAA' : '#666' }]}>التجربة:</Text>
                <Text style={[styles.specVal, { color: isDark ? '#FFF' : '#111' }]}>
                  Windows Feature Experience Pack 1000.26100.32.0
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 130,
    borderRightWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 8,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 120, 212, 0.12)',
  },
  navText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
  },
  sectionWrap: {
    paddingBottom: 20,
  },
  mainHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 12,
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  wallpaperGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  wpCard: {
    width: '48%',
    borderRadius: 8,
    borderWidth: 2,
    padding: 6,
    position: 'relative',
  },
  wpCardActive: {
    borderWidth: 2,
  },
  wpPreview: {
    height: 60,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wpOrb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.8,
  },
  wpName: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardSettingTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardSettingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleActive: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  segmentWrap: {
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.3)',
  },
  segmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specsCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150,150,150,0.15)',
  },
  specKey: {
    fontSize: 11.5,
    flex: 1,
  },
  specVal: {
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  updateCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  updateMainText: {
    fontSize: 14,
    fontWeight: '700',
  },
  updateSubText: {
    fontSize: 11,
    marginTop: 2,
  },
  updateBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  updateBtnText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
  updateResult: {
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 16,
  },
});
