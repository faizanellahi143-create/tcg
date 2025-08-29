import axios from "axios";
import { TcgCard } from "../store/slices/cardSlice";
import { GundamCard } from "../types/card";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Types for deck operations
export interface DeckCardData {
  _id?: string;
  id?: string;
  cardType: "gundam" | "tcg";
  quantity: number;
  name: string;
  type: string;
  rarity: string;
  set: string;
  image: string;
  // Gundam specific
  cost?: number;
  colors?: string[];
  power?: number;
  hp?: number;
  // TCG specific
  ap?: string;
  bp?: string;
  affinity?: string;
  effect?: string;
  code?: string;
}

export interface CreateDeckRequest {
  name: string;
  description?: string;
  notes?: string;
  cards: DeckCardData[];
  format?: string;
  tags?: string[];
  isPublic?: boolean;
  createdBy: string;
}

export interface UpdateDeckRequest {
  name?: string;
  description?: string;
  notes?: string;
  cards?: DeckCardData[];
  format?: string;
  tags?: string[];
  isPublic?: boolean;
  updatedBy: string;
}

export interface GameRecordRequest {
  opponent: string;
  result: "win" | "loss" | "draw";
  format?: string;
  notes?: string;
  userId: string;
}

// Helper function to convert TCG cards to deck format
export const convertTcgCardsToDeckFormat = (
  cards: TcgCard[],
  quantities: Record<string, number>
): DeckCardData[] => {
  return cards
    .filter((card) => quantities[card._id] && quantities[card._id] > 0)
    .map((card) => ({
      _id: card._id,
      cardType: "tcg" as const,
      quantity: quantities[card._id],
      name: card.name,
      type: card.type,
      rarity: card.rarity,
      set: card.set?.name || card.set || "",
      image: card.images?.large || card.imageUrl,
      ap: card.ap,
      bp: card.bp,
      affinity: card.affinity,
      effect: card.effect,
      code: card.code,
    }));
};

// Helper function to convert Gundam cards to deck format
export const convertGundamCardsToDeckFormat = (
  cards: GundamCard[],
  quantities: Record<string, number>
): DeckCardData[] => {
  return cards
    .filter((card) => quantities[card.id] && quantities[card.id] > 0)
    .map((card) => ({
      id: card.id,
      cardType: "gundam" as const,
      quantity: quantities[card.id],
      name: card.name,
      type: card.type,
      rarity: card.rarity,
      set: card.set,
      image: card.image,
      cost: card.cost,
      colors: card.colors,
      power: card.power,
      hp: card.hp,
    }));
};

// Helper function to calculate deck statistics
export const calculateDeckStats = (cards: DeckCardData[]) => {
  const stats = {
    gundamCards: 0,
    tcgCards: 0,
    totalCards: 0,
    averageCost: 0,
    totalAP: 0,
    totalBP: 0,
    colorDistribution: {} as Record<string, number>,
    typeDistribution: {} as Record<string, number>,
    rarityDistribution: {} as Record<string, number>,
    affinityDistribution: {} as Record<string, number>,
  };

  let totalCost = 0;
  let costCount = 0;
  let totalAP = 0;
  let apCount = 0;
  let totalBP = 0;
  let bpCount = 0;

  cards.forEach((card) => {
    const quantity = card.quantity || 1;
    stats.totalCards += quantity;

    if (card.cardType === "gundam") {
      stats.gundamCards += quantity;

      if (card.cost) {
        totalCost += card.cost * quantity;
        costCount += quantity;
      }

      if (card.colors) {
        card.colors.forEach((color) => {
          stats.colorDistribution[color] =
            (stats.colorDistribution[color] || 0) + quantity;
        });
      }
    } else if (card.cardType === "tcg") {
      stats.tcgCards += quantity;

      if (card.ap && card.ap !== "-") {
        const ap = parseInt(card.ap) || 0;
        totalAP += ap * quantity;
        apCount += quantity;
      }

      if (card.bp && card.bp !== "-") {
        const bp = parseInt(card.bp) || 0;
        totalBP += bp * quantity;
        bpCount += quantity;
      }

      if (card.affinity && card.affinity !== "-") {
        stats.affinityDistribution[card.affinity] =
          (stats.affinityDistribution[card.affinity] || 0) + quantity;
      }
    }

    // Common stats
    if (card.type) {
      stats.typeDistribution[card.type] =
        (stats.typeDistribution[card.type] || 0) + quantity;
    }

    if (card.rarity) {
      stats.rarityDistribution[card.rarity] =
        (stats.rarityDistribution[card.rarity] || 0) + quantity;
    }
  });

  stats.averageCost = costCount > 0 ? totalCost / costCount : 0;
  stats.totalAP = totalAP;
  stats.totalBP = totalBP;

  return stats;
};

// Helper function to estimate market value
export const estimateMarketValue = (cards: DeckCardData[]): number => {
  let totalValue = 0;

  cards.forEach((card) => {
    const quantity = card.quantity || 1;

    // Basic pricing based on rarity (you can enhance this)
    let estimatedPrice = 1.5; // Base price

    if (card.rarity) {
      switch (card.rarity) {
        case "UR":
          estimatedPrice = 50;
          break;
        case "SR":
          estimatedPrice = 25;
          break;
        case "R":
          estimatedPrice = 10;
          break;
        case "U":
          estimatedPrice = 5;
          break;
        case "C":
          estimatedPrice = 1;
          break;
        default:
          estimatedPrice = 1.5;
      }
    }

    totalValue += estimatedPrice * quantity;
  });

  return Math.round(totalValue * 100) / 100;
};

// API functions
export const deckService = {
  // Create a new deck
  async createDeck(deckData: CreateDeckRequest) {
    const response = await axios.post(`${API_BASE_URL}/api/decks`, deckData);
    return response.data;
  },

  // Get all decks with filtering
  async getDecks(params: {
    page?: number;
    limit?: number;
    search?: string;
    format?: string;
    tags?: string[];
    minCards?: string;
    maxCards?: string;
    minValue?: string;
    maxValue?: string;
    cardType?: string;
    sortBy?: string;
    sortOrder?: string;
    isPublic?: boolean;
    createdBy?: string;
  }) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await axios.get(
      `${API_BASE_URL}/api/decks?${queryParams}`
    );
    return response.data;
  },

  // Get deck by ID
  async getDeckById(deckId: string) {
    const response = await axios.get(`${API_BASE_URL}/api/decks/${deckId}`);
    return response.data;
  },

  // Update deck
  async updateDeck(deckId: string, deckData: UpdateDeckRequest) {
    const response = await axios.put(
      `${API_BASE_URL}/api/decks/${deckId}`,
      deckData
    );
    return response.data;
  },

  // Delete deck
  async deleteDeck(deckId: string, userId: string) {
    const response = await axios.delete(`${API_BASE_URL}/api/decks/${deckId}`, {
      data: { userId },
    });
    return response.data;
  },

  // Add game record
  async addGameRecord(deckId: string, gameData: GameRecordRequest) {
    const response = await axios.post(
      `${API_BASE_URL}/api/decks/${deckId}/games`,
      gameData
    );
    return response.data;
  },

  // Like/unlike deck
  async likeDeck(deckId: string, userId: string) {
    const response = await axios.post(
      `${API_BASE_URL}/api/decks/${deckId}/like`,
      { userId }
    );
    return response.data;
  },

  // Increment play count
  async incrementPlayCount(deckId: string) {
    const response = await axios.post(
      `${API_BASE_URL}/api/decks/${deckId}/play`
    );
    return response.data;
  },

  // Get deck statistics overview
  async getDeckStats() {
    const response = await axios.get(
      `${API_BASE_URL}/api/decks/stats/overview`
    );
    return response.data;
  },

  // Get user's decks
  async getUserDecks(
    userId: string,
    params: { page?: number; limit?: number; isPublic?: boolean } = {}
  ) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await axios.get(
      `${API_BASE_URL}/api/decks/user/${userId}?${queryParams}`
    );
    return response.data;
  },
};

export default deckService;
