import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,                 // keep unique here
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,                 // keep unique here
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    profile: {
      displayName: { type: String, trim: true, maxlength: [50, "Display name cannot exceed 50 characters"] },
      avatar: { type: String, default: "" },
      bio: { type: String, maxlength: [500, "Bio cannot exceed 500 characters"] },
      location: { type: String, trim: true, maxlength: [100, "Location cannot exceed 100 characters"] },
      website: { type: String, trim: true }
    },
    stats: {
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
      gamesLost: { type: Number, default: 0 },
      totalPlayTime: { type: Number, default: 0 }, // minutes
      rank: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master"], default: "Bronze" }
    },
    preferences: {
      theme: { type: String, enum: ["light", "dark", "auto"], default: "auto" },
      notifications: { email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
      privacy: { profilePublic: { type: Boolean, default: true }, showStats: { type: Boolean, default: true } }
    },
    collections: {
      cards: [
        {
          card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
          quantity: { type: Number, min: 1, default: 1 },
          obtainedAt: { type: Date, default: Date.now }
        }
      ],
      wishlist: [
        {
          card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
          priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
          addedAt: { type: Date, default: Date.now }
        }
      ]
    },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    lastLogin: { type: Date },
    refreshTokens: [{ token: String, expiresAt: Date }]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// keep ONLY this extra index; remove username/email schema.index duplicates
userSchema.index({ "stats.rank": 1 });

// virtuals
userSchema.virtual("winRate").get(function () {
  if (this.stats.gamesPlayed === 0) return 0;
  return Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100);
});
userSchema.virtual("totalCards").get(function () {
  return this.collections.cards.reduce((t, c) => t + c.quantity, 0);
});

// hooks
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (e) {
    next(e);
  }
});

// methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
userSchema.methods.addCardToCollection = function (cardId, quantity = 1) {
  const existing = this.collections.cards.find((c) => c.card.toString() === cardId.toString());
  if (existing) existing.quantity += quantity;
  else this.collections.cards.push({ card: cardId, quantity, obtainedAt: new Date() });
  return this.save();
};
userSchema.methods.addToWishlist = function (cardId, priority = "Medium") {
  const existing = this.collections.wishlist.find((w) => w.card.toString() === cardId.toString());
  if (!existing) this.collections.wishlist.push({ card: cardId, priority, addedAt: new Date() });
  return this.save();
};

export default mongoose.model("User", userSchema);
