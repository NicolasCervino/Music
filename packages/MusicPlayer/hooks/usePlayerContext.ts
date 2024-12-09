import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
} 