import React, { useEffect, useRef, useState } from 'react';

interface TCGCard3DProps {
  game: 'pokemon' | 'onepiece' | 'yugioh' | 'magic' | 'lorcana';
  cardName: string;
  imageUrl?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  opacity?: number;
  scale?: number;
  rotation?: number;
  className?: string;
  enableFadeIn?: boolean;
  enable3D?: boolean;
  animationDelay?: number;
}

const TCGCard3D: React.FC<TCGCard3DProps> = ({
  game,
  cardName,
  imageUrl,
  rarity,
  className = '',
  opacity = 0.6,
  scale = 1.0,
  rotation = 0,
  animationDelay = 0,
  enableFadeIn = true,
  enable3D = true,
}) => {
  const [isVisible, setIsVisible] = useState(!enableFadeIn);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle fade-in animation
  useEffect(() => {
    if (enableFadeIn) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, animationDelay);

      return () => clearTimeout(timer);
    }
  }, [enableFadeIn, animationDelay]);

  // Handle mouse tracking for 3D effect
  useEffect(() => {
    if (!enable3D) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect || !isHovered) {
        return;
      }

      // Check if mouse is actually over the card
      const isOverCard =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isOverCard) {
        setMousePosition({ x: 0, y: 0 });
        return;
      }

      // Calculate mouse position relative to the card center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Convert to normalized coordinates (-1 to 1)
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      setMousePosition({ x, y });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered, enable3D]);

  // Calculate 3D transforms
  const get3DTransform = (): string => {
    if (!enable3D || !mousePosition || !cardRef.current || !isHovered) {
      return '';
    }

    // mousePosition is already normalized (-1 to 1) from handleMouseMove
    const rotateY = Math.max(-12, Math.min(12, mousePosition.x * 12));
    const rotateX = Math.max(-12, Math.min(12, -mousePosition.y * 12));

    return `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(15px)`;
  };

  // Calculate glow effect based on rarity and hover state
  const getGlowEffect = () => {
    const baseGlow = getRarityGlow();

    if (!enable3D) {
      return `${baseGlow} saturate(0.9) brightness(1.0) drop-shadow(0 0 8px rgba(59, 130, 246, 0.2))`;
    }

    if (isHovered) {
      // Enhanced glow on hover
      return `${baseGlow} saturate(1.1) brightness(1.15) drop-shadow(0 0 20px rgba(59, 130, 246, 0.4))`;
    }

    // Faint but visible glow for idle state
    return `${baseGlow} saturate(0.98) brightness(1.08) drop-shadow(0 0 15px rgba(59, 130, 246, 0.25))`;
  };
  const getGameColors = () => {
    switch (game) {
      case 'pokemon':
        return {
          primary: '#3B82F6', // Blue
          secondary: '#EF4444', // Red
          accent: '#F59E0B', // Yellow
        };
      case 'onepiece':
        return {
          primary: '#DC2626', // Red
          secondary: '#1F2937', // Dark Gray
          accent: '#F59E0B', // Gold
        };
      case 'lorcana':
        return {
          primary: '#8B5CF6', // Purple
          secondary: '#06B6D4', // Cyan
          accent: '#F97316', // Orange
        };
      case 'magic':
        return {
          primary: '#1F2937', // Dark
          secondary: '#059669', // Green
          accent: '#DC2626', // Red
        };
      case 'yugioh':
        return {
          primary: '#7C2D12', // Brown
          secondary: '#B45309', // Orange
          accent: '#FDE047', // Yellow
        };
      default:
        return {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          accent: '#EC4899',
        };
    }
  };

  const getRarityGlow = () => {
    switch (rarity) {
      case 'legendary':
        return 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))';
      case 'epic':
        return 'drop-shadow(0 0 6px rgba(147, 51, 234, 0.25))';
      case 'rare':
        return 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.2))';
      case 'uncommon':
        return 'drop-shadow(0 0 3px rgba(34, 197, 94, 0.15))';
      default:
        return 'drop-shadow(0 0 2px rgba(107, 114, 128, 0.1))';
    }
  };

  const colors = getGameColors();

  const generateCardPlaceholder = (
    game: string,
    cardName: string,
    colors: { primary: string; secondary: string; accent: string }
  ): string => {
    // Sanitize inputs to avoid invalid characters
    const safeName = cardName.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
    const gameIcon =
      game === 'onepiece'
        ? 'OP'
        : game === 'yugioh'
          ? 'YGO'
          : game === 'lorcana'
            ? 'LOR'
            : game === 'magic'
              ? 'MTG'
              : 'TCG';

    const gameTitle = game === 'onepiece' ? 'One Piece' : game.toUpperCase();
    const svgContent = [
      '<svg width="180" height="250" xmlns="http://www.w3.org/2000/svg">',
      '<defs>',
      `<linearGradient id="bg-${game}" x1="0%" y1="0%" x2="100%" y2="100%">`,
      `<stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />`,
      `<stop offset="50%" style="stop-color:${colors.secondary};stop-opacity:1" />`,
      `<stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />`,
      '</linearGradient>',
      '</defs>',
      `<rect width="180" height="250" rx="12" fill="url(#bg-${game})" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`,
      '<rect x="10" y="10" width="160" height="30" rx="8" fill="rgba(0,0,0,0.4)"/>',
      `<text x="90" y="28" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${gameTitle}</text>`,
      '<rect x="15" y="50" width="150" height="120" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>',
      `<text x="90" y="125" text-anchor="middle" fill="white" font-size="24" font-weight="bold">${gameIcon}</text>`,
      '<rect x="10" y="180" width="160" height="40" rx="6" fill="rgba(0,0,0,0.6)"/>',
      `<text x="90" y="200" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="11" font-weight="600">${safeName}</text>`,
      '</svg>',
    ].join('');

    try {
      return `data:image/svg+xml;base64,${btoa(svgContent)}`;
    } catch {
      // Fallback to URL encoding if btoa fails
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    }
  };

  const getImageUrl = () => {
    // Use provided imageUrl first if it's a valid local path
    if (imageUrl && imageUrl.startsWith('/images/')) {
      return imageUrl;
    }

    // Map to our downloaded images
    const cardKey = cardName.toLowerCase().replace(/\s+/g, '-');

    if (game === 'pokemon') {
      if (cardKey.includes('charizard')) {
        return '/images/cards/pokemon/charizard.png';
      }
      if (cardKey.includes('pikachu')) {
        return '/images/cards/pokemon/pikachu.png';
      }
      if (cardKey.includes('blastoise')) {
        return '/images/cards/pokemon/blastoise.png';
      }
      if (cardKey.includes('venusaur')) {
        return '/images/cards/pokemon/venusaur.png';
      }
    }

    if (game === 'onepiece' && cardKey.includes('luffy')) {
      return '/images/cards/onepiece/luffy.png';
    }

    if (game === 'yugioh' && cardKey.includes('blue')) {
      return '/images/cards/yugioh/blue-eyes-white-dragon.jpg';
    }

    if (game === 'magic' && cardKey.includes('lightning')) {
      return '/images/cards/magic/lightning-bolt.jpg';
    }

    if (game === 'lorcana' && cardKey.includes('elsa')) {
      return '/images/cards/lorcana/elsa.png';
    }

    // Generate SVG placeholder for cards without downloaded images
    return generateCardPlaceholder(game, cardName, colors);
  };

  return (
    <div
      ref={cardRef}
      className={`tcg-card-3d ${className}`}
      style={{
        cursor: 'pointer',
        willChange: 'transform, opacity, filter',
        opacity: isVisible ? opacity : 0,
        transition: 'opacity 600ms ease-out',
        pointerEvents: 'auto',
        transformStyle: 'preserve-3d',
        transform: `scale(${scale})`,
      }}
      onMouseEnter={() => {
        if (enable3D) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (enable3D) {
          setIsHovered(false);
          setMousePosition({ x: 0, y: 0 });
        }
      }}
    >
      <div
        className="card-rotation-wrapper"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="card-inner"
          style={{
            width: '180px',
            height: '250px',
            perspective: '1500px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: get3DTransform(),
            filter: getGlowEffect(),
            animation:
              enable3D && isHovered
                ? 'none'
                : isHovered
                  ? `tcg-card-hover-float 2.5s ease-in-out infinite ${animationDelay}ms`
                  : `tcg-card-idle-3d 10s ease-in-out infinite ${animationDelay}ms`,
            transition:
              enable3D && isHovered ? 'transform 120ms ease-out, filter 150ms ease-out' : 'none',
          }}
        >
          <div
            className="card-front"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset,
              0 2px 0 rgba(255, 255, 255, 0.2) inset
            `,
              position: 'relative',
              overflow: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Holographic overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                linear-gradient(
                  45deg,
                  transparent 30%,
                  rgba(255, 255, 255, 0.1) 50%,
                  transparent 70%
                ),
                linear-gradient(
                  -45deg,
                  transparent 30%,
                  rgba(255, 255, 255, 0.05) 50%,
                  transparent 70%
                )
              `,
                animation: 'holo-shift 4s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />

            {/* Real card image */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#000',
              }}
            >
              <img
                src={getImageUrl()}
                alt={cardName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  opacity: 1.0,
                }}
                onError={e => {
                  // Fallback to gradient background if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.background = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`;
                  }
                }}
              />
              {/* Subtle overlay for better background integration */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.15) 100%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>

            {/* Rarity indicator */}
          </div>

          {/* Rarity indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              width: '20px',
              height: '4px',
              borderRadius: '2px',
              background: getRarityColor(rarity),
              opacity: 0.8,
            }}
          />
        </div>
      </div>
    </div>
  );
};

function getRarityColor(rarity?: string) {
  switch (rarity) {
    case 'rare':
      return 'linear-gradient(45deg, #3B82F6, #60A5FA)';
    case 'uncommon':
      return 'linear-gradient(45deg, #22C55E, #4ADE80)';
    default:
      return 'linear-gradient(45deg, #6B7280, #9CA3AF)';
  }
}

export default TCGCard3D;
