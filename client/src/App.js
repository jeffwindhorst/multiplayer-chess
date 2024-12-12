import { useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Game from "./Game";
import InitGame from "./InitGame";
import CustomDialog from "./components/CustomDialog";
import socket from "./socket";
import { TextField } from "@mui/material";

// import HeaderConsole from "./HeaderConsole";
import HeaderConsole from "./HeaderConsole";

export default function App() {
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);

  const useHeaderConsole = true;
  const [connectedClients, setConnectedClients] = useState([]);

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  useEffect(() => {
    socket.on("updateClients", (clients) => {
      setConnectedClients(clients);
    });

    return () => {
      socket.off("updateClients");
    };
  }, []);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      setPlayers(roomData.players);
    });
  }, []);

  useEffect(() => {
    socket.on("updateClients", (clients) => {
      setConnectedClients(clients);
    });

    return () => {
      socket.off("updateClients");
    };
  }, []);

  let HeaderDisplay;
  if (useHeaderConsole) {
    HeaderDisplay = <HeaderConsole clients={connectedClients} />;
  } else {
    HeaderDisplay = null;
  }

  return (
    <Container>
      <CustomDialog
        open={!usernameSubmitted}
        handleClose={() => setUsernameSubmitted(true)}
        title="Pick a username"
        contentText="Please select a username"
        handleContinue={() => {
          if (!username) return;
          socket.emit("username", username);
          setUsernameSubmitted(true);
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          name="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
        />
      </CustomDialog>

      <div>
        <div>{HeaderDisplay}</div>
      </div>

      {room ? (
        <Game
          room={room}
          orientation={orientation}
          username={username}
          players={players}
          // the cleanup function will be used by Game to reset the state when a game is over
          cleanup={cleanup}
        />
      ) : (
        <InitGame
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
        />
      )}
    </Container>
  );
}
