// Card image mappings for reliable local images
export const cardImages = {
  pokemon: {
    charizard: '/images/cards/pokemon/charizard.png',
    pikachu: '/images/cards/pokemon/pikachu.png',
    blastoise: '/images/cards/pokemon/blastoise.png',
    venusaur: '/images/cards/pokemon/venusaur.png',
  },
  onepiece: {
    luffy: '/images/cards/onepiece/luffy.png',
  },
  yugioh: {
    blueEyes: '/images/cards/yugioh/blue-eyes-white-dragon.jpg',
  },
  lorcana: {
    elsa: '', // Will use SVG fallback
  },
  magic: {
    lightningBolt: '/images/cards/magic/lightning-bolt.jpg',
  },
};

// Generate SVG placeholder for non-Pokemon games
export const generateCardPlaceholder = (
  game: string,
  cardName: string,
  colors: { primary: string; secondary: string; accent: string }
): string => {
  const svgContent = `
    <svg width="180" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${game}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.secondary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="shine-${game}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.3);stop-opacity:1" />
          <stop offset="50%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0.2);stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Card background -->
      <rect width="180" height="250" rx="12" fill="url(#bg-${game})" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      
      <!-- Holographic shine effect -->
      <rect width="180" height="250" rx="12" fill="url(#shine-${game})" opacity="0.7"/>
      
      <!-- Game title area -->
      <rect x="10" y="10" width="160" height="30" rx="8" fill="rgba(0,0,0,0.4)"/>
      <text x="90" y="28" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-transform="uppercase">
        ${game === 'onepiece' ? 'One Piece' : game}
      </text>
      
      <!-- Card artwork area -->
      <rect x="15" y="50" width="150" height="120" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
      
      <!-- Game icon -->
      <text x="90" y="125" text-anchor="middle" font-size="48" opacity="0.8">
        ${game === 'onepiece' ? '🏴‍☠️' : game === 'yugioh' ? '👁️' : game === 'lorcana' ? '✨' : game === 'magic' ? '🔮' : '⭐'}
      </text>
      
      <!-- Card name area -->
      <rect x="10" y="180" width="160" height="40" rx="6" fill="rgba(0,0,0,0.6)"/>
      <text x="90" y="200" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="11" font-weight="600">
        ${cardName}
      </text>
      
      <!-- Decorative elements -->
      <circle cx="20" cy="230" r="8" fill="rgba(255,215,0,0.8)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
      <circle cx="160" cy="230" r="8" fill="rgba(255,215,0,0.8)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};
