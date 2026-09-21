import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppId,
  WindowState,
  SystemSettings,
  StickyNoteItem,
  FileItem,
  AppDefinition,
  Language,
} from '../types';
import { SYSTEM_APPS } from '../constants/apps';
import { translations } from '../constants/translations';
import { soundManager } from '../utils/sound';

interface SystemContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  t: (key: keyof typeof translations['ar']) => string;
  lang: Language;

  // Windows
  windows: WindowState[];
  activeWindowId: string | null;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, pos: { x: number; y: number }) => void;
  minimizeAll: () => void;

  // Menus
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;

  isWidgetsOpen: boolean;
  toggleWidgets: () => void;
  closeWidgets: () => void;

  isActionCenterOpen: boolean;
  toggleActionCenter: () => void;
  closeActionCenter: () => void;

  isSearchOpen: boolean;
  toggleSearch: () => void;
  closeSearch: () => void;

  // System Power / Lock
  powerState: 'running' | 'locked' | 'restarting' | 'shutdown';
  lockScreen: () => void;
  unlockScreen: () => void;
  restartSystem: () => void;
  shutdownSystem: () => void;
  powerOnSystem: () => void;

  // Sticky Notes
  stickyNotes: StickyNoteItem[];
  addStickyNote: () => void;
  updateStickyNote: (id: string, text: string, title?: string, color?: string) => void;
  deleteStickyNote: (id: string) => void;

  // Files
  files: FileItem[];
  createFile: (name: string, type: 'folder' | 'txt', parentId: string | null, content?: string) => void;
  deleteFile: (id: string) => void;
  emptyRecycleBin: () => void;

  // Apps
  apps: AppDefinition[];
  installStoreApp: (app: AppDefinition) => void;

  // Selection & Context Menu
  contextMenu: { visible: boolean; x: number; y: number } | null;
  openContextMenu: (x: number, y: number) => void;
  closeContextMenu: () => void;

  // Toast / Notifications
  notification: { title: string; message: string } | null;
  showNotification: (title: string, message: string) => void;
}

const defaultSettings: SystemSettings = {
  theme: 'dark',
  accentColor: '#0078D4',
  wallpaperId: 'bloom-dark',
  taskbarAlignment: 'center',
  language: 'ar',
  soundEnabled: true,
  transparency: true,
  screenBrightness: 1,
  systemVolume: 0.8,
  wifiEnabled: true,
  bluetoothEnabled: true,
  airplaneMode: false,
  nightLight: false,
  batterySaver: false,
  iconSize: 'medium',
};

const initialFiles: FileItem[] = [
  {
    id: 'f1',
    name: 'مرحبا_بك_في_ويندوز_11.txt',
    type: 'txt',
    size: '2 KB',
    date: '2026-09-21',
    content:
      'مرحباً بك في نظام Windows 11 للهاتف!\n\nتم تطوير هذه التجربة لتقديم شكل ووظائف نظام ويندوز 11 المتطورة على الهاتف الذكي:\n- قائمة ابدأ الحديثة بتصميم Mica الزجاجي.\n- شريط المهام في المنتصف مع مركز الصيانة والإجراءات.\n- مستكشف ملفات متكامل مع تصفح الأقراص.\n- متصفح Edge ومفكرة وحاسبة وموجه أوامر تفاعلي.\n- ألعاب كلاسيكية: كاسحة الألغام و Tic-Tac-Toe.\n- دعم كامل للغة العربية والإنجليزية، وتخصيص المظهر والخلفيات.\n\nنتمنى لك تجربة ممتعة!',
    parentId: null,
  },
  {
    id: 'f2',
    name: 'المستندات المهمة',
    type: 'folder',
    size: '12 MB',
    date: '2026-09-20',
    parentId: null,
  },
  {
    id: 'f3',
    name: 'ملاحظات_المشروع.txt',
    type: 'txt',
    size: '4 KB',
    date: '2026-09-18',
    content: 'خطة إطلاق وتطوير التطبيقات لعام 2026:\n1. تعزيز الأداء الفائق\n2. دعم تأثيرات الشفافية السلسة\n3. تحسين نظام النوافذ المتعددة واللمس السريع.',
    parentId: 'f2',
  },
  {
    id: 'f4',
    name: 'مشاريع_البرمجة',
    type: 'folder',
    size: '48 MB',
    date: '2026-09-15',
    parentId: null,
  },
];

const initialNotes: StickyNoteItem[] = [
  {
    id: 'n1',
    title: 'مهام اليوم',
    content: '• تجربة قائمة ابدأ ونوافذ ويندوز 11\n• تغيير الخلفية إلى شروق الشمس\n• فحص موجه الأوامر PowerShell',
    color: '#FEFF9C',
    position: { x: 20, y: 70 },
    createdAt: Date.now(),
  },
];

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const STORAGE_KEY = 'WIN11_SETTINGS_STORAGE_V1';

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZ, setHighestZ] = useState<number>(10);

  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [powerState, setPowerState] = useState<'running' | 'locked' | 'restarting' | 'shutdown'>('running');
  const [stickyNotes, setStickyNotes] = useState<StickyNoteItem[]>(initialNotes);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [apps, setApps] = useState<AppDefinition[]>(SYSTEM_APPS);

  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number } | null>(null);
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);

  // Load saved settings
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        // use defaults
      }
    })();
  }, []);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const t = (key: keyof typeof translations['ar']): string => {
    const dict = translations[settings.language] || translations.ar;
    return (dict as any)[key] || (translations.ar as any)[key] || key;
  };

  const playClickSound = () => {
    if (settings.soundEnabled) {
      soundManager.playClick();
    }
  };

  // Window Management
  const openApp = (appId: AppId) => {
    playClickSound();
    setIsStartMenuOpen(false);
    setIsWidgetsOpen(false);
    setIsActionCenterOpen(false);
    setIsSearchOpen(false);
    setContextMenu(null);

    // If app is already open, restore/focus it
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id
            ? { ...w, isMinimized: false, zIndex: highestZ + 1 }
            : w
        )
      );
      setHighestZ((z) => z + 1);
      setActiveWindowId(existing.id);
      return;
    }

    const appDef = apps.find((a) => a.id === appId) || SYSTEM_APPS.find((a) => a.id === appId);
    if (!appDef) return;

    const newZ = highestZ + 1;
    setHighestZ(newZ);

    // Dynamic offset so multiple windows cascade nicely
    const count = windows.length;
    const posX = Math.min(20 + (count % 4) * 16, 60);
    const posY = Math.min(60 + (count % 4) * 20, 140);

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: appDef.name,
      titleAr: appDef.nameAr,
      icon: appDef.icon,
      iconType: appDef.iconType,
      isMinimized: false,
      isMaximized: true, // on mobile default maximized provides best usability while allowing restore
      zIndex: newZ,
      position: { x: posX, y: posY },
      size: { width: 340, height: 480 },
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    playClickSound();
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        const nextActive = remaining[remaining.length - 1];
        setActiveWindowId(nextActive.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id: string) => {
    playClickSound();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const maximizeWindow = (id: string) => {
    playClickSound();
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  };

  const bringToFront = (id: string) => {
    playClickSound();
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w))
    );
    setActiveWindowId(id);
  };

  const updateWindowPosition = (id: string, pos: { x: number; y: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position: pos } : w))
    );
  };

  const minimizeAll = () => {
    playClickSound();
    setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })));
    setActiveWindowId(null);
    setIsStartMenuOpen(false);
    setIsWidgetsOpen(false);
    setIsActionCenterOpen(false);
  };

  // Menus toggling
  const toggleStartMenu = () => {
    playClickSound();
    setIsStartMenuOpen((prev) => !prev);
    setIsWidgetsOpen(false);
    setIsActionCenterOpen(false);
    setIsSearchOpen(false);
    setContextMenu(null);
  };

  const closeStartMenu = () => setIsStartMenuOpen(false);

  const toggleWidgets = () => {
    playClickSound();
    setIsWidgetsOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsActionCenterOpen(false);
    setIsSearchOpen(false);
    setContextMenu(null);
  };

  const closeWidgets = () => setIsWidgetsOpen(false);

  const toggleActionCenter = () => {
    playClickSound();
    setIsActionCenterOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsWidgetsOpen(false);
    setIsSearchOpen(false);
    setContextMenu(null);
  };

  const closeActionCenter = () => setIsActionCenterOpen(false);

  const toggleSearch = () => {
    playClickSound();
    setIsSearchOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsWidgetsOpen(false);
    setIsActionCenterOpen(false);
    setContextMenu(null);
  };

  const closeSearch = () => setIsSearchOpen(false);

  // Power actions
  const lockScreen = () => {
    playClickSound();
    setIsStartMenuOpen(false);
    setPowerState('locked');
  };

  const unlockScreen = () => {
    playClickSound();
    setPowerState('running');
  };

  const restartSystem = () => {
    playClickSound();
    setIsStartMenuOpen(false);
    setPowerState('restarting');
    setTimeout(() => {
      setWindows([]);
      setPowerState('running');
      if (settings.soundEnabled) soundManager.playChime();
    }, 2800);
  };

  const shutdownSystem = () => {
    playClickSound();
    setIsStartMenuOpen(false);
    setPowerState('shutdown');
  };

  const powerOnSystem = () => {
    if (settings.soundEnabled) soundManager.playChime();
    setWindows([]);
    setPowerState('running');
  };

  // Sticky Notes
  const addStickyNote = () => {
    playClickSound();
    const colors = ['#FEFF9C', '#7AF9A3', '#7AD1F9', '#FFB7DF', '#D6A4FF'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newNote: StickyNoteItem = {
      id: `note-${Date.now()}`,
      title: 'ملاحظة جديدة',
      content: 'اكتب ملاحظتك هنا...',
      color: randomColor,
      position: { x: 30 + (stickyNotes.length % 3) * 20, y: 100 + (stickyNotes.length % 3) * 30 },
      createdAt: Date.now(),
    };
    setStickyNotes((prev) => [newNote, ...prev]);
  };

  const updateStickyNote = (id: string, text: string, title?: string, color?: string) => {
    setStickyNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              content: text,
              ...(title !== undefined ? { title } : {}),
              ...(color !== undefined ? { color } : {}),
            }
          : n
      )
    );
  };

  const deleteStickyNote = (id: string) => {
    playClickSound();
    setStickyNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // File System
  const createFile = (name: string, type: 'folder' | 'txt', parentId: string | null, content = '') => {
    playClickSound();
    const newF: FileItem = {
      id: `file-${Date.now()}`,
      name,
      type,
      size: type === 'folder' ? '0 KB' : `${Math.max(1, Math.round(content.length / 100))} KB`,
      date: new Date().toISOString().split('T')[0],
      content,
      parentId,
    };
    setFiles((prev) => [newF, ...prev]);
  };

  const deleteFile = (id: string) => {
    playClickSound();
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const emptyRecycleBin = () => {
    playClickSound();
    showNotification('سلة المحذوفات', 'تم تفريغ سلة المحذوفات بنجاح!');
  };

  const installStoreApp = (app: AppDefinition) => {
    playClickSound();
    if (!apps.some((a) => a.id === app.id)) {
      setApps((prev) => [...prev, app]);
      showNotification('متجر Microsoft', `تم تثبيت تطبيق ${app.nameAr} بنجاح!`);
    }
  };

  // Context Menu
  const openContextMenu = (x: number, y: number) => {
    playClickSound();
    setContextMenu({ visible: true, x, y });
    setIsStartMenuOpen(false);
    setIsWidgetsOpen(false);
    setIsActionCenterOpen(false);
  };

  const closeContextMenu = () => setContextMenu(null);

  const showNotification = (title: string, message: string) => {
    setNotification({ title, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.title === title ? null : curr));
    }, 4000);
  };

  return (
    <SystemContext.Provider
      value={{
        settings,
        updateSettings,
        t,
        lang: settings.language,
        windows,
        activeWindowId,
        openApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        bringToFront,
        updateWindowPosition,
        minimizeAll,
        isStartMenuOpen,
        toggleStartMenu,
        closeStartMenu,
        isWidgetsOpen,
        toggleWidgets,
        closeWidgets,
        isActionCenterOpen,
        toggleActionCenter,
        closeActionCenter,
        isSearchOpen,
        toggleSearch,
        closeSearch,
        powerState,
        lockScreen,
        unlockScreen,
        restartSystem,
        shutdownSystem,
        powerOnSystem,
        stickyNotes,
        addStickyNote,
        updateStickyNote,
        deleteStickyNote,
        files,
        createFile,
        deleteFile,
        emptyRecycleBin,
        apps,
        installStoreApp,
        contextMenu,
        openContextMenu,
        closeContextMenu,
        notification,
        showNotification,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
