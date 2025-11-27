import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Axios from 'axios';
import { AuthContext } from '../../Auth/AuthContext';

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Health Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { googleId } = useContext(AuthContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // AI Logic
    try {
        // First try to get an AI response
        const aiRes = await Axios.post(`${process.env.REACT_APP_SERVER_URL}/ai/chat`, {
            message: userMessage.text
        });
        
        const botResponse = { id: Date.now() + 1, text: aiRes.data.reply, sender: 'bot' };
        setMessages(prev => [...prev, botResponse]);

        // If the AI suggests submitting a question (we can check keywords or just always offer it as an option in UI)
        // For now, let's just keep the chat flow natural. 
        // If the user explicitly asks to submit a question, we could handle that, but the AI is now smart enough to guide them.

    } catch (err) {
        console.error(err);
        // Fallback or error message
        const errorResponse = { id: Date.now() + 1, text: "I'm having trouble connecting to the server. Please try again later.", sender: 'bot' };
        setMessages(prev => [...prev, errorResponse]);
    }
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="position-fixed border-0 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          background: 'var(--gradient-primary)',
          color: 'white',
          zIndex: 1000
        }}
      >
        <MessageCircle size={30} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="position-fixed bg-white rounded-xl shadow-2xl overflow-hidden d-flex flex-column"
            style={{
              bottom: 100,
              right: 30,
              width: 350,
              height: 500,
              zIndex: 1000,
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {/* Header */}
            <div className="p-3 text-white d-flex justify-content-between align-items-center" style={{ background: 'var(--gradient-primary)' }}>
              <div className="d-flex align-items-center gap-2">
                <Bot size={20} />
                <span className="font-weight-bold">AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn btn-sm text-white p-0">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow-1 p-3 overflow-auto bg-light">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`p-3 rounded-xl shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-white text-dark rounded-bl-none'
                    }`}
                    style={{ maxWidth: '80%', fontSize: '0.9rem' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-secondary font-italic small">
                    AI is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-top">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control border-0 bg-light rounded-pill px-3"
                  placeholder="Ask a health question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="input-group-append ml-2">
                  <button type="submit" className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, padding: 0 }}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChatbot;
