import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
    <div className={cn("space-y-2", isVisible && "animate-fade-up")}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      
      <div className={cn("h-2 w-full rounded-full bg-muted overflow-hidden", className)}>
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out",
            !isVisible && "w-0"
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