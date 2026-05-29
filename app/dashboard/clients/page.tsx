'use client';

import { useState } from 'react';

// ─── TYPES ────────────────────────────────────────────────────
type Stage = 'Lead' | 'Demo' | 'Proposal' | 'Negotiation' | 'Closed' | 'Lost';
type Tab = 'list' | 'pipeline' | 'profile';

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  description: string;
}

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'completed';
  spent: number;
  leads: number;
  date: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'us' | 'them';
  time: string;
}

interface Client {
  id: string;
  name: string;
  business: string;
  niche: string;
  phone: string;
  email: string;
  city: string;
  stage: Stage;
  monthlyValue: number;
  joinDate: string;
  avatar: string;
  tags: string[];
  notes: string;
  nextFollowUp: string;
  campaigns: Campaign[];
  invoices: Invoice[];
  messages: Message[];
  rating: number;
  totalRevenue: number;
}

// ─── DEMO DATA ────────────────────────────────────────────────
const DEMO_CLIENTS: Client[] = [
  {
    id: '1', name: 'Dr. Rajesh Sharma', business: 'Bright Smile Dental', niche: 'Dental Clinic',
    phone: '+91 98765 43210', email: 'rajesh@brightsmile.com', city: 'Vijay Nagar, Indore',
    stage: 'Closed', monthlyValue: 20000, joinDate: '2026-01-15', avatar: 'RS',
    tags: ['dental', 'vip', 'active'], notes: 'Very happy with results. Referred 2 clients. Running Facebook + WhatsApp campaigns.',
    nextFollowUp: '2026-06-05', rating: 5, totalRevenue: 100000,
    campaigns: [
      { id: 'c1', name: 'Dental Checkup Drive', platform: 'Facebook', status: 'active', spent: 8000, leads: 42, date: '2026-05-01' },
      { id: 'c2', name: 'Smile Makeover Ad', platform: 'Instagram', status: 'active', spent: 5000, leads: 28, date: '2026-05-10' },
      { id: 'c3', name: 'WhatsApp Campaign', platform: 'WhatsApp', status: 'completed', spent: 0, leads: 65, date: '2026-04-15' },
    ],
    invoices: [
      { id: 'inv1', amount: 20000, status: 'paid', date: '2026-05-01', description: 'May 2026 - Marketing Package' },
      { id: 'inv2', amount: 20000, status: 'paid', date: '2026-04-01', description: 'Apr 2026 - Marketing Package' },
      { id: 'inv3', amount: 20000, status: 'pending', date: '2026-06-01', description: 'Jun 2026 - Marketing Package' },
    ],
    messages: [
      { id: 'm1', text: 'Sir, your Facebook campaign got 42 leads this month!', sender: 'us', time: '2026-05-28 10:00' },
      { id: 'm2', text: 'Excellent! I am very happy. Please continue.', sender: 'them', time: '2026-05-28 10:15' },
      { id: 'm3', text: 'June invoice will be ₹20,000. Sending tomorrow.', sender: 'us', time: '2026-05-29 09:00' },
    ],
  },
  {
    id: '2', name: 'Priya Patel', business: 'Glow Beauty Salon', niche: 'Beauty Salon',
    phone: '+91 87654 32109', email: 'priya@glowsalon.com', city: 'Palasia, Indore',
    stage: 'Closed', monthlyValue: 20000, joinDate: '2026-02-01', avatar: 'PP',
    tags: ['salon', 'active'], notes: 'Running Instagram + Story ads. Bridal season campaign very successful.',
    nextFollowUp: '2026-06-03', rating: 4, totalRevenue: 80000,
    campaigns: [
      { id: 'c4', name: 'Bridal Season Special', platform: 'Instagram', status: 'active', spent: 6000, leads: 35, date: '2026-05-05' },
      { id: 'c5', name: 'Weekend Glow Offer', platform: 'Facebook', status: 'paused', spent: 3000, leads: 18, date: '2026-04-20' },
    ],
    invoices: [
      { id: 'inv4', amount: 20000, status: 'paid', date: '2026-05-01', description: 'May 2026 - Marketing Package' },
      { id: 'inv5', amount: 20000, status: 'overdue', date: '2026-04-01', description: 'Apr 2026 - Marketing Package' },
    ],
    messages: [
      { id: 'm4', text: 'Priya ji, bridal campaign results are amazing! 35 leads in 3 weeks.', sender: 'us', time: '2026-05-25 11:00' },
      { id: 'm5', text: 'Thank you so much! Can we increase the budget?', sender: 'them', time: '2026-05-25 11:30' },
    ],
  },
  {
    id: '3', name: 'Amit Verma', business: 'PSC Coaching Academy', niche: 'Coaching Institute',
    phone: '+91 76543 21098', email: 'amit@pscacademy.com', city: 'New Palasia, Indore',
    stage: 'Proposal', monthlyValue: 20000, joinDate: '', avatar: 'AV',
    tags: ['coaching', 'hot-lead'], notes: 'Demo done on 28 May. Very interested. Proposal sent. Waiting for approval.',
    nextFollowUp: '2026-06-01', rating: 0, totalRevenue: 0,
    campaigns: [],
    invoices: [],
    messages: [
      { id: 'm6', text: 'Amit ji, thank you for the demo! Sending proposal now.', sender: 'us', time: '2026-05-28 15:00' },
      { id: 'm7', text: 'Looks good. Let me discuss with my partner.', sender: 'them', time: '2026-05-28 16:00' },
    ],
  },
  {
    id: '4', name: 'Sunita Gupta', business: 'Iron Beast Gym', niche: 'Gym & Fitness',
    phone: '+91 65432 10987', email: 'sunita@ironbeast.com', city: 'Scheme 54, Indore',
    stage: 'Demo', monthlyValue: 0, joinDate: '', avatar: 'SG',
    tags: ['gym', 'scheduled'], notes: 'Demo scheduled for 2 June 2026. Interested in Instagram + WhatsApp campaigns.',
    nextFollowUp: '2026-06-02', rating: 0, totalRevenue: 0,
    campaigns: [],
    invoices: [],
    messages: [
      { id: 'm8', text: 'Sunita ji, demo is confirmed for 2nd June at 5 PM.', sender: 'us', time: '2026-05-29 10:00' },
    ],
  },
  {
    id: '5', name: 'Vikram Singh', business: 'Spice Garden Restaurant', niche: 'Restaurant',
    phone: '+91 54321 09876', email: 'vikram@spicegarden.com', city: 'MG Road, Indore',
    stage: 'Lead', monthlyValue: 0, joinDate: '', avatar: 'VS',
    tags: ['restaurant', 'new'], notes: 'Contacted via Facebook ad. Interested in food photography + social media management.',
    nextFollowUp: '2026-05-31', rating: 0, totalRevenue: 0,
    campaigns: [],
    invoices: [],
    messages: [],
  },
  {
    id: '6', name: 'Neha Joshi', business: 'Luxe Jewellery', niche: 'Jewellery',
    phone: '+91 43210 98765', email: 'neha@luxejewellery.com', city: 'Sarafa Bazar, Indore',
    stage: 'Negotiation', monthlyValue: 0, joinDate: '', avatar: 'NJ',
    tags: ['jewellery', 'negotiating'], notes: 'Demo done. Wants to negotiate price. Offered ₹15K for first 3 months.',
    nextFollowUp: '2026-05-31', rating: 0, totalRevenue: 0,
    campaigns: [],
    invoices: [],
    messages: [
      { id: 'm9', text: 'Neha ji, we can offer ₹15,000 for first 3 months as welcome offer.', sender: 'us', time: '2026-05-27 14:00' },
      { id: 'm10', text: 'Let me think about it. Will revert by tomorrow.', sender: 'them', time: '2026-05-27 14:30' },
    ],
  },
];

const STAGE_COLORS: Record<Stage, string> = {
  Lead: 'bg-gray-600', Demo: 'bg-blue-600', Proposal: 'bg-yellow-600',
  Negotiation: 'bg-orange-600', Closed: 'bg-green-600', Lost: 'bg-red-600'
};

const STAGE_ORDER: Stage[] = ['Lead', 'Demo', 'Proposal', 'Negotiation', 'Closed', 'Lost'];

// ─── PIPELINE COLUMN ──────────────────────────────────────────
function PipelineColumn({ stage, clients, onSelect }: { stage: Stage; clients: Client[]; onSelect: (c: Client) => void }) {
  const value = clients.reduce((s, c) => s + c.monthlyValue, 0);
  return (
    <div className="min-w-[220px] bg-gray-900 rounded-xl border border-gray-800 flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${STAGE_COLORS[stage]}`}>{stage}</span>
          <span className="text-xs text-gray-400">{clients.length} clients</span>
        </div>
        {value > 0 && <p className="text-xs text-green-400">₹{value.toLocaleString('en-IN')}/mo</p>}
      </div>
      <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[500px]">
        {clients.length === 0 && <p className="text-xs text-gray-600 text-center py-4">No clients</p>}
        {clients.map(client => (
          <div key={client.id} onClick={() => onSelect(client)}
            className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 cursor-pointer hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">{client.avatar}</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{client.name}</p>
                <p className="text-xs text-gray-400 truncate">{client.business}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{client.niche}</span>
              {client.monthlyValue > 0 && <span className="text-xs text-green-400 font-bold">₹{(client.monthlyValue/1000).toFixed(0)}K</span>}
            </div>
            {client.nextFollowUp && (
              <p className="text-xs text-orange-400 mt-1">📅 {client.nextFollowUp}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLIENT PROFILE ───────────────────────────────────────────
function ClientProfile({ client, onBack }: { client: Client; onBack: () => void }) {
  const [activeSection, setActiveSection] = useState<'overview' | 'campaigns' | 'invoices' | 'messages' | 'notes'>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(client.messages);

  function sendMessage() {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'us',
      time: new Date().toLocaleString('en-IN')
    }]);
    setNewMessage('');
  }

  const totalPaid = client.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = client.invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Profile Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-start gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white mt-1 shrink-0">←</button>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
            {client.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h2 className="font-bold text-lg text-white">{client.name}</h2>
                <p className="text-gray-400 text-sm">{client.business} · {client.niche}</p>
                <p className="text-gray-500 text-xs mt-0.5">📍 {client.city}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${STAGE_COLORS[client.stage]}`}>{client.stage}</span>
                {client.monthlyValue > 0 && <span className="text-sm font-bold text-green-400">₹{client.monthlyValue.toLocaleString('en-IN')}/mo</span>}
              </div>
            </div>
            <div className="flex gap-3 mt-2 flex-wrap">
              <a href={`tel:${client.phone}`} className="text-xs text-blue-400 hover:text-blue-300">📞 {client.phone}</a>
              <a href={`mailto:${client.email}`} className="text-xs text-blue-400 hover:text-blue-300">✉️ {client.email}</a>
              <a href={`https://wa.me/${client.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:text-green-300">💬 WhatsApp</a>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {client.stage === 'Closed' && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Total Revenue', value: `₹${client.totalRevenue.toLocaleString('en-IN')}`, color: 'text-green-400' },
              { label: 'Active Campaigns', value: client.campaigns.filter(c => c.status === 'active').length, color: 'text-blue-400' },
              { label: 'Total Leads', value: client.campaigns.reduce((s,c) => s+c.leads, 0), color: 'text-purple-400' },
              { label: 'Pending', value: `₹${totalPending.toLocaleString('en-IN')}`, color: 'text-orange-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-800 rounded-xl p-3 text-center">
                <p className={`text-base font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 px-4 py-2 bg-gray-900 border-b border-gray-800 overflow-x-auto">
        {(['overview', 'campaigns', 'invoices', 'messages', 'notes'] as const).map(s => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`text-xs px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-all ${activeSection === s ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            {s === 'overview' ? '📊 Overview' : s === 'campaigns' ? `📢 Campaigns (${client.campaigns.length})` : s === 'invoices' ? `🧾 Invoices (${client.invoices.length})` : s === 'messages' ? `💬 Messages (${messages.length})` : '📝 Notes'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">🗺️ Pipeline Stage</h3>
              <div className="flex gap-1 flex-wrap">
                {STAGE_ORDER.filter(s => s !== 'Lost').map((s, i) => (
                  <div key={s} className="flex items-center gap-1">
                    <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${client.stage === s ? `${STAGE_COLORS[s]} text-white` : 'bg-gray-800 text-gray-500'}`}>{s}</div>
                    {i < 4 && <span className="text-gray-600 text-xs">→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">📅 Next Follow Up</p>
                <p className="text-sm font-bold text-orange-400">{client.nextFollowUp || 'Not set'}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">⭐ Client Rating</p>
                <p className="text-sm font-bold text-yellow-400">{'⭐'.repeat(client.rating) || 'Not rated'}</p>
              </div>
              {client.joinDate && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">📆 Client Since</p>
                  <p className="text-sm font-bold text-white">{client.joinDate}</p>
                </div>
              )}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">🏷️ Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {client.tags.map(tag => <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>)}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">📝 Notes</p>
              <p className="text-sm text-gray-200 leading-relaxed">{client.notes || 'No notes yet.'}</p>
            </div>
          </div>
        )}

        {/* CAMPAIGNS */}
        {activeSection === 'campaigns' && (
          <div className="space-y-3">
            {client.campaigns.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📢</div>
                <p>No campaigns yet. Close the deal to start campaigns!</p>
              </div>
            ) : (
              client.campaigns.map(campaign => (
                <div key={campaign.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm text-white">{campaign.name}</h3>
                      <p className="text-xs text-gray-400">{campaign.platform} · Started {campaign.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${campaign.status === 'active' ? 'bg-green-900/50 text-green-400 border border-green-600/30' : campaign.status === 'paused' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-600/30' : 'bg-gray-800 text-gray-400'}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-sm font-bold text-red-400">₹{campaign.spent.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500">Ad Spend</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-sm font-bold text-green-400">{campaign.leads}</p>
                      <p className="text-xs text-gray-500">Leads</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-sm font-bold text-blue-400">₹{campaign.leads > 0 ? Math.round(campaign.spent / campaign.leads) : 0}</p>
                      <p className="text-xs text-gray-500">Cost/Lead</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* INVOICES */}
        {activeSection === 'invoices' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-3 text-center">
                <p className="text-base font-bold text-green-400">₹{totalPaid.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400">Total Paid</p>
              </div>
              <div className="bg-orange-900/20 border border-orange-600/30 rounded-xl p-3 text-center">
                <p className="text-base font-bold text-orange-400">₹{totalPending.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400">Pending</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-xl p-3 text-center">
                <p className="text-base font-bold text-blue-400">{client.invoices.length}</p>
                <p className="text-xs text-gray-400">Total Invoices</p>
              </div>
            </div>
            {client.invoices.length === 0 ? (
              <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-3">🧾</div><p>No invoices yet.</p></div>
            ) : (
              client.invoices.map(inv => (
                <div key={inv.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{inv.description}</p>
                    <p className="text-xs text-gray-400">Due: {inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-white">₹{inv.amount.toLocaleString('en-IN')}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.status === 'paid' ? 'bg-green-900/50 text-green-400' : inv.status === 'overdue' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))
            )}
            <button className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              + Create New Invoice
            </button>
          </div>
        )}

        {/* MESSAGES */}
        {activeSection === 'messages' && (
          <div className="flex flex-col h-full" style={{ minHeight: '400px' }}>
            <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-3">💬</div><p>No messages yet.</p></div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'us' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-2xl px-4 py-2.5 ${msg.sender === 'us' ? 'bg-purple-700 text-white rounded-br-sm' : 'bg-gray-800 text-gray-100 rounded-bl-sm'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-60 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              <button onClick={sendMessage} disabled={!newMessage.trim()} className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">Send</button>
            </div>
          </div>
        )}

        {/* NOTES */}
        {activeSection === 'notes' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">Client Notes</p>
              <textarea defaultValue={client.notes} rows={6} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 resize-none" placeholder="Add notes about this client..." />
              <button className="mt-2 text-xs bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg">Save Notes</button>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-3">Next Follow-up</p>
              <input type="date" defaultValue={client.nextFollowUp} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-3">Move to Stage</p>
              <div className="flex flex-wrap gap-2">
                {STAGE_ORDER.map(s => (
                  <button key={s} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${client.stage === s ? `${STAGE_COLORS[s]} text-white` : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function ClientsPage() {
  const [tab, setTab] = useState<Tab>('list');
  const [clients] = useState<Client[]>(DEMO_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<Stage | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.business.toLowerCase().includes(search.toLowerCase()) ||
      c.niche.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'All' || c.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const totalRevenue = clients.filter(c => c.stage === 'Closed').reduce((s, c) => s + c.monthlyValue, 0);
  const closedCount = clients.filter(c => c.stage === 'Closed').length;
  const pipelineValue = clients.filter(c => !['Closed', 'Lost'].includes(c.stage)).reduce((s, c) => s + 20000, 0);

  if (selectedClient) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <ClientProfile client={selectedClient} onBack={() => setSelectedClient(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">🏢 Client Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage your clients, pipeline, campaigns and invoices</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
          + Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Clients', value: closedCount, icon: '✅', color: 'text-green-400', bg: 'bg-green-900/20 border-green-600/30' },
          { label: 'Monthly Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: '💰', color: 'text-green-400', bg: 'bg-green-900/20 border-green-600/30' },
          { label: 'Pipeline Clients', value: clients.filter(c => !['Closed','Lost'].includes(c.stage)).length, icon: '🔄', color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-600/30' },
          { label: 'Pipeline Value', value: `₹${pipelineValue.toLocaleString('en-IN')}`, icon: '📈', color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-600/30' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className={`${bg} border rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{icon}</span>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(['list', 'pipeline'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`text-sm px-5 py-2 rounded-xl font-medium capitalize transition-all ${tab === t ? 'bg-purple-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-700'}`}>
            {t === 'list' ? '📋 Client List' : '🔄 Pipeline View'}
          </button>
        ))}
      </div>

      {/* LIST VIEW */}
      {tab === 'list' && (
        <>
          <div className="flex gap-3 mb-4 flex-wrap">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="flex-1 min-w-48 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" />
            <div className="flex gap-2 overflow-x-auto">
              {(['All', ...STAGE_ORDER] as const).map(s => (
                <button key={s} onClick={() => setStageFilter(s as Stage | 'All')}
                  className={`text-xs px-3 py-2 rounded-xl whitespace-nowrap transition-all border ${stageFilter === s ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(client => (
              <div key={client.id} onClick={() => setSelectedClient(client)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-purple-500/50 transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-base font-bold text-white shrink-0">
                  {client.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-bold text-white">{client.name}</h3>
                      <p className="text-sm text-gray-400">{client.business} · {client.niche}</p>
                      <p className="text-xs text-gray-500 mt-0.5">📍 {client.city} · 📞 {client.phone}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${STAGE_COLORS[client.stage]}`}>{client.stage}</span>
                      {client.monthlyValue > 0 && <p className="text-sm font-bold text-green-400 mt-1">₹{client.monthlyValue.toLocaleString('en-IN')}/mo</p>}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-gray-400">📢 {client.campaigns.length} campaigns</span>
                    <span className="text-xs text-gray-400">🧾 {client.invoices.length} invoices</span>
                    {client.nextFollowUp && <span className="text-xs text-orange-400">📅 Follow-up: {client.nextFollowUp}</span>}
                  </div>
                </div>
                <span className="text-gray-600 text-xl shrink-0">›</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PIPELINE VIEW */}
      {tab === 'pipeline' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STAGE_ORDER.map(stage => (
              <PipelineColumn key={stage} stage={stage} clients={clients.filter(c => c.stage === stage)} onSelect={setSelectedClient} />
            ))}
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">+ Add New Client</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name', placeholder: 'e.g. Dr. Rajesh Sharma' },
                { label: 'Business Name', placeholder: 'e.g. Bright Smile Dental' },
                { label: 'Business Type / Niche', placeholder: 'e.g. Dental Clinic' },
                { label: 'Phone', placeholder: '+91 98765 43210' },
                { label: 'Email', placeholder: 'email@business.com' },
                { label: 'City', placeholder: 'e.g. Vijay Nagar, Indore' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  <input placeholder={placeholder} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pipeline Stage</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                  {STAGE_ORDER.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-colors">Add Client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
