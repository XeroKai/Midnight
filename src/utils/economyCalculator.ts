/**
 * Economy Calculator
 * Handles all economic calculations for the game
 * Schedule 1 gibi dinamik ekonomi sistemi
 */

export class EconomyCalculator {
  /**
   * Calculate passive income based on reputation and time delta
   */
  static calculatePassiveIncome(
    reputation: number,
    deltaTimeSeconds: number
  ): number {
    const baseRate = reputation * 10; // Base rate per second
    return baseRate * (deltaTimeSeconds / 1000);
  }

  /**
   * Calculate dynamic pricing based on supply/demand
   */
  static calculateDynamicPrice(
    basePrice: number,
    demand: number,
    supply: number,
    reputation: number
  ): number {
    const supplyDemandRatio = demand / Math.max(supply, 1);
    const reputationModifier = 1 + reputation / 1000;
    return basePrice * supplyDemandRatio * reputationModifier;
  }

  /**
   * Calculate NPC purchase probability
   */
  static calculatePurchaseProbability(
    npcLoyalty: number,
    priceCompetitiveness: number,
    reputation: number
  ): number {
    const baseProbability = npcLoyalty * 0.7;
    const priceBonus = priceCompetitiveness * 0.2;
    const reputationBonus = Math.min(reputation / 1000, 0.1);

    return Math.min(baseProbability + priceBonus + reputationBonus, 1);
  }

  /**
   * Calculate production output
   */
  static calculateProductionOutput(
    baseOutput: number,
    efficiency: number,
    timeElapsedHours: number
  ): number {
    return baseOutput * efficiency * timeElapsedHours;
  }

  /**
   * Calculate reputation gain/loss
   */
  static calculateReputationChange(
    transactionQuality: number, // 0-1
    customerSatisfaction: number, // 0-1
    volumeMultiplier: number = 1
  ): number {
    return (transactionQuality + customerSatisfaction) * 5 * volumeMultiplier;
  }

  /**
   * Calculate market share impact
   */
  static calculateMarketShareChange(
    myRevenue: number,
    totalMarketRevenue: number,
    rivalCount: number
  ): number {
    return (myRevenue / totalMarketRevenue) * (1 - 0.1 * rivalCount);
  }

  /**
   * Calculate NPC pricing strategy
   */
  static calculateNPCPrice(
    baseCost: number,
    rivalPrices: number[],
    reputation: number
  ): number {
    const avgRivalPrice = rivalPrices.length > 0 
      ? rivalPrices.reduce((a, b) => a + b, 0) / rivalPrices.length 
      : baseCost * 1.5;

    const reputationFactor = 1 + (reputation / 500) * 0.1;
    return avgRivalPrice * 0.95 * reputationFactor;
  }
}
