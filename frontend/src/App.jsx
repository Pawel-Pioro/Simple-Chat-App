// src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const chatSocket = useRef(null);

  useEffect(() => {
    const url = `ws://127.0.0.1:8000/ws/socket-server/`;
    chatSocket.current = new WebSocket(url);

    chatSocket.current.onmessage = function (e) {
      const data = JSON.parse(e.data);
      if (data.type === 'chat') {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    };

    return () => {
      chatSocket.current.close();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    chatSocket.current.send(JSON.stringify({ message }));
    setMessage('');
  };

  return (
    <div>
      <h1>Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div id="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
