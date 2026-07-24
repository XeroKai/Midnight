import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GameStore } from './src/store/gameStore';
import { GameEngine } from './src/engine/gameEngine';
import MainMenu from './src/screens/MainMenu';
import GameWorld from './src/screens/GameWorld';
import RoomListScreen from './src/screens/RoomListScreen';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import MultiplayerGameWorld from './src/screens/MultiplayerGameWorld';

type AppState = 'menu' | 'game' | 'multiplayer-mode' | 'room-list' | 'create-room' | 'multiplayer-game' | 'loading';

export default function App() {
  const [appState, setAppState] = useState<AppState>('menu');
  const [loading, setLoading] = useState(true);

  const gameState = GameStore((state) => state.gameState);
  const currentRoom = GameStore((state) => state.currentRoom);

  useEffect(() => {
    // Initialize game engine
    GameEngine.initialize().then(() => {
      setLoading(false);
    });

    return () => {
      GameEngine.stop();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  const handlePlayMultiplayer = () => {
    setAppState('room-list');
  };

  const handleCreateRoom = () => {
    setAppState('create-room');
  };

  const handleRoomCreated = () => {
    setAppState('multiplayer-game');
  };

  const handleBackToMenu = () => {
    setAppState('menu');
  };

  return (
    <View style={styles.container}>
      {appState === 'menu' && (
        <MainMenu />
      )}

      {appState === 'game' && (
        <GameWorld />
      )}

      {appState === 'room-list' && (
        <RoomListScreen
          onSelectMode={(mode) => {
            if (mode === 'create') {
              setAppState('create-room');
            }
          }}
        />
      )}

      {appState === 'create-room' && (
        <CreateRoomScreen
          onRoomCreated={handleRoomCreated}
          onCancel={() => setAppState('room-list')}
        />
      )}

      {appState === 'multiplayer-game' && (
        <MultiplayerGameWorld />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
  },
});
