export interface GundamCard {
  id: string;
  name: string;
  cost: number;
  type: 'Unit' | 'Pilot' | 'Command' | 'Base';
  colors: ('Blue' | 'Green' | 'Red' | 'White' | 'Purple' | 'Colorless')[];
  rarity: string;
  set: string;
  power?: number;
  hp?: number;
  level?: number;
  ap?: number;
  link?: string;
  trait?: string;
  zone?: string;
  show?: string;
  source?: string;
  abilities: string[];
  flavorText?: string;
  image: string;
  marketPrice?: number;
}

export interface DeckCard extends GundamCard {
  quantity: number;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  notes?: string;
  cards: DeckCard[];
  totalCards: number;
  colors: string[];
  isPublic: boolean;
  marketValue: number;
  createdAt: Date;
  updatedAt: Date;
  author?: string;
  tags?: string[];
  wins?: number;
  losses?: number;
  versions?: DeckVersion[];
  likes?: number;
  comments?: number;
  featured?: boolean;
  trending?: boolean;
  allowComments?: boolean;
  allowForks?: boolean;
  forks?: number;
  originalDeckId?: string;
  gameHistory?: GameRecord[];
}

export interface GameRecord {
  id: string;
  opponent: string;
  result: 'win' | 'loss';
  date: Date;
  format: string;
  notes?: string;
}

export interface DeckVersion {
  id: string;
  version: number;
  name: string;
  cards: DeckCard[];
  createdAt: Date;
  notes?: string;
  totalCards: number;
  marketValue: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isLoggedIn: boolean;
  decks: Deck[];
  collection?: GundamCard[];
  wishlist?: GundamCard[];
  preferences: {
    emailMarketing: boolean;
    emailStrategy: boolean;
  };
}

export interface AIComparisonResult {
  deck1Name: string;
  deck2Name: string;
  winProbability: number;
  predictedWins: number;
  overallSummary: string;
  deck1Strengths: string[];
  deck1Weaknesses: string[];
  deck2Strengths: string[];
  deck2Weaknesses: string[];
  strategicRecommendations: string[];
  alternativeCards: {
    deck1: string[];
    deck2: string[];
  };
  keyMatchupFactors: string[];
}