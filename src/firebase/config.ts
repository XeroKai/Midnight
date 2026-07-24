/**
 * Firebase Configuration Module
 * Realtime multiplayer sync for Midnight Economy
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDemoKey',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'midnight-demo.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'midnight-demo',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'midnight-demo.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.FIREBASE_APP_ID || '1:123456789:web:abc123',
  databaseURL: 'https://midnight-demo.firebaseio.com',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

/**
 * Firebase helper functions
 */
export class FirebaseService {
  /**
   * Sync player data to Firebase
   */
  static async syncPlayerData(playerId: string, playerData: any): Promise<void> {
    try {
      const playerRef = ref(database, `players/${playerId}`);
      await set(playerRef, {
        ...playerData,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error('Firebase sync error:', error);
    }
  }

  /**
   * Listen to player data changes
   */
  static listenToPlayerData(playerId: string, callback: (data: any) => void): void {
    try {
      const playerRef = ref(database, `players/${playerId}`);
      onValue(playerRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        }
      });
    } catch (error) {
      console.error('Firebase listener error:', error);
    }
  }

  /**
   * Sync leaderboard
   */
  static async updateLeaderboard(playerId: string, score: number): Promise<void> {
    try {
      const leaderboardRef = ref(database, `leaderboard/${playerId}`);
      await set(leaderboardRef, {
        playerId,
        score,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Leaderboard update error:', error);
    }
  }
}

export default app;
