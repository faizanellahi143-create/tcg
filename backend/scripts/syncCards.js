#!/usr/bin/env node

import dotenv from "dotenv";
import mongoose from "mongoose";
import CardSyncService from "../src/services/cardSyncService.js";

// Load environment variables
dotenv.config();

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  switch (arg) {
    case "--help":
    case "-h":
      showHelp();
      process.exit(0);
      break;

    case "--dry-run":
      options.dryRun = true;
      break;

    case "--name":
      if (i + 1 < args.length) {
        options.name = args[++i];
      } else {
        console.error("Error: --name requires a value");
        process.exit(1);
      }
      break;

    case "--delay":
      if (i + 1 < args.length) {
        const delay = parseInt(args[++i]);
        if (isNaN(delay) || delay < 0) {
          console.error("Error: --delay must be a positive number");
          process.exit(1);
        }
        options.delay = delay;
      } else {
        console.error("Error: --delay requires a value");
        process.exit(1);
      }
      break;

    case "--stats":
      options.showStats = true;
      break;

    default:
      console.error(`Unknown argument: ${arg}`);
      showHelp();
      process.exit(1);
  }
}

function showHelp() {
  console.log(`
TCG Card Sync Script

Usage: node scripts/syncCards.js [options]

Options:
  --help, -h           Show this help message
  --dry-run            Run without saving to database (test mode)
  --name <name>        Filter cards by name
  --delay <ms>         Delay between API requests in milliseconds (default: 1000)
  --stats              Show database statistics after sync

Examples:
  # Sync all cards
  node scripts/syncCards.js
  
  # Test sync without saving (dry run)
  node scripts/syncCards.js --dry-run
  
  # Sync cards with specific name
  node scripts/syncCards.js --name "Gon"
  
  # Sync with custom delay
  node scripts/syncCards.js --delay 2000
  
  # Show stats after sync
  node scripts/syncCards.js --stats
`);
}

async function main() {
  try {
    console.log("🚀 Starting TCG Card Sync...\n");

    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/tcg-bot-simulator";
    console.log(
      `📡 Connecting to MongoDB: ${mongoUri.replace(
        /\/\/[^:]+:[^@]+@/,
        "//***:***@"
      )}`
    );

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully\n");

    // Initialize sync service
    const syncService = new CardSyncService();

    // Test API connection
    console.log("🔍 Testing TCG API connection...");
    const isConnected = await syncService.tcgApiService.testConnection();
    if (!isConnected) {
      throw new Error(
        "❌ Cannot connect to TCG API. Please check your internet connection."
      );
    }
    console.log("✅ TCG API connection successful\n");

    // Show current database stats
    if (options.showStats) {
      console.log("📊 Current database statistics:");
      const stats = await syncService.getStats();
      console.log(`Total cards: ${stats.totalCards}`);
      console.log(
        `Cards by type: ${stats.cardsByType
          .map((s) => `${s._id}: ${s.count}`)
          .join(", ")}`
      );
      console.log(
        `Cards by rarity: ${stats.cardsByRarity
          .map((s) => `${s._id}: ${s.count}`)
          .join(", ")}`
      );
      console.log(
        `Cards by set: ${stats.cardsBySet
          .map((s) => `${s._id}: ${s.count}`)
          .join(", ")}\n`
      );
    }

    // Perform sync
    let result;
    if (options.name) {
      console.log(`🎯 Syncing cards with name: "${options.name}"`);
      result = await syncService.syncCardsByName(options.name);
    } else {
      console.log("🔄 Starting full card sync...");
      result = await syncService.syncAllCards({
        delay: options.delay || 1000,
        dryRun: options.dryRun || false,
      });
    }

    // Show results
    console.log("\n📋 Sync Results:");
    if (result.success) {
      if (result.dryRun) {
        console.log(`✅ Dry run completed successfully`);
        console.log(`📊 Would sync ${result.cardsFetched} cards`);
        console.log(`💡 Run without --dry-run to actually save cards`);
      } else {
        console.log(`✅ Sync completed successfully`);
        console.log(`📊 Cards fetched: ${result.cardsFetched}`);
        if (result.summary) {
          console.log(`💾 New cards saved: ${result.summary.saved}`);
          console.log(`🔄 Cards updated: ${result.summary.updated}`);
          console.log(`❌ Errors: ${result.summary.errors}`);
        }
      }
    } else {
      console.log(`❌ Sync failed: ${result.error}`);
      process.exit(1);
    }

    // Show final stats if requested
    if (options.showStats && !options.dryRun) {
      console.log("\n📊 Final database statistics:");
      const stats = await syncService.getStats();
      console.log(`Total cards: ${stats.totalCards}`);
      console.log(
        `Cards by type: ${stats.cardsByType
          .map((s) => `${s._id}: ${s.count}`)
          .join(", ")}`
      );
      console.log(
        `Cards by rarity: ${stats.cardsByRarity
          .map((s) => `${s._id}: ${s.count}`)
          .join(", ")}`
      );
      console.log(
        `Cards by set: ${stats.cardsBySet
          .map((s) => `${s._id}: ${s.count}`)
          .join(", ")}`
      );
    }

    console.log("\n🎉 Card sync process completed!");
  } catch (error) {
    console.error("\n💥 Fatal error:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("🔌 Database connection closed");
    }
    process.exit(0);
  }
}

// Run the main function
main().catch(console.error);
