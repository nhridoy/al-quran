import { createContext, useContext } from "react";
import type {
  AudioPlayerActions,
  AudioPlayerContextType,
  AudioPlayerState,
} from "./types";
import { usePlayback } from "./usePlayback";

const AudioPlayerStateContext = createContext<AudioPlayerState | null>(null);
const AudioPlayerActionsContext = createContext<AudioPlayerActions | null>(
  null,
);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { stateValue, actionsValue } = usePlayback();

  return (
    <AudioPlayerStateContext.Provider value={stateValue}>
      <AudioPlayerActionsContext.Provider value={actionsValue}>
        {children}
      </AudioPlayerActionsContext.Provider>
    </AudioPlayerStateContext.Provider>
  );
}

export function useAudioPlayerState(): AudioPlayerState {
  const context = useContext(AudioPlayerStateContext);
  if (!context) {
    throw new Error(
      "useAudioPlayerState must be used within AudioPlayerProvider",
    );
  }
  return context;
}

export function useAudioPlayerActions(): AudioPlayerActions {
  const context = useContext(AudioPlayerActionsContext);
  if (!context) {
    throw new Error(
      "useAudioPlayerActions must be used within AudioPlayerProvider",
    );
  }
  return context;
}

export function useAudioPlayer(): AudioPlayerContextType {
  const state = useAudioPlayerState();
  const actions = useAudioPlayerActions();
  return { ...state, ...actions };
}
