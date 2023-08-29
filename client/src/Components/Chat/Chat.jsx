import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMessages, postMessage } from "../../Redux/Actions/actions.js";
import "./Chat.css";

const socket = io("http://localhost:4000");
export const Chat = () => {
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isScrollingManually, setIsScrollingManually] = useState(false);

  const messagesFromStore = useSelector((state) => state.messages);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const receivedMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on("message", receivedMessage);

    return () => {
      socket.off("message", receivedMessage);
    };
  }, []);

  useEffect(() => {
    dispatch(getMessages());
  }, []);
  
  useEffect(() => {
    console.log(messagesFromStore.length);
    if (messagesFromStore.length > 0 && !isScrollingManually) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messagesFromStore, isScrollingManually]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nickname !== "") {
      socket.emit("message", message, nickname);

      const newMessage = {
        body: message,
        from: "Yo",
        timestamp: new Date().getTime(),
      };
      setMessages((messages) => [...messages, newMessage]);
      const prevScrollHeight = messagesContainerRef.current.scrollHeight;

      setTimeout(() => {
        dispatch(postMessage(message, nickname));
        setMessage("");

        requestAnimationFrame(() => {
          messagesContainerRef.current.scrollTop = prevScrollHeight;
        });
      }, 0);
    } else {
      alert("Para enviar mensajes debes establecer un nombre");
    }
  };

  const nicknameSubmit = (e) => {
    e.preventDefault();
    setNickname(nickname);
  };

  return (
    <div className="container mt-3">
      {/* <h5 className="text-center mb-3">Set your name and start chatting</h5> */}
      <div className="card shadow border-0 mb-3 ">
        <div className="card-body">
          <form onSubmit={nicknameSubmit}>
            <div className="d-flex">
              <input
                type="text"
                className="form-control text-center"
                id="nickname"
                placeholder="Set your name and start chatting"
                // disabled={disabled}
                onChange={(e) => setNickname(e.target.value)}
                value={nickname}
                required
              />
              <button
                className="btn btn-lightBlue mx-3"
                type="submit"
                id="btn-nickname"
                // disabled={disabled}
              >
                Establecer
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow border-0 mb-5 max-height-300">
        <div
          className="card-body  overflow-auto border rounded"
          ref={messagesContainerRef}
          onScroll={() => setIsScrollingManually(true)}
          onMouseUp={() => setIsScrollingManually(false)}
        >
          {messagesFromStore.map((message, index) => (
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
                    ? "bg-light bg-opacity-25"
                    : "bg-lightBlue"
                }`}
              >
                <div className="card-body">
                  <small>
                    <span className="fw-bold">{message.from}:</span>{" "}
                    {message.message}
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
                    ? "bg-light "
                    : "bg-lightBlue"
                }`}
              >
                <div className="card-body">
                  <small>
                    <span className="fw-bold">{message.from}:</span> {message.body}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
        <form className="my-2 mx-2" onSubmit={handleSubmit}>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Mensaje..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button className="btn btn-lightBlue ms-2 " type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-send"
                viewBox="0 0 16 16"
              >
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Chat;
