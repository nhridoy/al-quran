import { usePlayer } from "../../hooks/usePlayer";
import { PlayerFull } from "./PlayerFull";
import { PlayerMini } from "./PlayerMini";

const Player = () => {
  const { isPlayerOpen, currentTrack } = usePlayer();

  if (!currentTrack) return null;

  return (
    <>
      {isPlayerOpen && <PlayerFull />}
      <div>
        <PlayerMini />
      </div>
    </>
  );
};

export default Player;
