import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';
import { soundManager } from '../utils/sound';

export const CalculatorApp: React.FC = () => {
  const { settings } = useSystem();
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const isDark = settings.theme === 'dark';

  const handleDigit = (digit: string) => {
    if (settings.soundEnabled) soundManager.playClick();
    if (waitingForNext) {
      setDisplay(digit);
      setWaitingForNext(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (settings.soundEnabled) soundManager.playClick();
    if (waitingForNext) {
      setDisplay('0.');
      setWaitingForNext(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOp = (op: string) => {
    if (settings.soundEnabled) soundManager.playClick();
    const current = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(current);
      setEquation(`${display} ${op}`);
    } else if (operation) {
      const result = calculate(prevValue, current, operation);
      setDisplay(String(result));
      setPrevValue(result);
      setEquation(`${result} ${op}`);
    }

    setOperation(op);
    setWaitingForNext(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  const handleEqual = () => {
    if (settings.soundEnabled) soundManager.playClick();
    if (prevValue === null || operation === null) return;
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operation);
    const log = `${equation} ${display} = ${result}`;
    setHistory((prev) => [log, ...prev]);
    setDisplay(String(result));
    setEquation('');
    setPrevValue(null);
    setOperation(null);
    setWaitingForNext(true);
  };

  const handleClear = () => {
    if (settings.soundEnabled) soundManager.playClick();
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperation(null);
    setWaitingForNext(false);
  };

  const handleBackspace = () => {
    if (settings.soundEnabled) soundManager.playClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleSpecial = (type: string) => {
    if (settings.soundEnabled) soundManager.playClick();
    const current = parseFloat(display);
    let result = 0;
    if (type === 'sqr') result = current * current;
    if (type === 'sqrt') result = Math.sqrt(current);
    if (type === 'inv') result = current !== 0 ? 1 / current : 0;
    if (type === 'neg') result = -current;
    if (type === 'pct') result = current / 100;

    setDisplay(String(result));
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#202020' : '#F3F3F3' }]}>
      {/* Top Bar with Mode & History Toggle */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="calculator-outline" size={16} color={settings.accentColor} />
          <Text style={[styles.modeTitle, { color: isDark ? '#FFF' : '#111' }]}>
            الحاسبة القياسية
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowHistory((v) => !v)} style={styles.historyBtn}>
          <Ionicons name="time-outline" size={18} color={isDark ? '#DDD' : '#444'} />
        </TouchableOpacity>
      </View>

      {/* Calculator Display */}
      <View style={styles.displayArea}>
        <Text style={[styles.equationText, { color: isDark ? '#888' : '#666' }]}>
          {equation || ' '}
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.displayText, { color: isDark ? '#FFF' : '#111' }]}
        >
          {display}
        </Text>
      </View>

      {/* History Slide Panel if open */}
      {showHistory ? (
        <View
          style={[
            styles.historyPanel,
            { backgroundColor: isDark ? '#272727' : '#EAEAEA' },
          ]}
        >
          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, { color: isDark ? '#FFF' : '#111' }]}>
              سجل العمليات
            </Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={() => setHistory([])}>
                <Ionicons name="trash-outline" size={16} color="#E05353" />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={{ flex: 1 }}>
            {history.length === 0 ? (
              <Text style={[styles.noHistoryText, { color: isDark ? '#777' : '#999' }]}>
                لا يوجد سجل بعد
              </Text>
            ) : (
              history.map((item, idx) => (
                <View key={idx} style={styles.historyRow}>
                  <Text style={[styles.historyItemText, { color: isDark ? '#EEE' : '#222' }]}>
                    {item}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      ) : (
        /* Keypad Grid (6 rows x 4 columns) */
        <View style={styles.keypad}>
          {/* Row 1 */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.funcBtn]} onPress={() => handleSpecial('pct')}>
              <Text style={[styles.btnText, { color: isDark ? '#DDD' : '#333' }]}>%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.funcBtn]} onPress={handleClear}>
              <Text style={[styles.btnText, { color: isDark ? '#DDD' : '#333' }]}>CE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.funcBtn]} onPress={handleClear}>
              <Text style={[styles.btnText, { color: isDark ? '#DDD' : '#333' }]}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.funcBtn]} onPress={handleBackspace}>
              <Ionicons name="backspace-outline" size={17} color={isDark ? '#DDD' : '#333'} />
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.funcBtn]} onPress={() => handleSpecial('inv')}>
              <Text style={[styles.btnText, { color: isDark ? '#DDD' : '#333' }]}>1/x</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.funcBtn]} onPress={() => handleSpecial('sqr')}>
              <Text style={[styles.btnText, { color: isDark ? '#DDD' : '#333' }]}>x²</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.funcBtn]} onPress={() => handleSpecial('sqrt')}>
              <Text style={[styles.btnText, { color: isDark ? '#DDD' : '#333' }]}>√x</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.opBtn]} onPress={() => handleOp('÷')}>
              <Text style={[styles.btnText, { color: isDark ? '#FFF' : '#111' }]}>÷</Text>
            </TouchableOpacity>
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('7')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('8')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('9')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.opBtn]} onPress={() => handleOp('×')}>
              <Text style={[styles.btnText, { color: isDark ? '#FFF' : '#111' }]}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Row 4 */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('4')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('5')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('6')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.opBtn]} onPress={() => handleOp('-')}>
              <Text style={[styles.btnText, { color: isDark ? '#FFF' : '#111' }]}>-</Text>
            </TouchableOpacity>
          </View>

          {/* Row 5 */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('1')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('2')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('3')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.opBtn]} onPress={() => handleOp('+')}>
              <Text style={[styles.btnText, { color: isDark ? '#FFF' : '#111' }]}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Row 6 */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.funcBtn]} onPress={() => handleSpecial('neg')}>
              <Text style={[styles.btnText, { color: isDark ? '#DDD' : '#333' }]}>+/-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={() => handleDigit('0')}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.numBtn]} onPress={handleDecimal}>
              <Text style={[styles.numText, { color: isDark ? '#FFF' : '#111' }]}>.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: settings.accentColor }]}
              onPress={handleEqual}
            >
              <Text style={[styles.btnText, { color: '#FFF', fontWeight: '700' }]}>=</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modeTitle: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  historyBtn: {
    padding: 4,
  },
  displayArea: {
    height: 70,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  equationText: {
    fontSize: 11.5,
    marginBottom: 2,
  },
  displayText: {
    fontSize: 34,
    fontWeight: '700',
  },
  keypad: {
    flex: 1,
    gap: 4,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  btn: {
    flex: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  funcBtn: {
    backgroundColor: 'rgba(150, 150, 150, 0.12)',
  },
  numBtn: {
    backgroundColor: 'rgba(150, 150, 150, 0.18)',
  },
  opBtn: {
    backgroundColor: 'rgba(150, 150, 150, 0.14)',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '500',
  },
  numText: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyPanel: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  noHistoryText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  historyRow: {
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  historyItemText: {
    fontSize: 12.5,
  },
});
