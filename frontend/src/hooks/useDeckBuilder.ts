import React from 'react';
import { useState, useMemo } from 'react';
import { GundamCard, DeckCard, User, DeckVersion, Deck, AIComparisonResult, GameRecord } from '../types/card';
import { mockCards } from '../data/mockCards';

interface FilterState {
  search: string;
  colors: string[];
  types: string[];
  rarity: string[];
  cost: string;
  sets: string[];
}

interface DeckFilterState {
  search: string;
  colors: string[];
  tags: string[];
  minCards: string;
  maxCards: string;
  minValue: string;
  maxValue: string;
  sortBy: string;
}

export const useDeckBuilder = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    colors: [],
    types: [],
    rarity: [],
    cost: '',
    sets: []
  });

  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<GundamCard | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [userCollection, setUserCollection] = useState<GundamCard[]>([]);
  const [userWishlist, setUserWishlist] = useState<GundamCard[]>([]);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [savedDecks, setSavedDecks] = useState<Deck[]>([]);
  const [aiComparisonResults, setAiComparisonResults] = useState<AIComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSavedDeckForView, setSelectedSavedDeckForView] = useState<Deck | null>(null);
  const [selectedDeckForAIAnalysis, setSelectedDeckForAIAnalysis] = useState<Deck | null>(null);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionNotes, setVersionNotes] = useState('');
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [publicDecks, setPublicDecks] = useState<Deck[]>([]);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [userFollowing, setUserFollowing] = useState<Set<string>>(new Set());

  const [deckFilters, setDeckFilters] = useState<DeckFilterState>({
    search: '',
    colors: [],
    tags: [],
    minCards: '',
    maxCards: '',
    minValue: '',
    maxValue: '',
    sortBy: 'name-asc'
  });

  // Initialize with demo decks for testing
  const createDemoDecks = () => {
    const demoDeck1: Deck = {
      id: 'demo-deck-1',
      name: 'Blue Control Mastery',
      description: 'A control-focused deck built around the legendary RX-78-2 Gundam and Amuro Ray synergy.',
      notes: 'Focus on card advantage and late-game dominance. Use Federation Bases for defense.',
      cards: [
        { ...mockCards.find(c => c.id === 'GD01-001')!, quantity: 3 }, // RX-78-2 Gundam
        { ...mockCards.find(c => c.id === 'ST-01-012')!, quantity: 4 }, // Amuro Ray
        { ...mockCards.find(c => c.id === 'GD01-011')!, quantity: 2 }, // Nu Gundam
        { ...mockCards.find(c => c.id === 'ST-02-009')!, quantity: 3 }, // Wing Zero
        { ...mockCards.find(c => c.id === 'ST-01-004')!, quantity: 4 }, // Federation Base
        { ...mockCards.find(c => c.id === 'ST-01-005')!, quantity: 4 }, // Beam Saber Strike
        { ...mockCards.find(c => c.id === 'ST-03-002')!, quantity: 4 }, // Zaku II (for early game)
        { ...mockCards.find(c => c.id === 'ST-04-007')!, quantity: 3 }, // Strike Freedom
        { ...mockCards.find(c => c.id === 'ST-07-016')!, quantity: 2 }, // Gundam Exia
        { ...mockCards.find(c => c.id === 'GD02-015')!, quantity: 2 }, // Gundam X
        { ...mockCards.find(c => c.id === 'ST-03-010')!, quantity: 4 }, // Gouf Custom
        { ...mockCards.find(c => c.id === 'ST-05-008')!, quantity: 3 }, // Barbatos
        { ...mockCards.find(c => c.id === 'ST-05-013')!, quantity: 2 }, // Mikazuki Augus
        { ...mockCards.find(c => c.id === 'ST-06-014')!, quantity: 3 }, // GQuuuuuuX
        { ...mockCards.find(c => c.id === 'ST-03-003')!, quantity: 3 }, // Char Aznable
        { ...mockCards.find(c => c.id === 'ST-03-006')!, quantity: 2 }, // Sazabi
        { ...mockCards.find(c => c.id === 'GD01-001')!, quantity: 4 } // RX-78-2 Gundam [Promo]
      ].filter(card => card).slice(0, 16), // Ensure we have valid cards and reasonable deck size
      totalCards: 50,
      colors: ['Blue', 'White'],
      isPublic: true,
      marketValue: 245.50,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
      author: 'DemoUser',
      tags: ['Control', 'Blue', 'Competitive', 'Federation'],
      wins: 12,
      losses: 3,
      versions: [],
      gameHistory: [],
      likes: 24,
      comments: 8,
      featured: true,
      allowComments: true,
      allowForks: true
    };

    const demoDeck2: Deck = {
      id: 'demo-deck-2',
      name: 'Red Zeon Aggro Rush',
      description: 'Fast-paced aggressive deck featuring Char Aznable and powerful Zeon mobile suits.',
      notes: 'Mulligan for low-cost units. Apply early pressure and finish with Sazabi.',
      cards: [
        { ...mockCards.find(c => c.id === 'ST-03-003')!, quantity: 4 }, // Char Aznable
        { ...mockCards.find(c => c.id === 'ST-03-006')!, quantity: 3 }, // Sazabi
        { ...mockCards.find(c => c.id === 'ST-03-002')!, quantity: 4 }, // Zaku II
        { ...mockCards.find(c => c.id === 'ST-03-010')!, quantity: 4 }, // Gouf Custom
        { ...mockCards.find(c => c.id === 'ST-05-008')!, quantity: 4 }, // Barbatos
        { ...mockCards.find(c => c.id === 'ST-05-013')!, quantity: 3 }, // Mikazuki Augus
        { ...mockCards.find(c => c.id === 'ST-06-014')!, quantity: 4 }, // GQuuuuuuX
        { ...mockCards.find(c => c.id === 'ST-01-005')!, quantity: 4 }, // Beam Saber Strike
        { ...mockCards.find(c => c.id === 'ST-01-004')!, quantity: 3 }, // Federation Base
        { ...mockCards.find(c => c.id === 'GD01-001')!, quantity: 2 }, // RX-78-2 Gundam
        { ...mockCards.find(c => c.id === 'ST-01-012')!, quantity: 2 }, // Amuro Ray
        { ...mockCards.find(c => c.id === 'ST-04-007')!, quantity: 2 }, // Strike Freedom
        { ...mockCards.find(c => c.id === 'ST-07-016')!, quantity: 3 }, // Gundam Exia
        { ...mockCards.find(c => c.id === 'GD02-015')!, quantity: 2 }, // Gundam X
        { ...mockCards.find(c => c.id === 'ST-02-009')!, quantity: 2 }, // Wing Zero
        { ...mockCards.find(c => c.id === 'GD01-011')!, quantity: 2 } // Nu Gundam
      ].filter(card => card).slice(0, 16), // Ensure we have valid cards and reasonable deck size
      totalCards: 50,
      colors: ['Red', 'Purple'],
      isPublic: true,
      marketValue: 189.75,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-12'),
      author: 'DemoUser',
      tags: ['Aggro', 'Red', 'Zeon', 'Fast', 'Iron-Blooded'],
      wins: 8,
      losses: 7,
      versions: [],
      gameHistory: [],
      likes: 15,
      comments: 5,
      trending: true,
      allowComments: true,
      allowForks: true
    };

    return [demoDeck1, demoDeck2];
  };

  const filteredCards = useMemo(() => {
    return mockCards.filter(card => {
      // Search filter
      if (filters.search && !card.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !card.id.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Color filter
      if (filters.colors.length > 0) {
        if (!filters.colors.some(color => card.colors.includes(color as any))) {
          return false;
        }
      }

      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(card.type)) {
        return false;
      }

      // Rarity filter
      if (filters.rarity.length > 0 && !filters.rarity.includes(card.rarity)) {
        return false;
      }

      // Cost filter
      if (filters.cost) {
        if (filters.cost === '6' && card.cost < 6) return false;
        if (filters.cost !== '6' && card.cost !== parseInt(filters.cost)) return false;
      }

      // Set filter
      if (filters.sets.length > 0 && !filters.sets.includes(card.set)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const deckQuantities = useMemo(() => {
    return deck.reduce((acc, card) => {
      acc[card.id] = card.quantity;
      return acc;
    }, {} as Record<string, number>);
  }, [deck]);

  const filteredAndSortedDecks = useMemo(() => {
    let filtered = savedDecks.filter(deck => {
      // Search filter
      if (deckFilters.search) {
        const searchLower = deckFilters.search.toLowerCase();
        if (!deck.name.toLowerCase().includes(searchLower) &&
            !deck.description?.toLowerCase().includes(searchLower) &&
            !deck.author.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Colors filter
      if (deckFilters.colors.length > 0) {
        if (!deckFilters.colors.some(color => deck.colors.includes(color))) {
          return false;
        }
      }

      // Tags filter
      if (deckFilters.tags.length > 0) {
        if (!deckFilters.tags.some(tag => deck.tags.includes(tag))) {
          return false;
        }
      }

      // Card count filters
      if (deckFilters.minCards && deck.totalCards < parseInt(deckFilters.minCards)) {
        return false;
      }
      if (deckFilters.maxCards && deck.totalCards > parseInt(deckFilters.maxCards)) {
        return false;
      }

      // Market value filters
      if (deckFilters.minValue && deck.marketValue < parseFloat(deckFilters.minValue)) {
        return false;
      }
      if (deckFilters.maxValue && deck.marketValue > parseFloat(deckFilters.maxValue)) {
        return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (deckFilters.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'value-high':
          return b.marketValue - a.marketValue;
        case 'value-low':
          return a.marketValue - b.marketValue;
        case 'cards-high':
          return b.totalCards - a.totalCards;
        case 'cards-low':
          return a.totalCards - b.totalCards;
        case 'winrate-high':
          const aWinRate = a.wins + a.losses > 0 ? a.wins / (a.wins + a.losses) : 0;
          const bWinRate = b.wins + b.losses > 0 ? b.wins / (b.wins + b.losses) : 0;
          return bWinRate - aWinRate;
        case 'winrate-low':
          const aWinRateLow = a.wins + a.losses > 0 ? a.wins / (a.wins + a.losses) : 0;
          const bWinRateLow = b.wins + b.losses > 0 ? b.wins / (b.wins + b.losses) : 0;
          return aWinRateLow - bWinRateLow;
        default:
          return 0;
      }
    });

    return filtered;
  }, [savedDecks, deckFilters]);

  const addToCollection = (card: GundamCard) => {
    setUserCollection(prev => [...prev, card]);
  };

  const removeFromCollection = (card: GundamCard) => {
    setUserCollection(prev => {
      const index = prev.findIndex(c => c.id === card.id);
      if (index > -1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  };

  const addToWishlist = (card: GundamCard) => {
    setUserWishlist(prev => {
      if (!prev.find(c => c.id === card.id)) {
        return [...prev, card];
      }
      return prev;
    });
  };

  const removeFromWishlist = (card: GundamCard) => {
    setUserWishlist(prev => prev.filter(c => c.id !== card.id));
  };

  const addToDeck = (card: GundamCard) => {
    setDeck(prevDeck => {
      const existingCard = prevDeck.find(deckCard => deckCard.id === card.id);
      
      if (existingCard) {
        if (existingCard.quantity >= 4) return prevDeck; // Max 4 copies
        return prevDeck.map(deckCard =>
          deckCard.id === card.id
            ? { ...deckCard, quantity: deckCard.quantity + 1 }
            : deckCard
        );
      } else {
        return [...prevDeck, { ...card, quantity: 1 }];
      }
    });
  };

  const removeFromDeck = (card: GundamCard) => {
    setDeck(prevDeck => {
      const existingCard = prevDeck.find(deckCard => deckCard.id === card.id);
      
      if (!existingCard) return prevDeck;
      
      if (existingCard.quantity <= 1) {
        return prevDeck.filter(deckCard => deckCard.id !== card.id);
      } else {
        return prevDeck.map(deckCard =>
          deckCard.id === card.id
            ? { ...deckCard, quantity: deckCard.quantity - 1 }
            : deckCard
        );
      }
    });
  };

  const saveDeck = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Check if we're updating an existing deck or creating a new one
    const existingDeckIndex = savedDecks.findIndex(d => d.name === `Current Deck - ${user.username}`);
    const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);
    const marketValue = deck.reduce((sum, card) => sum + (card.marketPrice || 0) * card.quantity, 0);
    const colors = [...new Set(deck.flatMap(card => card.colors))];
    
    if (existingDeckIndex >= 0) {
      // Updating existing deck - create new version
      setShowVersionModal(true);
    } else {
      // Creating new deck
      const deckData: Deck = {
        id: Date.now().toString(),
        name: `Current Deck - ${user.username}`,
        description: 'Auto-saved deck from deck builder',
        notes: '',
        cards: deck,
        totalCards,
        colors,
        isPublic: false,
        marketValue,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: user.username,
        tags: [],
        wins: 0,
        losses: 0,
        gameHistory: [],
        gameHistory: [],
        versions: [{
          id: `v1-${Date.now()}`,
          version: 1,
          name: 'Initial Version',
          cards: deck,
          createdAt: new Date(),
          notes: 'Initial deck creation',
          totalCards,
          marketValue
        }]
      };
      
      setSavedDecks(prev => [...prev, deckData]);
      
      // Also save to localStorage
      const updatedDecks = [...savedDecks, deckData];
      localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
      
      alert('Deck saved successfully!');
    }
  };

  const saveNewVersion = () => {
    if (!user) return;
    
    const existingDeckIndex = savedDecks.findIndex(d => d.name === `Current Deck - ${user.username}`);
    if (existingDeckIndex >= 0) {
      const existingDeck = savedDecks[existingDeckIndex];
      const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);
      const marketValue = deck.reduce((sum, card) => sum + (card.marketPrice || 0) * card.quantity, 0);
      const colors = [...new Set(deck.flatMap(card => card.colors))];
      
      const newVersion: DeckVersion = {
        id: `v${existingDeck.versions.length + 1}-${Date.now()}`,
        version: existingDeck.versions.length + 1,
        name: `Version ${existingDeck.versions.length + 1}`,
        cards: [...deck],
        createdAt: new Date(),
        notes: versionNotes || 'Updated deck',
        totalCards,
        marketValue
      };
      
      const updatedDeck: Deck = {
        ...existingDeck,
        cards: deck,
        totalCards,
        colors,
        marketValue,
        updatedAt: new Date(),
        versions: [...existingDeck.versions, newVersion]
      };
      
      const updatedDecks = [...savedDecks];
      updatedDecks[existingDeckIndex] = updatedDeck;
      setSavedDecks(updatedDecks);
      
      // Save to localStorage
      localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
      
      setShowVersionModal(false);
      setVersionNotes('');
      alert(`New version saved: ${newVersion.name}`);
    }
  };

  const revertDeckToVersion = (deckId: string, versionId: string) => {
    const targetDeck = savedDecks.find(d => d.id === deckId);
    if (!targetDeck) return;
    
    const targetVersion = targetDeck.versions.find(v => v.id === versionId);
    if (!targetVersion) return;
    
    if (confirm(`Revert to ${targetVersion.name}? This will replace your current deck in the builder.`)) {
      setDeck(targetVersion.cards);
      alert(`Reverted to ${targetVersion.name}`);
    }
  };

  const deleteVersion = (deckId: string, versionId: string) => {
    const deckIndex = savedDecks.findIndex(d => d.id === deckId);
    if (deckIndex === -1) return;
    
    const deck = savedDecks[deckIndex];
    const versionToDelete = deck.versions.find(v => v.id === versionId);
    
    if (!versionToDelete) return;
    
    if (deck.versions.length <= 1) {
      alert('Cannot delete the only version of a deck.');
      return;
    }
    
    if (confirm(`Delete ${versionToDelete.name}? This action cannot be undone.`)) {
      const updatedVersions = deck.versions.filter(v => v.id !== versionId);
      const updatedDeck = { ...deck, versions: updatedVersions };
      
      const updatedDecks = [...savedDecks];
      updatedDecks[deckIndex] = updatedDeck;
      setSavedDecks(updatedDecks);
      
      localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
      alert(`Deleted ${versionToDelete.name}`);
    }
  };

  const exportDeck = () => {
    setShowExportModal(true);
  };

  const importDeck = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          // Simple deck import logic - would need more sophisticated parsing
          console.log('Importing deck:', content);
          alert('Deck import feature coming soon!');
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  const login = (email: string, password: string) => {
    // Mock login - would be real authentication in production
    const mockUser: User = {
      id: '1',
      username: email.split('@')[0],
      email,
      isLoggedIn: true,
      decks: [],
      preferences: {
        emailMarketing: false,
        emailStrategy: true
      }
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = (email: string, password: string, username: string, preferences: any) => {
    // Mock signup - would be real authentication in production
    const mockUser: User = {
      id: Date.now().toString(),
      username,
      email,
      isLoggedIn: true,
      decks: [],
      collection: [],
      wishlist: [],
      preferences
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const compareDecksWithAI = async (deck1Id: string, deck2Id: string) => {
    setIsAnalyzing(true);
    
    // Find the decks
    const deck1 = savedDecks.find(d => d.id === deck1Id);
    const deck2 = savedDecks.find(d => d.id === deck2Id);
    
    if (!deck1 || !deck2) {
      setIsAnalyzing(false);
      return;
    }

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock AI analysis
    const winProbability = Math.floor(Math.random() * 31) + 40; // 40-70%
    const predictedWins = Math.round(winProbability / 10);

    const mockAnalysis: AIComparisonResult = {
      deck1Name: deck1.name,
      deck2Name: deck2.name,
      winProbability,
      predictedWins,
      overallSummary: `Based on comprehensive analysis of both deck compositions, ${deck1.name} shows a ${winProbability}% probability of victory against ${deck2.name}. This matchup is determined by key factors including card synergies, mana curve efficiency, and strategic flexibility. The analysis considers unit distribution, command card effectiveness, and potential opening hand scenarios.`,
      deck1Strengths: [
        "Strong early game presence with efficient low-cost units",
        "Excellent card synergy between pilot and unit combinations",
        "Balanced mana curve allowing consistent plays each turn",
        "Multiple win conditions providing strategic flexibility"
      ],
      deck1Weaknesses: [
        "Vulnerable to aggressive rush strategies",
        "Limited late-game recovery options",
        "Dependent on specific card combinations for optimal performance"
      ],
      deck2Strengths: [
        "Powerful late-game units with high impact abilities",
        "Strong defensive capabilities and board control",
        "Consistent card draw and resource management",
        "Effective removal and disruption options"
      ],
      deck2Weaknesses: [
        "Slower setup time leaves early game vulnerable",
        "Higher mana curve may lead to inconsistent opening hands",
        "Limited early game interaction and tempo plays"
      ],
      strategicRecommendations: [
        "Focus on aggressive mulligan strategy to secure optimal opening hands",
        "Prioritize early board presence to establish tempo advantage",
        "Maintain card advantage through efficient trades and resource management",
        "Identify key timing windows for deploying high-impact combinations",
        "Adapt playstyle based on opponent's early game development",
        "Consider sideboard options for improved matchup coverage",
        "Practice optimal sequencing of plays to maximize synergy effects"
      ],
      alternativeCards: {
        deck1: [
          "Consider adding more early game removal to handle aggressive starts",
          "Include additional card draw engines for sustained pressure",
          "Add flexible utility cards that work in multiple scenarios"
        ],
        deck2: [
          "Include more early game defensive options and cheap units",
          "Add ramp or acceleration effects to reach late game faster",
          "Consider more versatile mid-range threats for tempo plays"
        ]
      },
      keyMatchupFactors: [
        "Opening hand quality and mulligan decisions",
        "Early game board development and tempo control",
        "Resource management and card advantage",
        "Timing of key combo pieces and synergies",
        "Adaptation to opponent's strategy and counter-play",
        "Late game threat density and closing power"
      ]
    };

    setAiComparisonResults(mockAnalysis);
    setIsAnalyzing(false);
  };

  const loadSavedDeck = (deckId: string) => {
    const savedDeck = savedDecks.find(d => d.id === deckId);
    if (savedDeck) {
      setDeck(savedDeck.cards);
      alert(`Loaded deck: ${savedDeck.name}`);
    }
  };

  const deleteSavedDeck = (deckId: string) => {
    const deckToDelete = savedDecks.find(d => d.id === deckId);
    if (deckToDelete && confirm(`Are you sure you want to delete "${deckToDelete.name}"?`)) {
      const updatedDecks = savedDecks.filter(d => d.id !== deckId);
      setSavedDecks(updatedDecks);
      localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
      alert(`Deleted deck: ${deckToDelete.name}`);
    }
  };

  const handleShareDeckSubmit = (deckData: {
    name: string;
    description: string;
    notes: string;
    tags: string[];
    isPublic: boolean;
    allowComments: boolean;
    allowForks: boolean;
  }) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);
    const marketValue = deck.reduce((sum, card) => sum + (card.marketPrice || 0) * card.quantity, 0);
    const colors = [...new Set(deck.flatMap(card => card.colors))];

    const newDeck: Deck = {
      id: Date.now().toString(),
      name: deckData.name,
      description: deckData.description,
      notes: deckData.notes,
      cards: [...deck],
      totalCards,
      colors,
      isPublic: deckData.isPublic,
      marketValue,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: user.username,
      tags: deckData.tags,
      wins: 0,
      losses: 0,
      versions: [],
      likes: 0,
      comments: 0,
      allowComments: deckData.allowComments,
      allowForks: deckData.allowForks
    };

    // Add to saved decks
    const updatedSavedDecks = [...savedDecks, newDeck];
    setSavedDecks(updatedSavedDecks);
    localStorage.setItem('savedDecks', JSON.stringify(updatedSavedDecks));

    // Add to public decks if public
    if (deckData.isPublic) {
      const updatedPublicDecks = [...publicDecks, newDeck];
      setPublicDecks(updatedPublicDecks);
      localStorage.setItem('publicDecks', JSON.stringify(updatedPublicDecks));
    }

    alert(`Deck ${deckData.isPublic ? 'shared publicly' : 'saved privately'}: ${deckData.name}`);
  };

  const likeDeck = (deckId: string) => {
    setUserLikes(prev => {
      const newLikes = new Set(prev);
      if (newLikes.has(deckId)) {
        newLikes.delete(deckId);
      } else {
        newLikes.add(deckId);
      }
      return newLikes;
    });
  };

  const followUser = (username: string) => {
    setUserFollowing(prev => {
      const newFollowing = new Set(prev);
      if (newFollowing.has(username)) {
        newFollowing.delete(username);
      } else {
        newFollowing.add(username);
      }
      return newFollowing;
    });
  };

  const loadPublicDeck = (deckId: string) => {
    const publicDeck = publicDecks.find(d => d.id === deckId);
    if (publicDeck) {
      setDeck(publicDeck.cards);
      alert(`Loaded public deck: ${publicDeck.name}`);
    }
  };

  const addGameRecordToDeck = (deckId: string, gameRecord: GameRecord) => {
    const deckIndex = savedDecks.findIndex(d => d.id === deckId);
    if (deckIndex === -1) return;

    const updatedDeck = { ...savedDecks[deckIndex] };
    
    // Add the game record to the deck's history
    updatedDeck.gameHistory = updatedDeck.gameHistory || [];
    updatedDeck.gameHistory.push(gameRecord);
    
    // Update wins/losses
    if (gameRecord.result === 'win') {
      updatedDeck.wins = (updatedDeck.wins || 0) + 1;
    } else if (gameRecord.result === 'loss') {
      updatedDeck.losses = (updatedDeck.losses || 0) + 1;
    }
    
    // Update the deck in the array
    const updatedDecks = [...savedDecks];
    updatedDecks[deckIndex] = updatedDeck;
    setSavedDecks(updatedDecks);
    
    // Persist to localStorage
    localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
  };

  const createTopBuilders = () => {
    return [
      { username: 'GundamMaster', totalDecks: 45, followers: 1250, avgLikes: 23.5 },
      { username: 'ZeonCommander', totalDecks: 38, followers: 980, avgLikes: 19.2 },
      { username: 'FederationAce', totalDecks: 52, followers: 1100, avgLikes: 21.8 },
      { username: 'WingPilot', totalDecks: 29, followers: 750, avgLikes: 18.4 },
      { username: 'IronBloodedOrphan', totalDecks: 33, followers: 890, avgLikes: 20.1 }
    ];
  };

  // Load user from localStorage on mount
  React.useEffect(() => {
    // Initialize with demo decks if no saved decks exist
    const savedDecksData = localStorage.getItem('savedDecks');
    if (!savedDecksData) {
      const demoDecks = createDemoDecks();
      setSavedDecks(demoDecks);
      setPublicDecks(demoDecks); // Also set as public decks for demo
      localStorage.setItem('savedDecks', JSON.stringify(demoDecks));
      localStorage.setItem('publicDecks', JSON.stringify(demoDecks));
    } else {
      const parsedDecks = JSON.parse(savedDecksData);
      // Convert date strings back to Date objects
      const decksWithDates = parsedDecks.map((deck: any) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt)
      }));
      setSavedDecks(decksWithDates);
    }

    // Load public decks
    const savedPublicDecks = localStorage.getItem('publicDecks');
    if (savedPublicDecks) {
      const parsedPublicDecks = JSON.parse(savedPublicDecks);
      const publicDecksWithDates = parsedPublicDecks.map((deck: any) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt)
      }));
      setPublicDecks(publicDecksWithDates);
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    const savedCollection = localStorage.getItem('userCollection');
    if (savedCollection) {
      setUserCollection(JSON.parse(savedCollection));
    }
    
    const savedWishlist = localStorage.getItem('userWishlist');
    if (savedWishlist) {
      setUserWishlist(JSON.parse(savedWishlist));
    }
  }, []);


  // Save collection and wishlist to localStorage
  React.useEffect(() => {
    localStorage.setItem('userCollection', JSON.stringify(userCollection));
  }, [userCollection]);

  React.useEffect(() => {
    localStorage.setItem('userWishlist', JSON.stringify(userWishlist));
  }, [userWishlist]);

  return {
    filters,
    setFilters,
    filteredCards,
    deck,
    deckQuantities,
    selectedCard,
    setSelectedCard,
    addToDeck,
    removeFromDeck,
    user,
    userCollection,
    userWishlist,
    addToCollection,
    removeFromCollection,
    addToWishlist,
    removeFromWishlist,
    showAuthModal,
    setShowAuthModal,
    showExportModal,
    setShowExportModal,
    isDraggingCard,
    setIsDraggingCard,
    login,
    signup,
    logout,
    saveDeck,
    exportDeck,
    importDeck,
    savedDecks,
    compareDecksWithAI,
    aiComparisonResults,
    isAnalyzing,
    loadSavedDeck,
    deleteSavedDeck,
    selectedSavedDeckForView,
    setSelectedSavedDeckForView,
    selectedDeckForAIAnalysis,
    setSelectedDeckForAIAnalysis,
    saveNewVersion: () => console.log('Version save not implemented'),
    showVersionModal,
    setShowVersionModal,
    versionNotes,
    setVersionNotes,
    deckFilters,
    setDeckFilters,
    filteredAndSortedDecks,
    showSharingModal,
    setShowSharingModal,
    handleShareDeckSubmit,
    publicDecks,
    userLikes,
    userFollowing,
    likeDeck,
    followUser,
    loadPublicDeck,
    featuredDecks: publicDecks.filter(deck => deck.featured),
    trendingDecks: publicDecks.filter(deck => deck.trending),
    topBuilders: createTopBuilders().map(builder => ({
      ...builder,
      isFollowing: userFollowing.has(builder.username)
    })),
    addGameRecordToDeck
  };
};