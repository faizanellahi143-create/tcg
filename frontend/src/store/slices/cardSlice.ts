import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL - adjust this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Card interface matching the backend schema
export interface TcgCard {
  _id: string;
  tcgId: string;
  code: string;
  url: string;
  name: string;
  rarity: string;
  ap: string;
  type: string;
  bp: string;
  affinity: string;
  effect: string;
  trigger: string;
  images?: {
    small: string;
    large: string;
  };
  set?: {
    name: string;
  };
  needEnergy?: {
    value: string;
    logo: string;
  };
  description: string;
  imageUrl: string;
  cardNumber: string;
  createdAt: string;
  updatedAt: string;
  power?: number;
}

// Filter interface
export interface CardFilters {
  name: string;
  type: string;
  rarity: string;
  set: string;
  affinity: string;
  minBp: string;
  maxBp: string;
}

// Card state interface
interface CardState {
  cards: TcgCard[];
  filteredCards: TcgCard[];
  filters: CardFilters;
  loading: boolean;
  error: string | null;
  totalCards: number;
  currentPage: number;
  hasMore: boolean;
  searchQuery: string;
}

// Initial state
const initialState: CardState = {
  cards: [],
  filteredCards: [],
  filters: {
    name: "",
    type: "",
    rarity: "",
    set: "",
    affinity: "",
    minBp: "",
    maxBp: "",
  },
  loading: false,
  error: null,
  totalCards: 0,
  currentPage: 1,
  hasMore: true,
  searchQuery: "",
};

// Helper function to safely parse BP values
const safeParseBP = (bp: string): number => {
  if (!bp || bp === "-" || bp === "") return 0;
  const parsed = parseInt(bp);
  return isNaN(parsed) ? 0 : parsed;
};

// Async thunk for fetching cards
export const fetchCards = createAsyncThunk(
  "cards/fetchCards",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/cards?page=${page}&limit=50`
      );

      // Handle both success and error responses
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "API request failed");
      }

      return response.data;
    } catch (error: any) {
      console.error("Fetch cards error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cards"
      );
    }
  }
);

// Async thunk for searching cards by name
export const searchCardsByName = createAsyncThunk(
  "cards/searchCardsByName",
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/cards?name=${encodeURIComponent(name)}`
      );

      // Handle both success and error responses
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "API request failed");
      }

      return response.data;
    } catch (error: any) {
      console.error("Search cards error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to search cards"
      );
    }
  }
);

// Async thunk for fetching card statistics
export const fetchCardStats = createAsyncThunk(
  "cards/fetchCardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cards/sync/stats`);

      // Handle both success and error responses
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "API request failed");
      }

      return response.data;
    } catch (error: any) {
      console.error("Fetch stats error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch card statistics"
      );
    }
  }
);

// Card slice
const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    // Set filters
    setFilters: (state, action: PayloadAction<Partial<CardFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
      // Apply filters immediately after setting them
      cardSlice.caseReducers.applyFilters(state);
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filters = {
        name: "",
        type: "",
        rarity: "",
        set: "",
        affinity: "",
        minBp: "",
        maxBp: "",
      };
      state.currentPage = 1;
      // Apply filters immediately after clearing them
      cardSlice.caseReducers.applyFilters(state);
    },

    // Set search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      // Apply filters immediately after setting search query
      cardSlice.caseReducers.applyFilters(state);
    },

    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Apply filters to cards (frontend-only filtering)
    applyFilters: (state) => {
      let filtered = [...state.cards];

      // Filter by name (search query)
      if (state.searchQuery.trim()) {
        const searchLower = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (card) =>
            card.name.toLowerCase().includes(searchLower) ||
            (card.effect && card.effect.toLowerCase().includes(searchLower)) ||
            (card.description &&
              card.description.toLowerCase().includes(searchLower)) ||
            (card.code && card.code.toLowerCase().includes(searchLower))
        );
      }

      // Filter by type
      if (state.filters.type) {
        filtered = filtered.filter((card) => card.type === state.filters.type);
      }

      // Filter by rarity
      if (state.filters.rarity) {
        filtered = filtered.filter(
          (card) => card.rarity === state.filters.rarity
        );
      }

      // Filter by set
      if (state.filters.set) {
        filtered = filtered.filter(
          (card) => card.set?.name === state.filters.set
        );
      }

      // Filter by affinity
      if (state.filters.affinity) {
        filtered = filtered.filter(
          (card) => card.affinity === state.filters.affinity
        );
      }

      // Filter by BP range
      if (state.filters.minBp || state.filters.maxBp) {
        filtered = filtered.filter((card) => {
          const bp = safeParseBP(card.bp);
          if (bp === 0) return false;

          if (state.filters.minBp && bp < parseInt(state.filters.minBp))
            return false;
          if (state.filters.maxBp && bp > parseInt(state.filters.maxBp))
            return false;

          return true;
        });
      }

      state.filteredCards = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cards
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          // If it's the first page, replace cards
          if (state.currentPage === 1) {
            state.cards = action.payload.data;
          } else {
            // Otherwise, append to existing cards
            state.cards = [...state.cards, ...action.payload.data];
          }

          // Use pagination.total if available, otherwise fallback to data length
          const totalCount =
            action.payload.pagination?.total || action.payload.data.length;
          state.totalCards = totalCount;

          // Check if there are more pages (assuming 50 is the page size)
          const currentPageSize = action.payload.data.length;
          state.hasMore =
            currentPageSize === 50 && state.cards.length < totalCount;
        }
        // Apply filters after updating cards
        cardSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch cards";
      })

      // Search cards by name
      .addCase(searchCardsByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCardsByName.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          state.cards = action.payload.data;
          state.totalCards = action.payload.data.length;
          state.hasMore = false; // Search results don't have pagination
        }
        // Apply filters after updating cards
        cardSlice.caseReducers.applyFilters(state);
      })
      .addCase(searchCardsByName.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to search cards";
      })

      // Fetch card stats
      .addCase(fetchCardStats.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.totalCards = action.payload.data.totalCards || 0;
        }
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setSearchQuery,
  setCurrentPage,
  clearError,
  applyFilters,
} = cardSlice.actions;

// Export selectors
export const selectCards = (state: { cards: CardState }) => state.cards.cards;
export const selectFilteredCards = (state: { cards: CardState }) =>
  state.cards.filteredCards;
export const selectFilters = (state: { cards: CardState }) =>
  state.cards.filters;
export const selectLoading = (state: { cards: CardState }) =>
  state.cards.loading;
export const selectError = (state: { cards: CardState }) => state.cards.error;
export const selectTotalCards = (state: { cards: CardState }) =>
  state.cards.totalCards;
export const selectCurrentPage = (state: { cards: CardState }) =>
  state.cards.currentPage;
export const selectHasMore = (state: { cards: CardState }) =>
  state.cards.hasMore;
export const selectSearchQuery = (state: { cards: CardState }) =>
  state.cards.searchQuery;

// Export reducer
export default cardSlice.reducer;
