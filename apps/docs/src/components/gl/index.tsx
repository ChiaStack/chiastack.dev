import { Effects } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";

import { Particles } from "./particles";
import { VignetteShader } from "./shaders/vignetteShader";

export const GL = ({
  hovering,
  isDark,
}: {
  hovering: boolean;
  isDark: boolean;
}) => {
  const {
    speed,
    focus,
    aperture,
    size,
    noiseScale,
    noiseIntensity,
    timeScale,
    pointSize,
    opacity,
    planeScale,
    vignetteDarkness,
    vignetteOffset,
    useManualTime,
    manualTime,
  } = useControls("Particle System", {
    speed: { value: 1.0, min: 0, max: 2, step: 0.01 },
    noiseScale: { value: 0.6, min: 0.1, max: 5, step: 0.1 },
    noiseIntensity: { value: 0.52, min: 0, max: 2, step: 0.01 },
    timeScale: { value: 1, min: 0, max: 2, step: 0.01 },
    focus: { value: 3.8, min: 0.1, max: 20, step: 0.1 },
    aperture: { value: 1.79, min: 0, max: 2, step: 0.01 },
    pointSize: { value: 10.0, min: 0.1, max: 10, step: 0.1 },
    opacity: { value: 0.8, min: 0, max: 1, step: 0.01 },
    planeScale: { value: 10.0, min: 0.1, max: 10, step: 0.1 },
    size: {
      value: 512,
      options: [256, 512, 1024],
    },
    showDebugPlane: { value: false },
    vignetteDarkness: { value: 1.5, min: 0, max: 2, step: 0.1 },
    vignetteOffset: { value: 0.4, min: 0, max: 2, step: 0.1 },
    useManualTime: { value: false },
    manualTime: { value: 0, min: 0, max: 50, step: 0.01 },
  });

  const backgroundColor = isDark ? "#000" : "#fff";
  const adjustedVignetteDarkness = isDark
    ? vignetteDarkness
    : vignetteDarkness * 0.6;
  const adjustedVignetteOffset = isDark ? vignetteOffset : vignetteOffset * 1.2;
  const adjustedOpacity = isDark ? opacity : opacity * 0.9;
  const adjustedPointSize = isDark ? pointSize : pointSize * 0.8;

  return (
    <div id="webgl" className="fixed inset-0 pointer-events-none h-svh w-full">
      <Canvas
        className="w-full h-full"
        camera={{
          position: [
            1.2629783123314589, 2.664606471394044, -1.8178993743288914,
          ],
          fov: 50,
          near: 0.01,
          far: 300,
        }}>
        {/* <Perf position="top-left" /> */}
        <color attach="background" args={[backgroundColor]} />
        <Particles
          speed={speed}
          aperture={aperture}
          focus={focus}
          size={size}
          noiseScale={noiseScale}
          noiseIntensity={noiseIntensity}
          timeScale={timeScale}
          pointSize={adjustedPointSize}
          opacity={adjustedOpacity}
          planeScale={planeScale}
          useManualTime={useManualTime}
          manualTime={manualTime}
          introspect={hovering}
          isDark={isDark}
        />
        <Effects multisamping={0} disableGamma>
          <shaderPass
            args={[VignetteShader]}
            uniforms-darkness-value={adjustedVignetteDarkness}
            uniforms-offset-value={adjustedVignetteOffset}
            uniforms-isDark-value={isDark ? 1.0 : 0.0}
          />
        </Effects>
      </Canvas>
    </div>
  );
};
