import axios from "axios";

class TcgApiService {
  constructor() {
    this.baseUrl = "https://apitcg.com/api/union-arena";
    this.apiKey = process.env.TCG_API_KEY;

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000, // 30 seconds timeout
      headers: {
        "User-Agent": "TCG-Bot-Simulator/1.0.0",
        Accept: "application/json",
        ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        ...(this.apiKey && { "X-API-Key": this.apiKey }),
      },
    });
  }

  /**
   * Fetch a single page of cards
   * @param {Object} params - Query parameters
   * @param {string} params.name - Card name to search for
   * @param {number} params.page - Page number (optional)
   * @param {number} params.limit - Items per page (optional)
   * @returns {Promise<Object>} API response
   */
  async fetchCardsPage(params = {}) {
    try {
      const response = await this.axiosInstance.get("/cards", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching cards page:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw new Error(`Failed to fetch cards: ${error.message}`);
    }
  }

  /**
   * Fetch all cards by iterating through all pages
   * @param {Object} options - Options for fetching
   * @param {string} options.name - Card name to search for (optional)
   * @param {number} options.delay - Delay between requests in ms (default: 1000)
   * @param {Function} options.onProgress - Progress callback function
   * @returns {Promise<Array>} Array of all cards
   */
  async fetchAllCards(options = {}) {
    const { name, delay = 1000, onProgress } = options;
    const allCards = [];
    let page = 1;
    let hasMore = true;
    let totalCount = 0;

    console.log(
      `Starting to fetch all cards${name ? ` for name: ${name}` : ""}...`
    );

    while (hasMore) {
      try {
        const params = { page, limit: 100 };
        if (name) params.name = name;

        console.log(`Fetching page ${page}...`);

        const response = await this.fetchCardsPage(params);
        const { data: cards, totalCount: currentTotalCount } = response;

        if (page === 1) {
          totalCount = currentTotalCount;
          console.log(`Total cards to fetch: ${totalCount}`);
        }

        if (!cards || cards.length === 0) {
          console.log("No more cards found");
          break;
        }

        allCards.push(...cards);
        console.log(
          `Fetched ${cards.length} cards from page ${page}. Total so far: ${allCards.length}`
        );

        // Call progress callback if provided
        if (onProgress) {
          onProgress({
            page,
            cardsFetched: allCards.length,
            totalCount,
            progress: Math.round((allCards.length / totalCount) * 100),
          });
        }

        // Check if we've fetched all cards
        if (allCards.length >= totalCount) {
          hasMore = false;
          console.log("All cards fetched successfully!");
        } else {
          page++;

          // Add delay between requests to be respectful to the API
          if (delay > 0) {
            console.log(`Waiting ${delay}ms before next request...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error.message);

        // If it's a rate limit or server error, wait longer and retry
        if (
          error.response &&
          (error.response.status === 429 || error.response.status >= 500)
        ) {
          const retryDelay = delay * 2;
          console.log(`Server error, waiting ${retryDelay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }

        throw error;
      }
    }

    console.log(`Successfully fetched ${allCards.length} cards`);
    return allCards;
  }

  /**
   * Search for cards by name
   * @param {string} name - Card name to search for
   * @returns {Promise<Array>} Array of matching cards
   */
  async searchCardsByName(name) {
    try {
      const response = await this.fetchCardsPage({ name });
      return response.data || [];
    } catch (error) {
      console.error(
        `Error searching for cards with name "${name}":`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Get card details by ID
   * @param {string} id - Card ID
   * @returns {Promise<Object>} Card details
   */
  async getCardById(id) {
    try {
      const response = await this.fetchCardsPage({ id });
      return response.data?.[0] || null;
    } catch (error) {
      console.error(`Error fetching card with ID "${id}":`, error.message);
      throw error;
    }
  }

  /**
   * Test API connectivity
   * @returns {Promise<boolean>} True if API is accessible
   */
  async testConnection() {
    try {
      const response = await this.axiosInstance.get("/cards?limit=1");
      return response.status === 200;
    } catch (error) {
      console.error("API connection test failed:", error.message);
      return false;
    }
  }
}

export default TcgApiService;
