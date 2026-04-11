import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, AlertCircle, Clock, Check } from 'lucide-react';
import { getMyNotifications, markNotificationAsRead } from '../../services/notificationService';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await getMyNotifications();
                setNotifications(res.data.notifications || []);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
        // Refresh every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'status_update': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'response': return <MessageSquare className="w-4 h-4 text-purple-500" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-9 h-9 rounded-xl bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors active:scale-95"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full border-2 border-white flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-stone-50 bg-stone-50/50 flex items-center justify-between">
                        <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                                {unreadCount} New
                            </span>
                        )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell className="w-10 h-10 text-stone-200 mx-auto mb-2" />
                                <p className="text-sm font-medium text-stone-400 font-serif lowercase italic">No updates yet...</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div 
                                    key={n._id}
                                    onClick={() => handleMarkAsRead(n._id)}
                                    className={`p-4 border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors cursor-pointer relative group ${!n.isRead ? 'bg-purple-50/30' : ''}`}
                                >
                                    {!n.isRead && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                                    )}
                                    <div className="flex gap-3">
                                        <div className="mt-0.5">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-xs leading-relaxed ${!n.isRead ? 'font-bold text-stone-900' : 'text-stone-500 font-medium'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-stone-400 mt-1 font-bold uppercase tracking-tighter">
                                                {formatDistanceToNow(new Date(n.createdAt))} ago
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <button 
                                                className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-white border border-stone-100 flex items-center justify-center text-purple-600 shadow-sm"
                                                title="Mark as read"
                                            >
                                                <Check className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
