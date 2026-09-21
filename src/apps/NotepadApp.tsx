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

const INITIAL_TEXT = `مرحباً بك في نظام Windows 11 للهاتف الذكي!

أهم مميزات النظام المصمم لك:
1. شريط المهام الأيقوني في المنتصف مع زر ابدأ ومركز الإجراءات.
2. تصميم الزجاج المصنفر Mica ونوافذ قابلة للتحريك والتكبير والتصغير.
3. مستكشف ملفات متطور يدعم إنشاء المجلدات والمستندات وحفظها.
4. إمكانية تغيير الخلفيات إلى خلفيات ويندوز 11 الشهيرة (Bloom, Sunrise, Flow).
5. حاسبة دقيقة، ومتصفح Edge سريع، وألعاب كلاسيكية (كاسحة الألغام و Tic-Tac-Toe).
6. موجه أوامر PowerShell تفاعلي بأوامر حقيقية ومؤثرات كود المصفوفة Matrix.

يمكنك تعديل هذا النص وحفظه أو مشاركته!`;

export const NotepadApp: React.FC = () => {
  const { settings, createFile, showNotification } = useSystem();
  const [content, setContent] = useState(INITIAL_TEXT);
  const [docName, setDocName] = useState('مستند_غير_معنون.txt');

  const isDark = settings.theme === 'dark';

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const handleSave = () => {
    createFile(docName, 'txt', null, content);
    showNotification('المفكرة', `تم حفظ "${docName}" في المستندات بنجاح.`);
  };

  const handleClear = () => {
    setContent('');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      {/* Menu / Toolbar Bar */}
      <View
        style={[
          styles.menuBar,
          {
            backgroundColor: isDark ? '#252525' : '#F3F3F3',
            borderBottomColor: isDark ? '#333' : '#E0E0E0',
          },
        ]}
      >
        <TouchableOpacity style={styles.menuItem} onPress={handleSave}>
          <Ionicons name="save-outline" size={15} color={settings.accentColor} />
          <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#111' }]}>حفظ الملف</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleClear}>
          <Ionicons name="trash-outline" size={15} color="#E05353" />
          <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#111' }]}>مسح النص</Text>
        </TouchableOpacity>

        <View style={styles.docNameBadge}>
          <Ionicons name="document-text-outline" size={13} color="#4CAF50" />
          <TextInput
            style={[styles.nameInput, { color: isDark ? '#BBB' : '#444' }]}
            value={docName}
            onChangeText={setDocName}
          />
        </View>
      </View>

      {/* Editor Body */}
      <ScrollView style={styles.editorScroll} contentContainerStyle={{ flexGrow: 1 }}>
        <TextInput
          style={[
            styles.editorInput,
            { color: isDark ? '#ECECEC' : '#1E1E1E' },
          ]}
          multiline
          value={content}
          onChangeText={setContent}
          placeholder="اكتب هنا..."
          placeholderTextColor={isDark ? '#666' : '#999'}
          textAlignVertical="top"
        />
      </ScrollView>

      {/* Status Bar at Bottom */}
      <View
        style={[
          styles.statusBar,
          {
            backgroundColor: isDark ? '#232323' : '#F0F0F0',
            borderTopColor: isDark ? '#333' : '#E0E0E0',
          },
        ]}
      >
        <Text style={[styles.statusItem, { color: isDark ? '#AAA' : '#666' }]}>
          الكلمات: {wordCount} | الأحرف: {charCount}
        </Text>
        <Text style={[styles.statusItem, { color: isDark ? '#AAA' : '#666' }]}>
          100% | Windows (CRLF) | UTF-8
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    gap: 5,
  },
  menuText: {
    fontSize: 12,
    fontWeight: '500',
  },
  docNameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 4,
  },
  nameInput: {
    fontSize: 11,
    paddingVertical: 2,
    maxWidth: 130,
  },
  editorScroll: {
    flex: 1,
  },
  editorInput: {
    flex: 1,
    padding: 14,
    fontSize: 13.5,
    lineHeight: 22,
    fontFamily: 'monospace',
    minHeight: 300,
  },
  statusBar: {
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  statusItem: {
    fontSize: 10.5,
  },
});
