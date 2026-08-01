import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  Html,
} from "@react-three/drei";
import { Suspense } from "react";
import Rider from "./Rider";

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-3 bg-zinc-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-zinc-700/50 shadow-2xl text-white">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium tracking-wide text-zinc-300">Loading 3D Model...</span>
      </div>
    </Html>
  );
}

export default function Scene({
  isPlaying = true,
  modelPath = "/models/rider.glb",
  moveLeft = false,
  moveRight = false,
  resetSignal = 0,
  selectedAnimation = "",
  activeHandAnimation = "",
  autoHandMotion = true,
  onAvailableAnimations = null,
}) {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 45 }}
        shadows
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={1.5} />

          <directionalLight
            position={[5, 10, 5]}
            intensity={3}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />

          <Environment preset="city" />

          <Center position={[0, -0.8, 0]}>
            <Rider
              isPlaying={isPlaying}
              modelPath={modelPath}
              moveLeft={moveLeft}
              moveRight={moveRight}
              resetSignal={resetSignal}
              selectedAnimation={selectedAnimation}
              activeHandAnimation={activeHandAnimation}
              autoHandMotion={autoHandMotion}
              onAvailableAnimations={onAvailableAnimations}
            />
          </Center>

          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.6}
            scale={15}
            blur={2.5}
            far={4}
          />

          <OrbitControls
            makeDefault
            enablePan={true}
            enableRotate={true}
            enableZoom={true}
            minDistance={1.5}
            maxDistance={12}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}


