import React, { useRef, useState } from 'react';

interface ARScannerDemoProps {
  className?: string;
}

interface ScanResult {
  cardName: string;
  game: string;
  rarity: string;
  value: string;
  confidence: number;
  setInfo?: string;
}

const MOCK_SCAN_RESULTS: ScanResult[] = [
  {
    cardName: 'Charizard VMAX',
    game: 'Pokémon',
    rarity: 'Rainbow Rare',
    value: '€245.99',
    confidence: 98.7,
    setInfo: "Champion's Path",
  },
  {
    cardName: 'Black Lotus',
    game: 'Magic: The Gathering',
    rarity: 'Power Nine',
    value: '€15,000+',
    confidence: 99.2,
    setInfo: 'Alpha',
  },
  {
    cardName: 'Blue-Eyes White Dragon',
    game: 'Yu-Gi-Oh!',
    rarity: 'Secret Rare',
    value: '€1,250.00',
    confidence: 96.4,
    setInfo: 'Legend of Blue Eyes',
  },
];

const ARScannerDemo: React.FC<ARScannerDemoProps> = ({ className = '' }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const videoRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  const analysisSteps = [
    'Detecting card edges...',
    'Analyzing image quality...',
    'Comparing with database...',
    'Verifying match confidence...',
    'Fetching market data...',
  ];

  const startScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setShowResult(false);
    setScanProgress(0);
    setAnalysisStep(0);

    // Simulate scanning process
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Show result after scan completes
          setTimeout(() => {
            const randomResult =
              MOCK_SCAN_RESULTS[Math.floor(Math.random() * MOCK_SCAN_RESULTS.length)];
            setScanResult(randomResult);
            setShowResult(true);
            setIsScanning(false);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Update analysis steps
    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev >= analysisSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  };

  const resetDemo = () => {
    setIsScanning(false);
    setScanResult(null);
    setShowResult(false);
    setScanProgress(0);
    setAnalysisStep(0);
  };

  return (
    <div className={`ar-scanner-demo relative w-full ${className}`}>
      <div className="neo-holo-card relative overflow-hidden rounded-2xl">
        {/* Camera Viewport */}
        <div
          ref={videoRef}
          className="relative aspect-[4/3] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 lg:aspect-[16/10]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%)
            `,
          }}
        >
          {/* Simulated camera feed background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/20" />

            {/* Mock card in viewfinder */}
            <div
              className={`absolute left-1/2 top-1/2 h-40 w-28 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border-2 transition-all duration-300 ${
                isScanning ? 'border-holo-primary shadow-lg shadow-blue-500/25' : 'border-white/30'
              }`}
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                backdropFilter: 'blur(2px)',
              }}
            />

            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0">
                {/* Scanning line */}
                <div
                  ref={scanLineRef}
                  className="via-holo-primary absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent"
                  style={{
                    top: `${(scanProgress / 100) * 90 + 5}%`,
                    boxShadow: '0 0 10px hsl(var(--holo-primary))',
                    transition: 'top 0.05s linear',
                  }}
                />

                {/* Corner guides */}
                <div className="absolute left-4 top-4 h-6 w-6">
                  <div className="bg-holo-primary absolute left-0 top-0 h-full w-1" />
                  <div className="bg-holo-primary absolute left-0 top-0 h-1 w-full" />
                </div>
                <div className="absolute right-4 top-4 h-6 w-6">
                  <div className="bg-holo-primary absolute right-0 top-0 h-full w-1" />
                  <div className="bg-holo-primary absolute right-0 top-0 h-1 w-full" />
                </div>
                <div className="absolute bottom-4 left-4 h-6 w-6">
                  <div className="bg-holo-primary absolute bottom-0 left-0 h-full w-1" />
                  <div className="bg-holo-primary absolute bottom-0 left-0 h-1 w-full" />
                </div>
                <div className="absolute bottom-4 right-4 h-6 w-6">
                  <div className="bg-holo-primary absolute bottom-0 right-0 h-full w-1" />
                  <div className="bg-holo-primary absolute bottom-0 right-0 h-1 w-full" />
                </div>
              </div>
            )}

            {/* Center crosshair */}
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/50" />
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/50" />
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
            </div>
          </div>

          {/* HUD Overlay */}
          <div className="pointer-events-none absolute inset-0">
            {/* Top bar with status */}
            <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${isScanning ? 'animate-pulse bg-red-500' : 'bg-green-500'}`}
                  />
                  <span className="text-xs text-white">{isScanning ? 'SCANNING' : 'READY'}</span>
                </div>
                <div className="text-xs text-white/80">EuroTCG Scanner</div>
              </div>
            </div>

            {/* Bottom info panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {isScanning ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-white">
                    <span>{analysisSteps[analysisStep]}</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/20">
                    <div
                      className="bg-holo-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-white/80">
                  Position card in center frame and tap scan
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scan Result Panel */}
        {showResult && scanResult && (
          <div className="animate-slide-up border-border bg-card border-t p-4">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-holo-primary text-lg font-bold">{scanResult.cardName}</h3>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                  <span>{scanResult.game}</span>
                  <span>•</span>
                  <span>{scanResult.setInfo}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-holo-success text-xl font-bold">{scanResult.value}</div>
                <div className="text-muted-foreground text-xs">{scanResult.confidence}% match</div>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--holo-warning)) 0%, hsl(var(--holo-accent)) 100%)',
                  color: 'white',
                }}
              >
                {scanResult.rarity}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              <button className="neo-holo-card flex items-center justify-center gap-2 p-3 text-sm transition-all hover:scale-105 lg:text-base">
                <span>💰</span>
                <span>Add to Portfolio</span>
              </button>
              <button className="neo-holo-card flex items-center justify-center gap-2 p-3 text-sm transition-all hover:scale-105 lg:text-base">
                <span>📊</span>
                <span>Price History</span>
              </button>
              <button className="neo-holo-card hidden items-center justify-center gap-2 p-3 text-sm transition-all hover:scale-105 lg:flex lg:text-base">
                <span>🔔</span>
                <span>Set Alert</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-border bg-card border-t p-4">
          {!isScanning && !showResult ? (
            <button
              onClick={startScan}
              className="from-holo-primary to-holo-secondary w-full rounded-lg bg-gradient-to-r px-6 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Start Scanning</span>
              </div>
            </button>
          ) : showResult ? (
            <div className="space-y-3">
              <button
                onClick={startScan}
                className="from-holo-primary to-holo-secondary w-full rounded-lg bg-gradient-to-r px-6 py-3 font-semibold text-white transition-all hover:scale-105"
              >
                Scan Another Card
              </button>
              <button
                onClick={resetDemo}
                className="border-border text-muted-foreground hover:bg-accent w-full rounded-lg border bg-transparent px-6 py-3 transition-all"
              >
                Reset Demo
              </button>
            </div>
          ) : (
            <button
              onClick={resetDemo}
              className="border-border text-muted-foreground hover:bg-accent w-full rounded-lg border bg-transparent px-6 py-3 transition-all"
              disabled={isScanning}
            >
              Cancel Scan
            </button>
          )}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-holo-primary/10 border-holo-primary/20 mt-4 rounded-lg border p-3">
        <div className="flex items-start gap-2">
          <svg
            className="text-holo-primary mt-0.5 h-5 w-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-holo-primary text-sm font-medium">Interactive Demo</p>
            <p className="text-muted-foreground mt-1 text-xs">
              This simulates the real scanner experience. The actual app uses your camera to scan
              physical cards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARScannerDemo;
