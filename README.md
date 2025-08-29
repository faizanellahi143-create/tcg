# TCG Bot Simulator

## Docker: Build, Push, and Deploy (Production)

Set your registry/namespace/version and run the targets below. Defaults are shown.

```bash
# Choose your values
export REGISTRY=docker.io
export NAMESPACE=your-namespace    # e.g., your Docker Hub username
export VERSION=v1.0.0

# Optional: see computed image names
make images REGISTRY=$REGISTRY NAMESPACE=$NAMESPACE VERSION=$VERSION

# Login (Docker Hub)
make login REGISTRY=$REGISTRY

# Build images locally
make build REGISTRY=$REGISTRY NAMESPACE=$NAMESPACE VERSION=$VERSION

# Push images to registry
make push REGISTRY=$REGISTRY NAMESPACE=$NAMESPACE VERSION=$VERSION

# Deploy with docker compose using pulled images
make deploy REGISTRY=$REGISTRY NAMESPACE=$NAMESPACE VERSION=$VERSION

# Optionally tag and push :latest
make push-latest REGISTRY=$REGISTRY NAMESPACE=$NAMESPACE VERSION=$VERSION
```

`docker-compose.prod.yml` is parameterized to use:

```yaml
backend:
  image: ${IMAGE_BACKEND}
frontend:
  image: ${IMAGE_FRONTEND}
```

The `deploy` target sets those variables when calling `docker compose`.

A full-stack Trading Card Game (TCG) bot simulator built with React, Node.js, and MongoDB. This application allows users to build decks, simulate games, track collections, and compete with other players.

## 🏗️ Project Structure

```
tcg-bot-simulator/
├── frontend/                 # React + TypeScript frontend
│   ├── src/                 # Source code
│   ├── package.json         # Frontend dependencies
│   └── ...                 # Frontend config files
├── backend/                 # Node.js + Express backend
│   ├── src/                # Source code
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── package.json        # Backend dependencies
│   └── env.example         # Environment variables template
├── package.json            # Root workspace configuration
└── README.md               # This file
```

## 🚀 Features

### Frontend

- **Deck Builder**: Drag-and-drop card management
- **Card Collection**: Track your card inventory
- **Deck Sharing**: Share and discover decks
- **User Profiles**: Customizable user profiles and statistics
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live game simulation

### Backend

- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based user authentication
- **MongoDB Integration**: Scalable database with Mongoose ODM
- **Security**: Rate limiting, CORS, helmet, input validation
- **User Management**: User profiles, collections, and statistics
- **Deck Management**: Create, update, and share decks

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Query** for server state management
- **React DnD** for drag and drop functionality
- **React Hook Form** for form handling
- **Zustand** for client state management

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Morgan** for logging
- **CORS** for cross-origin requests

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **MongoDB** (local or cloud instance)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tcg-bot-simulator.git
cd tcg-bot-simulator
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Environment Setup

```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit backend/.env with your configuration
# Set your MongoDB URI and JWT secrets
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run dev:frontend    # Frontend on http://localhost:5173
npm run dev:backend     # Backend on http://localhost:5000
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tcg-bot-simulator

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRE=7d
```

### MongoDB Setup

1. **Local MongoDB**:

   ```bash
   # Install MongoDB locally
   brew install mongodb-community  # macOS
   # or
   sudo apt-get install mongodb    # Ubuntu

   # Start MongoDB service
   brew services start mongodb-community
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a cluster and get connection string
   - Update `MONGODB_URI` in your `.env` file

## 📚 Available Scripts

### Root Level

```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both frontend and backend
npm run install:all      # Install all dependencies
npm run lint             # Lint all workspaces
npm run test             # Run tests in all workspaces
npm run clean:all        # Clean all build artifacts
```

### Frontend

```bash
npm run dev:frontend     # Start frontend dev server
npm run build:frontend   # Build frontend for production
npm run preview:frontend # Preview production build
npm run lint:frontend    # Lint frontend code
```

### Backend

```bash
npm run dev:backend      # Start backend dev server
npm run build:backend    # Build backend for production
npm run start:backend    # Start production backend
npm run lint:backend     # Lint backend code
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Cards

- `GET /api/cards` - Get all cards (with filtering)
- `GET /api/cards/:id` - Get single card
- `POST /api/cards` - Create new card (admin)
- `PUT /api/cards/:id` - Update card (admin)
- `DELETE /api/cards/:id` - Delete card (admin)

### Decks

- `GET /api/decks` - Get public decks
- `GET /api/decks/my` - Get user's decks
- `GET /api/decks/:id` - Get single deck
- `POST /api/decks` - Create new deck
- `PUT /api/decks/:id` - Update deck
- `DELETE /api/decks/:id` - Delete deck
- `POST /api/decks/:id/like` - Like/unlike deck

### Users

- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/collection` - Get user collection
- `GET /api/users/:id/wishlist` - Get user wishlist
- `GET /api/users/leaderboard/rankings` - Get leaderboard

## 🗄️ Database Models

### User

- Profile information (username, email, display name, bio)
- Statistics (games played, win rate, rank)
- Collections (cards, wishlist)
- Preferences (theme, notifications, privacy)

### Card

- Basic info (name, type, description, image)
- Monster stats (attribute, level, attack, defense)
- Rarity and set information
- Ban list status

### Deck

- Deck information (name, description, format)
- Card composition with quantities
- Public/private visibility
- Statistics (views, likes, win rate)

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Input Validation** using express-validator
- **Security Headers** with helmet
- **MongoDB Injection Protection** with Mongoose

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

## 🚀 Deployment

### Frontend

```bash
npm run build:frontend
# Deploy the `frontend/dist` folder to your hosting service
```

### Backend

```bash
npm run build:backend
npm run start:backend
# Or use PM2 for production
pm2 start backend/dist/server.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/tcg-bot-simulator/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Express.js team for the web framework
- All contributors and users of this project

---

**Happy Gaming! 🎮**
