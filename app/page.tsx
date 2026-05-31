'use client';

import { useState, useEffect, useRef } from 'react';

// ─── DEMO BOOKING MODAL ───────────────────────────────────────
function DemoModal({ plan, onClose }: { plan: string; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', business: '', type: '', city: '', country: '', phone: '', email: '', employees: '', monthly_budget: '', goal: '', hearAbout: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const businessTypes = ['Dental Clinic', 'Coaching Institute', 'Beauty Salon', 'Gym & Fitness', 'Restaurant', 'Real Estate', 'Hospital', 'Jewellery Store', 'Clothing Store', 'E-commerce', 'Agency', 'Other'];
  const goals = ['Generate more leads', 'Automate social media posts', 'Manage WhatsApp marketing', 'Create ad creatives', 'Build landing pages', 'All of the above'];

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-lg bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top gradient bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #6c47ff, #a855f7, #ec4899)' }} />

        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">✕</button>

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
              <p className="text-gray-400 mb-4">We'll call you within <span className="text-purple-400 font-bold">2 hours</span> to schedule your demo.</p>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-left mb-6">
                <p className="text-xs text-gray-400 mb-1">Selected Plan</p>
                <p className="text-white font-bold">{plan}</p>
                <p className="text-xs text-gray-400 mt-2 mb-1">Business</p>
                <p className="text-white font-semibold">{form.business} — {form.type}</p>
                <p className="text-xs text-gray-400 mt-2 mb-1">Contact</p>
                <p className="text-white">{form.phone} · {form.email}</p>
              </div>
              <p className="text-xs text-gray-500">Questions? WhatsApp us at <span className="text-green-400">+91 99811 99648</span></p>
              <button onClick={onClose} className="mt-4 w-full py-3 rounded-xl text-white font-bold" style={{ background: 'linear-gradient(135deg, #6c47ff, #a855f7)' }}>Done</button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'text-white' : 'bg-gray-800 text-gray-500'}`}
                      style={step >= s ? { background: 'linear-gradient(135deg, #6c47ff, #a855f7)' } : {}}>
                      {step > s ? '✓' : s}
                    </div>
                    {s < 3 && <div className={`h-0.5 w-8 transition-all ${step > s ? 'bg-purple-500' : 'bg-gray-700'}`} />}
                  </div>
                ))}
                <span className="ml-auto text-xs text-gray-500">Step {step} of 3</span>
              </div>

              {/* Step 1 — About You */}
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Tell us about yourself</h3>
                  <p className="text-gray-400 text-sm mb-5">We'll customize the demo for your business</p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Your Name *</label>
                        <input value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="e.g. Rajesh Sharma" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Business Name *</label>
                        <input value={form.business} onChange={e => updateForm('business', e.target.value)} placeholder="e.g. Bright Smile Dental" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Business Type *</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {businessTypes.map(bt => (
                          <button key={bt} onClick={() => updateForm('type', bt)}
                            className={`text-xs py-1.5 px-2 rounded-lg border transition-all text-left ${form.type === bt ? 'border-purple-500 bg-purple-900/30 text-purple-300' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                            {bt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">City *</label>
                        <input value={form.city} onChange={e => updateForm('city', e.target.value)} placeholder="e.g. Mumbai" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Country *</label>
                        <input value={form.country} onChange={e => updateForm('country', e.target.value)} placeholder="e.g. India" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500" />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => form.name && form.business && form.type && form.city ? setStep(2) : null}
                    disabled={!form.name || !form.business || !form.type || !form.city}
                    className="w-full mt-5 py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #6c47ff, #a855f7)' }}>
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 2 — Contact & Budget */}
              {step === 2 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Contact & Goals</h3>
                  <p className="text-gray-400 text-sm mb-5">So we can reach you and prepare the right demo</p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Phone / WhatsApp *</label>
                        <input value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+91 98765 43210" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Email *</label>
                        <input value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="you@business.com" type="email" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Team Size</label>
                      <div className="flex gap-2">
                        {['Just me', '2-5', '6-20', '20+'].map(s => (
                          <button key={s} onClick={() => updateForm('employees', s)}
                            className={`flex-1 text-xs py-2 rounded-lg border transition-all ${form.employees === s ? 'border-purple-500 bg-purple-900/30 text-purple-300' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Monthly Marketing Budget</label>
                      <div className="flex gap-2 flex-wrap">
                        {['< $100', '$100-500', '$500-2K', '$2K+', 'Not sure'].map(b => (
                          <button key={b} onClick={() => updateForm('monthly_budget', b)}
                            className={`text-xs py-1.5 px-3 rounded-lg border transition-all ${form.monthly_budget === b ? 'border-purple-500 bg-purple-900/30 text-purple-300' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Primary Goal</label>
                      <div className="space-y-1.5">
                        {goals.map(g => (
                          <button key={g} onClick={() => updateForm('goal', g)}
                            className={`w-full text-xs py-2 px-3 rounded-lg border text-left transition-all ${form.goal === g ? 'border-purple-500 bg-purple-900/30 text-purple-300' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl text-gray-400 bg-gray-800 text-sm font-medium">← Back</button>
                    <button onClick={() => form.phone && form.email ? setStep(3) : null}
                      disabled={!form.phone || !form.email}
                      className="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, #6c47ff, #a855f7)' }}>
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 — Confirm */}
              {step === 3 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Confirm your demo booking</h3>
                  <p className="text-gray-400 text-sm mb-5">We'll call you within 2 hours to schedule</p>
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Plan Selected</span>
                      <span className="text-sm font-bold text-purple-400">{plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Name</span>
                      <span className="text-sm text-white">{form.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Business</span>
                      <span className="text-sm text-white">{form.business}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Type</span>
                      <span className="text-sm text-white">{form.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Location</span>
                      <span className="text-sm text-white">{form.city}, {form.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Phone</span>
                      <span className="text-sm text-white">{form.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Goal</span>
                      <span className="text-sm text-white">{form.goal || 'Not specified'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">How did you hear about us?</label>
                    <select value={form.hearAbout} onChange={e => updateForm('hearAbout', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                      <option value="">Select...</option>
                      <option>Google Search</option>
                      <option>Facebook / Instagram Ad</option>
                      <option>LinkedIn</option>
                      <option>WhatsApp</option>
                      <option>Friend / Referral</option>
                      <option>YouTube</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setStep(2)} className="px-5 py-3 rounded-xl text-gray-400 bg-gray-800 text-sm">← Back</button>
                    <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl text-white font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, #6c47ff, #ec4899)' }}>
                      🚀 Book My Free Demo
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">No payment required. Free demo call within 2 hours.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COUNTER ANIMATION ────────────────────────────────────────
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── MAIN LANDING PAGE ────────────────────────────────────────
export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('USD');

  function openDemo(plan: string) {
    setSelectedPlan(plan);
    setShowModal(true);
  }

  const features = [
    { icon: '🤖', title: 'AI Content Generator', desc: 'Generate ad copy, headlines, articles, reel scripts, hashtags and more in seconds. 8 AI tools built for every content need.', preview: '📢 Ad Copy · ✍️ Headlines · 📱 Social Posts · 🎬 Reel Scripts · #️⃣ Hashtags · 👥 Audience AI' },
    { icon: '🎨', title: 'Ad Creative Studio', desc: 'Generate complete ad creatives — AI image + headline + copy + CTA — ready to boost on Facebook & Instagram instantly.', preview: '🖼️ AI Image · 📝 Ad Copy · 📲 Platform Previews · ⬇️ Export Package' },
    { icon: '🌐', title: 'Landing Page Builder', desc: 'AI generates a complete landing page for any business in 10 seconds. Full editor — change text, colors, images, sections.', preview: '✨ AI Generated · ✏️ Full Editor · 🎨 Color Themes · 📤 Export HTML' },
    { icon: '💬', title: 'WhatsApp Automation', desc: 'Send bulk WhatsApp messages, manage conversations, and automate follow-ups — all from one dashboard.', preview: '📢 Broadcast · ⚡ Quick Replies · 👥 Contact Lists · 📊 Delivery Tracking' },
    { icon: '📱', title: 'Social Media Manager', desc: 'Auto-generate and schedule posts for Facebook, Instagram, LinkedIn and more. Set it once, publish forever.', preview: '📅 Schedule · 🤖 AI Posts · 📊 Analytics · 🌍 Multi-platform' },
    { icon: '🏢', title: 'Client CRM', desc: 'Full pipeline management — track leads, demos, proposals and closed deals. Complete client profiles with campaigns and invoices.', preview: '🔄 Pipeline · 📊 Analytics · 🧾 Invoices · 💬 Messages' },
  ];

  const plans = [
    {
      name: 'Basic',
      usdYear: '$4,999', usdMonth: '$499',
      inrYear: '₹4,999', inrMonth: '₹4,999',
      tag: '', color: 'border-gray-700',
      platformBadge: '1 Platform',
      platformDesc: 'Choose any 1: Facebook, Instagram, LinkedIn, or WhatsApp',
      features: [
        '✅ 1 Social Platform of your choice',
        'AI Content Generator (8 tools)',
        'Ad Creative Studio',
        'Landing Page Builder (5 pages)',
        'WhatsApp OR Social Scheduler',
        'Lead Manager',
        '1 User',
        'Email Support',
      ],
      cta: 'Book Demo',
    },
    {
      name: 'Professional',
      usdYear: '$6,999', usdMonth: '$699',
      inrYear: '₹6,999', inrMonth: '₹6,999',
      tag: '⭐ Most Popular', color: 'border-purple-500',
      platformBadge: '2 Platforms',
      platformDesc: 'Choose any 2: Facebook, Instagram, LinkedIn, WhatsApp',
      features: [
        '✅ 2 Social Platforms of your choice',
        'Everything in Basic',
        'Unlimited Landing Pages',
        'WhatsApp Automation (5,000 msg/mo)',
        'Client CRM (unlimited clients)',
        'Campaign Analytics & ROAS',
        '5 Users',
        'Priority Support (WhatsApp)',
      ],
      cta: 'Book Demo',
    },
    {
      name: 'Premium',
      usdYear: '$8,999', usdMonth: '$899',
      inrYear: '₹8,999', inrMonth: '₹8,999',
      tag: '🚀 Best Value', color: 'border-pink-500',
      platformBadge: 'All Platforms',
      platformDesc: 'Facebook + Instagram + LinkedIn + WhatsApp + Google',
      features: [
        '✅ ALL Platforms Included',
        'Everything in Professional',
        'White Label (your own branding)',
        'Custom Domain',
        'LinkedIn API Integration',
        'Google Business Profile',
        'Dedicated Account Manager',
        'Unlimited Users · 24/7 Support',
      ],
      cta: 'Book Demo',
    },
  ];

  const testimonials = [
    { name: 'Rajesh Sharma', role: 'Dental Clinic Owner', country: '🇮🇳 India', text: 'GlobalWebSaaS transformed our marketing. We went from 10 leads a month to 80+ using their AI ad creatives and WhatsApp automation.', avatar: 'RS', rating: 5 },
    { name: 'Sarah Chen', role: 'E-commerce Founder', country: '🇸🇬 Singapore', text: 'The landing page builder is incredible. I generated 5 different campaign pages in one afternoon. ROI was visible within the first week.', avatar: 'SC', rating: 5 },
    { name: 'Ahmed Al-Rashid', role: 'Real Estate Agency', country: '🇦🇪 UAE', text: 'Best marketing tool for agencies. My team manages 20+ clients from one dashboard. The AI content saves us 40 hours a week.', avatar: 'AA', rating: 5 },
    { name: 'Priya Patel', role: 'Salon Chain Owner', country: '🇮🇳 India', text: 'The AI generates beautiful ad creatives for our Instagram. We used to pay ₹15,000/month for a designer. Now it\'s all automated.', avatar: 'PP', rating: 5 },
  ];

  return (
    <div style={{ backgroundColor: '#07070f', color: '#f0f0ff', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden' }}>
      {/* ── NAVBAR ── */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'rgba(7,7,15,0.9)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/globalwebsaas-logo.png" alt="GlobalWebSaaS" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>GlobalWebSaaS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href="#features" style={{ color: '#9090b8', fontSize: 14, textDecoration: 'none', padding: '6px 12px' }} className="hidden md:block">Features</a>
            <a href="#pricing" style={{ color: '#9090b8', fontSize: 14, textDecoration: 'none', padding: '6px 12px' }} className="hidden md:block">Pricing</a>
            <a href="#testimonials" style={{ color: '#9090b8', fontSize: 14, textDecoration: 'none', padding: '6px 12px' }} className="hidden md:block">Reviews</a>
            <a href="/auth/login" style={{ color: '#9090b8', fontSize: 14, textDecoration: 'none', padding: '6px 12px' }}>Login</a>
            <button onClick={() => openDemo('Professional')} style={{ background: 'linear-gradient(135deg,#6c47ff,#a855f7)', color: 'white', border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Book Free Demo
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* BG glows */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,71,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,71,255,0.12)', border: '1px solid rgba(108,71,255,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6c47ff', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>AI-Powered Marketing Automation for Every Business</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24 }}>
            Your Complete<br />
            <span style={{ background: 'linear-gradient(135deg, #6c47ff, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Marketing Team
            </span><br />
            — At a Fraction of the Cost
          </h1>

          <p style={{ fontSize: 18, color: '#9090b8', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 40px', fontWeight: 400 }}>
            Generate ads, create content, manage WhatsApp, build landing pages, and track clients — all from one powerful AI dashboard. Works for any business, anywhere in the world.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <button onClick={() => openDemo('Professional')} style={{ background: 'linear-gradient(135deg, #6c47ff, #a855f7)', color: 'white', border: 'none', borderRadius: 14, padding: '16px 32px', fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 40px rgba(108,71,255,0.4)' }}>
              🚀 Book Free Demo
            </button>
            <a href="/dashboard" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', borderRadius: 14, padding: '16px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
              👁️ View Live Demo
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { value: 500, suffix: '+', label: 'Businesses Served' },
              { value: 50, suffix: '+', label: 'Countries' },
              { value: 10, suffix: 'M+', label: 'Leads Generated' },
              { value: 98, suffix: '%', label: 'Satisfaction Rate' },
            ].map(({ value, suffix, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#a78bfa' }}><Counter end={value} suffix={suffix} /></div>
                <div style={{ fontSize: 12, color: '#6060a0' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: '#6c47ff', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Everything You Need</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>One Platform. Infinite Growth.</h2>
            <p style={{ color: '#9090b8', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>Replace your entire marketing stack with one AI-powered dashboard</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} onClick={() => setActiveFeature(i)}
                style={{ background: activeFeature === i ? 'rgba(108,71,255,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${activeFeature === i ? 'rgba(108,71,255,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 20, padding: 28, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: activeFeature === i ? '#a78bfa' : '#f0f0ff' }}>{f.title}</h3>
                <p style={{ color: '#7070a0', fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>{f.desc}</p>
                <div style={{ background: 'rgba(108,71,255,0.08)', borderRadius: 10, padding: '8px 12px' }}>
                  <p style={{ color: '#8080c0', fontSize: 11, lineHeight: 1.8 }}>{f.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(108,71,255,0.03)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: '#6c47ff', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Trusted Worldwide</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>Real Results, Real Businesses</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, borderLeft: '3px solid #6c47ff' }}>
                <div style={{ marginBottom: 12 }}>{'⭐'.repeat(t.rating)}</div>
                <p style={{ color: '#c0c0e0', fontSize: 14, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6c47ff,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</p>
                    <p style={{ color: '#6060a0', fontSize: 12 }}>{t.role} · {t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: '#6c47ff', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Simple Pricing</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>Invest in Growth</h2>
            <p style={{ color: '#9090b8', fontSize: 16, marginBottom: 32 }}>All plans include a <span style={{ color: '#a78bfa', fontWeight: 700 }}>free demo call</span> before you pay anything</p>

            {/* Currency Toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: 4, gap: 4 }}>
              <button
                onClick={() => setCurrency('INR')}
                style={{ padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s', background: currency === 'INR' ? 'linear-gradient(135deg,#f97316,#ef4444)' : 'transparent', color: currency === 'INR' ? 'white' : '#6060a0' }}>
                🇮🇳 India (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                style={{ padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s', background: currency === 'USD' ? 'linear-gradient(135deg,#6c47ff,#a855f7)' : 'transparent', color: currency === 'USD' ? 'white' : '#6060a0' }}>
                🌍 Global ($)
              </button>
            </div>
            {currency === 'INR' && (
              <p style={{ color: '#9090b8', fontSize: 13, marginTop: 12 }}>
                💳 Pay via UPI, Bank Transfer, or Razorpay · GST invoice provided
              </p>
            )}
            {currency === 'USD' && (
              <p style={{ color: '#9090b8', fontSize: 13, marginTop: 12 }}>
                💳 Pay via Credit Card, PayPal, or Wire Transfer · Invoice in USD
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
            {plans.map((plan, i) => (
              <div key={i} style={{ background: i === 1 ? 'rgba(108,71,255,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${i === 1 ? 'rgba(108,71,255,0.5)' : i === 2 ? 'rgba(236,72,153,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 24, padding: 32, position: 'relative', transform: i === 1 ? 'scale(1.02)' : 'scale(1)' }}>
                {plan.tag && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: i === 1 ? 'linear-gradient(135deg,#6c47ff,#a855f7)' : 'linear-gradient(135deg,#ec4899,#a855f7)', borderRadius: 100, padding: '4px 16px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {plan.tag}
                  </div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{plan.name}</h3>
                {/* Platform Badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: i === 2 ? 'rgba(236,72,153,0.15)' : i === 1 ? 'rgba(108,71,255,0.15)' : 'rgba(255,255,255,0.07)', border: `1px solid ${i === 2 ? 'rgba(236,72,153,0.4)' : i === 1 ? 'rgba(108,71,255,0.4)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 100, padding: '4px 14px', marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>🌐</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: i === 2 ? '#f472b6' : i === 1 ? '#a78bfa' : '#c0c0e0' }}>{(plan as any).platformBadge}</span>
                </div>
                <p style={{ color: '#6060a0', fontSize: 12, marginBottom: 16 }}>{(plan as any).platformDesc}</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: i === 1 ? '#a78bfa' : i === 2 ? '#f472b6' : '#f0f0ff' }}>
                    {currency === 'INR' ? plan.inrMonth : plan.usdYear}
                  </span>
                  <span style={{ color: '#6060a0', fontSize: 14 }}>
                    {currency === 'INR' ? '/month' : '/year'}
                  </span>
                  {currency === 'USD' && (
                    <p style={{ color: '#6060a0', fontSize: 12, marginTop: 4 }}>or {plan.usdMonth}/month billed monthly</p>
                  )}
                  {currency === 'INR' && (
                    <p style={{ color: '#6060a0', fontSize: 12, marginTop: 4 }}>billed monthly · cancel anytime</p>
                  )}
                </div>
                <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: '#6c47ff', fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
                      <span style={{ color: '#c0c0e0', fontSize: 14 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => openDemo(plan.name + ' Plan — ' + (currency === 'INR' ? plan.inrMonth : plan.usdYear))}
                  style={{ width: '100%', padding: '14px 0', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', border: 'none', background: i === 1 ? 'linear-gradient(135deg,#6c47ff,#a855f7)' : i === 2 ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'rgba(255,255,255,0.08)', color: 'white' }}>
                  {plan.cta} →
                </button>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: '#6060a0', fontSize: 13, marginTop: 32 }}>
            💡 No hidden fees. Cancel anytime. {currency === 'INR' ? 'GST invoice provided for Indian businesses.' : 'All prices in USD. Indian clients switch to ₹ pricing above.'}
          </p>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '80px 24px', margin: '0 24px 80px', borderRadius: 28, background: 'linear-gradient(135deg, rgba(108,71,255,0.2), rgba(236,72,153,0.1))', border: '1px solid rgba(108,71,255,0.2)', maxWidth: 1052, marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Ready to 10x Your Marketing?
          </h2>
          <p style={{ color: '#9090b8', fontSize: 16, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Book a free demo call. We'll show you exactly how GlobalWebSaaS can work for your business — no pressure, no payment required.
          </p>
          <button onClick={() => openDemo('Professional Plan')}
            style={{ background: 'linear-gradient(135deg, #6c47ff, #ec4899)', color: 'white', border: 'none', borderRadius: 14, padding: '18px 40px', fontSize: 18, fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 50px rgba(108,71,255,0.3)' }}>
            🚀 Book My Free Demo Now
          </button>
          <p style={{ color: '#6060a0', fontSize: 13, marginTop: 16 }}>Takes 2 minutes · We call you within 2 hours · 100% Free</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <img src="/globalwebsaas-logo.png" alt="GlobalWebSaaS" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 16 }}>GlobalWebSaaS</span>
        </div>
        <p style={{ color: '#6060a0', fontSize: 13, marginBottom: 16 }}>AI-Powered Marketing Automation for Every Business Worldwide</p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          {['Features', 'Pricing', 'Reviews', 'Login', 'Dashboard Demo'].map(link => (
            <a key={link} href={link === 'Dashboard Demo' ? '/dashboard' : link === 'Login' ? '/auth/login' : `#${link.toLowerCase()}`}
              style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>{link}</a>
          ))}
        </div>
        <p style={{ color: '#40405a', fontSize: 12 }}>© 2026 GlobalWebSaaS · Built by Graicy Choure · contact@globalwebsaas.org</p>
      </footer>

      {/* MODAL */}
      {showModal && <DemoModal plan={selectedPlan} onClose={() => setShowModal(false)} />}
    </div>
  );
}

