import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Bot, MessageCircle } from 'lucide-react';

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = React.useState([
        { id: 1, text: "Hello! How can we help you today?", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputValue, setInputValue] = React.useState('');
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newUserMessage]);
        setInputValue('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: "Thank you for your message. One of our representatives will get back to you shortly. For urgent matters, please call our 24/7 helpline.",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-6 right-6 z-[60] w-full max-w-[400px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[600px] max-h-[80vh]"
                >
                    {/* Header */}
                    <div className="bg-primary p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg leading-tight">Live Support</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Online & Active</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-xl text-white/80 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
                    >
                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.sender === 'user' 
                                            ? 'bg-primary text-white rounded-tr-none' 
                                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <p className={`text-[10px] font-medium text-slate-400 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.time}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form 
                        onSubmit={handleSend}
                        className="p-5 bg-white border-t border-slate-100 flex items-center gap-3"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                        <button 
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="p-3 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatWidget;
