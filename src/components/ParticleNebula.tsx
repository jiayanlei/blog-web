import { useMemo } from 'react';
import Particles from '@tsparticles/react';
import type { Container, ISourceOptions } from '@tsparticles/engine';

function ParticleNebula() {
  const isMobile = useMemo(
    () => window.matchMedia('(max-width: 640px)').matches,
    [],
  );
  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: false,
      detectRetina: true,
      fpsLimit: isMobile ? 30 : 48,
      background: {
        color: 'transparent',
      },
      particles: {
        number: {
          value: isMobile ? 28 : 72,
          density: {
            enable: true,
            width: 1280,
            height: 720,
          },
        },
        color: {
          value: ['#67e8f9', '#8b5cf6', '#f0abfc'],
        },
        links: {
          enable: !isMobile,
          color: '#8b5cf6',
          distance: 150,
          opacity: 0.1,
          width: 1,
        },
        move: {
          enable: true,
          direction: 'none',
          random: true,
          speed: isMobile ? 0.28 : 0.5,
          straight: false,
          outModes: {
            default: 'out',
          },
        },
        opacity: {
          value: {
            min: 0.16,
            max: 0.46,
          },
        },
        size: {
          value: {
            min: 1,
            max: isMobile ? 2 : 2.8,
          },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: !isMobile,
            mode: 'grab',
          },
        },
        modes: {
          grab: {
            distance: 120,
            links: {
              opacity: 0.24,
            },
          },
        },
      },
    }),
    [isMobile],
  );

  return (
    <Particles
      id="particle-nebula"
      className="pointer-events-none fixed inset-0 -z-10"
      options={options}
      particlesLoaded={async (_container?: Container) => undefined}
    />
  );
}

export default ParticleNebula;
