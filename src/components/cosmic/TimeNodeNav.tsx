import type { CSSProperties } from 'react';
import type { TimeNode } from '../../data/siteContent';

type TimeNodeNavProps = {
  nodes: TimeNode[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

function TimeNodeNav({ nodes, currentIndex, onSelect }: TimeNodeNavProps) {
  return (
    <nav className="time-node-nav" aria-label="首页节点导航">
      {nodes.map((node, index) => (
        <button
          className={index === currentIndex ? 'time-node-nav-item is-active' : 'time-node-nav-item'}
          key={node.id}
          type="button"
          onClick={() => onSelect(index)}
          aria-current={index === currentIndex ? 'step' : undefined}
          style={{ '--nav-index': index } as CSSProperties}
        >
          <span className="time-node-nav-dot" aria-hidden="true">
            ·
          </span>
          <span className="time-node-nav-label">{node.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default TimeNodeNav;
