import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSystem } from '../context/SystemContext';
import { soundManager } from '../utils/sound';

type GameTab = 'minesweeper' | 'tictactoe';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export const GamesApp: React.FC = () => {
  const { settings } = useSystem();
  const [activeTab, setActiveTab] = useState<GameTab>('minesweeper');

  const isDark = settings.theme === 'dark';

  // --- Minesweeper State ---
  const ROWS = 8;
  const COLS = 8;
  const MINES = 10;
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const initMinesweeper = () => {
    let board: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      let row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      board.push(row);
    }

    // Place mines randomly
    let placed = 0;
    while (placed < MINES) {
      let r = Math.floor(Math.random() * ROWS);
      let c = Math.floor(Math.random() * COLS);
      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!board[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              let nr = r + dr;
              let nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) {
                count++;
              }
            }
          }
          board[r][c].neighborMines = count;
        }
      }
    }

    setGrid(board);
    setGameOver(false);
    setGameWon(false);
    setTimer(0);
    setTimerRunning(false);
  };

  useEffect(() => {
    initMinesweeper();
  }, []);

  useEffect(() => {
    let interval: any;
    if (timerRunning && !gameOver && !gameWon) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, gameOver, gameWon]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    if (!timerRunning) setTimerRunning(true);
    if (settings.soundEnabled) soundManager.playClick();

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (newGrid[r][c].isMine) {
      // Game over: reveal all mines
      newGrid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) cell.isRevealed = true;
        })
      );
      setGrid(newGrid);
      setGameOver(true);
      setTimerRunning(false);
      return;
    }

    // Flood fill uncover empty cells
    const floodFill = (rowIdx: number, colIdx: number) => {
      if (
        rowIdx < 0 ||
        rowIdx >= ROWS ||
        colIdx < 0 ||
        colIdx >= COLS ||
        newGrid[rowIdx][colIdx].isRevealed ||
        newGrid[rowIdx][colIdx].isFlagged
      ) {
        return;
      }

      newGrid[rowIdx][colIdx].isRevealed = true;
      if (newGrid[rowIdx][colIdx].neighborMines === 0 && !newGrid[rowIdx][colIdx].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            floodFill(rowIdx + dr, colIdx + dc);
          }
        }
      }
    };

    floodFill(r, c);

    // Check win condition
    let unrevealedSafe = 0;
    newGrid.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.isMine && !cell.isRevealed) unrevealedSafe++;
      });
    });

    if (unrevealedSafe === 0) {
      setGameWon(true);
      setTimerRunning(false);
    }

    setGrid(newGrid);
  };

  const toggleFlag = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].isRevealed) return;
    if (settings.soundEnabled) soundManager.playSnap();
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
  };

  const handleCellPress = (r: number, c: number) => {
    if (flagMode) {
      toggleFlag(r, c);
    } else {
      revealCell(r, c);
    }
  };

  // --- Tic-Tac-Toe State ---
  const [boardTTT, setBoardTTT] = useState<string[]>(Array(9).fill(''));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [tttWinner, setTttWinner] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });

  const checkTTTWinner = (sq: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
        return sq[a];
      }
    }
    if (sq.every((cell) => cell !== '')) return 'Tie';
    return null;
  };

  const handleTTTClick = (index: number) => {
    if (boardTTT[index] || tttWinner || turn !== 'X') return;
    if (settings.soundEnabled) soundManager.playClick();

    const next = [...boardTTT];
    next[index] = 'X';
    setBoardTTT(next);

    const win = checkTTTWinner(next);
    if (win) {
      setTttWinner(win);
      if (win === 'X') setScore((s) => ({ ...s, player: s.player + 1 }));
      return;
    }

    setTurn('O');
    // AI Move
    setTimeout(() => {
      const emptyIdxs = next
        .map((val, idx) => (val === '' ? idx : null))
        .filter((val) => val !== null) as number[];
      if (emptyIdxs.length > 0) {
        const aiChoice = emptyIdxs[Math.floor(Math.random() * emptyIdxs.length)];
        next[aiChoice] = 'O';
        setBoardTTT([...next]);
        const aiWin = checkTTTWinner(next);
        if (aiWin) {
          setTttWinner(aiWin);
          if (aiWin === 'O') setScore((s) => ({ ...s, ai: s.ai + 1 }));
        }
        setTurn('X');
      }
    }, 400);
  };

  const resetTTT = () => {
    setBoardTTT(Array(9).fill(''));
    setTttWinner(null);
    setTurn('X');
  };

  const getNumberColor = (num: number) => {
    const colors = ['', '#0078D4', '#107C41', '#E81123', '#00188F', '#B4009E', '#008272', '#000', '#555'];
    return colors[num] || '#FFF';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1C' : '#F5F5F5' }]}>
      {/* Game Selection Tabs */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: isDark ? '#252525' : '#E8E8E8',
            borderBottomColor: isDark ? '#333' : '#DDD',
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === 'minesweeper' && styles.tabActive]}
          onPress={() => setActiveTab('minesweeper')}
        >
          <Ionicons name="nuclear-outline" size={15} color="#E81123" />
          <Text style={[styles.tabText, { color: isDark ? '#FFF' : '#111' }]}>كاسحة الألغام</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'tictactoe' && styles.tabActive]}
          onPress={() => setActiveTab('tictactoe')}
        >
          <Ionicons name="grid-outline" size={15} color="#0078D4" />
          <Text style={[styles.tabText, { color: isDark ? '#FFF' : '#111' }]}>Tic-Tac-Toe</Text>
        </TouchableOpacity>
      </View>

      {/* Minesweeper View */}
      {activeTab === 'minesweeper' && (
        <ScrollView contentContainerStyle={styles.minesweeperWrap}>
          {/* Header Scoreboard */}
          <View
            style={[
              styles.mineHeader,
              {
                backgroundColor: isDark ? '#2A2A2A' : '#E5E5E5',
                borderColor: isDark ? '#444' : '#CCC',
              },
            ]}
          >
            {/* Mines left */}
            <View style={styles.lcdBox}>
              <Text style={styles.lcdText}>
                {String(
                  MINES - grid.flat().filter((c) => c.isFlagged).length
                ).padStart(3, '0')}
              </Text>
            </View>

            {/* Face Button */}
            <TouchableOpacity onPress={initMinesweeper} style={styles.faceBtn}>
              <Text style={{ fontSize: 24 }}>
                {gameOver ? '😵' : gameWon ? '😎' : '🙂'}
              </Text>
            </TouchableOpacity>

            {/* Timer */}
            <View style={styles.lcdBox}>
              <Text style={styles.lcdText}>{String(Math.min(timer, 999)).padStart(3, '0')}</Text>
            </View>
          </View>

          {/* Flag Mode Toggle Button */}
          <TouchableOpacity
            style={[
              styles.flagToggleBtn,
              { backgroundColor: flagMode ? '#E81123' : isDark ? '#333' : '#DDD' },
            ]}
            onPress={() => setFlagMode((f) => !f)}
          >
            <Ionicons name="flag" size={16} color={flagMode ? '#FFF' : isDark ? '#BBB' : '#444'} />
            <Text
              style={[
                styles.flagToggleText,
                { color: flagMode ? '#FFF' : isDark ? '#BBB' : '#444' },
              ]}
            >
              {flagMode ? 'وضع وضع العلم (مفعل)' : 'وضع كشف الخانات'}
            </Text>
          </TouchableOpacity>

          {/* Grid */}
          <View
            style={[
              styles.mineGrid,
              {
                backgroundColor: isDark ? '#111' : '#BDBDBD',
                borderColor: isDark ? '#333' : '#777',
              },
            ]}
          >
            {grid.map((row, rIdx) => (
              <View key={rIdx} style={styles.mineRow}>
                {row.map((cell, cIdx) => (
                  <TouchableOpacity
                    key={cIdx}
                    style={[
                      styles.mineCell,
                      cell.isRevealed
                        ? [styles.cellRevealed, { backgroundColor: isDark ? '#2E2E2E' : '#E0E0E0' }]
                        : [styles.cellHidden, { backgroundColor: isDark ? '#3E3E3E' : '#C0C0C0' }],
                    ]}
                    onPress={() => handleCellPress(rIdx, cIdx)}
                    onLongPress={() => toggleFlag(rIdx, cIdx)}
                    activeOpacity={0.8}
                  >
                    {cell.isRevealed ? (
                      cell.isMine ? (
                        <Ionicons name="nuclear" size={16} color="#E81123" />
                      ) : cell.neighborMines > 0 ? (
                        <Text
                          style={[
                            styles.cellNumber,
                            { color: getNumberColor(cell.neighborMines) },
                          ]}
                        >
                          {cell.neighborMines}
                        </Text>
                      ) : null
                    ) : cell.isFlagged ? (
                      <Ionicons name="flag" size={14} color="#E81123" />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {gameOver && (
            <Text style={styles.loseText}>انفجر اللغم! اضغط على الوجه لإعادة المحاولة.</Text>
          )}
          {gameWon && (
            <Text style={styles.winText}>أحسنت! فزت بكاسحة الألغام في {timer} ثانية!</Text>
          )}
        </ScrollView>
      )}

      {/* Tic-Tac-Toe View */}
      {activeTab === 'tictactoe' && (
        <ScrollView contentContainerStyle={styles.tttWrap}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreBadge}>
              <Text style={[styles.scoreLabel, { color: isDark ? '#AAA' : '#666' }]}>أنت (X)</Text>
              <Text style={[styles.scoreValue, { color: settings.accentColor }]}>{score.player}</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={[styles.scoreLabel, { color: isDark ? '#AAA' : '#666' }]}>Windows AI (O)</Text>
              <Text style={[styles.scoreValue, { color: '#E81123' }]}>{score.ai}</Text>
            </View>
          </View>

          <View style={[styles.tttGrid, { borderColor: isDark ? '#444' : '#CCC' }]}>
            {boardTTT.map((cell, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.tttCell,
                  {
                    backgroundColor: isDark ? '#292929' : '#FFFFFF',
                    borderColor: isDark ? '#3D3D3D' : '#DDD',
                  },
                ]}
                onPress={() => handleTTTClick(idx)}
              >
                <Text
                  style={[
                    styles.tttCellText,
                    { color: cell === 'X' ? settings.accentColor : '#E81123' },
                  ]}
                >
                  {cell}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tttWinner && (
            <Text
              style={[
                styles.tttResult,
                { color: tttWinner === 'X' ? '#107C41' : tttWinner === 'O' ? '#E81123' : '#888' },
              ]}
            >
              {tttWinner === 'X'
                ? 'فزت بالجولة!'
                : tttWinner === 'O'
                ? 'فاز الذكاء الاصطناعي!'
                : 'تعادل!'}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.resetBtn, { backgroundColor: settings.accentColor }]}
            onPress={resetTTT}
          >
            <Text style={styles.resetBtnText}>جولة جديدة</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 36,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  tabActive: {
    backgroundColor: 'rgba(0, 120, 212, 0.15)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  minesweeperWrap: {
    alignItems: 'center',
    padding: 16,
  },
  mineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 280,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  lcdBox: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  lcdText: {
    color: '#FF0000',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  faceBtn: {
    padding: 4,
  },
  flagToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
  },
  flagToggleText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  mineGrid: {
    borderWidth: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  mineRow: {
    flexDirection: 'row',
  },
  mineCell: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  cellHidden: {
    elevation: 2,
  },
  cellRevealed: {
    elevation: 0,
  },
  cellNumber: {
    fontSize: 15,
    fontWeight: '700',
  },
  loseText: {
    color: '#E81123',
    fontWeight: '700',
    marginTop: 12,
    fontSize: 12,
  },
  winText: {
    color: '#107C41',
    fontWeight: '700',
    marginTop: 12,
    fontSize: 12,
  },
  tttWrap: {
    alignItems: 'center',
    padding: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 20,
  },
  scoreBadge: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  tttGrid: {
    width: 240,
    height: 240,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  tttCell: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tttCellText: {
    fontSize: 32,
    fontWeight: '700',
  },
  tttResult: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 16,
  },
  resetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 6,
    marginTop: 16,
  },
  resetBtnText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
