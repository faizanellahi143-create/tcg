import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    // TCG API fields
    tcgId: {
      type: String,
      required: [true, "TCG ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: [true, "Card code is required"],
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Card name is required"],
      trim: true,
      maxlength: [100, "Card name cannot exceed 100 characters"],
    },
    rarity: {
      type: String,
      trim: true,
    },
    ap: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Card type is required"],
      trim: true,
    },
    bp: {
      type: String,
      trim: true,
    },
    affinity: {
      type: String,
      trim: true,
    },
    effect: {
      type: String,
      trim: true,
    },
    trigger: {
      type: String,
      trim: true,
    },
    images: {
      small: {
        type: String,
        trim: true,
      },
      large: {
        type: String,
        trim: true,
      },
    },
    set: {
      name: {
        type: String,
        trim: true,
      },
    },
    needEnergy: {
      value: {
        type: String,
        trim: true,
      },
      logo: {
        type: String,
        trim: true,
      },
    },

    // Legacy fields (keeping for backward compatibility)
    attribute: {
      type: String,
      enum: [
        "DARK",
        "DIVINE",
        "EARTH",
        "FIRE",
        "LIGHT",
        "WATER",
        "WIND",
        "SPELL",
        "TRAP",
      ],
    },
    level: {
      type: Number,
      min: [1, "Level must be at least 1"],
      max: [12, "Level cannot exceed 12"],
    },
    attack: {
      type: Number,
      min: [0, "Attack cannot be negative"],
    },
    defense: {
      type: Number,
      min: [0, "Defense cannot be negative"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    imageUrl: {
      type: String,
    },
    cardNumber: {
      type: String,
      sparse: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    isLimited: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
cardSchema.index({ name: "text", effect: "text" });
cardSchema.index({ type: 1 });
cardSchema.index({ rarity: 1 });
cardSchema.index({ code: 1 });
cardSchema.index({ "set.name": 1 });

// Virtual for card power (if bp is numeric)
cardSchema.virtual("power").get(function () {
  if (this.bp && !isNaN(parseInt(this.bp))) {
    return parseInt(this.bp);
  }
  return 0;
});

// Pre-save middleware to set description from effect if not provided
cardSchema.pre("save", function (next) {
  if (!this.description && this.effect) {
    this.description = this.effect;
  }

  // Set imageUrl from images.large if not provided
  if (!this.imageUrl && this.images && this.images.large) {
    this.imageUrl = this.images.large;
  }

  next();
});

export default mongoose.model("Card", cardSchema);
