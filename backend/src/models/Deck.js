import mongoose from "mongoose";

const deckCardSchema = new mongoose.Schema({
  // For Gundam cards
  gundamCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GundamCard",
  },
  // For TCG cards
  tcgCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
  },
  // Card type to distinguish between Gundam and TCG
  cardType: {
    type: String,
    enum: ["gundam", "tcg"],
    required: true,
  },
  quantity: {
    type: Number,
    min: [1, "Quantity must be at least 1"],
    max: [4, "Quantity cannot exceed 4"],
    default: 1,
  },
  // Store card data snapshot for quick access
  cardData: {
    name: String,
    type: String,
    rarity: String,
    set: String,
    image: String,
    // Gundam specific
    cost: Number,
    colors: [String],
    power: Number,
    hp: Number,
    // TCG specific
    ap: String,
    bp: String,
    affinity: String,
    effect: String,
    code: String,
  },
});

const gameRecordSchema = new mongoose.Schema({
  opponent: {
    type: String,
    required: true,
    trim: true,
  },
  result: {
    type: String,
    enum: ["win", "loss", "draw"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  format: {
    type: String,
    default: "Standard",
  },
  notes: {
    type: String,
    trim: true,
  },
});

const deckVersionSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cards: [deckCardSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
  totalCards: {
    type: Number,
    required: true,
  },
  marketValue: {
    type: Number,
    default: 0,
  },
});

const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Deck name is required"],
      trim: true,
      maxlength: [100, "Deck name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      trim: true,
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      trim: true,
    },
    cards: [deckCardSchema],
    totalCards: {
      type: Number,
      required: true,
      min: [1, "Deck must have at least 1 card"],
    },
    // Statistics
    statistics: {
      // Card type breakdown
      gundamCards: { type: Number, default: 0 },
      tcgCards: { type: Number, default: 0 },

      // Gundam specific stats
      averageCost: { type: Number, default: 0 },
      colorDistribution: { type: Map, of: Number, default: {} },
      typeDistribution: { type: Map, of: Number, default: {} },

      // TCG specific stats
      totalAP: { type: Number, default: 0 },
      averageAP: { type: Number, default: 0 },
      totalBP: { type: Number, default: 0 },
      averageBP: { type: Number, default: 0 },
      affinityDistribution: { type: Map, of: Number, default: {} },
      energyRequirements: { type: Map, of: Number, default: {} },

      // Common stats
      rarityDistribution: { type: Map, of: Number, default: {} },
      setDistribution: { type: Map, of: Number, default: {} },
    },

    // Market value
    marketValue: {
      type: Number,
      default: 0,
      min: [0, "Market value cannot be negative"],
    },

    // Colors (for Gundam cards)
    colors: [
      {
        type: String,
        enum: ["Blue", "Green", "Red", "White", "Purple", "Colorless"],
      },
    ],

    // Tags
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],

    // Format
    format: {
      type: String,
      enum: ["Standard", "Modern", "Legacy", "Commander", "Limited", "TCG"],
      default: "Standard",
    },

    // Visibility and sharing
    isPublic: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    allowForks: {
      type: Boolean,
      default: true,
    },

    // Social features
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    forks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deck",
      },
    ],
    originalDeckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck",
    },

    // Game performance
    gameHistory: [gameRecordSchema],
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    winRate: {
      type: Number,
      default: 0,
      min: [0, "Win rate cannot be negative"],
      max: [100, "Win rate cannot exceed 100"],
    },

    // Analytics
    views: {
      type: Number,
      default: 0,
    },
    plays: {
      type: Number,
      default: 0,
    },

    // Versioning
    versions: [deckVersionSchema],
    currentVersion: {
      type: Number,
      default: 1,
    },

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
deckSchema.index({ name: "text", description: "text", notes: "text" });
deckSchema.index({ createdBy: 1, createdAt: -1 });
deckSchema.index({ isPublic: 1, createdAt: -1 });
deckSchema.index({ format: 1 });
deckSchema.index({ tags: 1 });
deckSchema.index({ "statistics.gundamCards": 1 });
deckSchema.index({ "statistics.tcgCards": 1 });
deckSchema.index({ marketValue: -1 });
deckSchema.index({ winRate: -1 });

// Virtual for total games
deckSchema.virtual("totalGames").get(function () {
  return this.wins + this.losses;
});

// Pre-save middleware to calculate statistics
deckSchema.pre("save", function (next) {
  if (this.isModified("cards")) {
    this.calculateStatistics();
  }
  this.updatedAt = new Date();
  next();
});

// Method to calculate deck statistics
deckSchema.methods.calculateStatistics = function () {
  const stats = {
    gundamCards: 0,
    tcgCards: 0,
    averageCost: 0,
    colorDistribution: new Map(),
    typeDistribution: new Map(),
    totalAP: 0,
    averageAP: 0,
    totalBP: 0,
    averageBP: 0,
    affinityDistribution: new Map(),
    energyRequirements: new Map(),
    rarityDistribution: new Map(),
    setDistribution: new Map(),
  };

  let totalCost = 0;
  let costCount = 0;
  let totalAP = 0;
  let apCount = 0;
  let totalBP = 0;
  let bpCount = 0;

  this.cards.forEach((card) => {
    const quantity = card.quantity || 1;

    if (card.cardType === "gundam") {
      stats.gundamCards += quantity;

      // Cost calculation
      if (card.cardData.cost) {
        totalCost += card.cardData.cost * quantity;
        costCount += quantity;
      }

      // Colors
      if (card.cardData.colors) {
        card.cardData.colors.forEach((color) => {
          stats.colorDistribution.set(
            color,
            (stats.colorDistribution.get(color) || 0) + quantity
          );
        });
      }
    } else if (card.cardType === "tcg") {
      stats.tcgCards += quantity;

      // AP calculation
      if (card.cardData.ap && card.cardData.ap !== "-") {
        const ap = parseInt(card.cardData.ap) || 0;
        totalAP += ap * quantity;
        apCount += quantity;
      }

      // BP calculation
      if (card.cardData.bp && card.cardData.bp !== "-") {
        const bp = parseInt(card.cardData.bp) || 0;
        totalBP += bp * quantity;
        bpCount += quantity;
      }

      // Affinity
      if (card.cardData.affinity && card.cardData.affinity !== "-") {
        stats.affinityDistribution.set(
          card.cardData.affinity,
          (stats.affinityDistribution.get(card.cardData.affinity) || 0) +
            quantity
        );
      }
    }

    // Common stats
    if (card.cardData.type) {
      stats.typeDistribution.set(
        card.cardData.type,
        (stats.typeDistribution.get(card.cardData.type) || 0) + quantity
      );
    }

    if (card.cardData.rarity) {
      stats.rarityDistribution.set(
        card.cardData.rarity,
        (stats.rarityDistribution.get(card.cardData.rarity) || 0) + quantity
      );
    }

    if (card.cardData.set) {
      stats.setDistribution.set(
        card.cardData.set,
        (stats.setDistribution.get(card.cardData.set) || 0) + quantity
      );
    }
  });

  // Calculate averages
  stats.averageCost = costCount > 0 ? totalCost / costCount : 0;
  stats.averageAP = apCount > 0 ? totalAP / apCount : 0;
  stats.averageBP = bpCount > 0 ? totalBP / bpCount : 0;

  stats.totalAP = totalAP;
  stats.totalBP = totalBP;

  // Convert Maps to objects for storage
  this.statistics = {
    gundamCards: stats.gundamCards,
    tcgCards: stats.tcgCards,
    averageCost: Math.round(stats.averageCost * 100) / 100,
    colorDistribution: Object.fromEntries(stats.colorDistribution),
    typeDistribution: Object.fromEntries(stats.typeDistribution),
    totalAP: stats.totalAP,
    averageAP: Math.round(stats.averageAP * 100) / 100,
    totalBP: stats.totalBP,
    averageBP: Math.round(stats.averageBP * 100) / 100,
    affinityDistribution: Object.fromEntries(stats.affinityDistribution),
    energyRequirements: Object.fromEntries(stats.energyRequirements),
    rarityDistribution: Object.fromEntries(stats.rarityDistribution),
    setDistribution: Object.fromEntries(stats.setDistribution),
  };

  // Update total cards
  this.totalCards = this.cards.reduce(
    (sum, card) => sum + (card.quantity || 1),
    0
  );
};

// Method to calculate market value
deckSchema.methods.calculateMarketValue = function () {
  // This would typically involve fetching current market prices
  // For now, we'll use a placeholder calculation
  let totalValue = 0;

  this.cards.forEach((card) => {
    const quantity = card.quantity || 1;
    // You would implement actual market price lookup here
    const estimatedPrice = 1.5; // Placeholder
    totalValue += estimatedPrice * quantity;
  });

  this.marketValue = Math.round(totalValue * 100) / 100;
  return this.marketValue;
};

// Method to add game record
deckSchema.methods.addGameRecord = function (record) {
  this.gameHistory.push(record);

  // Update win/loss counts
  if (record.result === "win") {
    this.wins += 1;
  } else if (record.result === "loss") {
    this.losses += 1;
  }

  // Calculate win rate
  const totalGames = this.wins + this.losses;
  this.winRate =
    totalGames > 0 ? Math.round((this.wins / totalGames) * 100) : 0;

  return this.save();
};

// Method to increment views
deckSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Method to increment plays
deckSchema.methods.incrementPlays = function () {
  this.plays += 1;
  return this.save();
};

// Static method to get deck statistics
deckSchema.statics.getDeckStats = async function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalDecks: { $sum: 1 },
        totalCards: { $sum: "$totalCards" },
        totalMarketValue: { $sum: "$marketValue" },
        averageDeckSize: { $avg: "$totalCards" },
        averageMarketValue: { $avg: "$marketValue" },
        totalViews: { $sum: "$views" },
        totalPlays: { $sum: "$plays" },
        totalWins: { $sum: "$wins" },
        totalLosses: { $sum: "$losses" },
        gundamDecks: {
          $sum: { $cond: [{ $gt: ["$statistics.gundamCards", 0] }, 1, 0] },
        },
        tcgDecks: {
          $sum: { $cond: [{ $gt: ["$statistics.tcgCards", 0] }, 1, 0] },
        },
        mixedDecks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gt: ["$statistics.gundamCards", 0] },
                  { $gt: ["$statistics.tcgCards", 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);
};

const Deck = mongoose.model("Deck", deckSchema);

export default Deck;
