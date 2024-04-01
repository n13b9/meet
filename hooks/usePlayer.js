import { useSocket } from "@/context/socket";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";

const usePlayer = (myId, roomId, peer) => {
  const socket = useSocket();
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const playersCopy = cloneDeep(players);

  const playerHighlighted = playersCopy[myId];
  delete playersCopy[myId];

  const nonHighlightedPlayers = playersCopy;
  const toggleAudio = () => {
    console.log("I toggled my Audio");
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].muted = !copy[myId].muted;
      return { ...copy };
    });

    socket.emit("user-toggle-audio", myId, roomId);
  };
  const toggleVideo = () => {
    console.log("I toggled my Video");
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].playing = !copy[myId].playing;
      return { ...copy };
    });

    socket.emit("user-toggle-video", myId, roomId);
  };

  const leaveRoom = () => {
    socket.emit("user-leave", myId, roomId);
    console.log("leaving room", roomId);
    peer?.disconnect();
    router.push("/");
  };

  return {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
};

export default usePlayer;
