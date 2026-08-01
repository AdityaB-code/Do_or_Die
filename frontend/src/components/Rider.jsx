import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Rider({
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
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const { actions, names } = useAnimations(animations, group);

  const targetX = useRef(0);
  const currentX = useRef(0);
  const keysPressed = useRef({ left: false, right: false });
  const activeBaseAnimRef = useRef(null);
  const activeHandAnimRef = useRef(null);
  const autoTimer = useRef(0);
  const currentAutoHand = useRef("V_BoneFlailLeft");

  // Send list of available animation names to parent UI
  useEffect(() => {
    if (onAvailableAnimations && names) {
      onAvailableAnimations(names);
    }
  }, [names, modelPath]);

  // Handle position reset signal
  useEffect(() => {
    targetX.current = 0;
  }, [resetSignal]);

  // Keyboard Listeners (Left / Right Arrow & A / D keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysPressed.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysPressed.current.right = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysPressed.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysPressed.current.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Synchronize pause/play status across all animation actions
  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action) => {
      if (action) {
        action.paused = !isPlaying;
      }
    });
  }, [isPlaying, actions]);

  // Main Animation Blending Loop
  useFrame((state, delta) => {
    if (!group.current || !actions) return;

    const speed = 4.5 * delta;
    const isMovingLeft = keysPressed.current.left || moveLeft;
    const isMovingRight = keysPressed.current.right || moveRight;

    if (isMovingLeft) {
      targetX.current = Math.max(-3.5, targetX.current - speed);
    }
    if (isMovingRight) {
      targetX.current = Math.min(3.5, targetX.current + speed);
    }

    // 1. BASE BODY ANIMATION
    let desiredBase = selectedAnimation;

    if (!desiredBase || !actions[desiredBase]) {
      if (isMovingLeft && actions["V_LeanLeft"]) {
        desiredBase = "V_LeanLeft";
      } else if (isMovingRight && actions["V_LeanRight"]) {
        desiredBase = "V_LeanRight";
      } else if (actions["V_RideIdle"]) {
        desiredBase = "V_RideIdle";
      } else if (names && names.length > 0) {
        desiredBase = names[0];
      }
    }

    if (desiredBase && actions[desiredBase] && activeBaseAnimRef.current !== desiredBase) {
      if (activeBaseAnimRef.current && actions[activeBaseAnimRef.current] && activeBaseAnimRef.current !== activeHandAnimRef.current) {
        actions[activeBaseAnimRef.current].fadeOut(0.2);
      }

      const baseAction = actions[desiredBase];
      baseAction
        .reset()
        .setEffectiveTimeScale(1.2)
        .setEffectiveWeight(0.6)
        .fadeIn(0.2)
        .play();

      baseAction.paused = !isPlaying;
      activeBaseAnimRef.current = desiredBase;
    }

    // 2. HAND & ARM ANIMATION LAYER
    let desiredHand = activeHandAnimation;

    if (!desiredHand) {
      if (isMovingLeft && actions["V_BoneFlailLeft"]) {
        desiredHand = "V_BoneFlailLeft";
      } else if (isMovingRight && actions["V_BoneFlailRight"]) {
        desiredHand = "V_BoneFlailRight";
      } else if (autoHandMotion) {
        // Cycle auto hand movements every 2 seconds
        autoTimer.current += delta;
        if (autoTimer.current > 2.2) {
          autoTimer.current = 0;
          currentAutoHand.current =
            currentAutoHand.current === "V_BoneFlailLeft"
              ? "V_BoneFlailRight"
              : "V_BoneFlailLeft";
        }
        if (actions[currentAutoHand.current]) {
          desiredHand = currentAutoHand.current;
        }
      }
    }

    if (desiredHand && actions[desiredHand] && activeHandAnimRef.current !== desiredHand) {
      if (activeHandAnimRef.current && actions[activeHandAnimRef.current] && activeHandAnimRef.current !== activeBaseAnimRef.current) {
        actions[activeHandAnimRef.current].fadeOut(0.2);
      }

      const handAction = actions[desiredHand];
      handAction
        .reset()
        .setEffectiveTimeScale(1.3)
        .setEffectiveWeight(1.0)
        .fadeIn(0.2)
        .play();

      handAction.paused = !isPlaying;
      activeHandAnimRef.current = desiredHand;
    }

    // Smooth position lerp
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, delta * 10);
    group.current.position.x = currentX.current;

    // Slight lean tilt during sideways movement
    let targetTilt = 0;
    if (isMovingLeft) targetTilt = 0.14;
    if (isMovingRight) targetTilt = -0.14;

    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      targetTilt,
      delta * 8
    );
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/rider.glb");
useGLTF.preload("/models/robot.glb");


