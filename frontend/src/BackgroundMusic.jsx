import { useEffect, useRef } from "react";

export default function BackgroundMusic({ isPlaying = false }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/audio/bg.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log("Audio play postponed until user interaction:", err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return null;
}