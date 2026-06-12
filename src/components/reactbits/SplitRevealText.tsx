import type { CSSProperties } from 'react';

type SplitRevealTextProps = {
  text: string;
  className?: string;
  by?: 'char' | 'word';
  delayStep?: number;
};

function SplitRevealText({ text, className = '', by = 'char', delayStep = 0.045 }: SplitRevealTextProps) {
  const parts = by === 'word' ? text.split(/(\s+)/) : Array.from(text);

  return (
    <span className={`rb-split-reveal ${className}`} aria-label={text}>
      {parts.map((part, index) => (
        <span
          aria-hidden="true"
          className={part.trim() ? 'rb-split-reveal-part' : 'rb-split-reveal-space'}
          key={`${part}-${index}`}
          style={{ '--rb-reveal-delay': `${index * delayStep}s` } as CSSProperties}
        >
          {part}
        </span>
      ))}
    </span>
  );
}

export default SplitRevealText;
