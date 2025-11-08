import React, { useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward?: string;
}

interface CollectionStats {
  totalCards: number;
  uniqueCards: number;
  totalValue: number;
  completionRate: number;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-scan',
    title: 'First Scan',
    description: 'Scan your first card',
    icon: '📷',
    progress: 0,
    maxProgress: 1,
    completed: false,
    reward: '50 XP',
  },
  {
    id: 'pack-opener',
    title: 'Pack Opener',
    description: 'Open 5 booster packs',
    icon: '🎁',
    progress: 0,
    maxProgress: 5,
    completed: false,
    reward: 'Rare Pack',
  },
  {
    id: 'price-checker',
    title: 'Price Checker',
    description: 'Check prices on 10 cards',
    icon: '💰',
    progress: 0,
    maxProgress: 10,
    completed: false,
    reward: 'Premium Badge',
  },
  {
    id: 'collector',
    title: 'Collector',
    description: 'Add 25 cards to collection',
    icon: '📚',
    progress: 0,
    maxProgress: 25,
    completed: false,
    reward: 'Collection Tracker',
  },
];

const INITIAL_STATS: CollectionStats = {
  totalCards: 0,
  uniqueCards: 0,
  totalValue: 0,
  completionRate: 0,
};

interface CollectionProgressGameProps {
  className?: string;
}

const CollectionProgressGame: React.FC<CollectionProgressGameProps> = ({ className = '' }) => {
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [nextLevelXP] = useState(100);

  const simulateAction = (actionType: 'scan' | 'pack' | 'price' | 'collect') => {
    let xpGained = 0;
    const newAchievements = [...achievements];

    // Update achievements based on action
    switch (actionType) {
      case 'scan':
        updateAchievement(newAchievements, 'first-scan');
        xpGained = 10;
        break;
      case 'pack':
        updateAchievement(newAchievements, 'pack-opener');
        xpGained = 25;
        break;
      case 'price':
        updateAchievement(newAchievements, 'price-checker');
        xpGained = 5;
        break;
      case 'collect':
        updateAchievement(newAchievements, 'collector');
        xpGained = 15;
        break;
    }

    // Update stats
    const newStats = { ...stats };
    if (actionType === 'collect') {
      newStats.totalCards += 1;
      newStats.uniqueCards += Math.random() > 0.3 ? 1 : 0;
      newStats.totalValue += Math.random() * 50 + 10;
      newStats.completionRate = (newStats.uniqueCards / 150) * 100; // Assume 150 total unique cards
    }

    // Update XP and level
    let newXP = currentXP + xpGained;
    let newLevel = playerLevel;
    if (newXP >= nextLevelXP) {
      newLevel += 1;
      newXP = newXP - nextLevelXP;
    }

    setAchievements(newAchievements);
    setStats(newStats);
    setCurrentXP(newXP);
    setPlayerLevel(newLevel);

    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const updateAchievement = (achievementList: Achievement[], achievementId: string) => {
    const achievement = achievementList.find(a => a.id === achievementId);
    if (achievement && !achievement.completed) {
      achievement.progress = Math.min(achievement.progress + 1, achievement.maxProgress);
      if (achievement.progress >= achievement.maxProgress) {
        achievement.completed = true;
      }
    }
  };

  const resetProgress = () => {
    setAchievements(INITIAL_ACHIEVEMENTS.map(a => ({ ...a })));
    setStats({ ...INITIAL_STATS });
    setPlayerLevel(1);
    setCurrentXP(0);
  };

  const completedAchievements = achievements.filter(a => a.completed).length;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  return (
    <div className={`collection-progress-game ${className}`}>
      <div className="neo-holo-card overflow-hidden rounded-2xl">
        {/* Player Stats Header */}
        <div className="border-border bg-card border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Collector Profile</h3>
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="text-sm font-medium">Level {playerLevel}</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Experience</span>
              <span className="text-muted-foreground">
                {currentXP} / {nextLevelXP} XP
              </span>
            </div>
            <div className="bg-muted/20 h-2 w-full rounded-full">
              <div
                className="from-holo-primary to-holo-secondary h-full rounded-full bg-gradient-to-r transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-holo-primary text-lg font-bold lg:text-xl">
                {stats.totalCards}
              </div>
              <div className="text-muted-foreground text-xs lg:text-sm">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-holo-accent text-lg font-bold lg:text-xl">
                {stats.uniqueCards}
              </div>
              <div className="text-muted-foreground text-xs lg:text-sm">Unique Cards</div>
            </div>
            <div className="hidden text-center lg:block">
              <div className="text-holo-success text-lg font-bold lg:text-xl">
                €{stats.totalValue.toFixed(0)}
              </div>
              <div className="text-muted-foreground text-xs lg:text-sm">Total Value</div>
            </div>
            <div className="hidden text-center lg:block">
              <div className="text-holo-warning text-lg font-bold lg:text-xl">
                {stats.completionRate.toFixed(1)}%
              </div>
              <div className="text-muted-foreground text-xs lg:text-sm">Completion</div>
            </div>
          </div>
        </div>

        {/* Achievement Progress */}
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold">Achievements</h4>
            <span className="text-muted-foreground text-xs">
              {completedAchievements}/{achievements.length} Complete
            </span>
          </div>

          <div className="mb-6 space-y-3">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                  achievement.completed
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-border bg-muted/20'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="truncate text-sm font-medium">{achievement.title}</h5>
                    {achievement.completed && <span className="ml-2 text-green-400">✓</span>}
                  </div>
                  <p className="text-muted-foreground mb-1 text-xs">{achievement.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-1 flex-1 rounded-full">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          achievement.completed ? 'bg-green-500' : 'bg-holo-primary'
                        }`}
                        style={{
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  {achievement.reward && (
                    <div className="text-holo-accent mt-1 text-xs">
                      Reward: {achievement.reward}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="mb-3 text-center text-sm font-medium">Try These Actions:</div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <button
                onClick={() => simulateAction('scan')}
                className="neo-holo-card flex items-center justify-center gap-2 p-3 text-sm transition-all hover:scale-105 active:scale-95 lg:text-base"
              >
                <span>📷</span>
                <span>Scan Card</span>
              </button>
              <button
                onClick={() => simulateAction('price')}
                className="neo-holo-card flex items-center justify-center gap-2 p-3 text-sm transition-all hover:scale-105 active:scale-95 lg:text-base"
              >
                <span>💰</span>
                <span>Check Price</span>
              </button>
              <button
                onClick={() => simulateAction('collect')}
                className="neo-holo-card flex items-center justify-center gap-2 p-3 text-sm transition-all hover:scale-105 active:scale-95 lg:text-base"
              >
                <span>�</span>
                <span>Add to Collection</span>
              </button>
              <button
                onClick={resetProgress}
                className="neo-holo-card flex items-center justify-center gap-2 border-dashed p-3 text-sm transition-all hover:scale-105 active:scale-95 lg:text-base"
              >
                <span>�</span>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="bg-holo-success/10 border-holo-success/20 mt-4 rounded-lg border p-3">
        <div className="flex items-start gap-2">
          <span className="text-lg">🎮</span>
          <div>
            <p className="text-holo-success text-sm font-medium">Gamified Collection</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Level up by using app features. Unlock achievements and earn rewards as you build your
              TCG collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionProgressGame;
