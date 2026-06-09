import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

type Rgb = [number, number, number];

type Star = {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkle: number;
  phase: number;
  speed: number;
  color: Rgb;
  kind: 'far' | 'mid' | 'main';
};

type Dust = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
  color: Rgb;
};

const ordinaryMeteors = [
  { top: '9%', left: '86%', delay: '-1.8s', duration: '9.8s', distanceX: '-74vw', distanceY: '56vh' },
  { top: '17%', left: '72%', delay: '1.4s', duration: '11.6s', distanceX: '-62vw', distanceY: '47vh' },
  { top: '3%', left: '96%', delay: '4.7s', duration: '10.8s', distanceX: '-78vw', distanceY: '59vh' },
  { top: '28%', left: '79%', delay: '7.2s', duration: '12.2s', distanceX: '-66vw', distanceY: '50vh' },
  { top: '14%', left: '58%', delay: '9.5s', duration: '10.4s', distanceX: '-55vw', distanceY: '43vh' },
  { top: '38%', left: '91%', delay: '12.1s', duration: '13.4s', distanceX: '-72vw', distanceY: '54vh' },
  { top: '23%', left: '104%', delay: '15.8s', duration: '11.2s', distanceX: '-84vw', distanceY: '62vh' },
] as const;

const mainStarPositions = [
  [0.18, 0.18],
  [0.34, 0.12],
  [0.48, 0.31],
  [0.58, 0.08],
  [0.67, 0.22],
  [0.78, 0.12],
  [0.42, 0.52],
  [0.24, 0.42],
  [0.52, 0.62],
] as const;

const heroVideoSrc = '/videos/time-node-background.mp4';
const heroVideoPoster = '/videos/time-node-background-poster.jpg';
const replayFromRatio = 0.46;

function rgba(color: Rgb, alpha: number) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function meteorStyle(meteor: (typeof ordinaryMeteors)[number]) {
  return {
    '--meteor-top': meteor.top,
    '--meteor-left': meteor.left,
    '--meteor-delay': meteor.delay,
    '--meteor-duration': meteor.duration,
    '--meteor-distance-x': meteor.distanceX,
    '--meteor-distance-y': meteor.distanceY,
  } as CSSProperties;
}

function DynamicHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return undefined;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let frameId = 0;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let dust: Dust[] = [];

    const buildScene = () => {
      const area = width * height;
      const farCount = Math.round(clamp(area / 6200, 120, 360));
      const midCount = Math.round(clamp(area / 21000, 34, 96));
      const dustCount = Math.round(clamp(area / 13000, 45, 140));
      const mainCount = width < 620 ? 5 : 9;
      const starColors: Rgb[] = [
        [226, 238, 255],
        [190, 218, 255],
        [255, 244, 218],
        [174, 204, 255],
      ];

      const randomSkyX = () => (Math.random() < 0.68 ? rand(0, width * 0.76) : rand(0, width));
      const randomSkyY = () => (Math.random() < 0.78 ? rand(0, height * 0.68) : rand(0, height * 0.9));

      stars = Array.from({ length: farCount }, () => {
        const x = randomSkyX();
        const y = randomSkyY();
        const clockFade = x > width * 0.58 && y > height * 0.44 ? 0.55 : 1;

        return {
          x,
          y,
          radius: rand(0.45, 1.15),
          baseAlpha: rand(0.22, 0.46) * clockFade,
          twinkle: rand(0.06, 0.16),
          phase: rand(0, Math.PI * 2),
          speed: rand(0.00045, 0.001),
          color: starColors[Math.floor(Math.random() * starColors.length)],
          kind: 'far' as const,
        };
      });

      stars.push(
        ...Array.from({ length: midCount }, () => {
          const x = randomSkyX();
          const y = randomSkyY();
          const clockFade = x > width * 0.58 && y > height * 0.44 ? 0.62 : 1;

          return {
            x,
            y,
            radius: rand(1.1, 2.1),
            baseAlpha: rand(0.44, 0.72) * clockFade,
            twinkle: rand(0.16, 0.32),
            phase: rand(0, Math.PI * 2),
            speed: rand(0.0008, 0.0018),
            color: starColors[Math.floor(Math.random() * starColors.length)],
            kind: 'mid' as const,
          };
        }),
      );

      stars.push(
        ...mainStarPositions.slice(0, mainCount).map(([x, y]) => ({
          x: width * x + rand(-18, 18),
          y: height * y + rand(-14, 14),
          radius: rand(2.1, 3.4),
          baseAlpha: rand(0.58, 0.82),
          twinkle: rand(0.18, 0.34),
          phase: rand(0, Math.PI * 2),
          speed: rand(0.001, 0.0017),
          color: Math.random() > 0.42 ? ([218, 235, 255] as Rgb) : ([255, 235, 196] as Rgb),
          kind: 'main' as const,
        })),
      );

      dust = Array.from({ length: dustCount }, () => ({
        x: rand(0, width),
        y: rand(height * 0.05, height * 0.92),
        radius: rand(0.55, 1.8),
        alpha: rand(0.05, 0.18),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.0002, 0.00055),
        driftX: rand(8, 34),
        driftY: rand(7, 26),
        color: Math.random() > 0.5 ? ([174, 204, 255] as Rgb) : ([235, 216, 255] as Rgb),
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
    };

    const drawStar = (star: Star, time: number) => {
      const alpha = clamp(
        star.baseAlpha + (reducedMotion ? 0 : Math.sin(time * star.speed + star.phase) * star.twinkle),
        0,
        0.95,
      );

      if (star.kind === 'main') {
        const glowSize = star.radius * 11;
        const glow = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
        glow.addColorStop(0, rgba(star.color, alpha * 0.72));
        glow.addColorStop(0.28, rgba(star.color, alpha * 0.2));
        glow.addColorStop(1, rgba(star.color, 0));

        context.fillStyle = glow;
        context.beginPath();
        context.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        context.fill();

        context.strokeStyle = rgba(star.color, alpha * 0.72);
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(star.x - star.radius * 7, star.y);
        context.lineTo(star.x + star.radius * 7, star.y);
        context.moveTo(star.x, star.y - star.radius * 5);
        context.lineTo(star.x, star.y + star.radius * 5);
        context.stroke();
      }

      context.fillStyle = rgba(star.color, alpha);
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    };

    const drawDust = (particle: Dust, time: number) => {
      const driftTime = time * particle.speed + particle.phase;
      const x = particle.x + (reducedMotion ? 0 : Math.sin(driftTime) * particle.driftX);
      const y = particle.y + (reducedMotion ? 0 : Math.cos(driftTime * 0.8) * particle.driftY);
      const alpha = particle.alpha + (reducedMotion ? 0 : Math.sin(driftTime * 1.6) * 0.04);

      context.fillStyle = rgba(particle.color, clamp(alpha, 0.02, 0.24));
      context.beginPath();
      context.arc(x, y, particle.radius, 0, Math.PI * 2);
      context.fill();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = 'lighter';
      dust.forEach((particle) => drawDust(particle, time));
      stars.forEach((star) => drawStar(star, time));
      context.restore();
    };

    const animate = (time: number) => {
      draw(time);

      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const restart = () => {
      window.cancelAnimationFrame(frameId);
      frameId = reducedMotion ? 0 : window.requestAnimationFrame(animate);
      draw(performance.now());
    };

    const handleResize = () => {
      resize();
      restart();
    };

    const handleMotionChange = () => {
      reducedMotion = motionQuery.matches;
      restart();
    };

    resize();
    restart();
    window.addEventListener('resize', handleResize);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const playVideo = () => {
      if (motionQuery.matches || document.hidden) {
        video.pause();
        return;
      }

      video.muted = true;
      void video.play().catch(() => undefined);
    };

    const handleVisibilityChange = () => {
      playVideo();
    };

    playVideo();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', playVideo);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', playVideo);
    };
  }, []);

  const handleVideoEnded = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = Number.isFinite(video.duration) ? video.duration * replayFromRatio : 0;
    void video.play().catch(() => undefined);
  };

  return (
    <div className="dynamic-hero-background" aria-hidden="true">
      <div className="dynamic-hero-image">
        <video
          ref={videoRef}
          className="dynamic-hero-video"
          src={heroVideoSrc}
          poster={heroVideoPoster}
          preload="metadata"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
        />
      </div>
      <canvas ref={canvasRef} className="dynamic-hero-stars" />
      <div className="dynamic-meteors">
        {ordinaryMeteors.map((meteor, index) => (
          <span key={index} className="hero-meteor" style={meteorStyle(meteor)} />
        ))}
        <span className="hero-meteor hero-meteor--big" />
      </div>
      <div className="dynamic-fog dynamic-fog--high" />
      <div className="dynamic-fog dynamic-fog--mid" />
      <div className="dynamic-fog dynamic-fog--low" />
      <div className="dynamic-clock-glow" />
      <div className="dynamic-hero-shade" />
    </div>
  );
}

export default DynamicHeroBackground;
