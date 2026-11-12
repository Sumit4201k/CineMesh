import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Radio } from 'lucide-react';
import { Button } from './ui/Button';

/**
 * @file Chat.jsx
 * @description Real-time Cinema Lounge text log & reactions branded with CineMesh styling.
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
    <div className="flex flex-col h-full bg-brand-card border border-brand-border overflow-hidden shadow-tactile-card">
      {/* Chat Header */}
      <div className="px-3 sm:px-4 py-3 border-b border-brand-border bg-brand-canvas flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-cyan" />
          <h3 className="font-display font-semibold text-sm text-neutral-200">Lounge Log</h3>
        </div>
        <span className="font-mono text-[10px] uppercase text-brand-cyan/80 tracking-wider">P2P Mesh</span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs overscroll-contain">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-12 px-4">
            <Radio className="w-6 h-6 mb-2 text-brand-borderLight" />
            <p className="font-medium text-neutral-300 text-xs">The lounge is quiet</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Send a message or reaction to everyone in the room.</p>
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
                  <span className={`font-semibold ${isMe ? 'text-brand-cyan' : 'text-purple-300'}`}>
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-neutral-500">{msg.timestamp}</span>
                </div>
                <div
                  className={`px-3.5 py-2 max-w-[85%] break-words leading-relaxed text-sm border-l-2 ${
                    isMe
                      ? 'bg-brand-purple/15 border-brand-purple text-white font-medium'
                      : 'bg-brand-canvas text-neutral-200 border-brand-border'
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
      <form onSubmit={handleSend} className="mobile-safe-input p-2.5 sm:p-3 border-t border-brand-border bg-brand-canvas flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Whisper to the room..."
          className="min-w-0 flex-1 px-3.5 py-2.5 bg-brand-card text-base sm:text-xs text-white placeholder-neutral-500 border border-brand-border focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 transition-all font-medium"
        />
        <Button type="submit" variant="primary" size="sm" icon={Send} className="min-w-11 px-3 shrink-0">
          <span className="hidden min-[400px]:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
