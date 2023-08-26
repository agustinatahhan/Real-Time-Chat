import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import axios from "axios";
const socket = io("http://localhost:4000");

function App() {
  const [nickname, setNickname] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [storedMessages, setStoredMessages] = useState([]);
  const [firstTime, setfirstTime] = useState(false);

  const url = "http://localhost:4000/";

  useEffect(() => {
    const receivedMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]); 
    };
    socket.on("message", receivedMessage);

    return () => {
      socket.off("message", receivedMessage);
    };
  }, []);

  if (!firstTime) {
    axios.get(url + "messages").then((res) => {
      const latestStoredMessages = res.data.messages.slice(-50);
      setStoredMessages(latestStoredMessages.reverse()); 
    });
    setfirstTime(true);
  }
  const handlerSubmit = (e) => {
    e.preventDefault();

    if (nickname !== "") {
      socket.emit("message", message, nickname);

      const newMessage = {
        body: message,
        from: "Yo",
      };

      setMessages((messages) => [...messages, newMessage]);

      setMessage("");

      axios.post(url + "save", {
        message: message,
        from: nickname,
      });
    } else {
      alert("Para enviar mensajes debes establecer un nickname!!!");
    }
  };

  const nicknameSubmit = (e) => {
    e.preventDefault();
    setNickname(nickname);
    setDisabled(true);
  };

  return (
    <div className="App">
      <div className="container mt-3">
        <div className="card shadow border-0">
          <div className="card-body">
            <h5 className="text-center mb-3">CHAT</h5>

            {/* nickname */}

            <form onSubmit={nicknameSubmit}>
              <div className="d-flex mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="nickname"
                  placeholder="Nickname..."
                  disabled={disabled}
                  onChange={(e) => setNickname(e.target.value)}
                  value={nickname}
                  required
                />
                <button
                  className="btn btn-success mx-3"
                  type="submit"
                  id="btn-nickname"
                  disabled={disabled}
                >
                  Establecer
                </button>
              </div>
            </form>
          </div>
        </div>


        <div className="card mt-3 mb-3 shadow border-0" id="content-chat">
          <div className="card-body">
            <small className="text-center text-muted">
              ... Mensajes guardados ...
            </small>
            {storedMessages.map((message, index) => (
              <div
                key={index}
                className={`d-flex p-3 ${
                  message.from === nickname
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`card mb-3 shadow border-1 ${
                    message.from === nickname
                      ? "bg-success bg-opacity-25"
                      : "bg-light"
                  }`}
                >
                  <div className="card-body">
                    <small className="text-muted">
                      {message.from}: {message.message}
                    </small>
                  </div>
                </div>
              </div>
            ))}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`d-flex p-3 ${
                  message.from === "Yo"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`card mb-3 shadow border-1 ${
                    message.from === "Yo"
                      ? "bg-success bg-opacity-25"
                      : "bg-light"
                  }`}
                >
                  <div className="card-body">
                    <small className="">
                      {message.from}: {message.body}
                    </small>
                  </div>
                </div>
              </div>
            ))}
            <form onSubmit={handlerSubmit}>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mensaje..."
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
                <button className="btn btn-success mx-3" type="submit">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
