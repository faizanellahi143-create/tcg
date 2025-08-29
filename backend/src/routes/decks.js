import express from "express";
import Deck from "../models/Deck.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

// @desc    Create a new deck
// @route   POST /api/decks
// @access  Private
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      notes,
      cards,
      format,
      tags,
      isPublic,
      createdBy,
    } = req.body;

    // Validate required fields
    if (!name || !cards || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Name, cards, and createdBy are required",
      });
    }

    // Validate cards structure
    if (!Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cards must be a non-empty array",
      });
    }

    // Process cards and create cardData snapshots
    const processedCards = cards.map((card) => {
      const cardData = {
        name: card.name || card.cardData?.name,
        type: card.type || card.cardData?.type,
        rarity: card.rarity || card.cardData?.rarity,
        set: card.set || card.cardData?.set || card.set?.name,
        image: card.image || card.imageUrl || card.images?.large,
      };

      // Add Gundam-specific data
      if (card.cost !== undefined || card.colors) {
        cardData.cost = card.cost;
        cardData.colors = card.colors;
        cardData.power = card.power;
        cardData.hp = card.hp;
      }

      // Add TCG-specific data
      if (card.ap !== undefined || card.bp !== undefined || card.affinity) {
        cardData.ap = card.ap;
        cardData.bp = card.bp;
        cardData.affinity = card.affinity;
        cardData.effect = card.effect;
        cardData.code = card.code;
      }

      return {
        gundamCardId:
          card.cardType === "gundam" ? card._id || card.id : undefined,
        tcgCardId: card.cardType === "tcg" ? card._id || card.id : undefined,
        cardType: card.cardType || (card.cost !== undefined ? "gundam" : "tcg"),
        quantity: card.quantity || 1,
        cardData,
      };
    });

    // Calculate total cards
    const totalCards = processedCards.reduce(
      (sum, card) => sum + (card.quantity || 1),
      0
    );

    // Extract colors from Gundam cards
    const colors = [];
    processedCards.forEach((card) => {
      if (card.cardType === "gundam" && card.cardData.colors) {
        card.cardData.colors.forEach((color) => {
          if (!colors.includes(color)) {
            colors.push(color);
          }
        });
      }
    });

    // Create deck
    const deck = new Deck({
      name,
      description,
      notes,
      cards: processedCards,
      totalCards,
      colors,
      format: format || "Standard",
      tags: tags || [],
      isPublic: isPublic || false,
      createdBy,
    });

    // Save deck (this will trigger statistics calculation)
    await deck.save();

    // Calculate market value
    deck.calculateMarketValue();
    await deck.save();

    res.status(201).json({
      success: true,
      message: "Deck created successfully",
      data: deck,
    });
  })
);

// @desc    Get all decks (with filtering and pagination)
// @route   GET /api/decks
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      search,
      format,
      tags,
      minCards,
      maxCards,
      minValue,
      maxValue,
      sortBy = "createdAt",
      sortOrder = "desc",
      isPublic,
      createdBy,
      cardType,
    } = req.query;

    // Build filter object
    const filter = {};

    if (isPublic !== undefined) {
      filter.isPublic = isPublic === "true";
    }

    if (createdBy) {
      filter.createdBy = createdBy;
    }

    if (format) {
      filter.format = format;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    if (cardType) {
      if (cardType === "gundam") {
        filter["statistics.gundamCards"] = { $gt: 0 };
      } else if (cardType === "tcg") {
        filter["statistics.tcgCards"] = { $gt: 0 };
      } else if (cardType === "mixed") {
        filter.$and = [
          { "statistics.gundamCards": { $gt: 0 } },
          { "statistics.tcgCards": { $gt: 0 } },
        ];
      }
    }

    if (minCards || maxCards) {
      filter.totalCards = {};
      if (minCards) filter.totalCards.$gte = parseInt(minCards);
      if (maxCards) filter.totalCards.$lte = parseInt(maxCards);
    }

    if (minValue || maxValue) {
      filter.marketValue = {};
      if (minValue) filter.marketValue.$gte = parseFloat(minValue);
      if (maxValue) filter.marketValue.$lte = parseFloat(maxValue);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [decks, total] = await Promise.all([
      Deck.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "username")
        .lean(),
      Deck.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: decks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  })
);

// @desc    Get deck by ID
// @route   GET /api/decks/:id
// @access  Public
router.get(
  "/:id",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const deck = await Deck.findById(req.params.id)
      .populate("createdBy", "username")
      .populate("updatedBy", "username")
      .lean();

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: "Deck not found",
      });
    }

    // Increment views
    await Deck.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: deck,
    });
  })
);

// @desc    Update deck
// @route   PUT /api/decks/:id
// @access  Private
router.put(
  "/:id",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      notes,
      cards,
      format,
      tags,
      isPublic,
      updatedBy,
    } = req.body;

    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: "Deck not found",
      });
    }

    // Check if user can update this deck
    if (deck.createdBy.toString() !== updatedBy) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this deck",
      });
    }

    // Update fields
    if (name !== undefined) deck.name = name;
    if (description !== undefined) deck.description = description;
    if (notes !== undefined) deck.notes = notes;
    if (format !== undefined) deck.format = format;
    if (tags !== undefined) deck.tags = tags;
    if (isPublic !== undefined) deck.isPublic = isPublic;
    if (updatedBy) deck.updatedBy = updatedBy;

    // Update cards if provided
    if (cards) {
      const processedCards = cards.map((card) => {
        const cardData = {
          name: card.name || card.cardData?.name,
          type: card.type || card.cardData?.type,
          rarity: card.rarity || card.cardData?.rarity,
          set: card.set || card.cardData?.set || card.set?.name,
          image: card.image || card.imageUrl || card.images?.large,
        };

        if (card.cost !== undefined || card.colors) {
          cardData.cost = card.cost;
          cardData.colors = card.colors;
          cardData.power = card.power;
          cardData.hp = card.hp;
        }

        if (card.ap !== undefined || card.bp !== undefined || card.affinity) {
          cardData.ap = card.ap;
          cardData.bp = card.bp;
          cardData.affinity = card.affinity;
          cardData.effect = card.effect;
          cardData.code = card.code;
        }

        return {
          gundamCardId:
            card.cardType === "gundam" ? card._id || card.id : undefined,
          tcgCardId: card.cardType === "tcg" ? card._id || card.id : undefined,
          cardType:
            card.cardType || (card.cost !== undefined ? "gundam" : "tcg"),
          quantity: card.quantity || 1,
          cardData,
        };
      });

      deck.cards = processedCards;
      deck.totalCards = processedCards.reduce(
        (sum, card) => sum + (card.quantity || 1),
        0
      );

      // Extract colors
      const colors = [];
      processedCards.forEach((card) => {
        if (card.cardType === "gundam" && card.cardData.colors) {
          card.cardData.colors.forEach((color) => {
            if (!colors.includes(color)) {
              colors.push(color);
            }
          });
        }
      });
      deck.colors = colors;
    }

    // Save deck (this will trigger statistics calculation)
    await deck.save();

    // Calculate market value
    deck.calculateMarketValue();
    await deck.save();

    res.json({
      success: true,
      message: "Deck updated successfully",
      data: deck,
    });
  })
);

// @desc    Delete deck
// @route   DELETE /api/decks/:id
// @access  Private
router.delete(
  "/:id",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: "Deck not found",
      });
    }

    // Check if user can delete this deck
    if (deck.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this deck",
      });
    }

    await Deck.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deck deleted successfully",
    });
  })
);

// @desc    Add game record to deck
// @route   POST /api/decks/:id/games
// @access  Private
router.post(
  "/:id/games",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const { opponent, result, format, notes, userId } = req.body;

    if (!opponent || !result) {
      return res.status(400).json({
        success: false,
        message: "Opponent and result are required",
      });
    }

    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: "Deck not found",
      });
    }

    // Check if user can modify this deck
    if (deck.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this deck",
      });
    }

    // Add game record
    await deck.addGameRecord({
      opponent,
      result,
      format: format || "Standard",
      notes,
    });

    res.json({
      success: true,
      message: "Game record added successfully",
      data: deck,
    });
  })
);

// @desc    Get deck statistics overview
// @route   GET /api/decks/stats/overview
// @access  Public
router.get(
  "/stats/overview",
  asyncHandler(async (req, res) => {
    const stats = await Deck.getDeckStats();

    res.json({
      success: true,
      data: stats[0] || {},
    });
  })
);

// @desc    Get user's decks
// @route   GET /api/decks/user/:userId
// @access  Public
router.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, isPublic } = req.query;

    const filter = { createdBy: req.params.userId };
    if (isPublic !== undefined) {
      filter.isPublic = isPublic === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [decks, total] = await Promise.all([
      Deck.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Deck.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: decks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        limit: parseInt(limit),
      },
    });
  })
);

// @desc    Increment deck plays
// @route   POST /api/decks/:id/play
// @access  Public
router.post(
  "/:id/play",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: "Deck not found",
      });
    }

    await deck.incrementPlays();

    res.json({
      success: true,
      message: "Play count incremented",
    });
  })
);

// @desc    Like/unlike deck
// @route   POST /api/decks/:id/like
// @access  Private
router.post(
  "/:id/like",
  validateObjectId,
  asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const deck = await Deck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: "Deck not found",
      });
    }

    const likeIndex = deck.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      deck.likes.splice(likeIndex, 1);
    } else {
      // Like
      deck.likes.push(userId);
    }

    await deck.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? "Deck unliked" : "Deck liked",
      data: { likes: deck.likes.length, isLiked: likeIndex === -1 },
    });
  })
);

export default router;
