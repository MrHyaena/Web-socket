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
    const [typingName, setTypingName] = useState("");

    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [typing, setTyping] = useState(false);

    function handleMessage(value) {
      setMessage(value);
    }

    function handleSend() {
      socket.emit("chat", {
        message: message,
        name: name,
      });

      setMessage("");
    }

    function handleTyping() {
      socket.emit("typing", name);
    }

    function handleStopTyping() {
      socket.emit("stopTyping");
    }

    //Socket receivers
    socket.on("chat", (data) => {
      setTyping(false);
      setChatMessages([...chatMessages, data]);
    });

    socket.on("typing", (data) => {
      setTypingName(data);
      setTyping(true);
    });

    socket.on("stopTyping", () => {
      setTyping(false);
    });

    //Initial socket connection received
    useEffect(() => {
      socket.on("connection", (socket) => {
        console.log(socket.id);
      });
    }, []);

    //UseEffect for scrolling down after message is received and typing state is changed
    useEffect(() => {
      const chatwindow = document.querySelector("#chatWindow");
      console.log(chatwindow.getBoundingClientRect());
      chatwindow.scrollTo({
        top: chatwindow.scrollHeight,
        behavior: "smooth",
      });
    }, [chatMessages, typingName]);

    return (
      <>
        <div
          className="h-[800px] w-[600px] grid grid-rows-[1fr_80px_80px_80px]"
          key={"chatWindow"}
        >
          <div
            id="chatWindow"
            className="p-5 border-t border-x border-slate-200 flex flex-col gap-7 max-w-full overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
          >
            {chatMessages.map((item, index) => {
              return (
                <>
                  <div
                    className="flex gap-2 items-center"
                    key={item.name + item.message}
                  >
                    <p className="bg-sky-300 font-semibold text-lg w-10 h-10 rounded-full flex items-center justify-center">
                      {item.name[0]}
                    </p>
                    <div key={item.name + item.message}>
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-slate-700">{item.message}</p>
                    </div>
                  </div>
                </>
              );
            })}
            <div className="">
              {typing && (
                <>
                  <p className="text-lg italic font-semibold text-gray-400">
                    {typingName} píše zprávu...
                  </p>
                </>
              )}
            </div>
          </div>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            className="border-t border-x p-5 border-slate-200"
            placeholder="Vaše jméno"
          />
          {name && (
            <input
              value={message}
              onFocus={() => {
                handleTyping();
              }}
              onBlur={() => {
                handleStopTyping();
              }}
              onChange={(e) => {
                handleMessage(e.target.value);
              }}
              type="text"
              className="border-t p-5 border-x border-slate-200"
              placeholder="Vaše zpráva"
            />
          )}
          <button
            onClick={handleSend}
            className="bg-sky-500 text-white font-semibold text-xl cursor-pointer hover:bg-sky-600"
          >
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
