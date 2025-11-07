import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  label: string;
  progress: number;
  delay?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, progress, delay = 0, className }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimatedProgress(progress);
    }, delay);

    return () => clearTimeout(timer);
  }, [progress, delay]);

  return (
    <div className={cn('space-y-2', isVisible && 'animate-fade-up')}>
      <div className="flex items-center justify-between">
        <span className="text-foreground text-sm font-medium">{label}</span>
        <span className="text-muted-foreground text-sm">{progress}%</span>
      </div>

      <div className={cn('bg-muted h-2 w-full overflow-hidden rounded-full', className)}>
        <div
          className={cn(
            'from-primary to-primary/80 h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
            !isVisible && 'w-0'
          )}
          style={{
            width: isVisible ? `${animatedProgress}%` : '0%',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
