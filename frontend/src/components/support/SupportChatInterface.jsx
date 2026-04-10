import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { sendChatRequest } from '../../services/supportService';

const SupportChatInterface = ({ isEmbedded = false }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial welcome message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    role: 'bot',
                    text: "Hi! I'm your support assistant. Ask me anything about gender inclusivity, policies, or how to use this platform.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || isTyping) return;

        const userMsg = {
            role: 'user',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const data = await sendChatRequest(inputText);
            const botMsg = {
                role: 'bot',
                text: data.data.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                role: 'bot',
                text: "Sorry, I'm having trouble responding right now. Please try again.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className={`flex flex-col h-full bg-white ${isEmbedded ? 'rounded-2xl border border-gray-100 shadow-xl overflow-hidden' : ''}`}>
            {/* Embedded Header (only shown if isEmbedded is true) */}
            {isEmbedded && (
                <div className="bg-purple-600 px-6 py-5 text-white shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-400/30 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-inner">
                            <Sparkles className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight uppercase tracking-wider">AI Assistant</h3>
                            <p className="text-xs text-purple-100 opacity-90 font-medium">Ready to help 24/7</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6 scroll-smooth min-h-0">
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div 
                            className={`px-4 py-3 max-w-[85%] shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-purple-600 text-white rounded-2xl rounded-tr-none' 
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none'
                            }`}
                        >
                            <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 font-semibold mx-1 uppercase tracking-tighter">
                            {msg.time}
                        </span>
                    </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex flex-col items-start animate-in fade-in duration-300">
                        <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm min-w-[70px] flex items-center justify-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className={`p-6 bg-white border-t border-gray-100 flex items-center gap-3 ${isEmbedded ? 'pb-8' : ''}`}>
                <div className="flex-1 relative group">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ask me something..."
                        disabled={isTyping}
                        className="w-full bg-gray-100 border-2 border-transparent rounded-2xl px-5 py-3 text-sm focus:ring-0 focus:border-purple-500 focus:bg-white transition-all disabled:opacity-50 outline-none shadow-inner"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="w-12 h-12 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 disabled:opacity-50 disabled:bg-gray-300 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 active:scale-95 flex items-center justify-center flex-shrink-0"
                >
                    {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
};

export default SupportChatInterface;
