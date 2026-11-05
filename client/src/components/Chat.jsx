import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Radio, Users } from 'lucide-react';
import { Button } from './ui/Button';

/**
 * @file Chat.jsx
 * @description Real-time Cinema Lounge text log & reactions.
 * Art direction: Editorial midnight transcript with distinctive sender hierarchy.
 */
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
    <div className="flex flex-col h-full bg-cinema-900/90 border border-neutral-800/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-tactile-card backdrop-blur-xl">
      {/* Chat Header */}
      <div className="px-4 py-3.5 border-b border-neutral-800 bg-cinema-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-semibold text-sm text-neutral-200">Lounge Log</h3>
        </div>
        <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider">P2P Channel</span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-12 px-4">
            <Radio className="w-6 h-6 mb-2 text-neutral-700" />
            <p className="font-medium text-neutral-400 text-xs">The lounge is quiet</p>
            <p className="text-[11px] text-neutral-600 mt-0.5">Send a reaction or comment to everyone in the room.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderName === userName;
            return (
              <div
                key={index}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono">
                  <span className={`font-semibold ${isMe ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-neutral-600">{msg.timestamp}</span>
                </div>
                <div
                  className={`px-3.5 py-2 rounded-2xl max-w-[85%] break-words leading-relaxed text-sm ${
                    isMe
                      ? 'bg-amber-400 text-cinema-950 font-medium rounded-tr-none shadow-sm'
                      : 'bg-cinema-850 text-neutral-200 rounded-tl-none border border-neutral-800'
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

      {/* Input Stage */}
      <form onSubmit={handleSend} className="p-3 border-t border-neutral-800/80 bg-cinema-950/90 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Whisper to the room..."
          className="flex-1 px-3.5 py-2.5 bg-cinema-900 text-xs text-white placeholder-neutral-600 rounded-xl border border-neutral-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all font-medium"
        />
        <Button type="submit" variant="primary" size="sm" icon={Send} className="px-3 shrink-0">
          Send
        </Button>
      </form>
    </div>
  );
}
