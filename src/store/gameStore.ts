import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Player {
  id: string;
  name: string;
  level: number;
  money: number;
  reputation: number;
  position: { x: number; y: number };
  inventory: Record<string, number>;
  lastOfflineTime: number;
}

export interface Business {
  id: string;
  type: 'factory' | 'warehouse' | 'market' | 'office';
  name: string;
  level: number;
  productionRate: number;
  position: { x: number; y: number };
  products: Record<string, number>;
}

export interface GameStoreState {
  gameState: 'menu' | 'loading' | 'game' | 'paused';
  player: Player | null;
  businesses: Business[];
  npcData: Record<string, any>;
  worldChunks: Map<string, any>;
  
  // Actions
  setGameState: (state: GameStoreState['gameState']) => void;
  setPlayer: (player: Player) => void;
  updatePlayerMoney: (amount: number) => void;
  updatePlayerReputation: (amount: number) => void;
  updatePlayerPosition: (x: number, y: number) => void;
  addBusiness: (business: Business) => void;
  updateBusiness: (businessId: string, updates: Partial<Business>) => void;
  setWorldChunk: (chunkId: string, data: any) => void;
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;
}

export const GameStore = create<GameStoreState>((set, get) => ({\n  gameState: 'menu',
  player: null,
  businesses: [],
  npcData: {},
  worldChunks: new Map(),

  setGameState: (state) => set({ gameState: state }),

  setPlayer: (player) => set({ player }),

  updatePlayerMoney: (amount) =>
    set((state) => ({
      player: state.player
        ? { 
            ...state.player, 
            money: Math.max(0, state.player.money + amount)
          }
        : null,
    })),

  updatePlayerReputation: (amount) =>
    set((state) => ({
      player: state.player
        ? { 
            ...state.player, 
            reputation: state.player.reputation + amount 
          }
        : null,
    })),

  updatePlayerPosition: (x, y) =>
    set((state) => ({
      player: state.player
        ? { ...state.player, position: { x, y } }
        : null,
    })),

  addBusiness: (business) =>
    set((state) => ({
      businesses: [...state.businesses, business],
    })),

  updateBusiness: (businessId, updates) =>
    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId ? { ...b, ...updates } : b
      ),
    })),

  setWorldChunk: (chunkId, data) =>
    set((state) => {
      const newChunks = new Map(state.worldChunks);
      newChunks.set(chunkId, data);
      return { worldChunks: newChunks };
    }),

  saveGame: async () => {
    try {
      const state = get();
      const saveData = {
        player: state.player ? { ...state.player, lastOfflineTime: Date.now() } : null,
        businesses: state.businesses,
        gameState: state.gameState,
      };
      await AsyncStorage.setItem(
        '@midnight_save',
        JSON.stringify(saveData)
      );
      console.log('✅ Game saved successfully');
    } catch (error) {
      console.error('❌ Save failed:', error);
    }
  },

  loadGame: async () => {
    try {
      const data = await AsyncStorage.getItem('@midnight_save');
      if (data) {
        const parsed = JSON.parse(data);
        set({ 
          player: parsed.player, 
          businesses: parsed.businesses,
          gameState: 'game' 
        });
        console.log('✅ Game loaded successfully');
      }
    } catch (error) {
      console.error('❌ Load failed:', error);
    }
  },
}));
