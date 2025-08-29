# 🎴 Dynamic Cards System - Implementation Guide

## Overview

The TCG Bot Simulator now features a dynamic card system that fetches real-time card data from the Union Arena TCG API and displays it in a modern, interactive Library interface. This system replaces the static mock data with live, searchable card information.

## 🏗️ Architecture

### Frontend (React + TypeScript + Redux Toolkit)

- **Redux Store**: Centralized state management for cards
- **Library Component**: Separate, dedicated component for card browsing
- **Dynamic Filtering**: Real-time search and filter capabilities
- **Pagination**: Efficient loading of large card collections

### Backend (Node.js + Express + MongoDB)

- **TCG API Integration**: Fetches cards from Union Arena TCG API
- **Card Sync Service**: Automated synchronization of card data
- **MongoDB Storage**: Persistent storage of card information
- **RESTful API**: Clean endpoints for frontend consumption

## 🚀 Features

### ✨ Dynamic Card Loading

- **Real-time API Integration**: Cards fetched from Union Arena TCG API
- **Automatic Pagination**: Loads cards in batches for performance
- **Smart Caching**: Redux store caches fetched cards
- **Error Handling**: Graceful fallbacks for API failures

### 🔍 Advanced Search & Filtering

- **Text Search**: Search by card name or effect text
- **Type Filtering**: Filter by card type (Character, Event, etc.)
- **Rarity Filtering**: Filter by card rarity (C, R, SR, UR, etc.)
- **Set Filtering**: Filter by card set (HUNTER X HUNTER, BLEACH, etc.)
- **Affinity Filtering**: Filter by energy affinity
- **BP Range Filtering**: Filter by Battle Points range

### 🎯 User Experience

- **Responsive Design**: Works on all device sizes
- **Loading States**: Clear feedback during API calls
- **Active Filter Display**: Shows currently applied filters
- **Filter Reset**: Easy clearing of all filters
- **Card Details Modal**: Rich card information display

## 📁 File Structure

```
frontend/
├── src/
│   ├── store/                    # Redux store configuration
│   │   ├── index.ts             # Store setup and configuration
│   │   ├── hooks.ts             # Typed Redux hooks
│   │   └── slices/
│   │       └── cardSlice.ts     # Card state management
│   ├── components/
│   │   ├── Library.tsx          # Main Library component
│   │   └── TcgCardDetailModal.tsx # Card detail modal
│   └── types/
│       └── card.ts              # Card type definitions

backend/
├── src/
│   ├── services/
│   │   ├── tcgApiService.js     # TCG API integration
│   │   └── cardSyncService.js   # Card synchronization
│   ├── models/
│   │   └── Card.js              # MongoDB card schema
│   └── routes/
│       └── cards.js             # Card API endpoints
├── scripts/
│   └── syncCards.js             # CLI card sync tool
└── .env                          # Environment configuration
```

## 🔧 Setup Instructions

### Backend Setup

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**

   ```bash
   ./setup-env.sh
   # Edit .env with your MongoDB Atlas connection string
   # Add your TCG API key
   ```

3. **Sync Cards**

   ```bash
   # Test sync (dry run)
   npm run sync:cards:test

   # Full sync
   npm run sync:cards
   ```

4. **Start Backend**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**

   ```bash
   ./setup-env.sh
   # Verify API URL points to your backend
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

## 🎮 Usage

### Library Tab

1. **Navigate** to the Library tab in the main interface
2. **Search** for cards using the search bar
3. **Apply Filters** using the advanced filter panel
4. **Browse Cards** in the responsive grid layout
5. **View Details** by clicking on any card
6. **Add to Deck** using the quantity controls

### Card Management

- **Search**: Real-time search with debouncing
- **Filter**: Multiple filter criteria simultaneously
- **Sort**: Cards automatically sorted by relevance
- **Pagination**: Load more cards as needed
- **Details**: Rich card information display

## 🔌 API Endpoints

### Card Endpoints

- `GET /api/cards` - Fetch cards with pagination
- `GET /api/cards?name=query` - Search cards by name
- `GET /api/cards/sync/stats` - Get card statistics
- `GET /api/cards/sync/test` - Test TCG API connection

### Sync Endpoints

- `POST /api/cards/sync` - Trigger card synchronization
- `GET /api/cards/sync/stats` - Get sync statistics

## 📊 Data Flow

1. **User Interaction** → Library component
2. **Redux Action** → Dispatch search/filter actions
3. **API Call** → Backend fetches from TCG API
4. **Data Processing** → Transform and store in Redux
5. **UI Update** → Re-render with new data
6. **User Feedback** → Loading states and error handling

## 🎨 UI Components

### Library Component

- **Header**: Title, description, and control buttons
- **Search Bar**: Real-time search with debouncing
- **Filter Panel**: Collapsible advanced filters
- **Card Grid**: Responsive card display
- **Pagination**: Load more functionality
- **Active Filters**: Visual filter indicators

### TcgCardDetailModal

- **Card Image**: High-resolution card display
- **Basic Info**: Type, rarity, AP, BP, affinity
- **Effect Text**: Full card effect description
- **Trigger Effects**: Special trigger conditions
- **Deck Controls**: Add/remove from deck
- **External Links**: TCG website and resources

## 🔒 Security Features

- **API Key Management**: Secure TCG API authentication
- **Rate Limiting**: Respectful API usage
- **Error Handling**: Graceful failure management
- **Input Validation**: Sanitized user inputs
- **Environment Variables**: Secure configuration

## 🚨 Error Handling

### Frontend Errors

- **Network Failures**: Clear error messages
- **API Errors**: User-friendly error display
- **Loading States**: Visual feedback during operations
- **Fallback UI**: Graceful degradation

### Backend Errors

- **API Timeouts**: Configurable timeout handling
- **Rate Limiting**: Automatic retry with backoff
- **Data Validation**: Schema validation and sanitization
- **Logging**: Comprehensive error logging

## 📈 Performance Optimizations

- **Debounced Search**: Prevents excessive API calls
- **Pagination**: Loads cards in manageable batches
- **Redux Caching**: Avoids redundant API calls
- **Image Optimization**: Efficient image loading
- **Lazy Loading**: Load components as needed

## 🔄 State Management

### Redux Store Structure

```typescript
interface CardState {
  cards: TcgCard[]; // All fetched cards
  filteredCards: TcgCard[]; // Currently displayed cards
  filters: CardFilters; // Active filter criteria
  loading: boolean; // Loading state
  error: string | null; // Error messages
  totalCards: number; // Total card count
  currentPage: number; // Current page
  hasMore: boolean; // More cards available
  searchQuery: string; // Current search query
}
```

### Key Actions

- `fetchCards` - Load cards from API
- `searchCardsByName` - Search specific cards
- `setFilters` - Apply filter criteria
- `clearFilters` - Reset all filters
- `setSearchQuery` - Update search term

## 🧪 Testing

### Backend Testing

```bash
# Test API connectivity
npm run sync:cards:test

# Test specific card search
node scripts/syncCards.js --name "Gon" --dry-run

# Test full sync
node scripts/syncCards.js --dry-run --stats
```

### Frontend Testing

- **Component Testing**: Test Library component
- **Redux Testing**: Test card slice actions
- **Integration Testing**: Test API integration
- **E2E Testing**: Test complete user flows

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**: Configure production environment
2. **Database**: Ensure MongoDB Atlas connection
3. **API Keys**: Set production TCG API key
4. **Monitoring**: Set up logging and monitoring

### Frontend Deployment

1. **Build**: Create production build
2. **Environment**: Set production API URL
3. **CDN**: Deploy to CDN for performance
4. **Monitoring**: Set up error tracking

## 🔮 Future Enhancements

### Planned Features

- **Card Collections**: User card collections
- **Deck Building**: Enhanced deck construction
- **Card Analytics**: Usage statistics and trends
- **Social Features**: Card sharing and discussion
- **Mobile App**: Native mobile application

### Technical Improvements

- **GraphQL**: More efficient data fetching
- **WebSockets**: Real-time updates
- **Service Workers**: Offline functionality
- **Performance**: Advanced caching strategies

## 📚 Additional Resources

- **TCG API Documentation**: [https://apitcg.com/docs](https://apitcg.com/docs)
- **Redux Toolkit**: [https://redux-toolkit.js.org](https://redux-toolkit.js.org)
- **React DnD**: [https://react-dnd.github.io](https://react-dnd.github.io)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy card building! 🎴✨**

