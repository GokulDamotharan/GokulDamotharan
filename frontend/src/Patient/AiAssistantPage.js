import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Axios from 'axios';
import Navbar from '../Basic/Navbar';
import Leftside from '../Dashbaord/LeftsidePatient';

const AiAssistantPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Health Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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
        const aiRes = await Axios.post(`${process.env.REACT_APP_SERVER_URL}/ai/chat`, {
            message: userMessage.text
        });
        
        const botResponse = { id: Date.now() + 1, text: aiRes.data.reply, sender: 'bot' };
        setMessages(prev => [...prev, botResponse]);

    } catch (err) {
        console.error(err);
        const errorResponse = { id: Date.now() + 1, text: "I'm having trouble connecting to the server. Please try again later.", sender: 'bot' };
        setMessages(prev => [...prev, errorResponse]);
    }
    setIsTyping(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <div className="col-md-3 col-lg-2 d-none d-md-block p-0">
            <Leftside />
          </div>
          <div className="col-md-9 col-lg-10 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 h-100 d-flex flex-column"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
            >
              {/* Header */}
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                <div className="bg-primary-gradient rounded-circle p-3 mr-3 text-white">
                  <Bot size={28} />
                </div>
                <div>
                  <h4 className="font-weight-bold mb-1 text-primary d-flex align-items-center">
                    AI Health Assistant
                    <Sparkles size={20} className="ml-2 text-warning" />
                  </h4>
                  <p className="text-muted small mb-0">Ask me anything about your health!</p>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-grow-1 overflow-auto mb-3 px-2" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="bg-primary rounded-circle p-2 mr-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                          <Bot size={20} className="text-white" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl shadow-sm ${
                          msg.sender === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-white text-dark'
                        }`}
                        style={{ maxWidth: '70%', fontSize: '0.95rem', whiteSpace: 'pre-line' }}
                      >
                        {msg.text}
                      </div>
                      {msg.sender === 'user' && (
                        <div className="bg-secondary rounded-circle p-2 ml-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                          <User size={20} className="text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="d-flex justify-content-start mb-3"
                  >
                    <div className="bg-primary rounded-circle p-2 mr-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                      <Bot size={20} className="text-white" />
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm text-secondary font-italic small">
                      AI is typing...
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="border-top pt-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-0 bg-light rounded-pill px-4 py-3"
                    placeholder="Ask a health question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ fontSize: '0.95rem' }}
                  />
                  <div className="input-group-append ml-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                      style={{ width: 50, height: 50, padding: 0 }}
                      disabled={!input.trim()}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
