import express from "express";
import User from "../models/User.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get("/", protect, admin, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      rank,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (rank) filter["stats.rank"] = rank;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select("-password -refreshTokens")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
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

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public (if profile is public)
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -refreshTokens -email")
      .populate("collections.cards.card", "name type imageUrl rarity");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if profile is public
    if (!user.preferences.privacy.profilePublic) {
      return res.status(403).json({
        success: false,
        error: "Profile is private",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res, next) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshTokens");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
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

// @desc    Get user collection
// @route   GET /api/users/:id/collection
// @access  Public (if profile is public)
router.get("/:id/collection", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("collections.cards preferences.privacy")
      .populate(
        "collections.cards.card",
        "name type imageUrl rarity attribute level attack defense description"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if stats are public
    if (!user.preferences.privacy.showStats) {
      return res.status(403).json({
        success: false,
        error: "Collection is private",
      });
    }

    res.json({
      success: true,
      data: user.collections.cards,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user wishlist
// @route   GET /api/users/:id/wishlist
// @access  Public (if profile is public)
router.get("/:id/wishlist", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("collections.wishlist preferences.privacy")
      .populate("collections.wishlist.card", "name type imageUrl rarity");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if profile is public
    if (!user.preferences.privacy.profilePublic) {
      return res.status(403).json({
        success: false,
        error: "Profile is private",
      });
    }

    res.json({
      success: true,
      data: user.collections.wishlist,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Public (if stats are public)
router.get("/:id/stats", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "stats preferences.privacy"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if stats are public
    if (!user.preferences.privacy.showStats) {
      return res.status(403).json({
        success: false,
        error: "Statistics are private",
      });
    }

    res.json({
      success: true,
      data: user.stats,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
router.get("/leaderboard/rankings", async (req, res, next) => {
  try {
    const {
      rank = "all",
      limit = 10,
      sortBy = "stats.gamesWon",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = { "preferences.privacy.showStats": true };
    if (rank !== "all") filter["stats.rank"] = rank;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const users = await User.find(filter)
      .select("username profile.displayName profile.avatar stats")
      .sort(sort)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
