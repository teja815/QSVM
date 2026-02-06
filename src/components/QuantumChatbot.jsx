import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Volume2, StopCircle, User, Mic, MicOff, Send } from 'lucide-react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Kizuna AI avatar URL
const AVATAR_URL = "https://img.freepik.com/premium-photo/female-robot-face-artificial-intelligence-concept-isolated-with-white-highlights_660230-176022.jpg"

export default function QuantumChatbot({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your Quantum Assistant. Ready to explore quantum computing? Ask me about qubits, gates, or anything quantum.',
      timestamp: new Date(),
      showAvatar: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState(-1);
  const [avatarAnimation, setAvatarAnimation] = useState('idle');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  const SYSTEM_PROMPT = `You are Quantum Assistant, a friendly quantum physics AI assistant with a female voice.

  PERSONALITY:
  - Sweet, enthusiastic, and encouraging
  - Use simple, clear language without emojis
  - Keep responses SHORT (2-3 sentences maximum)
  - Use fun analogies to explain quantum concepts
  - Speak naturally like a human female assistant
  
  RESPONSE STYLE:
  1. Start with friendly greeting or acknowledgment
  2. Explain concept in 1-2 simple sentences
  3. Use 1 analogy if helpful
  4. End with a follow-up question or invitation
  
  Example: "Hello! Quantum superposition is like a coin spinning in air - it's both heads and tails until you catch it. That's how qubits can be 0 and 1 at the same time. Would you like me to explain quantum entanglement next?"`;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        setAvatarAnimation('listening');
        
        setTimeout(() => {
          handleSendMessage();
        }, 300);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setAvatarAnimation('idle');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      if (voices.length > 0) {
        console.log('Available voices:', voices.map(v => v.name));
      }
    };
    
    synthRef.current.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessageToGroq = async (userMessage) => {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`  // ✅ FIXED: Added backticks
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(-8).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: userMessage }  // ✅ Added user's current message
          ],
          temperature: 0.7,
          max_tokens: 150,
          top_p: 0.9,
          frequency_penalty: 0.3,
          presence_penalty: 0.3
        })  // ✅ Added closing parenthesis
      });  // ✅ Added closing parenthesis and semicolon

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API error:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  };

  const speakResponse = (text, messageIndex) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    setAvatarAnimation('speaking');
    setCurrentSpeakingIndex(messageIndex);

    setMessages(prev => prev.map((msg, idx) => 
      idx === messageIndex ? { ...msg, showAvatar: true } : msg
    ));

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    const voices = synthRef.current.getVoices();
    let selectedVoice = voices.find(voice => 
      voice.name.includes('Female') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Zira') ||
      voice.name.includes('Karen') ||
      voice.name.includes('Google UK English Female') ||
      voice.name.includes('Microsoft Zira Desktop') ||
      voice.name.toLowerCase().includes('female')
    );

    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAvatarAnimation('speaking');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setAvatarAnimation('idle');
      setCurrentSpeakingIndex(-1);
      
      setTimeout(() => {
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex ? { ...msg, showAvatar: false } : msg
        ));
      }, 1000);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setAvatarAnimation('idle');
      setCurrentSpeakingIndex(-1);
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { ...msg, showAvatar: false } : msg
      ));
    };

    synthRef.current.speak(utterance);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputText,
      timestamp: new Date(),
      showAvatar: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setAvatarAnimation('thinking');

    const response = await sendMessageToGroq(inputText);

    const assistantMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      showAvatar: false
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

    const newMessageIndex = messages.length;
    speakResponse(response, newMessageIndex);
  };

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setAvatarAnimation('idle');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setAvatarAnimation('listening');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setAvatarAnimation('idle');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setAvatarAnimation('idle');
      setCurrentSpeakingIndex(-1);
      
      setMessages(prev => prev.map(msg => ({ ...msg, showAvatar: false })));
    }
  };

  const stopMessageSpeaking = (messageIndex) => {
    if (synthRef.current && currentSpeakingIndex === messageIndex) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setAvatarAnimation('idle');
      setCurrentSpeakingIndex(-1);
      
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { ...msg, showAvatar: false } : msg
      ));
    }
  };

  const replayMessage = (messageIndex) => {
    const message = messages[messageIndex];
    if (message && message.role === 'assistant') {
      speakResponse(message.content, messageIndex);
    }
  };

  const avatarVariants = {
    idle: {
      scale: 1,
      opacity: 1,
      rotate: 0
    },
    listening: {
      scale: [1, 1.05, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity
      }
    },
    thinking: {
      scale: [1, 1.03, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    speaking: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-[#00F7FF] via-[#9D4EDD] to-[#FF2E63] flex items-center justify-center shadow-2xl cursor-pointer group"
            style={{
              boxShadow: '0 0 30px rgba(0, 247, 255, 0.7), 0 0 60px rgba(157, 78, 221, 0.5)'
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                <img 
                  src={AVATAR_URL} 
                  alt="Quantum Assistant"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: 100, y: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={{ scale: 0, opacity: 0, x: 100, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] h-[520px] rounded-3xl overflow-hidden shadow-2xl"
            style={{
              boxShadow: '0 0 40px rgba(0, 247, 255, 0.5), 0 0 80px rgba(157, 78, 221, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              className={`h-full flex flex-col backdrop-blur-xl ${
                darkMode
                  ? 'bg-gradient-to-b from-gray-900/95 to-gray-800/95 border-2 border-[#00F7FF]/40'
                  : 'bg-gradient-to-b from-white/95 to-gray-50/95 border-2 border-[#00F7FF]/30'
              }`}
            >
              {/* Header */}
              <div className="relative p-4 bg-gradient-to-r from-[#9D4EDD] via-[#7B2CBF] to-[#00F7FF]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      variants={avatarVariants}
                      animate={avatarAnimation}
                      className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/80 shadow-xl"
                    >
                      <img 
                        src={AVATAR_URL} 
                        alt="Quantum Assistant"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Quantum Assistant</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isLoading ? 'bg-yellow-400 animate-pulse' :
                          isSpeaking ? 'bg-green-400 animate-pulse' :
                          isListening ? 'bg-red-400 animate-pulse' :
                          'bg-[#00F7FF]'
                        }`} />
                        <p className="text-xs text-white/90 font-medium">
                          {isLoading ? 'Thinking...' :
                           isSpeaking ? 'Speaking...' :
                           isListening ? 'Listening...' :
                           'Online'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      stopSpeaking();
                    }}
                    className="text-white hover:bg-white/20 p-1.5 rounded-full transition-all duration-300 hover:rotate-90"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-3">
                  <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                      animate={{
                        width: ['0%', '100%', '0%']
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Messages Container - Fixed for center avatar */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-transparent to-gray-900/5 dark:to-gray-900/10 relative">
                {/* Center Avatar Overlay - Appears in middle for every speaking message */}
                <AnimatePresence>
                  {isSpeaking && currentSpeakingIndex !== -1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative"
                      >
                        {/* Circular face only - no background */}
                        <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white/30">
                          <img 
                            src={AVATAR_URL} 
                            alt="Speaking Avatar"
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: 'center 30%' // Focus on face
                            }}
                          />
                          
                          {/* Lip-sync effect - simple mouth movement */}
                          <motion.div
                            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-pink-400/90 rounded-full"
                            animate={{
                              height: [4, 8, 4],
                              width: [56, 64, 56],
                            }}
                            transition={{
                              duration: 0.3,
                              repeat: Infinity
                            }}
                          />
                          
                          {/* Subtle glow */}
                          <div className="absolute inset-0 rounded-full border-2 border-cyan-300/30 animate-pulse"></div>
                        </div>
                        
                        {/* Simple speaking indicator */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#9D4EDD] to-[#00F7FF] text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap shadow-lg">
                          Speaking...
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages List */}
                <div className={`${isSpeaking ? 'opacity-40' : 'opacity-100'}`}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                    >
                      <div className="flex items-end space-x-2 max-w-[85%]">
                        {message.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center border border-white/50 shadow">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-xl ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-[#9D4EDD] to-[#00F7FF] text-white rounded-br-sm'
                              : darkMode
                              ? 'bg-gradient-to-r from-gray-800/90 to-gray-900/90 text-gray-100 border border-[#00F7FF]/30 rounded-bl-sm'
                              : 'bg-gradient-to-r from-gray-50 to-white text-gray-900 border border-[#00F7FF]/30 rounded-bl-sm shadow-sm'
                          }`}
                          style={{
                            boxShadow: message.role === 'user'
                              ? '0 2px 10px rgba(157, 78, 221, 0.3)'
                              : '0 2px 10px rgba(0, 247, 255, 0.2)'
                          }}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs ${message.role === 'user' ? 'text-cyan-100/80' : 'text-gray-500'}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            
                            {message.role === 'assistant' && (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => replayMessage(index)}
                                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                  title="Replay message"
                                >
                                  <Volume2 className="w-3 h-3 text-gray-500 hover:text-[#00F7FF]" />
                                </button>
                                
                                {currentSpeakingIndex === index && (
                                  <button
                                    onClick={() => stopMessageSpeaking(index)}
                                    className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    title="Stop speaking"
                                  >
                                    <StopCircle className="w-3 h-3 text-red-500 hover:text-red-600" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center border border-white/50 shadow">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-end space-x-2 max-w-[85%]">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center border border-white/50 shadow">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          >
                            <Bot className="w-3 h-3 text-white" />
                          </motion.div>
                        </div>
                        <div className={`p-3 rounded-xl rounded-bl-sm ${
                          darkMode 
                            ? 'bg-gradient-to-r from-gray-800/90 to-gray-900/90' 
                            : 'bg-gradient-to-r from-gray-50 to-white shadow-sm'
                        }`}>
                          <div className="flex space-x-1 items-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Thinking</div>
                            <div className="flex space-x-1">
                              {[0, 0.2, 0.4].map((delay) => (
                                <motion.div
                                  key={delay}
                                  className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                                  animate={{ y: [0, -3, 0] }}
                                  transition={{ duration: 0.7, repeat: Infinity, delay }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-3 border-t ${
                darkMode 
                  ? 'border-[#00F7FF]/30 bg-gradient-to-t from-gray-900 to-gray-800/80' 
                  : 'border-[#00F7FF]/30 bg-gradient-to-t from-white to-gray-50/80'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about quantum computing..."
                      className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none transition-all text-sm ${
                        darkMode
                          ? 'bg-gray-800/90 border-[#00F7FF]/40 text-white placeholder-gray-400 focus:border-[#00F7FF] focus:ring-1 focus:ring-[#00F7FF]/30'
                          : 'bg-white/90 border-[#00F7FF]/40 text-gray-900 placeholder-gray-500 focus:border-[#00F7FF] focus:ring-1 focus:ring-[#00F7FF]/30'
                      }`}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startVoiceInput}
                      className={`p-2.5 rounded-lg transition-all ${
                        isListening
                          ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                          : 'bg-gradient-to-r from-[#9D4EDD] to-[#00F7FF] text-white'
                      }`}
                      style={{
                        boxShadow: isListening
                          ? '0 0 15px rgba(239, 68, 68, 0.5)'
                          : '0 0 10px rgba(157, 78, 221, 0.4)'
                      }}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </motion.button>

                    {isSpeaking && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={stopSpeaking}
                        className="p-2.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white"
                        style={{
                          boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
                        }}
                        title="Stop all speech"
                      >
                        <StopCircle className="w-4 h-4" />
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputText.trim()}
                      className="p-2.5 rounded-lg bg-gradient-to-r from-[#00F7FF] to-[#9D4EDD] text-white disabled:opacity-50"
                      style={{
                        boxShadow: '0 0 10px rgba(0, 247, 255, 0.4)'
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="mt-2 text-center">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Speak or type your question. Keep it short and clear.
                  </p>
                  <div className="flex items-center justify-center mt-1 space-x-4">
                    <button
                      onClick={() => stopSpeaking()}
                      disabled={!isSpeaking}
                      className={`text-xs ${isSpeaking ? 'text-red-500 hover:text-red-600' : 'text-gray-400'} transition-colors flex items-center gap-1`}
                    >
                      <StopCircle className="w-3 h-3" />
                      Stop All Speech
                    </button>
                    <span className="text-gray-400">•</span>
                    <button
                      onClick={() => {
                        const lastAssistantIndex = messages.map((m, i) => m.role === 'assistant' ? i : -1).filter(i => i !== -1).pop();
                        if (lastAssistantIndex !== undefined) {
                          replayMessage(lastAssistantIndex);
                        }
                      }}
                      disabled={messages.filter(m => m.role === 'assistant').length === 0}
                      className={`text-xs ${messages.filter(m => m.role === 'assistant').length > 0 ? 'text-[#00F7FF] hover:text-[#9D4EDD]' : 'text-gray-400'} transition-colors flex items-center gap-1`}
                    >
                      <Volume2 className="w-3 h-3" />
                      Replay Last
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}