import { create } from 'zustand';
import { database, FirebaseService } from '../firebase/config';
import { ref, onValue, set, push, update, get } from 'firebase/database';

export interface MultiplayerPlayer {
  id: string;
  name: string;
  money: number;
  reputation: number;
  position: { x: number; y: number };
  color: string;
  lastUpdate: number;
  isOnline: boolean;
}

export interface GameRoom {
  id: string;
  name: string;
  host: string;
  players: Record<string, MultiplayerPlayer>;
  maxPlayers: number;
  isPrivate: boolean;
  createdAt: number;
  gameState: 'waiting' | 'playing' | 'paused' | 'finished';
}

export interface MultiplayerStoreState {
  rooms: Record<string, GameRoom>;
  currentRoom: GameRoom | null;
  currentPlayerId: string | null;
  
  // Room actions
  createRoom: (roomName: string, playerName: string, maxPlayers?: number) => Promise<string>;
  joinRoom: (roomId: string, playerName: string) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  listRooms: () => Promise<GameRoom[]>;
  
  // Player actions
  updatePlayerPosition: (roomId: string, playerId: string, x: number, y: number) => Promise<void>;
  updatePlayerMoney: (roomId: string, playerId: string, amount: number) => Promise<void>;
  updatePlayerReputation: (roomId: string, playerId: string, amount: number) => Promise<void>;
  
  // Trade between players
  tradeWithPlayer: (
    roomId: string,
    fromPlayerId: string,
    toPlayerId: string,
    goods: number,
    price: number
  ) => Promise<boolean>;
  
  // Listen to room changes
  listenToRoom: (roomId: string, callback: (room: GameRoom) => void) => void;
  
  // Leave room and cleanup
  disconnectMultiplayer: () => Promise<void>;
}

export const MultiplayerStore = create<MultiplayerStoreState>((set, get) => ({
  rooms: {},
  currentRoom: null,
  currentPlayerId: null,

  /**
   * Create new multiplayer room
   */
  createRoom: async (roomName, playerName, maxPlayers = 4) => {
    try {
      const playerId = `player_${Date.now()}`;
      const roomData: GameRoom = {
        id: '',
        name: roomName,
        host: playerId,
        players: {
          [playerId]: {
            id: playerId,
            name: playerName,
            money: 50000,
            reputation: 100,
            position: { x: 250, y: 250 },
            color: '#00d4ff',
            lastUpdate: Date.now(),
            isOnline: true,
          },
        },
        maxPlayers,
        isPrivate: false,
        createdAt: Date.now(),
        gameState: 'waiting',
      };

      const roomsRef = ref(database, 'multiplayer_rooms');
      const newRoomRef = push(roomsRef);
      roomData.id = newRoomRef.key || '';

      await set(newRoomRef, roomData);

      set({
        currentRoom: roomData,
        currentPlayerId: playerId,
      });

      console.log(`✅ Room "${roomName}" created: ${roomData.id}`);
      return roomData.id;
    } catch (error) {
      console.error('❌ Room creation failed:', error);
      throw error;
    }
  },

  /**
   * Join existing multiplayer room
   */
  joinRoom: async (roomId, playerName) => {
    try {
      const roomRef = ref(database, `multiplayer_rooms/${roomId}`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        console.error('❌ Room not found');
        return false;
      }

      const room: GameRoom = snapshot.val();
      const playerId = `player_${Date.now()}`;

      // Check if room is full
      if (Object.keys(room.players).length >= room.maxPlayers) {
        console.error('❌ Room is full');
        return false;
      }

      // Add new player to room
      const newPlayer: MultiplayerPlayer = {
        id: playerId,
        name: playerName,
        money: 50000,
        reputation: 100,
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        color: ['#ff6b9d', '#ffa500', '#00ff88', '#ff00ff'][
          Object.keys(room.players).length % 4
        ],
        lastUpdate: Date.now(),
        isOnline: true,
      };

      const updateData: Record<string, any> = {};
      updateData[`multiplayer_rooms/${roomId}/players/${playerId}`] = newPlayer;

      await update(ref(database), updateData);

      room.players[playerId] = newPlayer;
      set({
        currentRoom: room,
        currentPlayerId: playerId,
      });

      console.log(`✅ Joined room "${room.name}" as ${playerName}`);
      return true;
    } catch (error) {
      console.error('❌ Join room failed:', error);
      return false;
    }
  },

  /**
   * Leave current room
   */
  leaveRoom: async () => {
    try {
      const state = get();
      if (!state.currentRoom || !state.currentPlayerId) return;

      const updateData: Record<string, any> = {};
      updateData[
        `multiplayer_rooms/${state.currentRoom.id}/players/${state.currentPlayerId}`
      ] = null;

      await update(ref(database), updateData);

      set({
        currentRoom: null,
        currentPlayerId: null,
      });

      console.log('✅ Left room');
    } catch (error) {
      console.error('❌ Leave room failed:', error);
    }
  },

  /**
   * List all available rooms
   */
  listRooms: async () => {
    try {
      const roomsRef = ref(database, 'multiplayer_rooms');
      const snapshot = await get(roomsRef);

      if (!snapshot.exists()) return [];

      const rooms = snapshot.val();
      return Object.values(rooms) as GameRoom[];
    } catch (error) {
      console.error('❌ List rooms failed:', error);
      return [];
    }
  },

  /**
   * Update player position in room
   */
  updatePlayerPosition: async (roomId, playerId, x, y) => {
    try {
      const updateData: Record<string, any> = {};
      updateData[`multiplayer_rooms/${roomId}/players/${playerId}/position`] = { x, y };
      updateData[`multiplayer_rooms/${roomId}/players/${playerId}/lastUpdate`] = Date.now();

      await update(ref(database), updateData);
    } catch (error) {
      console.error('❌ Update position failed:', error);
    }
  },

  /**
   * Update player money
   */
  updatePlayerMoney: async (roomId, playerId, amount) => {
    try {
      const playerRef = ref(database, `multiplayer_rooms/${roomId}/players/${playerId}`);
      const snapshot = await get(playerRef);

      if (!snapshot.exists()) return;

      const player = snapshot.val();
      const newMoney = Math.max(0, player.money + amount);

      const updateData: Record<string, any> = {};
      updateData[`multiplayer_rooms/${roomId}/players/${playerId}/money`] = newMoney;
      updateData[`multiplayer_rooms/${roomId}/players/${playerId}/lastUpdate`] = Date.now();

      await update(ref(database), updateData);
    } catch (error) {
      console.error('❌ Update money failed:', error);
    }
  },

  /**
   * Update player reputation
   */
  updatePlayerReputation: async (roomId, playerId, amount) => {
    try {
      const playerRef = ref(database, `multiplayer_rooms/${roomId}/players/${playerId}`);
      const snapshot = await get(playerRef);

      if (!snapshot.exists()) return;

      const player = snapshot.val();
      const newReputation = player.reputation + amount;

      const updateData: Record<string, any> = {};
      updateData[`multiplayer_rooms/${roomId}/players/${playerId}/reputation`] = newReputation;
      updateData[`multiplayer_rooms/${roomId}/players/${playerId}/lastUpdate`] = Date.now();

      await update(ref(database), updateData);
    } catch (error) {
      console.error('❌ Update reputation failed:', error);
    }
  },

  /**
   * Trade between players
   */
  tradeWithPlayer: async (roomId, fromPlayerId, toPlayerId, goods, price) => {
    try {
      const fromPlayerRef = ref(database, `multiplayer_rooms/${roomId}/players/${fromPlayerId}`);
      const toPlayerRef = ref(database, `multiplayer_rooms/${roomId}/players/${toPlayerId}`);

      const [fromSnapshot, toSnapshot] = await Promise.all([
        get(fromPlayerRef),
        get(toPlayerRef),
      ]);

      if (!fromSnapshot.exists() || !toSnapshot.exists()) return false;

      const fromPlayer = fromSnapshot.val();
      const toPlayer = toSnapshot.val();

      // Check if trade is possible
      if (fromPlayer.money < price || toPlayer.inventory?.goods < goods) {
        console.log('❌ Trade not possible - insufficient resources');
        return false;
      }

      const updateData: Record<string, any> = {};

      // Update from player (loses money, gains goods)
      updateData[`multiplayer_rooms/${roomId}/players/${fromPlayerId}/money`] =
        fromPlayer.money - price;
      updateData[`multiplayer_rooms/${roomId}/players/${fromPlayerId}/inventory/goods`] =
        (fromPlayer.inventory?.goods || 0) + goods;

      // Update to player (gains money, loses goods)
      updateData[`multiplayer_rooms/${roomId}/players/${toPlayerId}/money`] =
        toPlayer.money + price;
      updateData[`multiplayer_rooms/${roomId}/players/${toPlayerId}/inventory/goods`] =
        (toPlayer.inventory?.goods || 0) - goods;

      // Add trade log
      updateData[`multiplayer_rooms/${roomId}/trades/${Date.now()}`] = {
        from: fromPlayerId,
        to: toPlayerId,
        goods,
        price,
        timestamp: Date.now(),
      };

      await update(ref(database), updateData);

      console.log(`✅ Trade successful: ${fromPlayer.name} ↔ ${toPlayer.name}`);
      return true;
    } catch (error) {
      console.error('❌ Trade failed:', error);
      return false;
    }
  },

  /**
   * Listen to room changes in real-time
   */
  listenToRoom: (roomId, callback) => {
    try {
      const roomRef = ref(database, `multiplayer_rooms/${roomId}`);
      onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        }
      });
    } catch (error) {
      console.error('❌ Listen to room failed:', error);
    }
  },

  /**
   * Disconnect from multiplayer
   */
  disconnectMultiplayer: async () => {
    try {
      const state = get();
      if (state.currentRoom && state.currentPlayerId) {
        await state.leaveRoom();
      }
      set({
        rooms: {},
        currentRoom: null,
        currentPlayerId: null,
      });
      console.log('✅ Disconnected from multiplayer');
    } catch (error) {
      console.error('❌ Disconnect failed:', error);
    }
  },
}));
