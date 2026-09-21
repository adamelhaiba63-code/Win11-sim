import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';

export const StickyNotesApp: React.FC = () => {
  const { stickyNotes, addStickyNote, updateStickyNote, deleteStickyNote, settings } = useSystem();

  const isDark = settings.theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }]}>
      {/* Top Action Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? '#262626' : '#F4F4F4',
            borderBottomColor: isDark ? '#333' : '#E0E0E0',
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#111' }]}>
          إدارة الملاحظات الملصقة ({stickyNotes.length})
        </Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: settings.accentColor }]}
          onPress={addStickyNote}
        >
          <Ionicons name="add" size={16} color="#FFF" />
          <Text style={styles.addBtnText}>ملاحظة جديدة</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.notesList}>
        {stickyNotes.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="copy-outline" size={42} color={isDark ? '#444' : '#CCC'} />
            <Text style={[styles.emptyText, { color: isDark ? '#888' : '#777' }]}>
              لا توجد ملاحظات ملصقة حالياً. اضغط على "ملاحظة جديدة" للبدء.
            </Text>
          </View>
        ) : (
          stickyNotes.map((note) => (
            <View
              key={note.id}
              style={[
                styles.noteCard,
                { backgroundColor: note.color },
              ]}
            >
              <View style={styles.cardHeader}>
                <TextInput
                  style={styles.cardTitleInput}
                  value={note.title}
                  onChangeText={(val) => updateStickyNote(note.id, note.content, val)}
                />
                <TouchableOpacity onPress={() => deleteStickyNote(note.id)}>
                  <Ionicons name="trash-outline" size={16} color="#333" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.cardContentInput}
                multiline
                value={note.content}
                onChangeText={(val) => updateStickyNote(note.id, val)}
                placeholder="اكتب تفاصيل الملاحظة..."
                placeholderTextColor="#666"
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '600',
  },
  notesList: {
    padding: 12,
    gap: 12,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  noteCard: {
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 4,
  },
  cardTitleInput: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#111',
    flex: 1,
  },
  cardContentInput: {
    fontSize: 12,
    color: '#222',
    minHeight: 60,
    textAlignVertical: 'top',
  },
});
