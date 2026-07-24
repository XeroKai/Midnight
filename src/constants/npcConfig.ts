/**
 * NPC Configuration and Behaviors
 * Defines all NPC types, personalities, and interaction rules
 * Schedule 1 tarzı dinamik davranışlar
 */

export const NPC_TYPES = {
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier',
  RIVAL: 'rival',
  AUTHORITY: 'authority',
} as const;

export const NPC_CONFIG = {
  customer: {
    name: 'Müşteri',
    icon: '👤',
    color: '#00d4ff',
    behavior: {
      purchaseFrequency: 'daily',
      priceNegotiation: true,
      loyaltyFactor: 0.8,
      budgetRange: [100, 5000],
      satisfactionThreshold: 0.7,
    },
  },
  supplier: {
    name: 'Tedarikçi',
    icon: '📦',
    color: '#ffa500',
    behavior: {
      restockInterval: 'weekly',
      priceAdjustment: 'basedOnReputation',
      quantityDiscount: true,
      reliabilityFactor: 0.9,
      minimumOrder: 50,
    },
  },
  rival: {
    name: 'Rakip',
    icon: '⚔️',
    color: '#ff6b9d',
    behavior: {
      marketShareCompetition: true,
      priceWars: true,
      territoryClaiming: true,
      aggressiveness: 0.7,
      spyingChance: 0.2,
    },
  },
  authority: {
    name: 'Otorite',
    icon: '🚔',
    color: '#ff6b9d',
    behavior: {
      patrolFrequency: 'random',
      riskMultiplier: 1.5,
      inspectionChance: 0.2,
      reputationRequired: 100,
      fineAmount: 500,
    },
  },
} as const;

/**
 * NPC name pools for random generation
 */
export const NPC_NAME_POOLS = {
  firstNames: [
    'Mustafa', 'Ahmet', 'Fatih', 'Emre', 'Selim', 'Hakan',
    'Ayşe', 'Zeynep', 'Melis', 'Sinem', 'Elif', 'Gül',
    'Kerem', 'Cem', 'Burak', 'Deniz', 'Serkan', 'Kaan',
  ],
  lastNames: [
    'Kaya', 'Demir', 'Çetin', 'Ateş', 'Deniz', 'Güneş',
    'Şahin', 'Kılıç', 'Aslan', 'Yıldız', 'Akçay', 'Özkan',
    'Tekin', 'Çakır', 'Demiral', 'Eren', 'Polat', 'Öztürk',
  ],
  businesses: [
    'Express Lojistik',
    'Premium Dağıtım',
    'Hızlı Taşımacılık',
    'Elit İhracat',
    'Zirve Ticaret',
    'Yeni Ufuklar',
    'Global Taşıma',
    'Akılcı Pazarlama',
  ],
} as const;

/**
 * NPC Dialogue Templates
 */
export const NPC_DIALOGUES = {
  customer: {
    greeting: [
      'Selam! Bir şeyler arıyorum.',
      'Burada ne satıyor musunuz?',
      'İyi fiyat verirsen alırım.',
      'Üretiminiz hakkında çok duydum.',
    ],
    negotiation: [
      'Biraz daha ucuz yapabilir misin?',
      'Rakibinden daha pahalı.',
      'Miktar indirimi var mı?',
      'Toplu sipariş yaparsam ne kadar?',
    ],
    satisfied: [
      'Mükemmel! Tekrar gelirim.',
      'Başka arkadaşlarımı da getireceğim.',
      'Kalite çok iyi, tavsiye ederim.',
      'İşim için bu harika!',
    ],
    unsatisfied: [
      'Beklediğimden farklı.',
      'Rakibininkinden iyisi var.',
      'Hiç de umduğum gibi değil.',
    ],
  },
  supplier: {\n    greeting: [
      'Stok durumu nasıl?',
      'Yeni ürünler geldi mi?',
      'Fiyatınız rekabetçi mi?',
      'Minimum sipariş kaç?',
    ],
    negotiation: [
      'Toplu sipariş indirimi var mı?',
      'Teslimat süresi ne kadar?',
      'Ödeme şartları nedir?',
      'Fiyatı biraz daha indir.',
    ],
    agreement: [
      'Anlaşmaya varabilir miyiz?',
      'Düzenli müşteri olabilirim.',
      'Uzun vadeli anlaşma yapalım.',
    ],
  },
  rival: {
    warning: [
      'Bu bölge bizim!',
      'Çekil yoksa savaşırız!',
      'Fiyatları kırmaya başlayacağız.',
      'Müşterilerimiz beni tercih ediyor.',
    ],
    threat: [
      'İyi davranırsan sorun olmaz.',
      'Beni kızdırma.',
      'Pişman olursun.',
    ],
  },
  authority: {
    inspection: [
      'Prosedürler kontrol ediliyor.',
      'Tüm kağıtlarınız hazır mı?',
      'Şikayetler aldık senden hakkında.',
      'Denetim zamanı geldi.',
    ],
    fine: [
      'Para cezası kesildi.',
      'Uyarı vermek zorundayım.',
      'Kuralları çiğnedin.',
    ],
    ok: [
      'Her şey yolunda görünüyor.',
      'Temiz kayıtlar.',
      'Devam et böyle.',
    ],
  },
} as const;

/**\n * NPC Personality types
 */\nexport const PERSONALITY_TYPES = {
  aggressive: { multiplier: 1.2, negotiationChance: 0.3 },
  friendly: { multiplier: 0.8, negotiationChance: 0.8 },
  fair: { multiplier: 1.0, negotiationChance: 0.5 },
  greedy: { multiplier: 1.5, negotiationChance: 0.1 },
  cautious: { multiplier: 0.9, negotiationChance: 0.6 },
} as const;
