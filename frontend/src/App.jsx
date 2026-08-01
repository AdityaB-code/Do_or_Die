import { useState } from "react";
import Scene from "./components/Scene";
import BackgroundMusic from "./BackgroundMusic";

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedModel, setSelectedModel] = useState("/models/rider.glb");
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [availableAnimations, setAvailableAnimations] = useState([]);
  const [selectedAnimation, setSelectedAnimation] = useState("");
  const [activeHandAnimation, setActiveHandAnimation] = useState("");
  const [autoHandMotion, setAutoHandMotion] = useState(true);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleResetPosition = () => {
    setResetSignal((prev) => prev + 1);
  };

  const handleModelChange = (modelPath) => {
    setSelectedModel(modelPath);
    setSelectedAnimation("");
    setActiveHandAnimation("");
  };

  const triggerHandAction = (animName) => {
    setActiveHandAnimation(animName);
    setTimeout(() => {
      setActiveHandAnimation("");
    }, 2500);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950 text-white select-none">
      {/* Background Audio Controller */}
      <BackgroundMusic isPlaying={isPlaying} />

      {/* 3D Scene Viewport */}
      <Scene
        isPlaying={isPlaying}
        modelPath={selectedModel}
        moveLeft={moveLeft}
        moveRight={moveRight}
        resetSignal={resetSignal}
        selectedAnimation={selectedAnimation}
        activeHandAnimation={activeHandAnimation}
        autoHandMotion={autoHandMotion}
        onAvailableAnimations={setAvailableAnimations}
      />

      {/* Top Header / Controls Overlay */}
      <header className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none z-10">
        <div className="flex items-center gap-3 bg-zinc-900/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-800/60 shadow-xl pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <h1 className="text-sm font-semibold tracking-wide text-zinc-200">3D Interactive Viewer</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
          {/* Auto Hand Motion Toggle */}
          <button
            onClick={() => setAutoHandMotion((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-medium rounded-2xl border transition-all duration-200 backdrop-blur-md ${
              autoHandMotion
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                : "bg-zinc-900/70 text-zinc-400 border-zinc-800/60 hover:text-white"
            }`}
          >
            {autoHandMotion ? "✨ Hands Moving: ON" : "💤 Hands Moving: OFF"}
          </button>

          {/* Animation Selector Dropdown */}
          {availableAnimations.length > 0 && (
            <div className="flex items-center gap-2 bg-zinc-900/70 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-zinc-800/60 shadow-xl">
              <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Animation:</span>
              <select
                value={selectedAnimation}
                onChange={(e) => setSelectedAnimation(e.target.value)}
                className="bg-zinc-800/80 text-white text-xs font-medium px-2.5 py-1 rounded-xl outline-none border border-zinc-700/50 cursor-pointer hover:bg-zinc-700/80 transition-all"
              >
                <option value="">✨ Auto (Steer & Ride)</option>
                {availableAnimations.map((anim) => (
                  <option key={anim} value={anim}>
                    🎬 {anim}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Model Switcher Pill */}
          <div className="flex items-center gap-1.5 bg-zinc-900/70 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-800/60 shadow-xl">
            <button
              onClick={() => handleModelChange("/models/rider.glb")}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ${
                selectedModel === "/models/rider.glb"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              Rider
            </button>
            <button
              onClick={() => handleModelChange("/models/robot.glb")}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ${
                selectedModel === "/models/robot.glb"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              Robot
            </button>
          </div>
        </div>
      </header>

      {/* Hand Quick Action Buttons (If Rider model is selected) */}
      {selectedModel === "/models/rider.glb" && (
        <div className="absolute top-20 right-6 flex flex-col gap-2 z-10 pointer-events-auto">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 text-right pr-1">
            Hand Actions:
          </span>
          <div className="flex flex-col gap-1.5 bg-zinc-900/80 backdrop-blur-md p-2 rounded-2xl border border-zinc-800/70 shadow-2xl">
            <button
              onClick={() => triggerHandAction("V_BoneFlailLeft")}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-800/80 hover:bg-indigo-600 text-zinc-200 hover:text-white transition-all text-left flex items-center gap-2"
            >
              <span>🖐️</span> Left Hand Flail
            </button>
            <button
              onClick={() => triggerHandAction("V_BoneFlailRight")}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-800/80 hover:bg-indigo-600 text-zinc-200 hover:text-white transition-all text-left flex items-center gap-2"
            >
              <span>🤚</span> Right Hand Flail
            </button>
            <button
              onClick={() => triggerHandAction("V_Shockwave")}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-800/80 hover:bg-indigo-600 text-zinc-200 hover:text-white transition-all text-left flex items-center gap-2"
            >
              <span>💥</span> Shockwave
            </button>
            <button
              onClick={() => triggerHandAction("V_Hazard_Stream")}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-800/80 hover:bg-indigo-600 text-zinc-200 hover:text-white transition-all text-left flex items-center gap-2"
            >
              <span>🔥</span> Hazard Stream
            </button>
          </div>
        </div>
      )}



      {/* Sideways Movement Controls (Left / Right Buttons & Center Reset) */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 pointer-events-auto flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-zinc-800/70 shadow-2xl">
        <span className="text-xs font-medium text-zinc-400 mr-1 hidden sm:inline">Move Model:</span>

        {/* Move Left Button */}
        <button
          onMouseDown={() => setMoveLeft(true)}
          onMouseUp={() => setMoveLeft(false)}
          onMouseLeave={() => setMoveLeft(false)}
          onTouchStart={() => setMoveLeft(true)}
          onTouchEnd={() => setMoveLeft(false)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 ${
            moveLeft
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-95"
              : "bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          <span>Left</span>
        </button>

        {/* Center Reset Button */}
        <button
          onClick={handleResetPosition}
          className="px-3 py-2 rounded-xl text-xs font-medium bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 transition-all duration-150 active:scale-95"
          title="Reset Model to Center"
        >
          ↺ Center
        </button>

        {/* Move Right Button */}
        <button
          onMouseDown={() => setMoveRight(true)}
          onMouseUp={() => setMoveRight(false)}
          onMouseLeave={() => setMoveRight(false)}
          onTouchStart={() => setMoveRight(true)}
          onTouchEnd={() => setMoveRight(false)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 ${
            moveRight
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-95"
              : "bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700/80 hover:text-white"
          }`}
        >
          <span>Right</span>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>

        {/* Keyboard Hint Badge */}
        <div className="hidden md:flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-800/50 px-2.5 py-1.5 rounded-lg border border-zinc-700/40 ml-1">
          <span className="font-mono bg-zinc-700/60 px-1 rounded text-zinc-300">◄</span>
          <span className="font-mono bg-zinc-700/60 px-1 rounded text-zinc-300">►</span>
          <span>or</span>
          <span className="font-mono bg-zinc-700/60 px-1 rounded text-zinc-300">A</span>
          <span className="font-mono bg-zinc-700/60 px-1 rounded text-zinc-300">D</span>
        </div>
      </div>

      {/* Bottom Floating Control Bar with SINGLE Unified Play/Pause Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
        <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-xl px-5 py-3 rounded-3xl border border-zinc-700/60 shadow-2xl shadow-black/80">
          
          {/* Single Play / Pause Button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio and animation" : "Play audio and animation"}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform active:scale-95 shadow-lg ${
              isPlaying
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-orange-500/25"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25 animate-pulse"
            }`}
          >
            {isPlaying ? (
              <>
                {/* Pause Icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <span>Pause Scene & Audio</span>
              </>
            ) : (
              <>
                {/* Play Icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play Scene & Audio</span>
              </>
            )}
          </button>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-2 border-l border-zinc-700/60 text-xs text-zinc-400">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? "bg-emerald-400 animate-ping" : "bg-amber-400"
              }`}
            ></span>
            <span>{isPlaying ? "Playing" : "Paused"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
