// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB("tcg-bot-simulator");

// Create collections with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password"],
      properties: {
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 30,
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        },
        password: {
          bsonType: "string",
          minLength: 6,
        },
      },
    },
  },
});

db.createCollection("cards", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "description", "imageUrl"],
      properties: {
        name: {
          bsonType: "string",
          maxLength: 100,
        },
        type: {
          enum: ["Monster", "Spell", "Trap", "Trap Monster"],
        },
        description: {
          bsonType: "string",
          maxLength: 1000,
        },
      },
    },
  },
});

db.createCollection("decks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "createdBy"],
      properties: {
        name: {
          bsonType: "string",
          maxLength: 100,
        },
        mainDeck: {
          bsonType: "int",
          minimum: 40,
          maximum: 60,
        },
      },
    },
  },
});

// Create indexes for better performance
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ "stats.rank": 1 });

db.cards.createIndex({ name: "text", description: "text" });
db.cards.createIndex({ type: 1 });
db.cards.createIndex({ attribute: 1 });
db.cards.createIndex({ rarity: 1 });
db.cards.createIndex({ isBanned: 1 });

db.decks.createIndex({ name: "text", description: "text" });
db.decks.createIndex({ createdBy: 1 });
db.decks.createIndex({ isPublic: 1 });
db.decks.createIndex({ format: 1 });
db.decks.createIndex({ tags: 1 });

// Create admin user if it doesn't exist
const adminUser = db.users.findOne({ username: "admin" });
if (!adminUser) {
  // Note: In production, use proper password hashing
  db.users.insertOne({
    username: "admin",
    email: "admin@tcg-bot-simulator.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Q8qK8e", // "admin123"
    profile: {
      displayName: "Administrator",
      bio: "System Administrator",
    },
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalPlayTime: 0,
      rank: "Master",
    },
    preferences: {
      theme: "dark",
      notifications: {
        email: true,
        push: true,
      },
      privacy: {
        profilePublic: true,
        showStats: true,
      },
    },
    isVerified: true,
    isAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  print("✅ Admin user created successfully");
} else {
  print("ℹ️  Admin user already exists");
}

// Create some sample cards if none exist
const cardCount = db.cards.countDocuments();
if (cardCount === 0) {
  const sampleCards = [
    {
      name: "Blue-Eyes White Dragon",
      type: "Monster",
      attribute: "LIGHT",
      level: 8,
      attack: 3000,
      defense: 2500,
      description:
        "This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.",
      imageUrl: "https://example.com/blue-eyes-white-dragon.jpg",
      rarity: "Ultra Rare",
      set: "Legend of Blue Eyes White Dragon",
      cardNumber: "LOB-001",
      isBanned: false,
      isLimited: false,
      tags: ["Dragon", "Legendary", "Classic"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Dark Magician",
      type: "Monster",
      attribute: "DARK",
      level: 7,
      attack: 2500,
      defense: 2100,
      description: "The ultimate wizard in terms of attack and defense.",
      imageUrl: "https://example.com/dark-magician.jpg",
      rarity: "Ultra Rare",
      set: "Legend of Blue Eyes White Dragon",
      cardNumber: "LOB-005",
      isBanned: false,
      isLimited: false,
      tags: ["Spellcaster", "Classic", "Magician"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Pot of Greed",
      type: "Spell",
      description: "Draw 2 cards from your deck.",
      imageUrl: "https://example.com/pot-of-greed.jpg",
      rarity: "Common",
      set: "Legend of Blue Eyes White Dragon",
      cardNumber: "LOB-118",
      isBanned: true,
      isLimited: false,
      tags: ["Draw", "Banned", "Classic"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  db.cards.insertMany(sampleCards);
  print("✅ Sample cards created successfully");
} else {
  print(`ℹ️  ${cardCount} cards already exist in database`);
}

print("🎉 MongoDB initialization completed successfully!");
print("📊 Database: tcg-bot-simulator");
print("👤 Admin credentials: admin / admin123");
print("🔗 Mongo Express: http://localhost:8081");
print("🔗 Backend API: http://localhost:5000");
print("🔗 Frontend: http://localhost:5173");
