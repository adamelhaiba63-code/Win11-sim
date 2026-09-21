export type AppId =
  | 'explorer'
  | 'settings'
  | 'edge'
  | 'calculator'
  | 'notepad'
  | 'terminal'
  | 'games'
  | 'photos'
  | 'mediaplayer'
  | 'store'
  | 'stickynotes'
  | 'camera'
  | 'recyclebin';

export interface AppDefinition {
  id: AppId;
  name: string;
  nameAr: string;
  icon: string;
  iconType: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';
  iconColor: string;
  bgColor?: string;
  pinnedToTaskbar?: boolean;
  desktopShortcut?: boolean;
  category: 'system' | 'productivity' | 'entertainment' | 'utilities';
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  titleAr: string;
  icon: string;
  iconType: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type ThemeMode = 'dark' | 'light';
export type TaskbarAlignment = 'center' | 'left';
export type Language = 'ar' | 'en';

export interface WallpaperItem {
  id: string;
  name: string;
  nameAr: string;
  type: 'gradient' | 'abstract' | 'landscape';
  colors: string[];
  thumbnail: string;
  textColor: 'light' | 'dark';
}

export interface StickyNoteItem {
  id: string;
  title: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  createdAt: number;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'txt' | 'img' | 'pdf' | 'doc';
  size: string;
  date: string;
  content?: string;
  parentId: string | null;
  isSystem?: boolean;
}

export interface SystemSettings {
  theme: ThemeMode;
  accentColor: string;
  wallpaperId: string;
  taskbarAlignment: TaskbarAlignment;
  language: Language;
  soundEnabled: boolean;
  transparency: boolean;
  screenBrightness: number; // 0 to 1
  systemVolume: number; // 0 to 1
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  airplaneMode: boolean;
  nightLight: boolean;
  batterySaver: boolean;
  iconSize: 'small' | 'medium' | 'large';
}
