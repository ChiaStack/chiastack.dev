import { useMemo, useState, useRef } from "react";

import { useFBO } from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import * as easing from "maath/easing";
import * as THREE from "three";

import { DofPointsMaterial } from "./shaders/pointMaterial";
import { SimulationMaterial } from "./shaders/simulationMaterial";

export function Particles({
  speed,
  aperture,
  focus,
  size = 512,
  noiseScale = 1.0,
  noiseIntensity = 0.5,
  timeScale = 0.5,
  pointSize = 2.0,
  opacity = 1.0,
  planeScale = 1.0,
  useManualTime = false,
  manualTime = 0,
  introspect = false,
  isDark = true,
  ...props
}: {
  speed: number;
  aperture: number;
  focus: number;
  size: number;
  noiseScale?: number;
  noiseIntensity?: number;
  timeScale?: number;
  pointSize?: number;
  opacity?: number;
  planeScale?: number;
  useManualTime?: boolean;
  manualTime?: number;
  introspect?: boolean;
  isDark?: boolean;
}) {
  // Reveal animation state
  const revealStartTime = useRef<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(true);
  const revealDuration = 3.5; // seconds
  // Create simulation material with scale parameter
  const simulationMaterial = useMemo(() => {
    return new SimulationMaterial(planeScale);
  }, [planeScale]);

  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  const dofPointsMaterial = useMemo(() => {
    const m = new DofPointsMaterial();
    if (m.uniforms.positions) {
      m.uniforms.positions.value = target.texture;
    }
    if (
      m.uniforms.initialPositions &&
      simulationMaterial.uniforms.initialPositions
    ) {
      m.uniforms.initialPositions.value =
        simulationMaterial.uniforms.initialPositions.value;
    }
    if (m.uniforms.uIsDark) {
      m.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
    }
    return m;
  }, [simulationMaterial, isDark]);

  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)
  );
  const [positions] = useState(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ])
  );
  const [uvs] = useState(
    () => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
  );

  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  useFrame((state, delta) => {
    if (!dofPointsMaterial || !simulationMaterial) return;

    state.gl.setRenderTarget(target);
    state.gl.clear();
    state.gl.render(scene, camera);
    state.gl.setRenderTarget(null);

    // Use manual time if enabled, otherwise use elapsed time
    const currentTime = useManualTime ? manualTime : state.clock.elapsedTime;

    // Initialize reveal start time on first frame
    if (revealStartTime.current === null) {
      revealStartTime.current = currentTime;
    }

    // Calculate reveal progress
    const revealElapsed = currentTime - revealStartTime.current;
    const revealProgress = Math.min(revealElapsed / revealDuration, 1.0);

    // Ease out the reveal animation
    const easedProgress = 1 - Math.pow(1 - revealProgress, 3);

    // Map progress to reveal factor (0 = fully hidden, higher values = more revealed)
    // We want to start from center (0) and expand outward (higher values)
    const revealFactor = easedProgress * 4.0; // Doubled the radius for larger coverage

    if (revealProgress >= 1.0 && isRevealing) {
      setIsRevealing(false);
    }

    if (dofPointsMaterial.uniforms.uTime) {
      // eslint-disable-next-line react-hooks/immutability
      dofPointsMaterial.uniforms.uTime.value = currentTime;
    }

    if (dofPointsMaterial.uniforms.uFocus) {
      dofPointsMaterial.uniforms.uFocus.value = focus;
    }
    if (dofPointsMaterial.uniforms.uBlur) {
      dofPointsMaterial.uniforms.uBlur.value = aperture;
    }

    if (dofPointsMaterial.uniforms.uTransition) {
      easing.damp(
        dofPointsMaterial.uniforms.uTransition,
        "value",
        introspect ? 1.0 : 0.0,
        introspect ? 0.35 : 0.2,
        delta
      );
    }

    if (simulationMaterial.uniforms.uTime) {
      // eslint-disable-next-line react-hooks/immutability
      simulationMaterial.uniforms.uTime.value = currentTime;
    }
    if (simulationMaterial.uniforms.uNoiseScale) {
      simulationMaterial.uniforms.uNoiseScale.value = noiseScale;
    }
    if (simulationMaterial.uniforms.uNoiseIntensity) {
      simulationMaterial.uniforms.uNoiseIntensity.value = noiseIntensity;
    }
    if (simulationMaterial.uniforms.uTimeScale) {
      simulationMaterial.uniforms.uTimeScale.value = timeScale * speed;
    }
    if (simulationMaterial.uniforms.uNoiseIntensity) {
      simulationMaterial.uniforms.uNoiseIntensity.value = noiseIntensity;
    }
    if (simulationMaterial.uniforms.uTimeScale) {
      simulationMaterial.uniforms.uTimeScale.value = timeScale * speed;
    }

    // Update point material uniforms
    if (dofPointsMaterial.uniforms.uPointSize) {
      dofPointsMaterial.uniforms.uPointSize.value = pointSize;
    }
    if (dofPointsMaterial.uniforms.uOpacity) {
      dofPointsMaterial.uniforms.uOpacity.value = opacity;
    }
    if (dofPointsMaterial.uniforms.uRevealFactor) {
      dofPointsMaterial.uniforms.uRevealFactor.value = revealFactor;
    }
    if (dofPointsMaterial.uniforms.uRevealProgress) {
      dofPointsMaterial.uniforms.uRevealProgress.value = easedProgress;
    }
    if (dofPointsMaterial.uniforms.uIsDark) {
      dofPointsMaterial.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
    }
  });

  return (
    <>
      {createPortal(
        <mesh material={simulationMaterial}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points material={dofPointsMaterial} {...props}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
      </points>
    </>
  );
}
