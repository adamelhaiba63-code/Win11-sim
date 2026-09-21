import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../../context/SystemContext';

interface TodoTask {
  id: string;
  text: string;
  done: boolean;
}

export const WidgetsBoard: React.FC = () => {
  const { isWidgetsOpen, closeWidgets, settings, t } = useSystem();
  const [tasks, setTasks] = useState<TodoTask[]>([
    { id: '1', text: 'تجربة تخصيص ويندوز 11', done: true },
    { id: '2', text: 'إنشاء مجلد وملاحظة في سطح المكتب', done: false },
    { id: '3', text: 'فحص أوامر PowerShell التفاعلية', done: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  if (!isWidgetsOpen) return null;

  const isDark = settings.theme === 'dark';

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newTaskText.trim(), done: false },
    ]);
    setNewTaskText('');
  };

  return (
    <TouchableWithoutFeedback onPress={closeWidgets}>
      <View style={StyleSheet.absoluteFillObject}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.board,
              {
                backgroundColor: isDark ? 'rgba(26, 26, 26, 0.96)' : 'rgba(240, 240, 240, 0.96)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleWrap}>
                <Ionicons
                  name="grid-outline"
                  size={18}
                  color={settings.accentColor}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#111' }]}>
                  {t('widgets')}
                </Text>
              </View>
              <TouchableOpacity onPress={closeWidgets} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={isDark ? '#BBB' : '#444'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
              {/* Weather Widget */}
              <View
                style={[
                  styles.widgetCard,
                  {
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
                    {t('weather')}
                  </Text>
                  <Ionicons name="partly-sunny" size={20} color="#F59E0B" />
                </View>
                <View style={styles.weatherBody}>
                  <View>
                    <Text style={[styles.tempMain, { color: isDark ? '#FFF' : '#111' }]}>26°C</Text>
                    <Text style={[styles.weatherDesc, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {t('clearSky')}
                    </Text>
                    <Text style={[styles.weatherSub, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {t('highLow')}
                    </Text>
                  </View>
                  <View style={styles.weatherDetails}>
                    <Text style={[styles.weatherMeta, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                      الرطوبة: 34%
                    </Text>
                    <Text style={[styles.weatherMeta, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                      الرياح: 12 كم/س
                    </Text>
                    <Text style={[styles.weatherMeta, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                      جودة الهواء: ممتاز (32)
                    </Text>
                  </View>
                </View>
              </View>

              {/* Markets / Finance Widget */}
              <View
                style={[
                  styles.widgetCard,
                  {
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
                    {t('marketWatch')}
                  </Text>
                  <Ionicons name="trending-up" size={18} color="#10B981" />
                </View>

                <View style={styles.marketRow}>
                  <Text style={[styles.symbol, { color: isDark ? '#FFF' : '#111' }]}>BTC/USD</Text>
                  <Text style={[styles.price, { color: isDark ? '#FFF' : '#111' }]}>$68,450</Text>
                  <Text style={styles.gain}>+3.42%</Text>
                </View>

                <View style={styles.marketRow}>
                  <Text style={[styles.symbol, { color: isDark ? '#FFF' : '#111' }]}>MSFT</Text>
                  <Text style={[styles.price, { color: isDark ? '#FFF' : '#111' }]}>$448.20</Text>
                  <Text style={styles.gain}>+1.85%</Text>
                </View>

                <View style={styles.marketRow}>
                  <Text style={[styles.symbol, { color: isDark ? '#FFF' : '#111' }]}>ETH/USD</Text>
                  <Text style={[styles.price, { color: isDark ? '#FFF' : '#111' }]}>$3,620</Text>
                  <Text style={styles.loss}>-0.65%</Text>
                </View>
              </View>

              {/* To-Do List Widget */}
              <View
                style={[
                  styles.widgetCard,
                  {
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
                    {t('todo')}
                  </Text>
                  <Ionicons name="checkbox-outline" size={18} color={settings.accentColor} />
                </View>

                <View style={styles.tasksList}>
                  {tasks.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.taskItem}
                      onPress={() => toggleTask(item.id)}
                    >
                      <Ionicons
                        name={item.done ? 'checkbox' : 'square-outline'}
                        size={18}
                        color={item.done ? settings.accentColor : isDark ? '#9CA3AF' : '#6B7280'}
                      />
                      <Text
                        style={[
                          styles.taskText,
                          {
                            color: item.done
                              ? isDark
                                ? '#6B7280'
                                : '#9CA3AF'
                              : isDark
                              ? '#F3F4F6'
                              : '#111827',
                            textDecorationLine: item.done ? 'line-through' : 'none',
                          },
                        ]}
                      >
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.addTodoRow}>
                  <TextInput
                    style={[
                      styles.addTodoInput,
                      {
                        backgroundColor: isDark ? '#374151' : '#F3F4F6',
                        color: isDark ? '#FFF' : '#111',
                      },
                    ]}
                    placeholder={t('addTodo')}
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={newTaskText}
                    onChangeText={setNewTaskText}
                    onSubmitEditing={handleAddTask}
                  />
                  <TouchableOpacity
                    onPress={handleAddTask}
                    style={[styles.addTodoBtn, { backgroundColor: settings.accentColor }]}
                  >
                    <Ionicons name="add" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* News Highlights */}
              <View
                style={[
                  styles.widgetCard,
                  {
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: isDark ? '#E5E7EB' : '#1F2937' }]}>
                    {t('topStories')}
                  </Text>
                  <Ionicons name="newspaper-outline" size={18} color="#3B82F6" />
                </View>

                <View style={styles.newsItem}>
                  <Text style={[styles.newsHeadline, { color: isDark ? '#FFF' : '#111' }]}>
                    مايكروسوفت تكشف عن تحديثات الذكاء الاصطناعي الثورية لنظام Windows 11
                  </Text>
                  <Text style={[styles.newsMeta, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    أخبار التقنية • قبل ساعتين
                  </Text>
                </View>

                <View style={styles.newsDivider} />

                <View style={styles.newsItem}>
                  <Text style={[styles.newsHeadline, { color: isDark ? '#FFF' : '#111' }]}>
                    إطلاق أحدث المعالجات فائق السرعة لدعم أنظمة الهواتف المحمولة
                  </Text>
                  <Text style={[styles.newsMeta, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    تكنولوجيا اليوم • قبل 4 ساعات
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const { width } = Dimensions.get('window');
const boardWidth = Math.min(width * 0.94, 420);

const styles = StyleSheet.create({
  board: {
    position: 'absolute',
    bottom: 54,
    left: 10,
    width: boardWidth,
    height: 540,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 30,
    zIndex: 9995,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  scrollArea: {
    padding: 12,
    gap: 12,
  },
  widgetCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  weatherBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempMain: {
    fontSize: 28,
    fontWeight: '700',
  },
  weatherDesc: {
    fontSize: 12,
    fontWeight: '500',
  },
  weatherSub: {
    fontSize: 10,
    marginTop: 2,
  },
  weatherDetails: {
    alignItems: 'flex-end',
    gap: 3,
  },
  weatherMeta: {
    fontSize: 11,
  },
  marketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  symbol: {
    fontSize: 12,
    fontWeight: '600',
    width: 70,
  },
  price: {
    fontSize: 12,
    fontWeight: '500',
  },
  gain: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  loss: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  tasksList: {
    gap: 6,
    marginBottom: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  taskText: {
    fontSize: 12,
    flex: 1,
  },
  addTodoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  addTodoInput: {
    flex: 1,
    height: 32,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 11.5,
  },
  addTodoBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsItem: {
    paddingVertical: 4,
  },
  newsHeadline: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  newsMeta: {
    fontSize: 10,
    marginTop: 3,
  },
  newsDivider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    marginVertical: 6,
  },
});
