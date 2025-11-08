import React, { useEffect, useRef, useState } from 'react';
import TCGCard3D from './TCGCard3D';

interface CardData {
  game: 'pokemon' | 'onepiece' | 'yugioh' | 'magic' | 'lorcana';
  cardName: string;
  imageUrl?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  value?: string;
}

const FEATURED_CARDS: CardData[] = [
  {
    game: 'pokemon',
    cardName: 'Charizard',
    imageUrl: '/images/cards/pokemon/charizard.png',
    rarity: 'legendary',
    description: 'The iconic fire-type dragon loved by collectors worldwide',
    value: '€245',
  },
  {
    game: 'onepiece',
    cardName: 'Monkey D. Luffy',
    imageUrl: '/images/cards/onepiece/luffy.png',
    rarity: 'rare',
    description: 'Future Pirate King from the Grand Line',
    value: '€89',
  },
  {
    game: 'pokemon',
    cardName: 'Pikachu',
    imageUrl: '/images/cards/pokemon/pikachu.png',
    rarity: 'rare',
    description: "Everyone's favorite electric mouse Pokémon",
    value: '€156',
  },
  {
    game: 'lorcana',
    cardName: 'Elsa',
    imageUrl: '/images/cards/lorcana/elsa.png',
    rarity: 'epic',
    description: 'Snow Queen with magical ice powers',
    value: '€67',
  },
  {
    game: 'pokemon',
    cardName: 'Blastoise',
    imageUrl: '/images/cards/pokemon/blastoise.png',
    rarity: 'rare',
    description: 'Water-type powerhouse with hydro cannons',
    value: '€134',
  },
];

interface MobileCardCarouselProps {
  className?: string;
}

const ResponsiveCardCarousel: React.FC<MobileCardCarouselProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % FEATURED_CARDS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentIndex(prev => (prev + 1) % FEATURED_CARDS.length);
    }
    if (isRightSwipe) {
      setCurrentIndex(prev => (prev - 1 + FEATURED_CARDS.length) % FEATURED_CARDS.length);
    }

    // Resume auto-play after interaction
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const currentCard = FEATURED_CARDS[currentIndex];

  return (
    <div className={`responsive-card-carousel relative w-full ${className}`}>
      {/* Hero Card Display */}
      <div
        ref={carouselRef}
        className="relative h-[400px] overflow-hidden rounded-2xl lg:h-[500px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background with game-specific gradient */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            background: getGameGradient(currentCard.game),
            filter: 'blur(120px)',
            transform: 'scale(1.2)',
          }}
        />

        {/* Holographic overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              linear-gradient(
                135deg,
                hsla(var(--holo-primary), 0.1) 0%,
                hsla(var(--holo-secondary), 0.15) 25%,
                hsla(var(--holo-tertiary), 0.1) 50%,
                hsla(var(--holo-accent), 0.15) 75%,
                hsla(var(--holo-primary), 0.1) 100%
              )
            `,
          }}
        />

        {/* Main card display */}
        <div className="relative flex h-full items-center justify-center">
          <div className="flex transform transition-transform duration-700 ease-out">
            <TCGCard3D
              key={currentCard.cardName}
              game={currentCard.game}
              cardName={currentCard.cardName}
              imageUrl={currentCard.imageUrl}
              rarity={currentCard.rarity}
              scale={1.4}
              opacity={1}
              enable3D={true}
              enableFadeIn={true}
              animationDelay={200}
              className="drop-shadow-2xl lg:scale-110"
            />
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() =>
            goToSlide((currentIndex - 1 + FEATURED_CARDS.length) % FEATURED_CARDS.length)
          }
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/30"
          aria-label="Previous card"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => goToSlide((currentIndex + 1) % FEATURED_CARDS.length)}
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/30"
          aria-label="Next card"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Card Info Panel */}
      <div className="neo-holo-card mt-6 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-foreground text-xl font-bold">{currentCard.cardName}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getRarityBadgeClass(
                  currentCard.rarity
                )}`}
              >
                {currentCard.rarity.toUpperCase()}
              </span>
            </div>
            <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
              {currentCard.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Market Value:</span>
              <span className="neo-holo-text text-lg font-bold">{currentCard.value}</span>
              <span className="text-xs text-green-500">↗ +12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="mt-4 flex justify-center gap-2">
        {FEATURED_CARDS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-8 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-holo-primary shadow-lg'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="neo-holo-card flex items-center justify-center gap-2 p-4 transition-all hover:scale-105">
          <span className="text-2xl">📷</span>
          <span className="text-sm font-semibold">Scan Card</span>
        </button>
        <button className="neo-holo-card flex items-center justify-center gap-2 p-4 transition-all hover:scale-105">
          <span className="text-2xl">💰</span>
          <span className="text-sm font-semibold">Check Price</span>
        </button>
      </div>
    </div>
  );
};

// Helper functions
function getGameGradient(game: string): string {
  switch (game) {
    case 'pokemon':
      return 'radial-gradient(circle at 30% 70%, #3B82F6 0%, #EF4444 50%, #F59E0B 100%)';
    case 'onepiece':
      return 'radial-gradient(circle at 30% 70%, #DC2626 0%, #1F2937 50%, #F59E0B 100%)';
    case 'lorcana':
      return 'radial-gradient(circle at 30% 70%, #8B5CF6 0%, #06B6D4 50%, #F97316 100%)';
    case 'magic':
      return 'radial-gradient(circle at 30% 70%, #1F2937 0%, #059669 50%, #DC2626 100%)';
    case 'yugioh':
      return 'radial-gradient(circle at 30% 70%, #7C2D12 0%, #B45309 50%, #FDE047 100%)';
    default:
      return 'radial-gradient(circle at 30% 70%, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)';
  }
}

function getRarityBadgeClass(rarity: string): string {
  switch (rarity) {
    case 'legendary':
      return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
    case 'epic':
      return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    case 'rare':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case 'uncommon':
      return 'bg-green-500/20 text-green-300 border border-green-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
  }
}

export default ResponsiveCardCarousel;
