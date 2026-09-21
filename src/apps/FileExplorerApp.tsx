import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';
import { FileItem } from '../types';

export const FileExplorerApp: React.FC = () => {
  const { files, createFile, deleteFile, settings, t, lang } = useSystem();
  const [currentPath, setCurrentPath] = useState('هذا الكمبيوتر الشخصي');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  const isDark = settings.theme === 'dark';

  // Files in current directory
  const currentFiles = files.filter((f) => f.parentId === selectedFolderId);

  const handleOpenItem = (file: FileItem) => {
    if (file.type === 'folder') {
      setSelectedFolderId(file.id);
      setCurrentPath(`هذا الكمبيوتر الشخصي > ${file.name}`);
    } else {
      setSelectedFile(file);
    }
  };

  const handleGoBack = () => {
    if (selectedFolderId !== null) {
      setSelectedFolderId(null);
      setCurrentPath('هذا الكمبيوتر الشخصي');
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFile(newFolderName.trim(), 'folder', selectedFolderId);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleCreateDoc = () => {
    if (!newFileName.trim()) return;
    const name = newFileName.endsWith('.txt') ? newFileName : `${newFileName}.txt`;
    createFile(name, 'txt', selectedFolderId, newFileContent);
    setNewFileName('');
    setNewFileContent('');
    setIsCreatingFile(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#191919' : '#FFFFFF' }]}>
      {/* Top Win11 Tab Bar */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: isDark ? '#202020' : '#EAEAEA',
            borderBottomColor: isDark ? '#333' : '#DDD',
          },
        ]}
      >
        <View
          style={[
            styles.tab,
            {
              backgroundColor: isDark ? '#191919' : '#FFFFFF',
              borderTopColor: settings.accentColor,
            },
          ]}
        >
          <Ionicons name="folder" size={14} color="#FFCA28" />
          <Text style={[styles.tabText, { color: isDark ? '#FFF' : '#111' }]} numberOfLines={1}>
            {selectedFolderId ? currentPath.split('>').pop()?.trim() : 'هذا الكمبيوتر'}
          </Text>
        </View>
        <TouchableOpacity style={styles.addTabBtn}>
          <Ionicons name="add" size={16} color={isDark ? '#AAA' : '#666'} />
        </TouchableOpacity>
      </View>

      {/* Action / Toolbar */}
      <View
        style={[
          styles.toolbar,
          {
            backgroundColor: isDark ? '#202020' : '#F7F7F7',
            borderBottomColor: isDark ? '#333' : '#E5E5E5',
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          disabled={selectedFolderId === null}
          style={[styles.toolBtn, selectedFolderId === null && { opacity: 0.3 }]}
        >
          <Ionicons name="arrow-back" size={16} color={isDark ? '#FFF' : '#333'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolBtnWithText}
          onPress={() => setIsCreatingFolder(true)}
        >
          <Ionicons name="folder-outline" size={16} color="#FFCA28" />
          <Text style={[styles.toolBtnText, { color: isDark ? '#FFF' : '#222' }]}>مجلد جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolBtnWithText}
          onPress={() => setIsCreatingFile(true)}
        >
          <Ionicons name="document-text-outline" size={16} color="#0078D4" />
          <Text style={[styles.toolBtnText, { color: isDark ? '#FFF' : '#222' }]}>مستند جديد</Text>
        </TouchableOpacity>
      </View>

      {/* Breadcrumb address bar */}
      <View
        style={[
          styles.addressBar,
          {
            backgroundColor: isDark ? '#272727' : '#F0F0F0',
            borderColor: isDark ? '#3D3D3D' : '#DDD',
          },
        ]}
      >
        <Ionicons name="desktop-outline" size={15} color={settings.accentColor} />
        <Text style={[styles.pathText, { color: isDark ? '#DDD' : '#333' }]} numberOfLines={1}>
          {currentPath}
        </Text>
      </View>

      {/* Main Layout: Sidebar & Content Area */}
      <View style={styles.mainLayout}>
        {/* Quick sidebar */}
        <View
          style={[
            styles.sidebar,
            {
              backgroundColor: isDark ? '#1C1C1C' : '#F5F5F5',
              borderRightColor: isDark ? '#2C2C2C' : '#E0E0E0',
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.sideItem, selectedFolderId === null && styles.sideActive]}
            onPress={() => {
              setSelectedFolderId(null);
              setCurrentPath('هذا الكمبيوتر الشخصي');
            }}
          >
            <Ionicons name="laptop-outline" size={16} color={settings.accentColor} />
            <Text style={[styles.sideText, { color: isDark ? '#FFF' : '#111' }]}>
              {t('thisPC')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideItem}
            onPress={() => {
              setSelectedFolderId(null);
              setCurrentPath('هذا الكمبيوتر الشخصي > التنزيلات');
            }}
          >
            <Ionicons name="download-outline" size={16} color="#0078D4" />
            <Text style={[styles.sideText, { color: isDark ? '#BBB' : '#444' }]}>
              {t('downloads')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideItem}
            onPress={() => {
              setSelectedFolderId(null);
              setCurrentPath('هذا الكمبيوتر الشخصي > المستندات');
            }}
          >
            <Ionicons name="document-outline" size={16} color="#107C41" />
            <Text style={[styles.sideText, { color: isDark ? '#BBB' : '#444' }]}>
              {t('documents')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideItem}
            onPress={() => {
              setSelectedFolderId(null);
              setCurrentPath('هذا الكمبيوتر الشخصي > الصور');
            }}
          >
            <Ionicons name="image-outline" size={16} color="#D83B01" />
            <Text style={[styles.sideText, { color: isDark ? '#BBB' : '#444' }]}>
              {t('pictures')}
            </Text>
          </TouchableOpacity>

          <View style={[styles.sideDivider, { backgroundColor: isDark ? '#333' : '#DDD' }]} />

          {/* Drive C info */}
          <View style={styles.driveCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="hardware-chip-outline" size={15} color="#FFCA28" />
              <Text style={[styles.driveTitle, { color: isDark ? '#FFF' : '#222' }]}>
                {t('localDiskC')}
              </Text>
            </View>
            <View style={[styles.driveBar, { backgroundColor: isDark ? '#333' : '#DDD' }]}>
              <View style={[styles.driveBarFill, { width: '45%', backgroundColor: settings.accentColor }]} />
            </View>
            <Text style={[styles.driveSub, { color: isDark ? '#888' : '#777' }]}>
              {t('freeSpace')}
            </Text>
          </View>
        </View>

        {/* Files Grid / List */}
        <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false}>
          {currentFiles.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="folder-open-outline" size={40} color={isDark ? '#444' : '#BBB'} />
              <Text style={[styles.emptyText, { color: isDark ? '#888' : '#777' }]}>
                هذا المجلد فارغ حالياً
              </Text>
            </View>
          ) : (
            currentFiles.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.fileRow,
                  { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                ]}
                onPress={() => handleOpenItem(item)}
              >
                <Ionicons
                  name={item.type === 'folder' ? 'folder' : 'document-text'}
                  size={24}
                  color={item.type === 'folder' ? '#FFCA28' : '#0078D4'}
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fileName, { color: isDark ? '#FFF' : '#111' }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.fileSub, { color: isDark ? '#888' : '#777' }]}>
                    {item.date} • {item.size}
                  </Text>
                </View>

                {/* Delete button */}
                <TouchableOpacity
                  onPress={() => deleteFile(item.id)}
                  style={styles.delBtn}
                >
                  <Ionicons name="trash-outline" size={16} color="#E05353" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Modal: View File Content */}
      {selectedFile && (
        <Modal transparent animationType="fade" visible={!!selectedFile}>
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: isDark ? '#222' : '#FFF',
                  borderColor: isDark ? '#444' : '#DDD',
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>
                  {selectedFile.name}
                </Text>
                <TouchableOpacity onPress={() => setSelectedFile(null)}>
                  <Ionicons name="close" size={20} color={isDark ? '#FFF' : '#111'} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <Text style={[styles.fileBodyText, { color: isDark ? '#DDD' : '#333' }]}>
                  {selectedFile.content || 'لا يوجد محتوى في هذا الملف.'}
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal: Create Folder */}
      {isCreatingFolder && (
        <Modal transparent animationType="fade" visible={isCreatingFolder}>
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCardSmall,
                {
                  backgroundColor: isDark ? '#252525' : '#FFF',
                  borderColor: isDark ? '#444' : '#DDD',
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>
                إنشاء مجلد جديد
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: isDark ? '#333' : '#F5F5F5',
                    color: isDark ? '#FFF' : '#111',
                  },
                ]}
                placeholder="اسم المجلد..."
                placeholderTextColor="#888"
                value={newFolderName}
                onChangeText={setNewFolderName}
                autoFocus
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.btnCancel, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]}
                  onPress={() => setIsCreatingFolder(false)}
                >
                  <Text style={{ color: isDark ? '#FFF' : '#111' }}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnOk, { backgroundColor: settings.accentColor }]}
                  onPress={handleCreateFolder}
                >
                  <Text style={{ color: '#FFF', fontWeight: '600' }}>{t('save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal: Create File */}
      {isCreatingFile && (
        <Modal transparent animationType="fade" visible={isCreatingFile}>
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: isDark ? '#252525' : '#FFF',
                  borderColor: isDark ? '#444' : '#DDD',
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>
                إنشاء مستند نصي جديد
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: isDark ? '#333' : '#F5F5F5',
                    color: isDark ? '#FFF' : '#111',
                    marginBottom: 10,
                  },
                ]}
                placeholder="اسم المستند (مثال: ملاحظات)"
                placeholderTextColor="#888"
                value={newFileName}
                onChangeText={setNewFileName}
              />
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: isDark ? '#333' : '#F5F5F5',
                    color: isDark ? '#FFF' : '#111',
                    height: 120,
                    textAlignVertical: 'top',
                  },
                ]}
                multiline
                placeholder="محتوى المستند..."
                placeholderTextColor="#888"
                value={newFileContent}
                onChangeText={setNewFileContent}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.btnCancel, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]}
                  onPress={() => setIsCreatingFile(false)}
                >
                  <Text style={{ color: isDark ? '#FFF' : '#111' }}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnOk, { backgroundColor: settings.accentColor }]}
                  onPress={handleCreateDoc}
                >
                  <Text style={{ color: '#FFF', fontWeight: '600' }}>{t('save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    paddingHorizontal: 12,
    height: 30,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderTopWidth: 2,
    gap: 6,
    maxWidth: 160,
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  addTabBtn: {
    padding: 6,
    marginLeft: 4,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    gap: 8,
  },
  toolBtn: {
    padding: 6,
    borderRadius: 4,
  },
  toolBtnWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 6,
  },
  toolBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 6,
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    gap: 8,
  },
  pathText: {
    fontSize: 11.5,
    flex: 1,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 125,
    borderRightWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  sideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 6,
    gap: 6,
    marginBottom: 2,
  },
  sideActive: {
    backgroundColor: 'rgba(0, 120, 212, 0.15)',
  },
  sideText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  sideDivider: {
    height: 1,
    marginVertical: 8,
  },
  driveCard: {
    padding: 4,
    gap: 4,
  },
  driveTitle: {
    fontSize: 10,
    fontWeight: '600',
  },
  driveBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
  },
  driveBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  driveSub: {
    fontSize: 8.5,
  },
  contentList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 13,
    marginTop: 8,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
  },
  fileName: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  fileSub: {
    fontSize: 10,
    marginTop: 2,
  },
  delBtn: {
    padding: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '92%',
    maxHeight: '80%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
  },
  modalCardSmall: {
    width: '88%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalBody: {
    maxHeight: 260,
  },
  fileBodyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  modalInput: {
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 12.5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 14,
  },
  btnCancel: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  btnOk: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 6,
  },
});
