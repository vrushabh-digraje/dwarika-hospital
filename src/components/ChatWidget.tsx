import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronLeft,
    MessageCircle,
    Search,
    Send,
    Shield,
    User,
    Users,
    X,
} from 'lucide-react';
import { cn } from '../lib/utils';

type Message = {
    id: string;
    sender: string;
    text: string;
    timestamp: Date;
    isAdminLog?: boolean;
};

type Chat = {
    id: string;
    name: string;
    type: 'group' | 'direct';
    unread?: number;
    online?: boolean;
};

const MOCK_CHATS: Chat[] = [
    { id: 'g1', name: 'Emergency Team', type: 'group', unread: 2, online: true },
    { id: 'g2', name: 'General Staff', type: 'group', online: false },
    { id: 'u1', name: 'Dr. Sandeep Kumar Shah', type: 'direct', unread: 1, online: true },
    { id: 'u2', name: 'Reception Desk', type: 'direct', online: true },
    { id: 'g3', name: 'Patient Support', type: 'group', online: false },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
    g1: [
        { id: '1', sender: 'Dr. Priya', text: 'Patient incoming in 5 mins.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
        { id: '2', sender: 'Nurse John', text: 'OT 2 is ready.', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    ],
    u1: [
        { id: '1', sender: 'Dr. Sandeep Sharma', text: 'Please send the patient report.', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
    ],
    g3: [
        { id: '1', sender: 'System', text: 'Welcome to Patient Support. How can we help you?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    ],
};

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || '')
        .join('');

const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

const ChatWidget = ({ isOpen, onClose }: ChatWidgetProps) => {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeChat = useMemo(
        () => MOCK_CHATS.find(chat => chat.id === activeChatId) ?? null,
        [activeChatId]
    );

    const currentMessages = useMemo(
        () => (activeChatId ? messages[activeChatId] || [] : []),
        [activeChatId, messages]
    );

    const visibleChats = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return MOCK_CHATS;
        return MOCK_CHATS.filter(chat => chat.name.toLowerCase().includes(query) || chat.type.toLowerCase().includes(query));
    }, [searchTerm]);

    const totalUnread = useMemo(
        () => MOCK_CHATS.reduce((sum, chat) => sum + (chat.unread || 0), 0),
        []
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages, activeChatId, isOpen]);

    const handleSend = () => {
        if (!inputText.trim() || !activeChatId) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: isAdminMode ? 'Admin' : 'You',
            text: inputText.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMessage],
        }));
        setInputText('');

        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                sender: activeChat?.type === 'group' ? 'System' : activeChat?.name || 'User',
                text: 'Message received. (This is a simulated response)',
                timestamp: new Date(),
            };

            setMessages(prev => ({
                ...prev,
                [activeChatId]: [...(prev[activeChatId] || []), reply],
            }));
        }, 1000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        aria-label="Close chat overlay"
                        className="fixed inset-0 z-[99] bg-slate-950/22 backdrop-blur-[4px]"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.96 }}
                        className="fixed bottom-4 right-4 z-[100] flex h-[640px] w-[min(95vw,860px)] overflow-hidden rounded-[24px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,253,0.96))] shadow-[0_50px_130px_-40px_rgba(15,23,42,0.5),0_20px_55px_-30px_rgba(15,23,42,0.32)] ring-1 ring-slate-300/70"
                    >
                    <div className="relative flex w-full overflow-hidden bg-white/95 backdrop-blur-xl">
                        <aside
                            className={cn(
                                'absolute inset-y-0 left-0 z-20 flex w-full max-w-[332px] min-h-0 flex-col overflow-hidden border-r border-slate-200/90 bg-[linear-gradient(180deg,#f8fbff_0%,#f3f7fc_100%)] transition-transform duration-300 md:relative md:translate-x-0',
                                activeChatId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
                            )}
                        >
                            <div className="shrink-0 border-b border-slate-200/90 bg-[linear-gradient(180deg,#f6f9ff_0%,#eef3fb_100%)] px-5 py-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#173f95_0%,#2a58b7_100%)] text-white shadow-[0_16px_30px_-22px_rgba(23,63,149,0.68)]">
                                            <MessageCircle className="h-4.5 w-4.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Hospital Chat</p>
                                            <h3 className="mt-1 truncate text-[1.9rem] leading-none font-black tracking-[-0.05em] text-slate-950">Team Inbox</h3>
                                        </div>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-slate-600 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.28)] transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                                        aria-label="Close chat"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mt-4 rounded-[18px] border border-white/70 bg-white/70 px-4 py-3 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.16)]">
                                    <p className="text-sm leading-6 text-slate-700">
                                        Fast internal coordination for staff and support.
                                    </p>

                                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-[auto_auto_1fr] sm:items-center">
                                        <div className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-800">
                                            {visibleChats.length} channels
                                        </div>
                                        <div className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-800">
                                            {totalUnread} unread
                                        </div>
                                        <button
                                            onClick={() => setIsAdminMode(prev => !prev)}
                                            className={cn(
                                                'col-span-2 sm:col-span-1 sm:justify-self-end inline-flex h-10 min-w-[118px] items-center justify-center gap-2 rounded-[14px] px-4 text-[11px] font-black uppercase tracking-[0.18em] transition-all',
                                                isAdminMode
                                                    ? 'border border-red-400/20 bg-[linear-gradient(135deg,#dc2626_0%,#ef4444_100%)] text-white shadow-[0_16px_32px_-24px_rgba(239,68,68,0.7)] hover:brightness-105'
                                                    : 'border border-blue-900/10 bg-[linear-gradient(135deg,#173f95_0%,#2a58b7_100%)] text-white shadow-[0_18px_34px_-24px_rgba(23,63,149,0.72)] hover:brightness-105'
                                            )}
                                            title="Toggle admin monitoring"
                                        >
                                            <Shield className="h-3.5 w-3.5" />
                                            {isAdminMode ? 'Admin' : 'User'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 border-b border-slate-200/90 bg-white/90 px-4 py-4 backdrop-blur-sm">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search people or channels"
                                        className="w-full rounded-[18px] border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-500 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                                <div className="space-y-2">
                                {visibleChats.map(chat => {
                                    const previewMessage = (messages[chat.id] || []).at(-1);
                                    const isActive = activeChatId === chat.id;

                                    return (
                                        <button
                                            key={chat.id}
                                            onClick={() => setActiveChatId(chat.id)}
                                            className={cn(
                                                'w-full rounded-[18px] border px-4 py-4 text-left transition-all',
                                                isActive
                                                    ? 'border-blue-300 bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)] shadow-[0_18px_38px_-28px_rgba(11,74,158,0.4)]'
                                                    : 'border-transparent bg-white hover:border-slate-300 hover:bg-slate-50'
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="relative shrink-0">
                                                    <div
                                                        className={cn(
                                                            'flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black',
                                                            chat.type === 'group'
                                                                ? 'bg-slate-200 text-slate-800'
                                                                : 'bg-blue-100 text-blue-900'
                                                        )}
                                                    >
                                                        {getInitials(chat.name)}
                                                    </div>
                                                    {chat.online && (
                                                        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <h4 className="truncate text-base font-black leading-tight text-slate-900">{chat.name}</h4>
                                                            <div className="mt-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                                                {chat.type === 'group' ? <Users className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                                                                <span>{chat.type}</span>
                                                            </div>
                                                        </div>

                                                        {chat.unread ? (
                                                            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 py-1 text-[10px] font-black text-white">
                                                                {chat.unread}
                                                            </span>
                                                        ) : null}
                                                    </div>

                                                    <p className="mt-3 truncate text-sm text-slate-700">
                                                        {previewMessage ? previewMessage.text : 'No messages yet'}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}

                                {visibleChats.length === 0 && (
                                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                                        No chats match your search.
                                    </div>
                                )}
                                </div>
                            </div>
                        </aside>

                        <section
                            className={cn(
                                'absolute inset-y-0 right-0 z-30 flex w-full flex-col bg-[linear-gradient(180deg,#fcfdff_0%,#f5f8fc_100%)] md:relative md:flex-1',
                                activeChatId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
                            )}
                        >
                            {activeChat ? (
                                <>
                                    <div className="border-b border-slate-200/90 bg-white/92 px-5 py-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setActiveChatId(null)}
                                                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>

                                            <div
                                                className={cn(
                                                    'flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black',
                                                    activeChat.type === 'group'
                                                        ? 'bg-slate-200 text-slate-800'
                                                        : 'bg-blue-100 text-blue-900'
                                                )}
                                            >
                                                {getInitials(activeChat.name)}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="truncate text-lg font-black text-slate-900">{activeChat.name}</h4>
                                                    {activeChat.online && <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />}
                                                </div>
                                                <p className="text-sm text-slate-700">
                                                    {activeChat.type === 'group' ? 'Channel discussion' : 'Direct conversation'}
                                                </p>
                                            </div>

                                            {isAdminMode && (
                                                <span className="ml-auto rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-red-600 ring-1 ring-red-200">
                                                    Monitoring
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f7faff_0%,#eff4f9_100%)] px-5 py-5">
                                        <div className="mx-auto flex max-w-2xl flex-col gap-4">
                                            {currentMessages.map(msg => {
                                                const isOwn = msg.sender === 'You' || msg.sender === 'Admin';
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                                                    >
                                                        <div className={cn('max-w-[82%]', isOwn ? 'items-end' : 'items-start')}>
                                                            {!isOwn && activeChat.type === 'group' && (
                                                                <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                                                    {msg.sender}
                                                                </p>
                                                            )}
                                                            <div
                                                                className={cn(
                                                                    'rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm',
                                                                    isOwn
                                                                        ? 'rounded-br-md bg-[linear-gradient(135deg,#143b8f_0%,#2252b8_100%)] text-white shadow-blue-900/20'
                                                                        : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
                                                                )}
                                                            >
                                                                {msg.text}
                                                            </div>
                                                            <p className={cn('mt-1 px-1 text-[11px] text-slate-500', isOwn ? 'text-right' : 'text-left')}>
                                                                {formatTime(msg.timestamp)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200/90 bg-white/92 px-5 py-4 backdrop-blur-sm">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSend();
                                            }}
                                            className="mx-auto flex max-w-2xl items-end gap-3"
                                        >
                                            <div className="flex-1 rounded-[26px] border border-slate-300 bg-slate-50 px-4 py-3 shadow-inner shadow-slate-200">
                                                <input
                                                    value={inputText}
                                                    onChange={(e) => setInputText(e.target.value)}
                                                    placeholder="Write a message"
                                                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#143b8f_0%,#2252b8_100%)] text-white shadow-lg shadow-blue-900/20 transition-transform hover:-translate-y-0.5"
                                            >
                                                <Send className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_28%),linear-gradient(180deg,#fafcff_0%,#f2f6fb_100%)] p-8">
                                    <div className="max-w-md text-center">
                                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-[0_18px_40px_-26px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
                                            <MessageCircle className="h-10 w-10 text-blue-900" />
                                        </div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-slate-500">Secure Messaging</p>
                                        <h4 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Choose a chat to continue</h4>
                                        <p className="mt-3 text-lg leading-8 text-slate-700">
                                            Open a team channel or direct message from the left panel to start the conversation.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatWidget;
