import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type MeteorState = {
  active: boolean;
  elapsed: number;
  duration: number;
  nextAt: number;
  startX: number;
  startY: number;
  travelX: number;
  travelY: number;
  length: number;
  thickness: number;
};

const DPR: [number, number] = [1, 1.45];
const STAR_COUNT = 1280;
const GALAXY_DUST_COUNT = 760;
const AIR_DUST_COUNT = 320;
const METEOR_SPAWN_GAP: [number, number] = [1.8, 3.6];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeSoftParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;

  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.Texture(canvas);
  }

  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.22, 'rgba(235,243,255,0.86)');
  gradient.addColorStop(0.52, 'rgba(174,204,255,0.24)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Stars() {
  const pointsRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const texture = useMemo(() => makeSoftParticleTexture(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
    }),
    [texture],
  );

  const geometry = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const alphas = new Float32Array(STAR_COUNT);
    const phases = new Float32Array(STAR_COUNT);
    const speeds = new Float32Array(STAR_COUNT);
    const flashes = new Float32Array(STAR_COUNT);
    const flashOffsets = new Float32Array(STAR_COUNT);
    const warmth = new Float32Array(STAR_COUNT);

    for (let index = 0; index < STAR_COUNT; index += 1) {
      const layerRoll = Math.random();
      const isFar = layerRoll < 0.62;
      const isMid = layerRoll >= 0.62 && layerRoll < 0.91;
      const z = isFar ? randomBetween(-9.2, -5.2) : isMid ? randomBetween(-4.8, -2.1) : randomBetween(-1.8, 0.4);

      positions[index * 3] = randomBetween(-12.8, 12.8);
      const skyY = isFar ? randomBetween(1.45, 7.2) : isMid ? randomBetween(1.15, 6.95) : randomBetween(0.95, 6.55);
      positions[index * 3 + 1] = skyY;
      positions[index * 3 + 2] = z;

      sizes[index] = isFar ? randomBetween(0.9, 2.0) : isMid ? randomBetween(1.7, 3.4) : randomBetween(3.1, 5.8);
      alphas[index] = isFar ? randomBetween(0.13, 0.3) : isMid ? randomBetween(0.24, 0.5) : randomBetween(0.46, 0.82);
      phases[index] = randomBetween(0, Math.PI * 2);
      speeds[index] = randomBetween(0.12, 0.34);
      flashes[index] = !isFar && Math.random() < 0.22 ? randomBetween(0.65, 1.25) : 0;
      flashOffsets[index] = randomBetween(0, 10);
      warmth[index] = Math.random() < 0.08 ? randomBetween(0.25, 0.8) : randomBetween(0, 0.12);
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    bufferGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    bufferGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    bufferGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    bufferGeometry.setAttribute('aFlash', new THREE.BufferAttribute(flashes, 1));
    bufferGeometry.setAttribute('aFlashOffset', new THREE.BufferAttribute(flashOffsets, 1));
    bufferGeometry.setAttribute('aWarmth', new THREE.BufferAttribute(warmth, 1));
    return bufferGeometry;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    uniforms.uTime.value = timeRef.current;

    if (pointsRef.current) {
      pointsRef.current.rotation.z = Math.sin(timeRef.current * 0.018) * 0.004;
      pointsRef.current.position.y = Math.sin(timeRef.current * 0.025) * 0.04;
    }
  });

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          attribute float aSize;
          attribute float aAlpha;
          attribute float aPhase;
          attribute float aSpeed;
          attribute float aFlash;
          attribute float aFlashOffset;
          attribute float aWarmth;
          varying float vAlpha;
          varying float vWarmth;
          uniform float uTime;

          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float twinkle = 0.72 + 0.28 * sin(uTime * aSpeed + aPhase);
            float flashCycle = mod(uTime + aFlashOffset, 9.2);
            float flash = exp(-pow((flashCycle - 0.22) * 3.2, 2.0)) * aFlash;
            vAlpha = aAlpha * twinkle + flash;
            vWarmth = aWarmth;
            gl_PointSize = aSize * (1.0 + flash * 1.8) * (11.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          varying float vWarmth;
          uniform sampler2D uTexture;

          void main() {
            vec4 sprite = texture2D(uTexture, gl_PointCoord);
            vec3 blueWhite = vec3(0.72, 0.84, 1.0);
            vec3 paleGold = vec3(1.0, 0.82, 0.48);
            vec3 color = mix(blueWhite, paleGold, vWarmth);
            gl_FragColor = vec4(color, sprite.a * vAlpha);
          }
        `}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </points>
  );
}

function GalaxyDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const texture = useMemo(() => makeSoftParticleTexture(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
    }),
    [texture],
  );

  const geometry = useMemo(() => {
    const positions = new Float32Array(GALAXY_DUST_COUNT * 3);
    const sizes = new Float32Array(GALAXY_DUST_COUNT);
    const alphas = new Float32Array(GALAXY_DUST_COUNT);
    const phases = new Float32Array(GALAXY_DUST_COUNT);
    const speeds = new Float32Array(GALAXY_DUST_COUNT);

    for (let index = 0; index < GALAXY_DUST_COUNT; index += 1) {
      const t = Math.random();
      const band = (Math.random() - 0.5) * randomBetween(0.35, 2.6);
      const x = -8.6 + t * 15.6 + band * 0.42;
      const y = 0.55 + t * 5.7 + band * 0.6;

      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = randomBetween(-3.8, 0.2);
      sizes[index] = randomBetween(1.4, 4.4);
      alphas[index] = randomBetween(0.09, 0.32);
      phases[index] = randomBetween(0, Math.PI * 2);
      speeds[index] = randomBetween(0.55, 1.35);
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    bufferGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    bufferGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    bufferGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return bufferGeometry;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    uniforms.uTime.value = timeRef.current;

    if (pointsRef.current) {
      pointsRef.current.rotation.z = -0.2 + Math.sin(timeRef.current * 0.022) * 0.008;
      pointsRef.current.position.x = Math.sin(timeRef.current * 0.018) * 0.16;
      pointsRef.current.position.y = Math.cos(timeRef.current * 0.017) * 0.1;
    }
  });

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          attribute float aSize;
          attribute float aAlpha;
          attribute float aPhase;
          attribute float aSpeed;
          varying float vAlpha;
          uniform float uTime;

          void main() {
            vec3 animated = position;
            animated.x += sin(uTime * 0.045 * aSpeed + aPhase) * 0.18;
            animated.y += cos(uTime * 0.038 * aSpeed + aPhase * 1.4) * 0.13;
            vec4 mvPosition = modelViewMatrix * vec4(animated, 1.0);
            float breath = 0.72 + 0.28 * sin(uTime * 0.12 + aPhase);
            vAlpha = aAlpha * breath * 1.65;
            gl_PointSize = aSize * (13.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          uniform sampler2D uTexture;

          void main() {
            vec4 sprite = texture2D(uTexture, gl_PointCoord);
            vec3 color = mix(vec3(0.48, 0.63, 0.96), vec3(1.0, 0.8, 0.5), 0.12);
            gl_FragColor = vec4(color, sprite.a * vAlpha);
          }
        `}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </points>
  );
}

function AirDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const texture = useMemo(() => makeSoftParticleTexture(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
    }),
    [texture],
  );

  const geometry = useMemo(() => {
    const positions = new Float32Array(AIR_DUST_COUNT * 3);
    const sizes = new Float32Array(AIR_DUST_COUNT);
    const alphas = new Float32Array(AIR_DUST_COUNT);
    const phases = new Float32Array(AIR_DUST_COUNT);
    const speeds = new Float32Array(AIR_DUST_COUNT);

    for (let index = 0; index < AIR_DUST_COUNT; index += 1) {
      positions[index * 3] = randomBetween(-9.8, 9.8);
      positions[index * 3 + 1] = randomBetween(-5.9, 5.9);
      positions[index * 3 + 2] = randomBetween(-1.2, 2.2);
      sizes[index] = randomBetween(1.4, 4.8);
      alphas[index] = randomBetween(0.018, 0.075);
      phases[index] = randomBetween(0, Math.PI * 2);
      speeds[index] = randomBetween(0.55, 1.35);
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    bufferGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    bufferGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    bufferGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return bufferGeometry;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    uniforms.uTime.value = timeRef.current;

    if (pointsRef.current) {
      pointsRef.current.position.x = (timeRef.current * 0.018) % 0.8;
      pointsRef.current.position.y = (timeRef.current * 0.012) % 0.55;
    }
  });

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          attribute float aSize;
          attribute float aAlpha;
          attribute float aPhase;
          attribute float aSpeed;
          varying float vAlpha;
          uniform float uTime;

          void main() {
            vec3 animated = position;
            animated.x += sin(uTime * 0.08 * aSpeed + aPhase) * 0.18 + uTime * 0.012;
            animated.y += cos(uTime * 0.07 * aSpeed + aPhase * 1.7) * 0.13 + uTime * 0.008;
            vec4 mvPosition = modelViewMatrix * vec4(animated, 1.0);
            float passingGlow = smoothstep(0.88, 1.0, sin(uTime * 0.21 + aPhase) * 0.5 + 0.5);
            vAlpha = aAlpha + passingGlow * 0.024;
            gl_PointSize = aSize * (12.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          uniform sampler2D uTexture;

          void main() {
            vec4 sprite = texture2D(uTexture, gl_PointCoord);
            gl_FragColor = vec4(vec3(0.72, 0.82, 0.96), sprite.a * vAlpha);
          }
        `}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </points>
  );
}

function Meteor({ initialDelay = 0.2, offset = 0 }: { initialDelay?: number; offset?: number }) {
  const meteorRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const stateRef = useRef<MeteorState>({
    active: false,
    elapsed: 0,
    duration: 1.35,
    nextAt: initialDelay,
    startX: 3.6 + offset,
    startY: 3.2,
    travelX: -5.2,
    travelY: -1.8,
    length: 4,
    thickness: 0.1,
  });
  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    const meteor = meteorRef.current;
    const glow = glowRef.current;
    if (!meteor || !glow) {
      return;
    }

    const state = stateRef.current;

    if (!state.active) {
      state.nextAt -= delta;
      uniforms.uOpacity.value = 0;

      if (state.nextAt <= 0) {
        state.active = true;
        state.elapsed = 0;
        state.duration = randomBetween(1.05, 1.55);
        state.startX = randomBetween(3.2, 8.2) + offset;
        state.startY = randomBetween(2.2, 4.6);
        state.travelX = -randomBetween(3.6, 5.4);
        state.travelY = -randomBetween(1.05, 1.8);
        state.length = randomBetween(2.8, 4.4);
        state.thickness = randomBetween(0.08, 0.13);
        meteor.scale.set(state.length, state.thickness, 1);
        glow.scale.set(state.length * 1.18, state.thickness * 5.4, 1);
      }

      return;
    }

    state.elapsed += delta;
    const progress = Math.min(state.elapsed / state.duration, 1);
    const ease = progress * progress * (3 - 2 * progress);
    const opacity = Math.sin(progress * Math.PI) * 2.2;

    meteor.position.set(state.startX + state.travelX * ease, state.startY + state.travelY * ease, -2.2);
    meteor.rotation.z = Math.atan2(state.travelY, state.travelX);
    glow.position.copy(meteor.position);
    glow.position.z = -2.24;
    glow.rotation.z = meteor.rotation.z;
    uniforms.uOpacity.value = opacity;

    if (progress >= 1) {
      state.active = false;
      state.nextAt = randomBetween(...METEOR_SPAWN_GAP);
      uniforms.uOpacity.value = 0;
    }
  });

  const meteorVertexShader = `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;
  const meteorFragmentShader = `
          varying vec2 vUv;
          uniform float uOpacity;

          void main() {
            float head = smoothstep(0.82, 1.0, vUv.x);
            float tail = smoothstep(0.0, 0.12, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x));
            float core = exp(-pow((vUv.y - 0.5) * 7.0, 2.0));
            float halo = exp(-pow((vUv.y - 0.5) * 3.0, 2.0)) * 0.34;
            float alpha = (head * 1.0 + tail * 0.82) * (core + halo) * uOpacity;
            vec3 tailColor = vec3(0.44, 0.66, 1.0);
            vec3 headColor = vec3(1.0, 0.98, 0.9);
            vec3 color = mix(tailColor, headColor, smoothstep(0.58, 1.0, vUv.x));
            gl_FragColor = vec4(color, alpha);
          }
        `;
  const glowFragmentShader = `
          varying vec2 vUv;
          uniform float uOpacity;

          void main() {
            float tail = smoothstep(0.0, 0.08, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));
            float halo = exp(-pow((vUv.y - 0.5) * 2.2, 2.0));
            float alpha = tail * halo * uOpacity * 0.46;
            vec3 color = vec3(0.36, 0.58, 1.0);
            gl_FragColor = vec4(color, alpha);
          }
        `;

  return (
    <>
      <mesh ref={glowRef} frustumCulled={false}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={meteorVertexShader}
          fragmentShader={glowFragmentShader}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh ref={meteorRef} frustumCulled={false}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={meteorVertexShader}
          fragmentShader={meteorFragmentShader}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </>
  );
}

function WindMist() {
  const timeRef = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0.24 },
    }),
    [],
  );

  useFrame((_, delta) => {
    timeRef.current += delta;
    uniforms.uTime.value = timeRef.current;
  });

  return (
    <mesh position={[0, -3.45, 0.65]} scale={[15.2, 3.05, 1]} frustumCulled={false}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uOpacity;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 5; i++) {
              value += amplitude * noise(p);
              p *= 2.05;
              amplitude *= 0.48;
            }
            return value;
          }

          void main() {
            vec2 wind = vec2(uTime * 0.018, uTime * 0.012);
            float mist = fbm(vUv * vec2(4.2, 1.45) + wind);
            mist += fbm(vUv * vec2(9.5, 2.0) + wind * 1.45) * 0.28;
            mist += fbm(vUv * vec2(16.0, 2.8) + wind * 0.7) * 0.08;

            float bottomHold = 1.0 - smoothstep(0.18, 0.95, vUv.y);
            float topFade = 1.0 - smoothstep(0.36, 0.98, vUv.y);
            float sideFade = smoothstep(0.0, 0.08, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x));
            float alpha = smoothstep(0.42, 0.84, mist) * bottomHold * topFade * sideFade * uOpacity;

            vec3 color = vec3(0.36, 0.46, 0.62);
            gl_FragColor = vec4(color, alpha);
          }
        `}
        depthWrite={false}
        transparent
      />
    </mesh>
  );
}

function CameraRig() {
  const { camera, size } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    perspectiveCamera.position.set(0, 0, 8);
    perspectiveCamera.fov = size.width < 760 ? 64 : 56;
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

function Scene() {
  return (
    <>
      <CameraRig />
      <Stars />
      <GalaxyDust />
      <WindMist />
      <AirDust />
      <Meteor initialDelay={0.15} />
      <Meteor initialDelay={1.35} offset={1.8} />
      <Meteor initialDelay={2.55} offset={-1.4} />
    </>
  );
}

function CosmicThreeLayer() {
  return (
    <div className="three-cosmic-layer" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 56, near: 0.1, far: 50 }}
        dpr={DPR}
        frameloop="always"
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default CosmicThreeLayer;
