import React from "react";
import Container from "@mui/material/Container";

const HeaderConsole2 = (props) => {
  const headerConsoleStyle = {
    zIndex: "1400",
    border: "1px solid red",
  };

  console.dir("Connected Clientzzzzzzzzzzz");
  console.dir({ props });

  return (
    <Container>
      <div>
        <h1>HEADER CONSOLE!</h1>
        <h2>Connected Clients: {props.clients.length}</h2>
        <ul>
          {props.clients.map((client, index) => (
            <li key={client}>{client}</li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default HeaderConsole2;
