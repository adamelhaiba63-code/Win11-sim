import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSystem } from '../context/SystemContext';
import { Desktop } from '../components/Desktop/Desktop';
import { Taskbar } from '../components/Taskbar/Taskbar';
import { StartMenu } from '../components/StartMenu/StartMenu';
import { ActionCenter } from '../components/ActionCenter/ActionCenter';
import { WidgetsBoard } from '../components/Widgets/WidgetsBoard';
import { SearchOverlay } from '../components/Search/SearchOverlay';
import { WindowContainer } from '../components/WindowManager/WindowContainer';
import { LockScreen } from '../components/LockScreen/LockScreen';
import { RebootScreen, ShutdownScreen } from '../components/PowerScreens/PowerScreens';

// Apps
import { FileExplorerApp } from '../apps/FileExplorerApp';
import { SettingsApp } from '../apps/SettingsApp';
import { EdgeApp } from '../apps/EdgeApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { NotepadApp } from '../apps/NotepadApp';
import { TerminalApp } from '../apps/TerminalApp';
import { GamesApp } from '../apps/GamesApp';
import { PhotosApp } from '../apps/PhotosApp';
import { MediaPlayerApp } from '../apps/MediaPlayerApp';
import { StoreApp } from '../apps/StoreApp';
import { StickyNotesApp } from '../apps/StickyNotesApp';

export const HomeScreen: React.FC = () => {
  const { windows, powerState } = useSystem();

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'explorer':
      case 'recyclebin':
        return <FileExplorerApp />;
      case 'settings':
        return <SettingsApp />;
      case 'edge':
        return <EdgeApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'notepad':
        return <NotepadApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'games':
        return <GamesApp />;
      case 'photos':
      case 'camera':
        return <PhotosApp />;
      case 'mediaplayer':
        return <MediaPlayerApp />;
      case 'store':
        return <StoreApp />;
      case 'stickynotes':
        return <StickyNotesApp />;
      default:
        return <FileExplorerApp />;
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Desktop surface */}
      <Desktop />

      {/* 2. Open Windows */}
      {windows.map((win) => (
        <WindowContainer key={win.id} window={win}>
          {renderAppContent(win.appId)}
        </WindowContainer>
      ))}

      {/* 3. Flyout Panels */}
      <StartMenu />
      <SearchOverlay />
      <WidgetsBoard />
      <ActionCenter />

      {/* 4. Bottom Taskbar */}
      <Taskbar />

      {/* 5. Power Screens */}
      {powerState === 'locked' && <LockScreen />}
      {powerState === 'restarting' && <RebootScreen />}
      {powerState === 'shutdown' && <ShutdownScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
