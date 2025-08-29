import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { useDrop } from "react-dnd";
import { Trash2 } from "lucide-react";
import { getHTML5Backend } from "./utils/dndBackendSingleton";
import { CardFilters } from "./components/CardFilters";
import { CardGrid } from "./components/CardGrid";
import { DeckView } from "./components/DeckView";
import { CardDetailModal } from "./components/CardDetailModal";
import { ExportDeckModal } from "./components/ExportDeckModal";
import { AuthModal } from "./components/AuthModal";
import { MyCards } from "./components/MyCards";
import { MetaTracker } from "./components/MetaTracker";
import { DeckStatistics } from "./components/DeckStatistics";
import { DeckComparison } from "./components/DeckComparison";
import { SavedDecksList } from "./components/SavedDecksList";
import { CommunityHub } from "./components/CommunityHub";
import { PublicDeckBrowser } from "./components/PublicDeckBrowser";
import { SavedDeckDetailModal } from "./components/SavedDeckDetailModal";
import { AIAnalysisPanel } from "./components/AIAnalysisPanel";
import { VersionModal } from "./components/VersionModal";
import { DeckSharingModal } from "./components/DeckSharingModal";
import { Library as LibraryComponent } from "./components/Library";
import { useDeckBuilder } from "./hooks/useDeckBuilder";
import {
  Zap,
  Library,
  Users,
  LogIn,
  LogOut,
  User,
  Package,
  TrendingUp,
  BarChart3,
  Globe,
} from "lucide-react";
import { GundamCard } from "./types/card";

interface RemoveFromDeckZoneProps {
  onRemoveFromDeck: (card: GundamCard) => void;
}

const RemoveFromDeckZone: React.FC<RemoveFromDeckZoneProps> = ({
  onRemoveFromDeck,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: { card: GundamCard }) => {
      onRemoveFromDeck(item.card);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`h-20 bg-red-600 border-t-4 border-red-400 flex items-center justify-center transition-all duration-200 ${
        isOver ? "bg-red-500 border-red-300" : ""
      }`}
    >
      <div className="flex items-center gap-3 text-white">
        <Trash2 size={24} />
        <span className="text-lg font-medium">
          {isOver
            ? "Release to remove from deck"
            : "Drag cards here to remove from deck"}
        </span>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState<
    "library" | "my-decks" | "my-cards" | "meta" | "stats" | "community"
  >("library");

  const {
    filters,
    setFilters,
    filteredCards,
    deck,
    deckQuantities,
    selectedCard,
    setSelectedCard,
    user,
    userCollection,
    userWishlist,
    addToCollection,
    removeFromCollection,
    addToWishlist,
    removeFromWishlist,
    showAuthModal,
    setShowAuthModal,
    showExportModal,
    setShowExportModal,
    isDraggingCard,
    setIsDraggingCard,
    login,
    signup,
    logout,
    addToDeck,
    removeFromDeck,
    saveDeck,
    exportDeck,
    importDeck,
    savedDecks,
    compareDecksWithAI,
    aiComparisonResults,
    isAnalyzing,
    loadSavedDeck,
    deleteSavedDeck,
    selectedSavedDeckForView,
    setSelectedSavedDeckForView,
    selectedDeckForAIAnalysis,
    setSelectedDeckForAIAnalysis,
    showVersionModal,
    setShowVersionModal,
    versionNotes,
    setVersionNotes,
    deckFilters,
    setDeckFilters,
    filteredAndSortedDecks,
    revertDeckToVersion,
    deleteVersion,
    showSharingModal,
    setShowSharingModal,
    handleShareDeckSubmit,
    publicDecks,
    userLikes,
    userFollowing,
    likeDeck,
    followUser,
    loadPublicDeck,
    featuredDecks,
    trendingDecks,
    addGameRecordToDeck,
  } = useDeckBuilder();

  // Mock topBuilders data since it's not returned by useDeckBuilder
  const topBuilders = [
    { id: "1", username: "GundamAce", followers: 1250, decks: 45 },
    { id: "2", username: "ZeonPilot", followers: 980, decks: 32 },
    { id: "3", username: "FederationForce", followers: 875, decks: 28 },
  ];

  const tabs = [
    { id: "library", label: "Library", icon: Library },
    { id: "my-decks", label: "My Decks", icon: Users },
    { id: "my-cards", label: "My Cards", icon: Package },
    { id: "community", label: "Community", icon: Globe },
    { id: "meta", label: "Meta", icon: TrendingUp },
  ];

  return (
    <DndProvider backend={getHTML5Backend()}>
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Mobile Suit TCG Club
                  </h1>
                  <p className="text-sm text-gray-400">
                    Suit up, pilots — it's time to draw.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <nav className="flex items-center gap-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-800 text-white"
                            : "text-gray-300 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>

                {/* Auth Section */}
                <div className="flex items-center gap-2 border-l border-slate-600 pl-4">
                  {user ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <User size={16} />
                        <span className="text-sm">{user.username}</span>
                      </div>
                      <button
                        onClick={logout}
                        className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <LogIn size={16} />
                      Stand Down
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === "library" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Dynamic Card Library */}
              <div className="lg:col-span-1">
                <LibraryComponent
                  onCardClick={(card) => {
                    // Convert TcgCard to GundamCard for compatibility
                    const gundamCard: GundamCard = {
                      id: card._id,
                      name: card.name,
                      cost: parseInt(card.ap) || 0,
                      type: "Unit",
                      colors:
                        card.affinity && card.affinity !== "-"
                          ? [card.affinity as any]
                          : ["Colorless"],
                      rarity: card.rarity,
                      set: card.set?.name || "",
                      power: parseInt(card.bp) || 0,
                      hp: parseInt(card.bp) || 0,
                      ap: parseInt(card.ap) || 0,
                      abilities: card.effect ? [card.effect] : [],
                      image: card.images?.large || card.imageUrl || "",
                      flavorText: card.description || card.effect || "",
                    };
                    setSelectedCard(gundamCard);
                  }}
                  onAddToDeck={(card) => {
                    // Convert TcgCard to GundamCard for compatibility
                    const gundamCard: GundamCard = {
                      id: card._id,
                      name: card.name,
                      cost: parseInt(card.ap) || 0,
                      type: "Unit",
                      colors:
                        card.affinity && card.affinity !== "-"
                          ? [card.affinity as any]
                          : ["Colorless"],
                      rarity: card.rarity,
                      set: card.set?.name || "",
                      power: parseInt(card.bp) || 0,
                      hp: parseInt(card.bp) || 0,
                      ap: parseInt(card.ap) || 0,
                      abilities: card.effect ? [card.effect] : [],
                      image: card.images?.large || card.imageUrl || "",
                      flavorText: card.description || card.effect || "",
                    };
                    addToDeck(gundamCard);
                  }}
                  onRemoveFromDeck={(card) => {
                    // Convert TcgCard to GundamCard for compatibility
                    const gundamCard: GundamCard = {
                      id: card._id,
                      name: card.name,
                      cost: parseInt(card.ap) || 0,
                      type: "Unit",
                      colors:
                        card.affinity && card.affinity !== "-"
                          ? [card.affinity as any]
                          : ["Colorless"],
                      rarity: card.rarity,
                      set: card.set?.name || "",
                      power: parseInt(card.bp) || 0,
                      hp: parseInt(card.bp) || 0,
                      ap: parseInt(card.ap) || 0,
                      abilities: card.effect ? [card.effect] : [],
                      image: card.images?.large || card.imageUrl || "",
                      flavorText: card.description || card.effect || "",
                    };
                    removeFromDeck(gundamCard);
                  }}
                  deckQuantities={deckQuantities}
                  setIsDraggingCard={setIsDraggingCard}
                />
              </div>

              {/* Deck Builder & Analysis */}
              <div className="lg:col-span-1 space-y-6">
                <DeckView
                  deck={deck}
                  onCardClick={setSelectedCard}
                  onAddToDeck={addToDeck}
                  onRemoveFromDeck={removeFromDeck}
                  onSaveDeck={saveDeck}
                  onShareDeckClick={() => setShowSharingModal(true)}
                  onExportDeck={exportDeck}
                  onImportDeck={importDeck}
                  setIsDraggingCard={setIsDraggingCard}
                />
              </div>
            </div>
          )}

          {activeTab === "my-cards" && (
            <MyCards
              collection={userCollection}
              wishlist={userWishlist}
              allCards={filteredCards}
              onAddToCollection={addToCollection}
              onRemoveFromCollection={removeFromCollection}
              onAddToWishlist={addToWishlist}
              onRemoveFromWishlist={removeFromWishlist}
              onCardClick={setSelectedCard}
              setIsDraggingCard={setIsDraggingCard}
            />
          )}

          {activeTab === "community" && (
            <div className="space-y-6">
              <CommunityHub
                publicDecks={publicDecks}
                featuredDecks={featuredDecks}
                trendingDecks={trendingDecks}
                topBuilders={topBuilders}
                onViewDeck={setSelectedSavedDeckForView}
                onFollowUser={followUser}
              />

              <PublicDeckBrowser
                publicDecks={publicDecks}
                onLoadDeck={loadPublicDeck}
                onViewDeck={setSelectedSavedDeckForView}
                onLikeDeck={likeDeck}
                onFollowUser={followUser}
                userLikes={userLikes}
                userFollowing={userFollowing}
              />
            </div>
          )}

          {activeTab === "meta" && <MetaTracker />}

          {activeTab === "my-decks" && (
            <div className="space-y-6">
              <SavedDecksList
                savedDecks={savedDecks}
                filteredAndSortedDecks={filteredAndSortedDecks}
                deckFilters={deckFilters}
                onDeckFiltersChange={setDeckFilters}
                onLoadDeck={loadSavedDeck}
                onDeleteDeck={deleteSavedDeck}
                onViewDeck={setSelectedSavedDeckForView}
                onAnalyzeDeck={setSelectedDeckForAIAnalysis}
                selectedDeckForAnalysis={selectedDeckForAIAnalysis}
              />

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <DeckComparison
                    savedDecks={savedDecks}
                    compareDecksWithAI={compareDecksWithAI}
                    aiComparisonResults={aiComparisonResults}
                    isAnalyzing={isAnalyzing}
                  />
                </div>

                <div>
                  <AIAnalysisPanel deck={selectedDeckForAIAnalysis} />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Drag to Remove Zone */}
        {isDraggingCard && (
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <RemoveFromDeckZone onRemoveFromDeck={removeFromDeck} />
          </div>
        )}

        {/* Card Detail Modal */}
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />

        {/* Export Modal */}
        {showExportModal && (
          <ExportDeckModal
            deck={deck}
            deckName="Current Deck"
            onClose={() => setShowExportModal(false)}
          />
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={login}
          onSignup={signup}
        />

        {/* Saved Deck Detail Modal */}
        <SavedDeckDetailModal
          deck={selectedSavedDeckForView}
          onClose={() => setSelectedSavedDeckForView(null)}
          onAddGameRecord={(gameRecord) => {
            if (selectedSavedDeckForView) {
              addGameRecordToDeck(selectedSavedDeckForView.id, gameRecord);
            }
          }}
          onRevertToVersion={() => console.log("Revert not implemented")}
          onDeleteVersion={() => console.log("Delete version not implemented")}
        />

        {/* Version Modal */}
        <VersionModal
          isOpen={showVersionModal}
          onClose={() => setShowVersionModal(false)}
          onSave={() => console.log("Save version not implemented")}
          versionNotes={versionNotes}
          setVersionNotes={setVersionNotes}
        />

        {/* Deck Sharing Modal */}
        <DeckSharingModal
          deck={
            deck.length > 0
              ? {
                  id: "current",
                  name: "Current Deck",
                  cards: deck,
                  totalCards: deck.reduce(
                    (sum, card) => sum + card.quantity,
                    0
                  ),
                  colors: [...new Set(deck.flatMap((card) => card.colors))],
                  isPublic: false,
                  marketValue: deck.reduce(
                    (sum, card) =>
                      sum + (card.marketPrice || 0) * card.quantity,
                    0
                  ),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }
              : null
          }
          isOpen={showSharingModal}
          onClose={() => setShowSharingModal(false)}
          onShare={handleShareDeckSubmit}
        />

        {/* Hidden deck display for image export */}
        <div id="deck-display" className="hidden">
          <div className="bg-white p-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Gundam TCG Deck
            </h1>
            <div className="grid grid-cols-6 gap-2">
              {deck.map((card, index) => (
                <div key={index} className="text-center">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full rounded"
                  />
                  <div className="text-xs mt-1">
                    {card.quantity}x {card.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
