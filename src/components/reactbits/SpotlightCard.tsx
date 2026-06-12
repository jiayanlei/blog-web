import { useCallback } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: string;
};

function SpotlightCard({ children, className = '', intensity = 'rgba(246, 198, 106, 0.18)' }: SpotlightCardProps) {
  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.currentTarget.style.setProperty('--rb-spotlight-x', `${x}px`);
    event.currentTarget.style.setProperty('--rb-spotlight-y', `${y}px`);
  }, []);

  return (
    <article
      className={`rb-spotlight-card ${className}`}
      onPointerMove={handlePointerMove}
      style={{ '--rb-spotlight-color': intensity } as CSSProperties}
    >
      {children}
    </article>
  );
}

export default SpotlightCard;
