import type { CSSProperties, ReactNode } from 'react';

type ShinyTextProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
  as?: 'span' | 'strong';
};

function ShinyText({ children, className = '', speed = 3.8, as: Component = 'span' }: ShinyTextProps) {
  return (
    <Component className={`rb-shiny-text ${className}`} style={{ '--rb-shiny-speed': `${speed}s` } as CSSProperties}>
      {children}
    </Component>
  );
}

export default ShinyText;
