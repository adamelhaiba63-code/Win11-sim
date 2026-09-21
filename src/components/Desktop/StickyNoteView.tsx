import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StickyNoteItem } from '../../types';
import { useSystem } from '../../context/SystemContext';

interface StickyNoteViewProps {
  note: StickyNoteItem;
}

export const StickyNoteView: React.FC<StickyNoteViewProps> = ({ note }) => {
  const { updateStickyNote, deleteStickyNote, addStickyNote } = useSystem();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: note.color,
          top: note.position.y,
          left: note.position.x,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={addStickyNote} style={styles.btn}>
          <Ionicons name="add" size={16} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        <TouchableOpacity onPress={() => deleteStickyNote(note.id)} style={styles.btn}>
          <Ionicons name="close" size={16} color="#333" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        multiline
        value={note.content}
        onChangeText={(txt) => updateStickyNote(note.id, txt)}
        placeholder="اكتب هنا..."
        placeholderTextColor="#666"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: 170,
    height: 150,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 5,
    overflow: 'hidden',
  },
  header: {
    height: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#222',
  },
  btn: {
    padding: 2,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    color: '#111',
    textAlignVertical: 'top',
  },
});
