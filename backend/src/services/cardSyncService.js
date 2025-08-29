import Card from "../models/Card.js";
import TcgApiService from "./tcgApiService.js";

class CardSyncService {
  constructor() {
    this.tcgApiService = new TcgApiService();
  }

  /**
   * Transform TCG API card data to our database schema
   * @param {Object} tcgCard - Card data from TCG API
   * @returns {Object} Transformed card data for database
   */
  transformTcgCard(tcgCard) {
    return {
      tcgId: tcgCard.id,
      code: tcgCard.code,
      url: tcgCard.url,
      name: tcgCard.name,
      rarity: tcgCard.rarity,
      ap: tcgCard.ap,
      type: tcgCard.type,
      bp: tcgCard.bp,
      affinity: tcgCard.affinity,
      effect: tcgCard.effect,
      trigger: tcgCard.trigger,
      images: {
        small: tcgCard.images?.small,
        large: tcgCard.images?.large,
      },
      set: {
        name: tcgCard.set?.name,
      },
      needEnergy: {
        value: tcgCard.needEnergy?.value,
        logo: tcgCard.needEnergy?.logo,
      },
      // Set legacy fields for backward compatibility
      description: tcgCard.effect || "",
      imageUrl: tcgCard.images?.large || "",
      cardNumber: tcgCard.code,
    };
  }

  /**
   * Save a single card to the database
   * @param {Object} cardData - Card data to save
   * @returns {Promise<Object>} Saved card or existing card
   */
  async saveCard(cardData) {
    try {
      // Check if card already exists
      const existingCard = await Card.findOne({ tcgId: cardData.tcgId });

      if (existingCard) {
        // Update existing card
        const updatedCard = await Card.findOneAndUpdate(
          { tcgId: cardData.tcgId },
          cardData,
          { new: true, runValidators: true }
        );
        return { card: updatedCard, isNew: false };
      } else {
        // Create new card
        const newCard = new Card(cardData);
        const savedCard = await newCard.save();
        return { card: savedCard, isNew: true };
      }
    } catch (error) {
      console.error(
        `Error saving card ${cardData.name} (${cardData.tcgId}):`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Save multiple cards to the database
   * @param {Array} cards - Array of card data
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise<Object>} Summary of sync operation
   */
  async saveCards(cards, onProgress) {
    const summary = {
      total: cards.length,
      saved: 0,
      updated: 0,
      errors: 0,
      errorDetails: [],
    };

    console.log(`Starting to save ${cards.length} cards to database...`);

    for (let i = 0; i < cards.length; i++) {
      try {
        const cardData = this.transformTcgCard(cards[i]);
        const result = await this.saveCard(cardData);

        if (result.isNew) {
          summary.saved++;
        } else {
          summary.updated++;
        }

        // Call progress callback if provided
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: cards.length,
            progress: Math.round(((i + 1) / cards.length) * 100),
            currentCard: cards[i].name,
            summary,
          });
        }

        // Log progress every 10 cards
        if ((i + 1) % 10 === 0) {
          console.log(`Processed ${i + 1}/${cards.length} cards...`);
        }
      } catch (error) {
        summary.errors++;
        summary.errorDetails.push({
          cardName: cards[i].name,
          cardId: cards[i].id,
          error: error.message,
        });

        console.error(`Failed to save card ${cards[i].name}:`, error.message);

        // Continue with next card instead of failing completely
        continue;
      }
    }

    console.log("Card sync completed!");
    console.log("Summary:", summary);

    return summary;
  }

  /**
   * Sync all cards from TCG API to database
   * @param {Object} options - Sync options
   * @param {string} options.name - Filter by card name (optional)
   * @param {number} options.delay - Delay between API requests (default: 1000)
   * @param {boolean} options.dryRun - If true, don't save to database (default: false)
   * @returns {Promise<Object>} Sync operation result
   */
  async syncAllCards(options = {}) {
    const { name, delay = 1000, dryRun = false } = options;

    try {
      console.log("Starting full card sync...");

      if (dryRun) {
        console.log("DRY RUN MODE: Cards will not be saved to database");
      }

      // Test API connection first
      const isConnected = await this.tcgApiService.testConnection();
      if (!isConnected) {
        throw new Error("Cannot connect to TCG API");
      }

      // Fetch all cards from API
      const cards = await this.tcgApiService.fetchAllCards({
        name,
        delay,
        onProgress: (progress) => {
          console.log(
            `API Progress: ${progress.progress}% (${progress.cardsFetched}/${progress.totalCount})`
          );
        },
      });

      if (dryRun) {
        console.log(`DRY RUN: Would sync ${cards.length} cards`);
        return {
          success: true,
          dryRun: true,
          cardsFetched: cards.length,
          message: "Dry run completed - no cards were saved",
        };
      }

      // Save cards to database
      const summary = await this.saveCards(cards, (progress) => {
        console.log(
          `DB Progress: ${progress.progress}% (${progress.current}/${progress.total}) - ${progress.currentCard}`
        );
      });

      return {
        success: true,
        dryRun: false,
        cardsFetched: cards.length,
        summary,
      };
    } catch (error) {
      console.error("Card sync failed:", error.message);
      return {
        success: false,
        error: error.message,
        cardsFetched: 0,
      };
    }
  }

  /**
   * Sync specific cards by name
   * @param {string} name - Card name to search and sync
   * @returns {Promise<Object>} Sync operation result
   */
  async syncCardsByName(name) {
    try {
      console.log(`Syncing cards with name: ${name}`);

      const cards = await this.tcgApiService.searchCardsByName(name);
      console.log(`Found ${cards.length} cards matching "${name}"`);

      if (cards.length === 0) {
        return {
          success: true,
          cardsFetched: 0,
          message: `No cards found matching "${name}"`,
        };
      }

      const summary = await this.saveCards(cards);

      return {
        success: true,
        cardsFetched: cards.length,
        summary,
      };
    } catch (error) {
      console.error(`Failed to sync cards with name "${name}":`, error.message);
      return {
        success: false,
        error: error.message,
        cardsFetched: 0,
      };
    }
  }

  /**
   * Get sync statistics
   * @returns {Promise<Object>} Database statistics
   */
  async getStats() {
    try {
      const totalCards = await Card.countDocuments();
      const cardsByType = await Card.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      const cardsByRarity = await Card.aggregate([
        { $group: { _id: "$rarity", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      const cardsBySet = await Card.aggregate([
        { $group: { _id: "$set.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      return {
        totalCards,
        cardsByType,
        cardsByRarity,
        cardsBySet,
      };
    } catch (error) {
      console.error("Error getting stats:", error.message);
      throw error;
    }
  }
}

export default CardSyncService;
