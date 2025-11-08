import React, { useEffect, useState } from 'react';

interface PricePoint {
  time: string;
  price: number;
}

interface CardPrice {
  name: string;
  currentPrice: number;
  change24h: number;
  changePercent: number;
  priceHistory: PricePoint[];
  rarity: string;
  marketCap: number;
}

const MOCK_CARD_DATA: CardPrice[] = [
  {
    name: 'Charizard VMAX',
    currentPrice: 245.99,
    change24h: 12.5,
    changePercent: 5.35,
    rarity: 'Rainbow Rare',
    marketCap: 1250000,
    priceHistory: [
      { time: '00:00', price: 233.49 },
      { time: '04:00', price: 238.2 },
      { time: '08:00', price: 242.15 },
      { time: '12:00', price: 240.8 },
      { time: '16:00', price: 244.3 },
      { time: '20:00', price: 245.99 },
    ],
  },
  {
    name: 'Black Lotus Alpha',
    currentPrice: 15240.0,
    change24h: -187.5,
    changePercent: -1.22,
    rarity: 'Power Nine',
    marketCap: 8500000,
    priceHistory: [
      { time: '00:00', price: 15427.5 },
      { time: '04:00', price: 15380.2 },
      { time: '08:00', price: 15295.75 },
      { time: '12:00', price: 15310.4 },
      { time: '16:00', price: 15268.9 },
      { time: '20:00', price: 15240.0 },
    ],
  },
  {
    name: 'Blue-Eyes White Dragon',
    currentPrice: 1250.0,
    change24h: 45.8,
    changePercent: 3.8,
    rarity: 'Secret Rare',
    marketCap: 680000,
    priceHistory: [
      { time: '00:00', price: 1204.2 },
      { time: '04:00', price: 1218.5 },
      { time: '08:00', price: 1235.75 },
      { time: '12:00', price: 1242.3 },
      { time: '16:00', price: 1247.6 },
      { time: '20:00', price: 1250.0 },
    ],
  },
];

interface CardValueTrackerProps {
  className?: string;
}

const CardValueTracker: React.FC<CardValueTrackerProps> = ({ className = '' }) => {
  const [selectedCard, setSelectedCard] = useState(0);
  const [animatedPrices, setAnimatedPrices] = useState<number[]>([]);
  const [isLive, setIsLive] = useState(false);

  // Simulate live price updates
  useEffect(() => {
    if (!isLive) {
      return;
    }

    const interval = setInterval(() => {
      setAnimatedPrices(prev => {
        return MOCK_CARD_DATA.map((card, index) => {
          const currentAnimated = prev[index] || card.currentPrice;
          const variation = (Math.random() - 0.5) * (card.currentPrice * 0.02); // 2% max variation
          return Math.max(0, currentAnimated + variation);
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Initialize animated prices
  useEffect(() => {
    setAnimatedPrices(MOCK_CARD_DATA.map(card => card.currentPrice));
  }, []);

  const currentCard = MOCK_CARD_DATA[selectedCard];
  const currentAnimatedPrice = animatedPrices[selectedCard] || currentCard?.currentPrice || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, isPercent = false) => {
    const sign = change > 0 ? '+' : '';
    if (isPercent) {
      return `${sign}${change.toFixed(2)}%`;
    }
    return `${sign}${formatPrice(change)}`;
  };

  const maxPrice = Math.max(...currentCard.priceHistory.map(p => p.price));
  const minPrice = Math.min(...currentCard.priceHistory.map(p => p.price));

  return (
    <div className={`card-value-tracker ${className}`}>
      <div className="neo-holo-card overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="border-border bg-card border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">EU Market Tracker</h3>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                isLive
                  ? 'border border-red-500/30 bg-red-500/20 text-red-400'
                  : 'border border-green-500/30 bg-green-500/20 text-green-400'
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${isLive ? 'animate-pulse bg-red-400' : 'bg-green-400'}`}
              />
              {isLive ? 'LIVE' : 'PAUSED'}
            </button>
          </div>

          {/* Card Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible">
            {MOCK_CARD_DATA.map((card, index) => (
              <button
                key={card.name}
                onClick={() => setSelectedCard(index)}
                className={`flex-shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-all lg:flex-1 lg:text-sm ${
                  selectedCard === index
                    ? 'border-holo-primary bg-holo-primary/10 text-holo-primary'
                    : 'border-border text-muted-foreground hover:border-holo-primary/50 bg-transparent'
                }`}
              >
                <span className="lg:hidden">{card.name.split(' ').slice(0, 2).join(' ')}</span>
                <span className="hidden lg:inline">{card.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Display */}
        <div className="p-4">
          <div className="mb-4">
            <div className="mb-2 flex items-baseline justify-between">
              <h4 className="truncate text-lg font-semibold">{currentCard.name}</h4>
              <span className="text-muted-foreground text-xs">{currentCard.rarity}</span>
            </div>

            <div className="mb-2 flex items-baseline gap-2">
              <span className="neo-holo-text text-2xl font-bold">
                {formatPrice(isLive ? currentAnimatedPrice : currentCard.currentPrice)}
              </span>
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-medium ${
                    currentCard.change24h > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatChange(currentCard.change24h)}
                </span>
                <span
                  className={`text-xs ${
                    currentCard.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  ({formatChange(currentCard.changePercent, true)})
                </span>
                <svg
                  className={`h-3 w-3 ${
                    currentCard.change24h > 0
                      ? 'rotate-0 text-green-400'
                      : 'rotate-180 text-red-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
            </div>

            <div className="text-muted-foreground text-xs">
              Market Cap: {formatPrice(currentCard.marketCap)}
            </div>
          </div>

          {/* Price Chart */}
          <div className="mb-4">
            <div className="text-muted-foreground mb-2 text-xs font-medium lg:text-sm">
              24h Price Movement
            </div>
            <div className="bg-muted/20 relative h-24 rounded-lg p-2 lg:h-32">
              {/* Chart Grid */}
              <svg className="absolute inset-2" width="100%" height="100%">
                {/* Grid lines */}
                {[...Array(4)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={`${(i * 100) / 3}%`}
                    x2="100%"
                    y2={`${(i * 100) / 3}%`}
                    stroke="hsl(var(--border))"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                ))}
                {[...Array(6)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={`${(i * 100) / 5}%`}
                    y1="0"
                    x2={`${(i * 100) / 5}%`}
                    y2="100%"
                    stroke="hsl(var(--border))"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                ))}

                {/* Price Line */}
                <polyline
                  points={currentCard.priceHistory
                    .map((point, i) => {
                      const x = (i * 100) / (currentCard.priceHistory.length - 1);
                      const y = 100 - ((point.price - minPrice) / (maxPrice - minPrice)) * 100;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke={
                    currentCard.change24h > 0
                      ? 'hsl(var(--holo-success))'
                      : 'hsl(var(--holo-error))'
                  }
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />

                {/* Data Points */}
                {currentCard.priceHistory.map((point, i) => (
                  <circle
                    key={i}
                    cx={`${(i * 100) / (currentCard.priceHistory.length - 1)}%`}
                    cy={`${100 - ((point.price - minPrice) / (maxPrice - minPrice)) * 100}%`}
                    r="2"
                    fill={
                      currentCard.change24h > 0
                        ? 'hsl(var(--holo-success))'
                        : 'hsl(var(--holo-error))'
                    }
                    className="drop-shadow-sm"
                  />
                ))}
              </svg>

              {/* Time labels */}
              <div className="text-muted-foreground absolute bottom-0 left-2 right-2 flex justify-between text-xs">
                {currentCard.priceHistory.map((point, i) => (
                  <span key={i} className={i % 2 === 0 ? 'block' : 'hidden sm:block'}>
                    {point.time}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/20 rounded-lg p-3 text-center">
              <div className="text-muted-foreground text-xs">24h High</div>
              <div className="font-semibold text-green-400">{formatPrice(maxPrice)}</div>
            </div>
            <div className="bg-muted/20 rounded-lg p-3 text-center">
              <div className="text-muted-foreground text-xs">24h Low</div>
              <div className="font-semibold text-red-400">{formatPrice(minPrice)}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="neo-holo-card flex items-center justify-center gap-2 p-3 text-sm transition-all hover:scale-105">
              <span>📊</span>
              <span>View Details</span>
            </button>
            <button className="neo-holo-card flex items-center justify-center gap-2 p-3 text-sm transition-all hover:scale-105">
              <span>🔔</span>
              <span>Set Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Market Summary */}
      <div className="bg-holo-accent/10 border-holo-accent/20 mt-4 rounded-lg border p-3">
        <div className="flex items-start gap-2">
          <span className="text-lg">📈</span>
          <div>
            <p className="text-holo-accent text-sm font-medium">Live EU Market Data</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Real-time pricing from Cardmarket and major European retailers. Updates every 30
              seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardValueTracker;
