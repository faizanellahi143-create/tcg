# TCG Card Sync Service

This service allows you to fetch all cards from the Union Arena TCG API and save them to your local database. It includes both CLI and API interfaces for flexibility.

## Features

- 🔄 **Full Card Sync**: Fetch all cards from the TCG API with pagination support
- 🎯 **Filtered Sync**: Sync cards by specific name or criteria
- 💾 **Database Integration**: Automatically save/update cards in MongoDB
- 🚀 **CLI Interface**: Command-line tool for easy automation
- 🌐 **API Endpoints**: HTTP endpoints for web-based triggering
- 📊 **Progress Tracking**: Real-time progress updates and statistics
- 🧪 **Dry Run Mode**: Test sync without affecting database
- ⚡ **Rate Limiting**: Configurable delays to respect API limits
- 🔍 **Duplicate Handling**: Smart update logic for existing cards

## Prerequisites

- Node.js 16+ and npm
- MongoDB database running
- TCG API key from [https://apitcg.com/platform](https://apitcg.com/platform)
- Environment variables configured (see `.env.example`)

## Installation

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment variables:

```bash
cp env.example .env
# Edit .env with your MongoDB connection string
```

## Usage

### CLI Interface

The CLI script provides a powerful command-line interface for card synchronization.

#### Basic Commands

```bash
# Sync all cards
node scripts/syncCards.js

# Test sync without saving (dry run)
node scripts/syncCards.js --dry-run

# Sync cards with specific name
node scripts/syncCards.js --name "Gon"

# Sync with custom delay between requests
node scripts/syncCards.js --delay 2000

# Show database statistics
node scripts/syncCards.js --stats

# Combine options
node scripts/syncCards.js --dry-run --delay 1500 --stats
```

#### Command Line Options

| Option          | Description                     | Default   |
| --------------- | ------------------------------- | --------- |
| `--help, -h`    | Show help message               | -         |
| `--dry-run`     | Run without saving to database  | false     |
| `--name <name>` | Filter cards by name            | all cards |
| `--delay <ms>`  | Delay between API requests (ms) | 1000      |
| `--stats`       | Show database statistics        | false     |

### API Endpoints

The service also provides HTTP endpoints for web-based triggering.

#### POST `/api/cards/sync`

Trigger a card sync operation.

**Request Body:**

```json
{
  "name": "Gon", // Optional: filter by card name
  "delay": 1000, // Optional: delay between requests (ms)
  "dryRun": false // Optional: test mode without saving
}
```

**Response:**

```json
{
  "success": true,
  "message": "Sync completed successfully",
  "data": {
    "success": true,
    "cardsFetched": 99,
    "summary": {
      "total": 99,
      "saved": 95,
      "updated": 4,
      "errors": 0
    }
  }
}
```

#### GET `/api/cards/sync/stats`

Get current database statistics.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalCards": 1250,
    "cardsByType": [
      { "_id": "Character", "count": 800 },
      { "_id": "Event", "count": 300 },
      { "_id": "Stage", "count": 150 }
    ],
    "cardsByRarity": [
      { "_id": "C", "count": 600 },
      { "_id": "R", "count": 400 },
      { "_id": "SR", "count": 200 },
      { "_id": "UR", "count": 50 }
    ],
    "cardsBySet": [
      { "_id": "HUNTER X HUNTER", "count": 500 },
      { "_id": "DRAGON BALL", "count": 400 },
      { "_id": "ONE PIECE", "count": 350 }
    ]
  }
}
```

#### GET `/api/cards/sync/test`

Test TCG API connectivity.

**Response:**

```json
{
  "success": true,
  "connected": true,
  "message": "TCG API is accessible"
}
```

## Configuration

### Environment Variables

```bash
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/tcg-bot-simulator

# Optional: Custom TCG API base URL
TCG_API_BASE_URL=https://apitcg.com/api/union-arena
```

### Rate Limiting

The service includes built-in rate limiting to be respectful to the TCG API:

- **Default delay**: 1000ms (1 second) between requests
- **Configurable**: Set custom delays via CLI or API
- **Smart retry**: Automatic retry with exponential backoff for server errors
- **User-Agent**: Proper identification in API requests

## Database Schema

The updated Card model includes all TCG API fields:

```javascript
{
  // TCG API fields
  tcgId: String,           // Unique TCG identifier
  code: String,            // Card code
  url: String,             // Card detail URL
  name: String,            // Card name
  rarity: String,          // Card rarity
  ap: String,              // Action points
  type: String,            // Card type
  bp: String,              // Battle points
  affinity: String,        // Energy affinity
  effect: String,          // Card effect text
  trigger: String,         // Trigger effect
  images: {                // Card images
    small: String,
    large: String
  },
  set: {                   // Card set information
    name: String
  },
  needEnergy: {            // Energy requirements
    value: String,
    logo: String
  },

  // Legacy fields (backward compatibility)
  description: String,
  imageUrl: String,
  cardNumber: String,
  // ... other existing fields
}
```

## Error Handling

The service includes comprehensive error handling:

- **API Errors**: Network issues, rate limits, server errors
- **Database Errors**: Connection issues, validation errors
- **Data Errors**: Malformed responses, missing fields
- **Graceful Degradation**: Continue processing other cards on individual failures

## Monitoring and Logging

- **Progress Tracking**: Real-time updates on sync progress
- **Detailed Logging**: Comprehensive console output
- **Error Reporting**: Detailed error information with context
- **Statistics**: Complete summary of sync operations

## Best Practices

1. **Start with Dry Run**: Always test with `--dry-run` first
2. **Respect Rate Limits**: Use appropriate delays (1000ms+ recommended)
3. **Monitor Progress**: Watch console output for issues
4. **Backup Database**: Ensure you have backups before large syncs
5. **Test Connectivity**: Use `/sync/test` endpoint to verify API access

## Troubleshooting

### Common Issues

1. **Connection Errors**

   - Check internet connectivity
   - Verify TCG API is accessible
   - Check firewall settings

2. **Database Errors**

   - Verify MongoDB connection string
   - Check database permissions
   - Ensure sufficient disk space

3. **Rate Limiting**
   - Increase delay between requests
   - Check API response headers
   - Implement exponential backoff

### Getting Help

- Check console output for detailed error messages
- Verify environment variables are set correctly
- Test API connectivity with `/sync/test` endpoint
- Review MongoDB logs for database issues

## Examples

### Full Production Sync

```bash
# Sync all cards with 2-second delays
node scripts/syncCards.js --delay 2000 --stats
```

### Development Testing

```bash
# Test sync without affecting database
node scripts/syncCards.js --dry-run --delay 500
```

### Targeted Sync

```bash
# Sync only specific cards
node scripts/syncCards.js --name "Gon Freecss" --stats
```

### Web-Based Sync

```bash
# Trigger sync via API
curl -X POST http://localhost:3000/api/cards/sync \
  -H "Content-Type: application/json" \
  -d '{"delay": 1500, "dryRun": false}'
```

## License

This service is part of the TCG Bot Simulator project and follows the same license terms.
