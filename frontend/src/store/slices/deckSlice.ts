import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Types
export interface DeckCard {
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

export interface SavedDeck {
  _id: string;
  name: string;
  description?: string;
  notes?: string;
  cards: DeckCard[];
  totalCards: number;
  colors: string[];
  format: string;
  tags: string[];
  isPublic: boolean;
  statistics: {
    gundamCards: number;
    tcgCards: number;
    averageCost: number;
    colorDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
    totalAP: number;
    averageAP: number;
    totalBP: number;
    averageBP: number;
    affinityDistribution: Record<string, number>;
    energyRequirements: Record<string, number>;
    rarityDistribution: Record<string, number>;
    setDistribution: Record<string, number>;
  };
  marketValue: number;
  wins: number;
  losses: number;
  winRate: number;
  views: number;
  plays: number;
  likes: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeckData {
  name: string;
  description?: string;
  notes?: string;
  cards: DeckCard[];
  format?: string;
  tags?: string[];
  isPublic?: boolean;
  createdBy: string;
}

export interface UpdateDeckData {
  name?: string;
  description?: string;
  notes?: string;
  cards?: DeckCard[];
  format?: string;
  tags?: string[];
  isPublic?: boolean;
  updatedBy: string;
}

export interface DeckFilters {
  search: string;
  format: string;
  tags: string[];
  minCards: string;
  maxCards: string;
  minValue: string;
  maxValue: string;
  cardType: string;
  sortBy: string;
  sortOrder: string;
}

interface DeckState {
  savedDecks: SavedDeck[];
  currentDeck: SavedDeck | null;
  loading: boolean;
  error: string | null;
  filters: DeckFilters;
  totalDecks: number;
  currentPage: number;
  hasMore: boolean;
}

const initialState: DeckState = {
  savedDecks: [],
  currentDeck: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    format: "",
    tags: [],
    minCards: "",
    maxCards: "",
    minValue: "",
    maxValue: "",
    cardType: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  totalDecks: 0,
  currentPage: 1,
  hasMore: true,
};

// Async thunks
export const createDeck = createAsyncThunk(
  "decks/createDeck",
  async (deckData: CreateDeckData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/decks`, deckData);
      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to create deck"
        );
      }
      return response.data.data;
    } catch (error: any) {
      console.error("Create deck error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create deck"
      );
    }
  }
);

export const fetchDecks = createAsyncThunk(
  "decks/fetchDecks",
  async (page: number = 1, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { decks: DeckState };
      const filters = state.decks.filters;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.format) params.append("format", filters.format);
      if (filters.tags.length > 0) {
        filters.tags.forEach((tag) => params.append("tags", tag));
      }
      if (filters.minCards) params.append("minCards", filters.minCards);
      if (filters.maxCards) params.append("maxCards", filters.maxCards);
      if (filters.minValue) params.append("minValue", filters.minValue);
      if (filters.maxValue) params.append("maxValue", filters.maxValue);
      if (filters.cardType) params.append("cardType", filters.cardType);

      const response = await axios.get(`${API_BASE_URL}/api/decks?${params}`);
      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch decks"
        );
      }
      return response.data;
    } catch (error: any) {
      console.error("Fetch decks error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch decks"
      );
    }
  }
);

export const fetchDeckById = createAsyncThunk(
  "decks/fetchDeckById",
  async (deckId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/decks/${deckId}`);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to fetch deck");
      }
      return response.data.data;
    } catch (error: any) {
      console.error("Fetch deck error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch deck"
      );
    }
  }
);

export const updateDeck = createAsyncThunk(
  "decks/updateDeck",
  async (
    { deckId, deckData }: { deckId: string; deckData: UpdateDeckData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/decks/${deckId}`,
        deckData
      );
      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to update deck"
        );
      }
      return response.data.data;
    } catch (error: any) {
      console.error("Update deck error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update deck"
      );
    }
  }
);

export const deleteDeck = createAsyncThunk(
  "decks/deleteDeck",
  async (
    { deckId, userId }: { deckId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/decks/${deckId}`,
        {
          data: { userId },
        }
      );
      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to delete deck"
        );
      }
      return deckId;
    } catch (error: any) {
      console.error("Delete deck error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete deck"
      );
    }
  }
);

export const addGameRecord = createAsyncThunk(
  "decks/addGameRecord",
  async (
    { deckId, gameData }: { deckId: string; gameData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/decks/${deckId}/games`,
        gameData
      );
      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to add game record"
        );
      }
      return response.data.data;
    } catch (error: any) {
      console.error("Add game record error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add game record"
      );
    }
  }
);

export const likeDeck = createAsyncThunk(
  "decks/likeDeck",
  async (
    { deckId, userId }: { deckId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/decks/${deckId}/like`,
        { userId }
      );
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to like deck");
      }
      return {
        deckId,
        likes: response.data.data.likes,
        isLiked: response.data.data.isLiked,
      };
    } catch (error: any) {
      console.error("Like deck error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to like deck"
      );
    }
  }
);

// Slice
const deckSlice = createSlice({
  name: "decks",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<DeckFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        format: "",
        tags: [],
        minCards: "",
        maxCards: "",
        minValue: "",
        maxValue: "",
        cardType: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setCurrentDeck: (state, action: PayloadAction<SavedDeck | null>) => {
      state.currentDeck = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.savedDecks = [];
      state.currentDeck = null;
      state.loading = false;
      state.error = null;
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create deck
      .addCase(createDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeck.fulfilled, (state, action) => {
        state.loading = false;
        state.savedDecks.unshift(action.payload);
        state.totalDecks += 1;
      })
      .addCase(createDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create deck";
      })

      // Fetch decks
      .addCase(fetchDecks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDecks.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          if (state.currentPage === 1) {
            state.savedDecks = action.payload.data;
          } else {
            state.savedDecks = [...state.savedDecks, ...action.payload.data];
          }
          state.totalDecks = action.payload.pagination?.totalItems || 0;
          state.hasMore = action.payload.pagination?.hasNextPage || false;
        }
      })
      .addCase(fetchDecks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch decks";
      })

      // Fetch deck by ID
      .addCase(fetchDeckById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeckById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDeck = action.payload;
      })
      .addCase(fetchDeckById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch deck";
      })

      // Update deck
      .addCase(updateDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeck.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.savedDecks.findIndex(
          (deck) => deck._id === action.payload._id
        );
        if (index !== -1) {
          state.savedDecks[index] = action.payload;
        }
        if (state.currentDeck?._id === action.payload._id) {
          state.currentDeck = action.payload;
        }
      })
      .addCase(updateDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update deck";
      })

      // Delete deck
      .addCase(deleteDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeck.fulfilled, (state, action) => {
        state.loading = false;
        state.savedDecks = state.savedDecks.filter(
          (deck) => deck._id !== action.payload
        );
        if (state.currentDeck?._id === action.payload) {
          state.currentDeck = null;
        }
        state.totalDecks = Math.max(0, state.totalDecks - 1);
      })
      .addCase(deleteDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete deck";
      })

      // Add game record
      .addCase(addGameRecord.fulfilled, (state, action) => {
        const index = state.savedDecks.findIndex(
          (deck) => deck._id === action.payload._id
        );
        if (index !== -1) {
          state.savedDecks[index] = action.payload;
        }
        if (state.currentDeck?._id === action.payload._id) {
          state.currentDeck = action.payload;
        }
      })

      // Like deck
      .addCase(likeDeck.fulfilled, (state, action) => {
        const { deckId, likes, isLiked } = action.payload;
        const deck = state.savedDecks.find((d) => d._id === deckId);
        if (deck) {
          deck.likes = likes;
        }
        if (state.currentDeck?._id === deckId) {
          state.currentDeck.likes = likes;
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  setCurrentDeck,
  clearError,
  resetState,
} = deckSlice.actions;

// Selectors
export const selectSavedDecks = (state: { decks: DeckState }) =>
  state.decks.savedDecks;
export const selectCurrentDeck = (state: { decks: DeckState }) =>
  state.decks.currentDeck;
export const selectDeckLoading = (state: { decks: DeckState }) =>
  state.decks.loading;
export const selectDeckError = (state: { decks: DeckState }) =>
  state.decks.error;
export const selectDeckFilters = (state: { decks: DeckState }) =>
  state.decks.filters;
export const selectTotalDecks = (state: { decks: DeckState }) =>
  state.decks.totalDecks;
export const selectCurrentPage = (state: { decks: DeckState }) =>
  state.decks.currentPage;
export const selectHasMore = (state: { decks: DeckState }) =>
  state.decks.hasMore;

export default deckSlice.reducer;
