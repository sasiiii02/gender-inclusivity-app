import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Minus } from 'lucide-react';
import SupportChatInterface from './SupportChatInterface';

const SupportChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasNotification, setHasNotification] = useState(true);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (hasNotification) setHasNotification(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {/* Chat Popup */}
            {isOpen && (
                <div className="mb-4 w-[360px] h-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-purple-600 px-4 py-3 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-400/30 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight">AI Support Assistant</h3>
                                <p className="text-[10px] text-purple-100 opacity-90 font-medium tracking-tight">Ask me anything</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleToggle}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Reusable Chat Interface */}
                    <SupportChatInterface />
                </div>
            )}

            {/* Chat Bubble Button */}
            <button
                onClick={handleToggle}
                aria-label="Open support chat"
                className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-purple-700 hover:scale-110 active:scale-95 transition-all relative group"
            >
                {isOpen ? <Minus className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
                
                {/* Notification Dot */}
                {hasNotification && !isOpen && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </button>
        </div>
    );
};

export default SupportChatBot;
