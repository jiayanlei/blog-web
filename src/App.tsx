import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent, TouchEvent } from 'react';
import TimeNodeNav from './components/cosmic/TimeNodeNav';
import { TimeNodeContent } from './components/sections/TimeNodeSections';
import { timeNodes } from './data/siteContent';

const WHEEL_THROTTLE_MS = 720;
const ACTIVE_NODE_STORAGE_KEY = 'portfolio-active-node-index';
const CosmicThreeLayer = lazy(() => import('./components/CosmicThreeLayer'));

function getInitialNodeIndex() {
  if (typeof window === 'undefined') {
    return 0;
  }

  const storedIndex = Number(window.sessionStorage.getItem(ACTIVE_NODE_STORAGE_KEY));

  if (!Number.isInteger(storedIndex) || storedIndex < 0 || storedIndex >= timeNodes.length) {
    return 0;
  }

  return storedIndex;
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(getInitialNodeIndex);
  const touchStartYRef = useRef<number | null>(null);
  const lastWheelAtRef = useRef(0);
  const activeNode = timeNodes[currentIndex];

  const moveToIndex = useCallback((nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= timeNodes.length) {
      return;
    }

    setCurrentIndex(nextIndex);
  }, []);

  const moveBy = useCallback((direction: 1 | -1) => {
    setCurrentIndex((index) => Math.min(Math.max(index + direction, 0), timeNodes.length - 1));
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(ACTIVE_NODE_STORAGE_KEY, String(currentIndex));
  }, [currentIndex]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const now = Date.now();
      if (Math.abs(event.deltaY) < 18 || now - lastWheelAtRef.current < WHEEL_THROTTLE_MS) {
        return;
      }

      lastWheelAtRef.current = now;
      moveBy(event.deltaY > 0 ? 1 : -1);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        moveBy(1);
      }

      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        moveBy(-1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [moveBy]);

  const handleTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (event.clientY - rect.top) / rect.height - 0.5;

    event.currentTarget.style.setProperty('--scene-pan-x', `${(-xRatio * 20).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--scene-pan-y', `${(-yRatio * 12).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--effect-pan-x', `${(xRatio * 10).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--effect-pan-y', `${(yRatio * 6).toFixed(2)}px`);
  }, []);

  const handlePointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--scene-pan-x', '0px');
    event.currentTarget.style.setProperty('--scene-pan-y', '0px');
    event.currentTarget.style.setProperty('--effect-pan-x', '0px');
    event.currentTarget.style.setProperty('--effect-pan-y', '0px');
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLElement>) => {
      if (touchStartYRef.current === null) {
        return;
      }

      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const distance = touchStartYRef.current - endY;
      touchStartYRef.current = null;

      if (Math.abs(distance) < 48) {
        return;
      }

      moveBy(distance > 0 ? 1 : -1);
    },
    [moveBy],
  );

  return (
    <main
      className="cosmic-background-stage"
      style={{ '--node-aura': activeNode.aura } as CSSProperties}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-image-background" aria-hidden="true" />
      <Suspense fallback={<div className="three-cosmic-layer three-cosmic-layer--loading" aria-hidden="true" />}>
        <CosmicThreeLayer />
      </Suspense>
      <div className="hero-gradient-mask" aria-hidden="true" />
      <div className="node-aura" aria-hidden="true" />

      <section
        className={`node-content node-content--${activeNode.id}`}
        key={activeNode.id}
        aria-labelledby={`${activeNode.id}-title`}
      >
        <TimeNodeContent nodeId={activeNode.id} />
      </section>

      <TimeNodeNav nodes={timeNodes} currentIndex={currentIndex} onSelect={moveToIndex} />
    </main>
  );
}

export default App;
