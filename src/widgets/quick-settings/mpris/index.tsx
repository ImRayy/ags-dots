import AstalMpris from "gi://AstalMpris";
import { Variable, bind } from "astal";
import { Gtk } from "astal/gtk3";
import Player from "./player";

export default function Mpris() {
  const mpris = AstalMpris.get_default();
  const totalPlayers = bind(mpris, "players").as((p) => p.length);
  const playerIndex = Variable(0);

  const { SLIDE_LEFT, SLIDE_RIGHT } = Gtk.StackTransitionType;
  const transitionType = Variable(SLIDE_RIGHT);

  const prevPlayer = () => {
    if (playerIndex.get() > 0) {
      transitionType.set(SLIDE_RIGHT);
      playerIndex.set(playerIndex.get() - 1);
    }
  };

  const nextPlayer = () => {
    if (playerIndex.get() < totalPlayers.get() - 1) {
      transitionType.set(SLIDE_LEFT);
      playerIndex.set(playerIndex.get() + 1);
    }
  };

  return (
    <eventbox
      name="mpris-player"
      visible={bind(totalPlayers).as((l) => l > 0)}
      onScroll={(_, { delta_y }) => (delta_y > 0 ? nextPlayer() : prevPlayer())}
    >
      <stack
        visibleChildName={bind(playerIndex).as((v) => `child-${v}`)}
        transitionType={bind(transitionType)}
      >
        {bind(mpris, "players").as((players) =>
          players.map((player, index) => (
            <Player name={`child-${index}`} player={player} />
          )),
        )}
      </stack>
    </eventbox>
  );
}
