import { useCallback } from 'react';
import type { PointerEvent, ReactNode } from 'react';

type MagnetLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

function MagnetLink({ href, children, className = '', external = false }: MagnetLinkProps) {
  const handlePointerMove = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    event.currentTarget.style.setProperty('--rb-magnet-x', `${x * 0.16}px`);
    event.currentTarget.style.setProperty('--rb-magnet-y', `${y * 0.2}px`);
  }, []);

  const handlePointerLeave = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--rb-magnet-x', '0px');
    event.currentTarget.style.setProperty('--rb-magnet-y', '0px');
  }, []);

  return (
    <a
      className={`rb-magnet-link ${className}`}
      href={href}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

export default MagnetLink;
