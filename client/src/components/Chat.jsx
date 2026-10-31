import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from './ui/Button';

export function Chat({ socket, roomId, userName }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chat-message', handleChatMessage);
    return () => {
      socket.off('chat-message', handleChatMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    socket.emit('chat-message', {
      roomId,
      message: inputMessage.trim(),
      senderName: userName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-cinema-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="p-3.5 border-b border-neutral-800 bg-cinema-950/60 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-indigo-400" />
        <h3 className="font-semibold text-sm text-neutral-200">Live Room Chat</h3>
      </div>

      {/* Message List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-sm">
        {messages.length === 0 ? (
          <div className="text-center text-neutral-500 text-xs py-8">
            No messages yet. Say hi to the room!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderName === userName;
            return (
              <div
                key={index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 text-xs text-neutral-400">
                  <span className="font-medium text-neutral-300">{msg.senderName}</span>
                  <span className="text-[10px] text-neutral-500">{msg.timestamp}</span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl max-w-[85%] break-words ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-cinema-800 text-neutral-200 rounded-tl-none border border-neutral-700/50'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-2.5 border-t border-neutral-800 bg-cinema-950/80 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-cinema-800 text-sm text-white placeholder-neutral-500 rounded-xl border border-neutral-700/60 focus:outline-none focus:border-indigo-500"
        />
        <Button type="submit" variant="primary" size="sm" icon={Send}>
          Send
        </Button>
      </form>
    </div>
  );
}
