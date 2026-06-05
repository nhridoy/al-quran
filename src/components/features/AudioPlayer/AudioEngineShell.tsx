import { useEffect } from "react";
import { mountAudioEngine, unmountAudioEngine } from "@/store/audio";

export default function AudioEngineShell() {
  useEffect(() => {
    mountAudioEngine();
    return unmountAudioEngine;
  }, []);
  return null;
}
