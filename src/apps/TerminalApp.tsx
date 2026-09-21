import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';

interface TerminalLine {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'success' | 'matrix';
  text: string;
}

const WELCOME_BANNER: TerminalLine[] = [
  {
    id: 'b1',
    type: 'output',
    text: 'Windows PowerShell\nCopyright (C) Microsoft Corporation. All rights reserved.',
  },
  {
    id: 'b2',
    type: 'output',
    text: 'Install the latest PowerShell for new features: https://microsoft.com/powershell',
  },
  {
    id: 'b3',
    type: 'success',
    text: 'Type "help" to see available commands.',
  },
];

export const TerminalApp: React.FC = () => {
  const { files, settings } = useSystem();
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_BANNER);
  const [inputVal, setInputVal] = useState('');
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleCommandSubmit = () => {
    const raw = inputVal.trim();
    if (!raw) return;

    const cmdEntry: TerminalLine = {
      id: `cmd-${Date.now()}`,
      type: 'cmd',
      text: `PS C:\\Users\\Administrator> ${raw}`,
    };

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let responses: TerminalLine[] = [];

    switch (cmd) {
      case 'help':
        responses.push({
          id: `res-${Date.now()}-1`,
          type: 'output',
          text: `Available Windows Commands:
  help        - Show this list of commands
  ver         - Display Windows version
  systeminfo  - Display detailed system and device information
  dir / ls    - List files and directories
  date / time - Show current system date and time
  ping <host> - Ping a network host
  neofetch    - Show Windows ASCII logo and specs
  matrix      - Activate Matrix cyberpunk visual code
  cls / clear - Clear the terminal screen
  echo <text> - Print text to console`,
        });
        break;

      case 'ver':
        responses.push({
          id: `res-${Date.now()}`,
          type: 'output',
          text: 'Microsoft Windows [Version 10.0.26100.1742] Windows 11 Mobile Pro 24H2',
        });
        break;

      case 'systeminfo':
        responses.push({
          id: `res-${Date.now()}`,
          type: 'output',
          text: `Host Name:                 WIN11-MOBILE
OS Name:                   Microsoft Windows 11 Pro Mobile
OS Version:                10.0.26100 Build 26100
System Manufacturer:       Microsoft Corporation
System Type:               ARM64-based Phone / Mobile
Processor:                 Snapdragon 8 Gen 3 @ 3.30GHz
Total Physical Memory:     16,384 MB (16 GB)
Available Physical Memory: 9,210 MB
Storage (C:):              256 GB NVMe SSD (142 GB Free)
Battery Status:            94% (Charging, AC Connected)
Theme:                     ${settings.theme.toUpperCase()} MODE
Accent Color:              ${settings.accentColor}`,
        });
        break;

      case 'dir':
      case 'ls':
        const fileList = files
          .map((f) => `  ${f.date}   ${f.type === 'folder' ? '<DIR>' : '     '}   ${f.size.padEnd(8)} ${f.name}`)
          .join('\n');
        responses.push({
          id: `res-${Date.now()}`,
          type: 'output',
          text: ` Directory of C:\\Users\\Administrator\n\n${fileList}\n               ${files.length} File(s) / Dir(s)`,
        });
        break;

      case 'date':
      case 'time':
        responses.push({
          id: `res-${Date.now()}`,
          type: 'output',
          text: `Current Date/Time: ${new Date().toLocaleString()}`,
        });
        break;

      case 'ping':
        const host = arg || '8.8.8.8';
        responses.push({
          id: `res-${Date.now()}`,
          type: 'output',
          text: `Pinging ${host} with 32 bytes of data:
Reply from ${host}: bytes=32 time=14ms TTL=117
Reply from ${host}: bytes=32 time=12ms TTL=117
Reply from ${host}: bytes=32 time=15ms TTL=117
Reply from ${host}: bytes=32 time=13ms TTL=117

Ping statistics for ${host}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 12ms, Maximum = 15ms, Average = 13ms`,
        });
        break;

      case 'neofetch':
        responses.push({
          id: `res-${Date.now()}`,
          type: 'matrix',
          text: `
   ##########   ##########     Administrator@WIN11-MOBILE
   ##########   ##########     -------------------------
   ##########   ##########     OS: Windows 11 Mobile Pro 24H2
   ##########   ##########     Host: Smartphone ARM64
                               Kernel: NT 10.0.26100
   ##########   ##########     Uptime: 4 days, 11 hours
   ##########   ##########     Shell: PowerShell 7.4.2
   ##########   ##########     Resolution: FHD+ (2400x1080)
   ##########   ##########     CPU: Snapdragon 8 Gen 3 (8) @ 3.3GHz
                               Memory: 7174MB / 16384MB
`,
        });
        break;

      case 'matrix':
        setIsMatrixActive(true);
        responses.push({
          id: `res-${Date.now()}`,
          type: 'matrix',
          text: `
01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100
01010111 01101001 01101110 01100100 01101111 01110111 01110011 00100000 00110001 00110001
>>> MATRIX STREAM INITIATED. CYBERNETIC SUB-ROUTINE ONLINE <<<
λ_00: 0x89F1 0x02AA 0xFF31 0xC001 ... ACCESS GRANTED
`,
        });
        break;

      case 'cls':
      case 'clear':
        setLines([]);
        setInputVal('');
        return;

      case 'echo':
        responses.push({
          id: `res-${Date.now()}`,
          type: 'output',
          text: arg || '',
        });
        break;

      default:
        responses.push({
          id: `res-${Date.now()}`,
          type: 'error',
          text: `'${cmd}' is not recognized as an internal or external command. Type "help" for a list of commands.`,
        });
    }

    setLines((prev) => [...prev, cmdEntry, ...responses]);
    setInputVal('');
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  return (
    <View style={styles.container}>
      {/* Terminal Tab */}
      <View style={styles.tabBar}>
        <View style={styles.tab}>
          <Ionicons name="terminal-outline" size={13} color="#0078D4" />
          <Text style={styles.tabText}>PowerShell</Text>
        </View>
        <TouchableOpacity style={styles.addTabBtn}>
          <Ionicons name="add" size={14} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Terminal Console Output */}
      <ScrollView
        ref={scrollRef}
        style={styles.terminalBody}
        contentContainerStyle={styles.terminalContent}
      >
        {lines.map((l) => {
          let textColor = '#CCCCCC';
          if (l.type === 'cmd') textColor = '#FFFFFF';
          if (l.type === 'error') textColor = '#FF6B6B';
          if (l.type === 'success') textColor = '#66BB6A';
          if (l.type === 'matrix') textColor = '#00FF66';

          return (
            <Text key={l.id} style={[styles.termText, { color: textColor }]}>
              {l.text}
            </Text>
          );
        })}

        {/* Input prompt row */}
        <View style={styles.promptRow}>
          <Text style={styles.promptPrefix}>PS C:\Users\Administrator&gt; </Text>
          <TextInput
            style={styles.termInput}
            value={inputVal}
            onChangeText={setInputVal}
            onSubmitEditing={handleCommandSubmit}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  tabBar: {
    height: 32,
    backgroundColor: '#1F1F1F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2B2B2B',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
    paddingHorizontal: 10,
    height: 28,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    gap: 6,
  },
  tabText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '500',
  },
  addTabBtn: {
    padding: 6,
    marginLeft: 4,
  },
  terminalBody: {
    flex: 1,
    padding: 10,
  },
  terminalContent: {
    paddingBottom: 20,
  },
  termText: {
    fontSize: 11.5,
    fontFamily: 'monospace',
    lineHeight: 18,
    marginBottom: 4,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  promptPrefix: {
    fontSize: 11.5,
    fontFamily: 'monospace',
    color: '#00ADEF',
  },
  termInput: {
    flex: 1,
    fontSize: 11.5,
    fontFamily: 'monospace',
    color: '#FFF',
    padding: 0,
    margin: 0,
  },
});
