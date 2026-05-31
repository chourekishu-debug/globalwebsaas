'use client';

import { useState } from 'react';

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';

// ─── TYPES ───────────────────────────────────────────────────────────
interface AdCreative {
  headline: string;
  subheadline: string;
  tagline: string;
  offerBadge: string;
  features: string[];
  benefits: { icon: string; title: string; desc: string }[];
  pricing: { label: string; price: string; note: string }[];
  cta: string;
  ctaSecondary: string;
  trustBadges: string[];
  adCopy: string;
  hashtags: string[];
  phone: string;
  website: string;
  theme: { primary: string; accent: string; bg: string; text: string };
}

const THEMES = [
  { name: 'Deep Blue', primary: '#1a1f5e', accent: '#4f8ef7', bg: 'linear-gradient(135deg,#0d1340 0%,#1a1f5e 50%,#0f2d6b 100%)', text: '#fff' },
  { name: 'Purple Power', primary: '#2d0052', accent: '#a855f7', bg: 'linear-gradient(135deg,#1a0030 0%,#2d0052 50%,#1e0040 100%)', text: '#fff' },
  { name: 'Saffron India', primary: '#7c2d00', accent: '#f97316', bg: 'linear-gradient(135deg,#431200 0%,#7c2d00 50%,#3d1a00 100%)', text: '#fff' },
  { name: 'Emerald Pro', primary: '#052e16', accent: '#22c55e', bg: 'linear-gradient(135deg,#021a0c 0%,#052e16 50%,#023d12 100%)', text: '#fff' },
  { name: 'Crimson Bold', primary: '#450a0a', accent: '#ef4444', bg: 'linear-gradient(135deg,#2a0505 0%,#450a0a 50%,#350808 100%)', text: '#fff' },
];

const BUSINESS_TYPES = [
  'Dental Clinic', 'Beauty Salon', 'Gym & Fitness', 'Restaurant', 'Real Estate',
  'Hospital / Clinic', 'Jewellery Store', 'Clothing Store', 'Coaching Institute',
  'E-commerce', 'Agency', 'Hotel / Resort', 'Pharmacy', 'Other',
];

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', size: '1080×1080', ratio: '1/1' },
  { id: 'facebook', label: 'Facebook', size: '1200×628', ratio: '1.91/1' },
  { id: 'story', label: 'Story', size: '1080×1920', ratio: '9/16' },
  { id: 'linkedin', label: 'LinkedIn', size: '1200×627', ratio: '1.91/1' },
];

// ─── MOCK GENERATION (replace with real API call) ─────────────────────
async function generateCreative(form: Record<string, string>): Promise<AdCreative> {
  const prompt = `You are an expert Indian ad creative writer. Create a rich, detailed ad creative for this business:

Business: ${form.businessName}
Type: ${form.businessType}
City: ${form.city}
Offer: ${form.offer || 'Best quality service'}
Target: ${form.target || 'Local customers'}
Phone: ${form.phone || '+91 98765 43210'}
Website: ${form.website || 'www.business.com'}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "headline": "Powerful 4-6 word headline",
  "subheadline": "Supporting benefit statement in 8-12 words",
  "tagline": "Short memorable tagline",
  "offerBadge": "Special offer text like '50% OFF' or 'FREE Consultation'",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6"],
  "benefits": [
    {"icon": "⚡", "title": "Benefit Title", "desc": "Short description"},
    {"icon": "🏆", "title": "Benefit Title", "desc": "Short description"},
    {"icon": "💎", "title": "Benefit Title", "desc": "Short description"},
    {"icon": "🎯", "title": "Benefit Title", "desc": "Short description"}
  ],
  "pricing": [
    {"label": "Basic", "price": "₹999", "note": "Perfect for starters"},
    {"label": "Pro", "price": "₹1,999", "note": "Most popular choice"},
    {"label": "Premium", "price": "₹3,999", "note": "Complete package"}
  ],
  "cta": "Primary call to action text",
  "ctaSecondary": "Secondary action text",
  "trustBadges": ["Badge 1", "Badge 2", "Badge 3", "Badge 4"],
  "adCopy": "2-3 sentence compelling ad copy for social media",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5", "#Tag6", "#Tag7", "#Tag8"],
  "phone": "${form.phone || '+91 98765 43210'}",
  "website": "${form.website || 'www.business.com'}"
}`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      }),
    });
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    // Fallback demo data
    return {
      headline: `${form.businessName} Excellence`,
      subheadline: 'Delivering World-Class Service Right in Your City',
      tagline: 'Everything You Need. All in One Place.',
      offerBadge: 'FREE Consultation',
      features: ['Expert Professionals', 'Latest Technology', 'Affordable Prices', 'Quick Results', 'Trusted by 1000+', '24/7 Support'],
      benefits: [
        { icon: '⚡', title: 'Quick Service', desc: 'Same day results' },
        { icon: '🏆', title: 'Award Winning', desc: 'Best in city' },
        { icon: '💎', title: 'Premium Quality', desc: 'No compromise' },
        { icon: '🎯', title: 'Results Driven', desc: '100% satisfaction' },
      ],
      pricing: [
        { label: 'Basic', price: '₹999', note: 'Perfect for starters' },
        { label: 'Pro', price: '₹1,999', note: 'Most popular' },
        { label: 'Premium', price: '₹3,999', note: 'Complete package' },
      ],
      cta: 'Book Free Consultation',
      ctaSecondary: 'Call Now',
      trustBadges: ['Trusted by 1000+', 'ISO Certified', '5★ Rating', 'Since 2015'],
      adCopy: `Looking for the best ${form.businessType} in ${form.city}? ${form.businessName} offers premium services at unbeatable prices. Book your free consultation today!`,
      hashtags: [`#${form.businessType?.replace(/\s/g, '')}`, `#${form.city}`, '#BestInCity', '#QualityService', '#TrustedBrand', '#BookNow', '#India', '#LocalBusiness'],
      phone: form.phone || '+91 98765 43210',
      website: form.website || 'www.business.com',
      theme: THEMES[0],
    };
  }
}

// ─── AD CREATIVE RENDERER ─────────────────────────────────────────────
function AdCreativeCard({ creative, theme, platform, businessName, city }: {
  creative: AdCreative; theme: typeof THEMES[0]; platform: typeof PLATFORMS[0]; businessName: string; city: string;
}) {
  const isStory = platform.id === 'story';
  const isSquare = platform.id === 'instagram';

  return (
    <div style={{
      background: theme.bg,
      color: theme.text,
      width: '100%',
      aspectRatio: platform.ratio,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Decorative top accent */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}88, ${theme.accent})`, flexShrink: 0 }} />

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `${theme.accent}15`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: `${theme.accent}10`, pointerEvents: 'none' }} />

      <div style={{ padding: isStory ? '20px 20px' : '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: isStory ? 12 : 16, position: 'relative', zIndex: 1 }}>

        {/* Brand + Offer Badge Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: isStory ? 13 : 12, fontWeight: 700, color: theme.accent, letterSpacing: 2, textTransform: 'uppercase' }}>{businessName}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{city}</div>
          </div>
          {creative.offerBadge && (
            <div style={{ background: theme.accent, color: '#fff', fontSize: 11, fontWeight: 800, padding: '5px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1 }}>
              {creative.offerBadge}
            </div>
          )}
        </div>

        {/* Main Headline */}
        <div>
          <h1 style={{ fontSize: isStory ? 28 : isSquare ? 26 : 24, fontWeight: 900, lineHeight: 1.1, margin: 0, letterSpacing: '-0.5px' }}>
            {creative.headline}
          </h1>
          <p style={{ fontSize: isStory ? 14 : 13, color: 'rgba(255,255,255,0.75)', margin: '8px 0 0', lineHeight: 1.4 }}>
            {creative.subheadline}
          </p>
          {creative.tagline && (
            <div style={{ marginTop: 8, display: 'inline-block', borderTop: `2px solid ${theme.accent}`, borderBottom: `2px solid ${theme.accent}`, padding: '4px 0', fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>
              {creative.tagline}
            </div>
          )}
        </div>

        {/* Benefits Grid */}
        {creative.benefits?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {creative.benefits.map((b, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{b.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features checklist */}
        {creative.features?.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>What You Get</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 5 }}>
              {creative.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                  <span style={{ color: theme.accent, fontWeight: 700, fontSize: 14 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Row */}
        {creative.pricing?.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Affordable Plans</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {creative.pricing.map((p, i) => (
                <div key={i} style={{
                  background: i === 1 ? theme.accent : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${i === 1 ? theme.accent : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: 10, padding: '10px 8px', textAlign: 'center',
                }}>
                  {i === 1 && <div style={{ fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>⭐ Popular</div>}
                  <div style={{ fontSize: 11, color: i === 1 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)' }}>{p.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{p.price}</div>
                  <div style={{ fontSize: 10, color: i === 1 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', marginTop: 3 }}>{p.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
          <div style={{ flex: 2, background: theme.accent, borderRadius: 50, padding: '12px 0', textAlign: 'center', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            🚀 {creative.cta}
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 50, padding: '12px 0', textAlign: 'center', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            📞 {creative.ctaSecondary}
          </div>
        </div>

        {/* Trust badges */}
        {creative.trustBadges?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {creative.trustBadges.map((b, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '3px 10px', fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
                ✓ {b}
              </div>
            ))}
          </div>
        )}

        {/* Footer — contact */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>📞 {creative.phone}</div>
          <div style={{ fontSize: 12, color: theme.accent, fontWeight: 600 }}>🌐 {creative.website}</div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${theme.accent}, ${theme.primary})`, flexShrink: 0 }} />
    </div>
  );
}

// ─── COPY PANEL ───────────────────────────────────────────────────────
function CopyPanel({ creative }: { creative: AdCreative }) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const CopyBtn = ({ text, label, k }: { text: string; label: string; k: string }) => (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
        <button
          onClick={() => copy(text, k)}
          style={{ background: copied === k ? '#22c55e22' : '#1e293b', border: `1px solid ${copied === k ? '#22c55e' : '#334155'}`, borderRadius: 6, padding: '4px 10px', fontSize: 11, color: copied === k ? '#22c55e' : '#94a3b8', cursor: 'pointer' }}>
          {copied === k ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  );

  return (
    <div>
      <CopyBtn text={creative.adCopy} label="Ad Copy" k="copy" />
      <CopyBtn text={creative.headline} label="Headline" k="headline" />
      <CopyBtn text={creative.subheadline} label="Subheadline" k="sub" />
      <CopyBtn text={creative.cta} label="CTA" k="cta" />
      <CopyBtn text={creative.hashtags?.join(' ')} label="Hashtags" k="hashtags" />
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────
export default function GenerateCreativePage() {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [creative, setCreative] = useState<AdCreative | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [activeTab, setActiveTab] = useState<'creative' | 'copy'>('creative');

  const [form, setForm] = useState({
    businessName: '', businessType: '', city: '', offer: '',
    target: '', phone: '', website: '',
  });

  function update(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function generate() {
    if (!form.businessName || !form.businessType) return;
    setLoading(true);
    try {
      const result = await generateCreative(form);
      setCreative(result);
      setStep('result');
    } finally {
      setLoading(false);
    }
  }

  // ── FORM STEP ──
  if (step === 'form') {
    return (
      <div style={{ minHeight: '100vh', background: '#07070f', color: '#f0f0ff', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,71,255,0.12)', border: '1px solid rgba(108,71,255,0.3)', borderRadius: 100, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6c47ff', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>AI Creative Studio</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', margin: '0 0 8px' }}>
              Generate Rich Ad Creatives
            </h1>
            <p style={{ color: '#6060a0', fontSize: 15, margin: 0 }}>
              AI builds a full poster-style creative — headline, features, pricing, CTA, trust badges & more
            </p>
          </div>

          {/* Form Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 32 }}>

            {/* Business Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9090b8', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Business Name *</label>
              <input
                value={form.businessName}
                onChange={e => update('businessName', e.target.value)}
                placeholder="e.g. Bright Smile Dental Clinic"
                style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '12px 16px', color: '#f0f0ff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Business Type */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9090b8', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Business Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                {BUSINESS_TYPES.map(bt => (
                  <button key={bt} onClick={() => update('businessType', bt)}
                    style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${form.businessType === bt ? '#6c47ff' : '#1e293b'}`, background: form.businessType === bt ? 'rgba(108,71,255,0.2)' : 'transparent', color: form.businessType === bt ? '#a78bfa' : '#64748b', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { key: 'city', label: 'City', placeholder: 'e.g. Indore' },
                { key: 'phone', label: 'Phone / WhatsApp', placeholder: '+91 98765 43210' },
                { key: 'website', label: 'Website', placeholder: 'www.yourbusiness.com' },
                { key: 'target', label: 'Target Audience', placeholder: 'e.g. Young professionals' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#9090b8', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={e => update(key, e.target.value)}
                    placeholder={placeholder}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: '10px 14px', color: '#f0f0ff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>

            {/* Offer */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9090b8', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Special Offer / USP</label>
              <input
                value={form.offer}
                onChange={e => update('offer', e.target.value)}
                placeholder="e.g. Free consultation for first visit, 50% OFF this month"
                style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: '10px 14px', color: '#f0f0ff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Theme Picker */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#9090b8', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Creative Theme</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {THEMES.map((t, i) => (
                  <button key={i} onClick={() => setSelectedTheme(i)}
                    style={{ flex: 1, padding: '10px 8px', borderRadius: 10, border: `2px solid ${selectedTheme === i ? t.accent : '#1e293b'}`, background: t.primary, cursor: 'pointer', fontSize: 11, color: '#fff', fontWeight: 600 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.accent, margin: '0 auto 6px' }} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading || !form.businessName || !form.businessType}
              style={{ width: '100%', padding: '16px 0', borderRadius: 14, background: !form.businessName || !form.businessType ? '#1e293b' : 'linear-gradient(135deg,#6c47ff,#a855f7)', color: 'white', border: 'none', fontSize: 16, fontWeight: 800, cursor: !form.businessName || !form.businessType ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? '✨ Generating your creative...' : '🚀 Generate Rich Ad Creative'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT STEP ──
  const theme = THEMES[selectedTheme];
  const platform = PLATFORMS[selectedPlatform];

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#f0f0ff', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <button onClick={() => setStep('form')} style={{ background: 'none', border: '1px solid #1e293b', borderRadius: 8, padding: '6px 14px', color: '#64748b', cursor: 'pointer', fontSize: 13, marginBottom: 8 }}>
              ← Back
            </button>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Your Ad Creative</h2>
            <p style={{ margin: 0, color: '#6060a0', fontSize: 14 }}>{form.businessName} · {form.city}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={generate}
              style={{ background: 'rgba(108,71,255,0.15)', border: '1px solid rgba(108,71,255,0.3)', borderRadius: 10, padding: '10px 20px', color: '#a78bfa', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              🔄 Regenerate
            </button>
            <button
              style={{ background: 'linear-gradient(135deg,#6c47ff,#a855f7)', border: 'none', borderRadius: 10, padding: '10px 20px', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
              ⬇ Download
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

          {/* LEFT — Creative Preview */}
          <div>
            {/* Platform Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {PLATFORMS.map((p, i) => (
                <button key={i} onClick={() => setSelectedPlatform(i)}
                  style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${selectedPlatform === i ? '#6c47ff' : '#1e293b'}`, background: selectedPlatform === i ? 'rgba(108,71,255,0.15)' : 'transparent', color: selectedPlatform === i ? '#a78bfa' : '#64748b', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  {p.label}
                  <span style={{ marginLeft: 6, fontSize: 11, color: '#475569' }}>{p.size}</span>
                </button>
              ))}
            </div>

            {/* Theme Row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {THEMES.map((t, i) => (
                <button key={i} onClick={() => setSelectedTheme(i)}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: t.accent, border: `3px solid ${selectedTheme === i ? '#fff' : 'transparent'}`, cursor: 'pointer' }}
                  title={t.name} />
              ))}
              <span style={{ fontSize: 12, color: '#475569', alignSelf: 'center', marginLeft: 4 }}>Theme</span>
            </div>

            {/* Creative */}
            <div style={{ maxWidth: 540 }}>
              {creative && (
                <AdCreativeCard
                  creative={creative}
                  theme={theme}
                  platform={platform}
                  businessName={form.businessName}
                  city={form.city}
                />
              )}
            </div>
          </div>

          {/* RIGHT — Copy Panel */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {(['creative', 'copy'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${activeTab === tab ? '#6c47ff' : '#1e293b'}`, background: activeTab === tab ? 'rgba(108,71,255,0.15)' : 'transparent', color: activeTab === tab ? '#a78bfa' : '#64748b', fontSize: 13, cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' }}>
                  {tab === 'creative' ? '🎨 Details' : '📝 Copy & Text'}
                </button>
              ))}
            </div>

            {activeTab === 'creative' && creative && (
              <div>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Features Included</div>
                  {creative.features?.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < creative.features.length - 1 ? '1px solid #1e293b' : 'none', fontSize: 13, color: '#cbd5e1' }}>
                      <span style={{ color: '#22c55e', fontSize: 14 }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Trust Badges</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {creative.trustBadges?.map((b, i) => (
                      <span key={i} style={{ background: '#1e293b', borderRadius: 100, padding: '4px 12px', fontSize: 12, color: '#94a3b8' }}>✓ {b}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'copy' && creative && <CopyPanel creative={creative} />}
          </div>
        </div>
      </div>
    </div>
  );
}
