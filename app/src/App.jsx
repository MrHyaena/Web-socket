import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const URL = "http://localhost:4000";

const socket = io(URL);

function App() {
  const [count, setCount] = useState(0);

  function Wrapper({ children }) {
    return (
      <>
        <div className="w-full min-h-screen flex items-center justify-center">
          {children}
        </div>
      </>
    );
  }

  function ChatWindow() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);

    function handleMessage(value) {
      setMessage(value);
    }

    useEffect(() => {
      socket.on("connection", (socket) => {
        console.log(socket.id);
      });
    }, []);

    return (
      <>
        <div className="h-[800px] w-[600px] border border-slate-200 grid grid-rows-[1fr_80px_80px_80px]">
          <div></div>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            className="border-t p-5 border-slate-200"
            placeholder="Vaše jméno"
          />
          <input
            value={message}
            onChange={(e) => {
              handleMessage(e.target.value);
            }}
            type="text"
            className="border-t p-5 border-slate-200"
            placeholder="Vaše zpráva"
          />
          <button className="bg-sky-500 text-white font-semibold text-xl">
            Odeslat
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Wrapper>
        <ChatWindow />
      </Wrapper>
    </>
  );
}

export default App;
