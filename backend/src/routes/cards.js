import express from "express";
import Card from "../models/Card.js";
import { protect, admin } from "../middleware/auth.js";
import CardSyncService from "../services/cardSyncService.js";

const router = express.Router();

// Initialize the sync service
const cardSyncService = new CardSyncService();

// @desc    Get all cards
// @route   GET /api/cards
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      attribute,
      rarity,
      search,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (attribute) filter.attribute = attribute;
    if (rarity) filter.rarity = rarity;
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const cards = await Card.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "username");

    const total = await Card.countDocuments(filter);

    res.json({
      success: true,
      data: cards,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single card
// @route   GET /api/cards/:id
// @access  Public
router.get("/:id", async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id).populate(
      "createdBy",
      "username"
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found",
      });
    }

    res.json({
      success: true,
      data: card,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new card
// @route   POST /api/cards
// @access  Private/Admin
router.post("/", protect, admin, async (req, res, next) => {
  try {
    const card = await Card.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: card,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update card
// @route   PUT /api/cards/:id
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found",
      });
    }

    res.json({
      success: true,
      data: card,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete card
// @route   DELETE /api/cards/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res, next) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found",
      });
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get card statistics
// @route   GET /api/cards/stats/overview
// @access  Public
router.get("/stats/overview", async (req, res, next) => {
  try {
    const stats = await Card.aggregate([
      {
        $group: {
          _id: null,
          totalCards: { $sum: 1 },
          monsterCards: {
            $sum: { $cond: [{ $eq: ["$type", "Monster"] }, 1, 0] },
          },
          spellCards: { $sum: { $cond: [{ $eq: ["$type", "Spell"] }, 1, 0] } },
          trapCards: { $sum: { $cond: [{ $eq: ["$type", "Trap"] }, 1, 0] } },
          bannedCards: { $sum: { $cond: ["$isBanned", 1, 0] } },
          limitedCards: { $sum: { $cond: ["$isLimited", 1, 0] } },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {},
    });
  } catch (error) {
    next(error);
  }
});

// New sync endpoint
router.post("/sync", async (req, res) => {
  try {
    const { name, delay = 1000, dryRun = false } = req.body;

    console.log(
      `Sync request received: name=${name}, delay=${delay}, dryRun=${dryRun}`
    );

    // Start sync process
    let result;
    if (name) {
      result = await cardSyncService.syncCardsByName(name);
    } else {
      result = await cardSyncService.syncAllCards({
        delay: parseInt(delay),
        dryRun: dryRun,
      });
    }

    if (result.success) {
      res.json({
        success: true,
        message: result.message || "Sync completed successfully",
        data: result,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Sync failed",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Sync endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get sync statistics
router.get("/sync/stats", async (req, res) => {
  try {
    const stats = await cardSyncService.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Stats endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
      error: error.message,
    });
  }
});

// Test TCG API connection
router.get("/sync/test", async (req, res) => {
  try {
    const isConnected = await cardSyncService.tcgApiService.testConnection();
    res.json({
      success: true,
      connected: isConnected,
      message: isConnected
        ? "TCG API is accessible"
        : "TCG API is not accessible",
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to test API connection",
      error: error.message,
    });
  }
});

export default router;
