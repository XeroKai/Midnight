import { GameStore } from '../store/gameStore';
import { EconomyCalculator } from '../utils/economyCalculator';

/**
 * 🎮 GAME ENGINE
 * Handles:
 * - Idle calculations (passive income, production)
 * - NPC behaviors and economy
 * - World chunk loading (performance optimization)
 * - Delta-time based calculations for offline progress
 */

export class GameEngine {
  private static lastUpdateTime: number = Date.now();
  private static updateInterval: NodeJS.Timeout | null = null;
  private static npcUpdateInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize game engine
   */
  static async initialize(): Promise<void> {
    console.log('🎮 Initializing Game Engine...');
    
    await GameStore.getState().loadGame();
    this.calculateOfflineProgress();
    this.startIdleCalculations();
    this.startNPCBehaviors();
  }

  /**
   * Calculate progress made while offline
   * Schedule 1 gibi: oyuncu çevrim dışıyken de para ve üretim devam eder
   */
  private static calculateOfflineProgress(): void {
    const state = GameStore.getState();
    const player = state.player;

    if (!player) return;

    const now = Date.now();
    const offlineTimeSeconds = (now - (player.lastOfflineTime || now)) / 1000;

    if (offlineTimeSeconds > 0) {
      // Passive income: reputation * 10 per second
      const offlineIncome = player.reputation * 10 * (offlineTimeSeconds / 3600); // Per hour
      state.updatePlayerMoney(offlineIncome);

      console.log(`📊 Offline Progress: +$${offlineIncome.toFixed(0)} (${(offlineTimeSeconds / 3600).toFixed(1)}h)`);
    }

    this.lastUpdateTime = now;
  }

  /**
   * Start idle calculations loop (her 2 saniyede bir)
   */
  private static startIdleCalculations(): void {
    this.updateInterval = setInterval(() => {
      this.updateIdleEconomy();
    }, 2000);
  }

  /**
   * Update idle economy
   */
  private static updateIdleEconomy(): void {
    const state = GameStore.getState();
    const player = state.player;

    if (!player) return;

    const now = Date.now();
    const deltaTime = (now - this.lastUpdateTime) / 1000; // saniye cinsinden

    // Passive income calculation
    const passiveIncome = EconomyCalculator.calculatePassiveIncome(
      player.reputation,
      deltaTime
    );

    state.updatePlayerMoney(passiveIncome);

    // Business production
    state.businesses.forEach((business) => {
      const production = business.productionRate * (deltaTime / 10);
      state.updateBusiness(business.id, {
        products: {
          ...business.products,
          goods: (business.products.goods || 0) + production,
        },
      });
    });

    this.lastUpdateTime = now;
  }

  /**
   * Start NPC behavior updates (her 5 saniyede bir)
   */
  private static startNPCBehaviors(): void {
    this.npcUpdateInterval = setInterval(() => {
      this.updateNPCBehaviors();
    }, 5000);
  }

  /**
   * Update NPC behaviors dynamically
   * Schedule 1 tarzı dinamik davranışlar
   */
  private static updateNPCBehaviors(): void {
    const state = GameStore.getState();
    const player = state.player;

    if (!player) return;

    // NPC müşteri davranışları
    Object.entries(state.npcData).forEach(([npcId, npc]) => {
      if (npc.type === 'customer') {
        this.processCustomerBehavior(npc, player);
      } else if (npc.type === 'rival') {
        this.processRivalBehavior(npc, player);
      } else if (npc.type === 'authority') {
        this.processAuthorityBehavior(npc, player);
      }
    });
  }

  /**
   * Customer NPC davranışı
   */
  private static processCustomerBehavior(npc: any, player: any): void {
    // %80 ihtimalle tekrar satın alır
    const willPurchase = Math.random() < 0.8;
    
    if (willPurchase && player.inventory.goods > 0) {
      const purchaseAmount = Math.floor(Math.random() * 100) + 50;
      const price = 100;
      const totalPrice = purchaseAmount * price;

      player.inventory.goods -= purchaseAmount;
      player.money += totalPrice;

      // Reputation: müşteri memnuniyeti
      const reputation = EconomyCalculator.calculateReputationChange(0.9, 0.85);
      player.reputation += reputation;

      console.log(`💰 Customer ${npc.id} purchased! +$${totalPrice}`);
    }
  }

  /**
   * Rival NPC davranışı
   */
  private static processRivalBehavior(npc: any, player: any): void {
    // Rakipler fiyat savaşları başlatabilir
    const wilStartPriceWar = Math.random() < 0.15; // %15 ihtimal

    if (wilStartPriceWar) {
      const priceReduction = 0.9; // %10 fiyat düşürü
      console.log(`⚔️ Rival ${npc.id} başladı fiyat savaşına!`);
      // Oyuncunun cevap vermesi gerekir
    }
  }

  /**
   * Authority (Otorite) NPC davranışı
   */
  private static processAuthorityBehavior(npc: any, player: any): void {
    // Belirli aralıklarla denetim yapabilir
    const inspectionChance = 0.1; // %10 ihtimal
    
    if (Math.random() < inspectionChance) {
      console.log(`🚔 Authority ${npc.id} denetim yapıyor!`);
      // Risk mekaniksi: oyuncunun itibarına göre ceza
      if (player.reputation < 100) {
        player.money -= 500; // Ceza
        console.log(`📉 Fine applied: -$500`);
      }
    }
  }

  /**
   * Load world chunk (chunk-based lazy loading)
   * Performans optimizasyonu: tüm harita yüklenmez, sadece gerekli bölgeler
   */
  static loadWorldChunk(chunkId: string): void {
    const existing = GameStore.getState().worldChunks.get(chunkId);
    if (existing) return; // Zaten yüklü

    const chunkData = this.generateChunkData(chunkId);
    GameStore.getState().setWorldChunk(chunkId, chunkData);
    console.log(`📦 Chunk ${chunkId} loaded`);
  }

  /**
   * Generate chunk data (seed-based procedural generation)
   */
  private static generateChunkData(chunkId: string): any {
    const [x, y] = chunkId.split(',').map(Number);
    return {
      id: chunkId,
      x,
      y,
      buildings: this.generateBuildings(x, y),
      npcs: this.generateNPCs(x, y),
      resources: this.generateResources(x, y),
    };
  }

  /**
   * Generate buildings for a chunk (seed-based)
   */
  private static generateBuildings(chunkX: number, chunkY: number): any[] {
    const seed = chunkX * 73856093 ^ chunkY * 19349663;
    const buildingCount = (seed % 5) + 3;
    const buildingTypes = ['factory', 'warehouse', 'market', 'office', 'shop'];

    return Array.from({ length: buildingCount }).map((_, i) => ({
      id: `building_${chunkX}_${chunkY}_${i}`,
      type: buildingTypes[(seed + i) % buildingTypes.length],
      name: `${buildingTypes[(seed + i) % buildingTypes.length]} #${i + 1}`,
      x: ((seed + i * 100) % 500) / 500,
      y: ((seed + i * 200) % 500) / 500,
      level: 1,
    }));
  }

  /**
   * Generate NPCs for a chunk
   */
  private static generateNPCs(chunkX: number, chunkY: number): any[] {
    const seed = chunkX * 73856093 ^ chunkY * 19349663;
    const npcCount = (seed % 3) + 2;
    const npcTypes = ['customer', 'supplier', 'rival', 'authority'];

    return Array.from({ length: npcCount }).map((_, i) => ({
      id: `npc_${chunkX}_${chunkY}_${i}`,
      type: npcTypes[(seed + i) % npcTypes.length],
      name: this.generateNPCName(),
      x: ((seed + i * 150) % 500) / 500,
      y: ((seed + i * 250) % 500) / 500,
      reputation: Math.floor((seed + i * 50) % 100),
    }));
  }

  /**
   * Generate resources for a chunk
   */
  private static generateResources(chunkX: number, chunkY: number): any[] {
    const seed = chunkX * 73856093 ^ chunkY * 19349663;
    const resourceCount = (seed % 3) + 1;
    const resourceTypes = ['raw_materials', 'components', 'fuel'];

    return Array.from({ length: resourceCount }).map((_, i) => ({
      id: `resource_${chunkX}_${chunkY}_${i}`,
      type: resourceTypes[i % resourceTypes.length],
      amount: Math.floor((seed + i * 100) % 1000),
    }));
  }

  /**
   * Generate random NPC names
   */
  private static generateNPCName(): string {
    const firstNames = ['Mustafa', 'Ahmet', 'Fatih', 'Emre', 'Selim', 'Ayşe', 'Zeynep', 'Melis'];
    const lastNames = ['Kaya', 'Demir', 'Çetin', 'Deniz', 'Güneş', 'Şahin', 'Aslan', 'Yıldız'];
    
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${first} ${last}`;
  }

  /**
   * Process NPC interaction
   */
  static processNPCInteraction(npcId: string): void {
    const npc = GameStore.getState().npcData[npcId];
    if (!npc) return;

    console.log(`🤝 Interacting with NPC: ${npc.name} (${npc.type})`);
    // NPC interaction logic
  }

  /**
   * Save game automatically
   */
  static autoSave(): void {
    GameStore.getState().saveGame();
  }

  /**
   * Stop game engine
   */
  static stop(): void {
    if (this.updateInterval) clearInterval(this.updateInterval);
    if (this.npcUpdateInterval) clearInterval(this.npcUpdateInterval);
    this.autoSave();
    console.log('🛑 Game Engine stopped');
  }
}
