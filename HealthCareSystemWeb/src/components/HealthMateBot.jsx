import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // For smooth animations

function HealthMateBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! 👋 I am HealthMate. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "Forgot Password",
    "Cannot Login",
    "How to Register?",
    "Need Help"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    const userMessage = { from: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    simulateBotReply(text);
  };

  const simulateBotReply = (userInput) => {
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(userInput);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotReply = (userInput) => {
    const text = userInput.toLowerCase();
    if (text.includes('forgot')) return 'If you forgot your password, click on "Forgot password?" link below the login button.';
    if (text.includes('login')) return 'Ensure your username and password are correct. If you still face issues, contact support.';
    if (text.includes('register')) return 'To register, click on "Register" on the login page and fill your details.';
    if (text.includes('help')) return 'I am here to assist! Please describe your issue in more detail.';
    return "I'm sorry, I didn't quite understand. Can you rephrase?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-white shadow-xl rounded-lg overflow-hidden w-72 h-96 flex flex-col"
          >
            {/* Header */}
            <div className="bg-purple-700 text-white p-4 flex justify-between items-center">
              <div className="font-bold">HealthMate 🤖</div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">✖</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] p-2 rounded-lg text-sm ${msg.from === 'bot' ? 'bg-purple-100 text-purple-800' : 'bg-pink-500 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="text-sm text-gray-500">HealthMate is typing...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              />
              <button onClick={() => handleSend(input)} className="bg-purple-700 text-white p-2 rounded-full hover:bg-purple-600">
                ➤
              </button>
            </div>

            {/* Quick Replies */}
            <div className="p-2 bg-gray-100 flex flex-wrap gap-2">
              {quickReplies.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(text)}
                  className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs hover:bg-purple-300"
                >
                  {text}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
    <motion.div
    className="flex flex-col items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    >
    <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="bg-white p-2 rounded-full shadow-lg hover:bg-purple-100 focus:outline-none"
    onClick={() => setIsOpen(true)}
    >
    <img src="/healthmate-icon.png" alt="HealthMate Bot" className="w-12 h-12 object-cover rounded-full" />
    </motion.button>
    <div className="text-sm mt-2 text-purple-700 font-semibold">
      HealthMate
    </div>
    </motion.div>
)}

    </div>
  );
}

export default HealthMateBot;
