'use client';

import { useState, useRef, useEffect } from 'react';

// ─── TYPES ────────────────────────────────────────────────────
interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  status: 'online' | 'offline' | 'typing';
  avatar: string;
  tag: 'lead' | 'client' | 'prospect' | 'vip';
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

// ─── DEMO DATA ────────────────────────────────────────────────
const DEMO_CONTACTS: Contact[] = [
  { id: '1', name: 'Rajesh Sharma', phone: '+91 98765 43210', lastMessage: 'Interested in your marketing services', lastTime: '10:32 AM', unread: 3, status: 'online', avatar: 'RS', tag: 'lead' },
  { id: '2', name: 'Priya Patel', phone: '+91 87654 32109', lastMessage: 'Can you share the pricing details?', lastTime: '9:15 AM', unread: 1, status: 'typing', avatar: 'PP', tag: 'prospect' },
  { id: '3', name: 'Amit Verma', phone: '+91 76543 21098', lastMessage: 'Thank you! Will confirm by evening.', lastTime: 'Yesterday', unread: 0, status: 'offline', avatar: 'AV', tag: 'client' },
  { id: '4', name: 'Sunita Gupta', phone: '+91 65432 10987', lastMessage: 'Please call me back', lastTime: 'Yesterday', unread: 0, status: 'offline', avatar: 'SG', tag: 'vip' },
  { id: '5', name: 'Vikram Singh', phone: '+91 54321 09876', lastMessage: 'Looking forward to working together', lastTime: 'Mon', unread: 0, status: 'offline', avatar: 'VS', tag: 'client' },
  { id: '6', name: 'Neha Joshi', phone: '+91 43210 98765', lastMessage: 'When can we schedule a demo?', lastTime: 'Mon', unread: 2, status: 'offline', avatar: 'NJ', tag: 'lead' },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Hello! I saw your ad on Facebook about marketing automation.', sender: 'them', time: '10:20 AM', status: 'read' },
    { id: '2', text: 'Hi Rajesh! Thanks for reaching out. Yes, we help businesses automate their marketing. What kind of business do you run?', sender: 'me', time: '10:22 AM', status: 'read' },
    { id: '3', text: 'I have a coaching institute in Indore. We are looking to get more students.', sender: 'them', time: '10:25 AM', status: 'read' },
    { id: '4', text: 'Perfect! We work with many coaching institutes. Our AI platform can auto-generate ads, manage leads, and send WhatsApp follow-ups automatically. Would you like a demo?', sender: 'me', time: '10:27 AM', status: 'read' },
    { id: '5', text: 'Interested in your marketing services', sender: 'them', time: '10:32 AM', status: 'read' },
  ],
  '2': [
    { id: '1', text: 'Hi, I need digital marketing for my dental clinic', sender: 'them', time: '9:10 AM', status: 'read' },
    { id: '2', text: 'Hello Priya! We specialize in healthcare marketing. Can you share your clinic name and location?', sender: 'me', time: '9:12 AM', status: 'read' },
    { id: '3', text: 'Can you share the pricing details?', sender: 'them', time: '9:15 AM', status: 'read' },
  ],
  '3': [
    { id: '1', text: 'Package confirmed. When do we start?', sender: 'them', time: 'Yesterday 4:00 PM', status: 'read' },
    { id: '2', text: 'We start Monday! Our team will set up your dashboard and AI tools by 10 AM.', sender: 'me', time: 'Yesterday 4:05 PM', status: 'read' },
    { id: '3', text: 'Thank you! Will confirm by evening.', sender: 'them', time: 'Yesterday 4:10 PM', status: 'read' },
  ],
  '4': [], '5': [], '6': [],
};

const QUICK_REPLIES = [
  'Hi! Thanks for reaching out. How can I help you today?',
  'We offer marketing automation at ₹20,000/month. Would you like a free demo?',
  'Our platform includes AI content, lead management, WhatsApp automation & analytics.',
  'Can I schedule a 15-min call to show you how it works?',
  'Please share your business name and location so I can customize a proposal for you.',
];

const TAG_COLORS: Record<string, string> = {
  lead: 'bg-blue-600',
  client: 'bg-green-600',
  prospect: 'bg-yellow-600',
  vip: 'bg-purple-600',
};

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-green-400',
  offline: 'bg-gray-500',
  typing: 'bg-yellow-400',
};

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function WhatsAppPage() {
  const [contacts, setContacts] = useState<Contact[]>(DEMO_CONTACTS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(DEMO_MESSAGES);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(DEMO_CONTACTS[0]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [filter, setFilter] = useState<'all' | 'lead' | 'client' | 'prospect' | 'vip'>('all');
  const [showNewChat, setShowNewChat] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', tag: 'lead' as Contact['tag'] });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  // Focus input when contact changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedContact]);

  const currentMessages = selectedContact ? (messages[selectedContact.id] || []) : [];

  const filteredContacts = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    const matchFilter = filter === 'all' || c.tag === filter;
    return matchSearch && matchFilter;
  });

  async function sendMessage() {
    if (!inputText.trim() || !selectedContact) return;

    const msgText = inputText.trim();
    const newMsg: Message = {
      id: Date.now().toString(),
      text: msgText,
      sender: 'me',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
    }));

    setContacts(prev => prev.map(c =>
      c.id === selectedContact.id
        ? { ...c, lastMessage: msgText, lastTime: 'Just now', unread: 0 }
        : c
    ));

    setInputText('');
    setShowQuickReplies(false);
    inputRef.current?.focus();

    // Send via real WhatsApp API
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: selectedContact.phone, message: msgText })
      });
      const data = await res.json();
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: (prev[selectedContact.id] || []).map(m =>
          m.id === newMsg.id ? { ...m, status: data.success ? 'delivered' : 'sent' } : m
        )
      }));
    } catch (err) {
      console.error('WhatsApp send error:', err);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function useQuickReply(text: string) {
    setInputText(text);
    setShowQuickReplies(false);
    inputRef.current?.focus();
  }

  function sendBroadcast() {
    if (!broadcastMsg.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setShowBroadcast(false);
      setBroadcastSent(false);
      setBroadcastMsg('');
    }, 2000);
  }

  function selectContact(contact: Contact) {
    setSelectedContact(contact);
    // Mark as read
    setContacts(prev => prev.map(c =>
      c.id === contact.id ? { ...c, unread: 0 } : c
    ));
  }

  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">💬</span>
          <div>
            <h1 className="font-bold text-base">WhatsApp Business</h1>
            <p className="text-xs text-gray-400">Marketing Automation</p>
          </div>
          {totalUnread > 0 && (
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">{totalUnread} new</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBroadcast(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          >
            📢 Broadcast
          </button>
          <button onClick={() => setShowNewChat(true)} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            ➕ New Chat
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Contact List */}
        <div className="w-80 border-r border-gray-800 flex flex-col bg-gray-900 shrink-0">
          {/* Search */}
          <div className="p-3 border-b border-gray-800">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 p-2 border-b border-gray-800 overflow-x-auto">
            {(['all', 'lead', 'prospect', 'client', 'vip'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors capitalize ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? '📋 All' : f === 'lead' ? '🔵 Leads' : f === 'prospect' ? '🟡 Prospects' : f === 'client' ? '🟢 Clients' : '👑 VIP'}
              </button>
            ))}
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => selectContact(contact)}
                className={`flex items-start gap-3 p-3 cursor-pointer border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-gray-800 border-l-2 border-l-green-500' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-sm font-bold">
                    {contact.avatar}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${STATUS_COLORS[contact.status]}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="font-semibold text-sm text-white truncate">{contact.name}</span>
                    <span className="text-xs text-gray-500 shrink-0 ml-1">{contact.lastTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400 truncate">{contact.lastMessage}</p>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {contact.unread > 0 && (
                        <span className="bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs text-white px-1.5 py-0.5 rounded-full mt-1 inline-block ${TAG_COLORS[contact.tag]}`}>
                    {contact.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Chat Window */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center font-bold text-sm">
                    {selectedContact.avatar}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${STATUS_COLORS[selectedContact.status]}`} />
                </div>
                <div>
                  <h2 className="font-bold text-sm">{selectedContact.name}</h2>
                  <p className="text-xs text-gray-400">
                    {selectedContact.status === 'typing' ? '✍️ typing...' : selectedContact.status === 'online' ? '🟢 Online' : selectedContact.phone}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full text-white ${TAG_COLORS[selectedContact.tag]}`}>
                  {selectedContact.tag}
                </span>
                <button className="text-gray-400 hover:text-white text-sm px-2">📋</button>
                <button className="text-gray-400 hover:text-white text-sm px-2">📞</button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-950">
              {currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-gray-400 text-sm">No messages yet. Say hello!</p>
                </div>
              ) : (
                currentMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-2.5 ${
                      msg.sender === 'me'
                        ? 'bg-green-700 text-white rounded-br-sm'
                        : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs opacity-60">{msg.time}</span>
                        {msg.sender === 'me' && (
                          <span className="text-xs opacity-70">
                            {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies Panel */}
            {showQuickReplies && (
              <div className="border-t border-gray-800 bg-gray-900 p-3 max-h-48 overflow-y-auto shrink-0">
                <p className="text-xs text-gray-400 mb-2">⚡ Quick Replies</p>
                <div className="space-y-1.5">
                  {QUICK_REPLIES.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => useQuickReply(reply)}
                      className="w-full text-left text-sm text-gray-200 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-800 bg-gray-900 p-3 shrink-0">
              <div className="flex items-end gap-2">
                {/* Quick Reply Toggle */}
                <button
                  onClick={() => setShowQuickReplies(!showQuickReplies)}
                  className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                    showQuickReplies ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                  title="Quick Replies"
                >
                  ⚡
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                    rows={1}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none leading-relaxed"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    onInput={e => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>

                {/* Emoji */}
                <button className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors shrink-0" title="Emoji">
                  😊
                </button>

                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl transition-all shrink-0 ${
                    inputText.trim()
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/30'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                  title="Send Message"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1.5 ml-1">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-950">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-bold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400 text-sm">Choose a contact from the left to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">📢 Broadcast Message</h3>
              <button onClick={() => setShowBroadcast(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {broadcastSent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-green-400 font-bold">Broadcast sent to {contacts.length} contacts!</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-3">Send to all {contacts.length} contacts at once</p>

                {/* Template Buttons */}
                <div className="mb-3 space-y-1.5">
                  <p className="text-xs text-gray-500">Quick templates:</p>
                  {[
                    '🎯 Special offer: Get 1 month free when you sign up for our marketing automation platform this week!',
                    '📊 Are you tracking your marketing ROI? Our AI platform shows you exactly what\'s working. Book a free demo!',
                    '🚀 New feature alert! AI content generator now supports 8 content types. Try it free today!',
                  ].map((t, i) => (
                    <button key={i} onClick={() => setBroadcastMsg(t)} className="w-full text-left text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors">
                      {t}
                    </button>
                  ))}
                </div>

                <textarea
                  value={broadcastMsg}
                  onChange={e => setBroadcastMsg(e.target.value)}
                  placeholder="Type your broadcast message..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none mb-4"
                />

                <div className="flex gap-3">
                  <button onClick={() => setShowBroadcast(false)} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 text-sm transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={sendBroadcast}
                    disabled={!broadcastMsg.trim()}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      broadcastMsg.trim() ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Send to {contacts.length} Contacts
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">➕ New Chat</h3>
              <button onClick={() => { setShowNewChat(false); setNewContact({ name: '', phone: '', tag: 'lead' }); }} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Add a new contact and start a conversation</p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Name *</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Amit Sharma"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">WhatsApp Number * (with country code)</label>
                <input
                  type="text"
                  value={newContact.phone}
                  onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))}
                  placeholder="e.g. +91 99811 99648"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Tag</label>
                <select
                  value={newContact.tag}
                  onChange={e => setNewContact(p => ({ ...p, tag: e.target.value as Contact['tag'] }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="lead">🔵 Lead</option>
                  <option value="prospect">🟡 Prospect</option>
                  <option value="client">🟢 Client</option>
                  <option value="vip">👑 VIP</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowNewChat(false); setNewContact({ name: '', phone: '', tag: 'lead' }); }}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newContact.name.trim() || !newContact.phone.trim()) return;
                  const initials = newContact.name.trim().split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
                  const contact: Contact = {
                    id: Date.now().toString(),
                    name: newContact.name.trim(),
                    phone: newContact.phone.trim(),
                    lastMessage: 'New contact added',
                    lastTime: 'Just now',
                    unread: 0,
                    status: 'offline',
                    avatar: initials,
                    tag: newContact.tag
                  };
                  setContacts(prev => [contact, ...prev]);
                  setMessages(prev => ({ ...prev, [contact.id]: [] }));
                  setSelectedContact(contact);
                  setShowNewChat(false);
                  setNewContact({ name: '', phone: '', tag: 'lead' });
                }}
                disabled={!newContact.name.trim() || !newContact.phone.trim()}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  newContact.name.trim() && newContact.phone.trim()
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
