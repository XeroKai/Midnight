import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GameStore } from '../store/gameStore';
import { GameEngine } from '../engine/gameEngine';

const MainMenu: React.FC = () => {
  const setGameState = GameStore((state) => state.setGameState);
  const setPlayer = GameStore((state) => state.setPlayer);
  const loadGame = GameStore((state) => state.loadGame);

  const handleNewGame = () => {
    const newPlayer = {
      id: 'player_' + Date.now(),
      name: 'Oyuncu',
      level: 1,
      money: 50000,
      reputation: 100,
      position: { x: 250, y: 250 },
      inventory: { goods: 500, cash: 50000 },
      lastOfflineTime: Date.now(),
    };
    setPlayer(newPlayer);
    setGameState('game');
  };

  const handleContinue = async () => {
    await loadGame();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🌙</Text>
        <Text style={styles.title}>MIDNIGHT</Text>
        <Text style={styles.subtitle}>ECONOMY SIMULATOR</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleNewGame}
        >
          <Text style={styles.buttonText}>🆕 YENİ OYUN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>▶️ DEVAM ET</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.tertiaryButton]}>
          <Text style={styles.buttonText}>⚙️ AYARLAR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
        <Text style={styles.creditText}>© XeroKai</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#00d4ff',
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 8,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    letterSpacing: 2,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  primaryButton: {
    backgroundColor: '#1a1f3a',
    borderColor: '#00d4ff',
  },
  secondaryButton: {
    backgroundColor: '#1a1f3a',
    borderColor: '#ff6b9d',
  },
  tertiaryButton: {
    backgroundColor: '#0a0e27',
    borderColor: '#ffa500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  creditText: {
    color: '#444',
    fontSize: 10,
  },
});

export default MainMenu;
