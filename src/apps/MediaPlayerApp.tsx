import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
}

const TRACKS: Track[] = [
  { id: '1', title: 'Windows 11 Bloom Symphony', artist: 'Fluent Soundscape', duration: '3:24', genre: 'Ambient' },
  { id: '2', title: 'Mica Glass Reflections', artist: 'Aero Beats', duration: '2:50', genre: 'Chillwave' },
  { id: '3', title: 'Subtle Indigo Sunset', artist: 'Synth Horizon', duration: '4:12', genre: 'Lo-Fi' },
  { id: '4', title: 'PowerShell Midnight Pulse', artist: 'Terminal Cyber', duration: '3:45', genre: 'Electronic' },
];

export const MediaPlayerApp: React.FC = () => {
  const { settings } = useSystem();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.35);

  const isDark = settings.theme === 'dark';
  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((p) => (p >= 1 ? 0 : p + 0.01));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((i) => (i + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1C' : '#F9F9F9' }]}>
      {/* Now Playing Hero */}
      <View style={styles.heroSection}>
        <View style={[styles.albumArt, { backgroundColor: settings.accentColor }]}>
          <Ionicons name="musical-notes" size={48} color="#FFF" />
          {/* Animated visualizer bars */}
          {isPlaying && (
            <View style={styles.visualizerRow}>
              <View style={[styles.bar, { height: 18 }]} />
              <View style={[styles.bar, { height: 26 }]} />
              <View style={[styles.bar, { height: 14 }]} />
              <View style={[styles.bar, { height: 22 }]} />
              <View style={[styles.bar, { height: 16 }]} />
            </View>
          )}
        </View>

        <Text numberOfLines={1} style={[styles.trackTitle, { color: isDark ? '#FFF' : '#111' }]}>
          {track.title}
        </Text>
        <Text style={[styles.trackArtist, { color: isDark ? '#AAA' : '#666' }]}>
          {track.artist} • {track.genre}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.trackBar, { backgroundColor: isDark ? '#333' : '#DDD' }]}>
            <View
              style={[
                styles.trackFill,
                { width: `${progress * 100}%`, backgroundColor: settings.accentColor },
              ]}
            />
          </View>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: isDark ? '#888' : '#777' }]}>
              {Math.floor(progress * 200 / 60)}:
              {String(Math.floor((progress * 200) % 60)).padStart(2, '0')}
            </Text>
            <Text style={[styles.timeText, { color: isDark ? '#888' : '#777' }]}>
              {track.duration}
            </Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={handlePrev} style={styles.ctrlBtn}>
            <Ionicons name="play-skip-back" size={20} color={isDark ? '#FFF' : '#222'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsPlaying((p) => !p)}
            style={[styles.mainPlayBtn, { backgroundColor: settings.accentColor }]}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.ctrlBtn}>
            <Ionicons name="play-skip-forward" size={20} color={isDark ? '#FFF' : '#222'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Playlist Section */}
      <View style={styles.playlistSection}>
        <Text style={[styles.playlistHeader, { color: isDark ? '#FFF' : '#111' }]}>
          قائمة التشغيل (Windows Media)
        </Text>
        <ScrollView style={{ flex: 1 }}>
          {TRACKS.map((t, idx) => {
            const isCurrent = idx === currentTrackIndex;
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.playlistRow,
                  isCurrent && { backgroundColor: 'rgba(0, 120, 212, 0.12)' },
                ]}
                onPress={() => {
                  setCurrentTrackIndex(idx);
                  setProgress(0);
                  setIsPlaying(true);
                }}
              >
                <Ionicons
                  name={isCurrent && isPlaying ? 'volume-high' : 'musical-note'}
                  size={16}
                  color={isCurrent ? settings.accentColor : isDark ? '#888' : '#777'}
                />
                <View style={{ flex: 1, marginHorizontal: 8 }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.rowTitle,
                      { color: isCurrent ? settings.accentColor : isDark ? '#FFF' : '#111' },
                    ]}
                  >
                    {t.title}
                  </Text>
                  <Text style={[styles.rowArtist, { color: isDark ? '#888' : '#777' }]}>
                    {t.artist}
                  </Text>
                </View>
                <Text style={[styles.rowDuration, { color: isDark ? '#888' : '#777' }]}>
                  {t.duration}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  albumArt: {
    width: 100,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  visualizerRow: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  bar: {
    width: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 2,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  trackArtist: {
    fontSize: 11,
    marginTop: 2,
  },
  progressContainer: {
    width: '100%',
    marginVertical: 12,
  },
  trackBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 9.5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  ctrlBtn: {
    padding: 8,
  },
  mainPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistSection: {
    flex: 1,
    padding: 12,
  },
  playlistHeader: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 8,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 2,
  },
  rowTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  rowArtist: {
    fontSize: 10,
    marginTop: 1,
  },
  rowDuration: {
    fontSize: 10.5,
  },
});
