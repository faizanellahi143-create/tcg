import { configureStore } from "@reduxjs/toolkit";
import cardReducer from "./slices/cardSlice";
import deckReducer from "./slices/deckSlice";

export const store = configureStore({
  reducer: {
    cards: cardReducer,
    decks: deckReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["cards/fetchCards/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.createdAt", "payload.updatedAt"],
        // Ignore these paths in the state
        ignoredPaths: ["cards.cards"],
      },
      // Add error handling middleware
      immutableCheck: {
        warnAfter: 128,
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
