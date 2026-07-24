import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import SplashScreen from 'expo-splash-screen';
import { GameStore } from './src/store/gameStore';
import { GameEngine } from './src/engine/gameEngine';
import MainMenu from './src/screens/MainMenu';
import GameWorld from './src/screens/GameWorld';

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const gameState = GameStore((state) => state.gameState);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        await GameEngine.initialize();
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Game initialization failed:', error);
      }
    };

    initializeGame();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {gameState === 'menu' ? <MainMenu /> : <GameWorld />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  content: {
    flex: 1,
  },
});

export default App;
