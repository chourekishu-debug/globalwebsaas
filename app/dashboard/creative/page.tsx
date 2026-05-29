'use client';

import { useState } from 'react';

// ─── TYPES ────────────────────────────────────────────────────
interface AdCreative {
  headline: string;
  subheadline: string;
  adCopy: string;
  ctaText: string;
  hashtags: string;
  imageUrl: string;
  imagePrompt: string;
  primaryColor: string;
  textColor: string;
  platform: string;
  businessName: string;
  offer: string;
  phone: string;
}

type Platform = 'instagram' | 'facebook' | 'linkedin' | 'story';
type Tab = 'create' | 'preview' | 'export';

const PLATFORMS = [
  { id: 'instagram' as Platform, label: 'Instagram', size: '1080×1080', icon: '📸', ratio: 'aspect-square' },
  { id: 'facebook' as Platform, label: 'Facebook', size: '1200×628', icon: '👥', ratio: 'aspect-[1.91/1]' },
  { id: 'linkedin' as Platform, label: 'LinkedIn', size: '1200×627', icon: '💼', ratio: 'aspect-[1.91/1]' },
  { id: 'story' as Platform, label: 'Story', size: '1080×1920', icon: '📲', ratio: 'aspect-[9/16]' },
];

const COLOR_THEMES = [
  { name: 'Ocean', primary: '#0EA5E9', bg: '#0C4A6E', text: '#FFFFFF' },
  { name: 'Royal', primary: '#7C3AED', bg: '#2E1065', text: '#FFFFFF' },
  { name: 'Fire', primary: '#EF4444', bg: '#7F1D1D', text: '#FFFFFF' },
  { name: 'Forest', primary: '#10B981', bg: '#064E3B', text: '#FFFFFF' },
  { name: 'Gold', primary: '#D4AF37', bg: '#1C1917', text: '#FFFFFF' },
  { name: 'Rose', primary: '#DB2777', bg: '#500724', text: '#FFFFFF' },
  { name: 'Slate', primary: '#38BDF8', bg: '#0F172A', text: '#FFFFFF' },
  { name: 'Warm', primary: '#F97316', bg: '#431407', text: '#FFFFFF' },
];

const NICHES = [
  'Dental Clinic', 'Coaching Institute', 'Beauty Salon', 'Gym & Fitness',
  'Restaurant', 'Real Estate', 'Hospital', 'Jewellery Store',
];

function getDemoCreative(business: string, offer: string): Partial<AdCreative> {
  const b = business.toLowerCase();
  if (/dental|dentist|teeth/.test(b)) return {
    headline: 'Smile Brighter Today!', subheadline: 'Painless Dental Care for the Whole Family',
    adCopy: 'Say goodbye to dental anxiety! Our expert team uses the latest technology for comfortable, pain-free treatments. From routine checkups to complete smile makeovers — we\'ve got you covered. Trusted by 500+ happy families in Indore.',
    ctaText: 'Book FREE Checkup', hashtags: '#DentalCare #IndoreDentist #SmileMakeover #PainlessDentistry #HealthySmile #IndoreHealth #DentalClinic #FamilyDentist',
    offer: offer || '🦷 First Consultation FREE!', phone: '+91 98765 43210', primaryColor: '#0EA5E9',
    imagePrompt: `${business} professional dental clinic, happy smiling Indian family with perfect white teeth, blue medical theme, bright professional advertising photography`,
  };
  if (/coaching|academy|institute|classes/.test(b)) return {
    headline: 'Your Rank. Our Mission.', subheadline: 'Crack NEET/JEE/Govt Exams in 2026',
    adCopy: 'Join Indore\'s most trusted coaching institute. Expert faculty, proven methodology, and personalized attention for every student. 500+ selections in competitive exams! New batch starting soon — limited seats available.',
    ctaText: 'Join FREE Demo Class', hashtags: '#NEETCoaching #JEEPrep #IndoreCoaching #StudyMotivation #CrackNEET2026 #GovernmentExam #UPSC #MPPSCCoaching',
    offer: offer || '📚 FREE Demo Class + Study Material', phone: '+91 98765 43210', primaryColor: '#7C3AED',
    imagePrompt: `${business} coaching institute, motivated Indian students studying hard with books and laptop, purple motivational theme, professional advertising photography`,
  };
  if (/salon|beauty|spa|hair/.test(b)) return {
    headline: 'Glow Up This Weekend!', subheadline: 'Premium Beauty Services at Best Prices',
    adCopy: 'Transform your look with our expert stylists. Hair, skin, nails, and bridal services — all under one roof. Because you deserve to look and feel your absolute best! Walk-in welcome, appointments preferred.',
    ctaText: 'Book Your Session', hashtags: '#BeautySalon #IndoreSalon #HairCare #SkinCare #GlowUp #BridalMakeup #NailArt #IndoreBeauty',
    offer: offer || '💅 30% OFF on First Visit!', phone: '+91 98765 43210', primaryColor: '#DB2777',
    imagePrompt: `${business} luxury beauty salon, elegant Indian woman with perfect hair and makeup, pink glamour professional advertising photography`,
  };
  if (/gym|fitness|workout/.test(b)) return {
    headline: 'Transform Your Body!', subheadline: 'Get Fit with Expert Personal Trainers',
    adCopy: 'Stop dreaming, start doing! Join Indore\'s premier gym with modern equipment, certified personal trainers, and proven transformation programs. Your best body is just one decision away!',
    ctaText: 'Get 7-Day FREE Trial', hashtags: '#GymLife #FitnessGoals #IndoreGym #PersonalTrainer #BodyTransformation #WorkoutMotivation #FitIndia',
    offer: offer || '💪 7 Days FREE Trial!', phone: '+91 98765 43210', primaryColor: '#EF4444',
    imagePrompt: `${business} modern gym, muscular Indian person working out with dumbbells, dark dramatic lighting red accents, motivational fitness advertising photography`,
  };
  return {
    headline: `${business} — Excellence!`, subheadline: 'Trusted by Thousands in Indore',
    adCopy: `${business} offers premium services with unmatched quality. Join our growing community of satisfied customers who trust us for reliable, professional results every time.`,
    ctaText: 'Contact Us Today', hashtags: `#${business.replace(/\s+/g,'').slice(0,15)} #Indore #Excellence #Quality #Trusted #IndoreBusiness`,
    offer: offer || '🎁 Special Offer This Month!', phone: '+91 98765 43210', primaryColor: '#0EA5E9',
    imagePrompt: `${business} professional business, happy Indian customers, modern setting, professional advertising photography`,
  };
}

function AdImagePreview({ creative, platform, showOverlay }: { creative: AdCreative; platform: Platform; showOverlay: boolean }) {
  const ratios: Record<Platform, string> = { instagram: 'aspect-square', facebook: 'aspect-[1.91/1]', linkedin: 'aspect-[1.91/1]', story: 'aspect-[9/16]' };
  return (
    <div className={`relative w-full ${ratios[platform]} overflow-hidden rounded-xl shadow-2xl bg-gray-800`} style={{ maxHeight: platform === 'story' ? '480px' : 'auto' }}>
      <img src={creative.imageUrl} alt={creative.headline} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.85) 100%)' }} />
      {showOverlay && (
        <>
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div style={{ backgroundColor: creative.primaryColor }} className="text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg max-w-[60%]">{creative.offer}</div>
            <div className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">{creative.businessName}</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-white font-black text-xl leading-tight mb-1 drop-shadow-lg">{creative.headline}</h2>
            <p className="text-white/90 text-sm mb-2 drop-shadow leading-snug">{creative.subheadline}</p>
            {platform !== 'story' && <p className="text-white/70 text-xs mb-3 line-clamp-2 drop-shadow">{creative.adCopy}</p>}
            <div className="flex items-center gap-2">
              <button style={{ backgroundColor: creative.primaryColor }} className="text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">{creative.ctaText} →</button>
              {creative.phone && <span className="text-white/80 text-xs bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full">📞 {creative.phone}</span>}
            </div>
          </div>
        </>
      )}
      <div className="absolute top-2 right-2">
        <span className="text-xs bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">✨ AI Generated</span>
      </div>
    </div>
  );
}

function FacebookPreview({ creative }: { creative: AdCreative }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg max-w-sm">
      <div className="p-3 flex items-center gap-2 border-b border-gray-100">
        <div style={{ backgroundColor: creative.primaryColor }} className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">{creative.businessName[0]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{creative.businessName}</p>
          <p className="text-xs text-gray-400">Sponsored · 🌍</p>
        </div>
        <span className="text-gray-400 text-lg shrink-0">⋯</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">{creative.adCopy} <span className="text-blue-600 font-medium">See more</span></p>
      </div>
      <div className="relative aspect-[1.91/1] overflow-hidden">
        <img src={creative.imageUrl} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.75))' }} />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-black text-lg leading-tight">{creative.headline}</p>
          <p className="text-white/80 text-xs">{creative.subheadline}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
        <div><p className="text-xs text-gray-500">globalwebsaas.com</p><p className="text-sm font-bold text-gray-900">{creative.offer}</p></div>
        <button style={{ backgroundColor: creative.primaryColor }} className="text-white text-xs font-bold px-4 py-2 rounded-md shrink-0">{creative.ctaText}</button>
      </div>
      <div className="px-3 py-2 flex justify-between text-xs text-gray-400 border-t border-gray-100">
        <div className="flex gap-3"><span>👍 Like</span><span>💬 Comment</span><span>↗️ Share</span></div>
        <span>❤️ 1.2K</span>
      </div>
    </div>
  );
}

function InstagramPreview({ creative }: { creative: AdCreative }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg max-w-xs">
      <div className="p-3 flex items-center gap-2">
        <div style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }} className="w-8 h-8 rounded-full p-0.5 shrink-0">
          <div style={{ backgroundColor: creative.primaryColor }} className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold">{creative.businessName[0]}</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-900 truncate">{creative.businessName.toLowerCase().replace(/\s+/g,'_')}</p>
          <p className="text-xs text-gray-400">Sponsored</p>
        </div>
        <span className="text-gray-400 shrink-0">⋯</span>
      </div>
      <div className="relative aspect-square overflow-hidden">
        <img src={creative.imageUrl} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8))' }} />
        <div className="absolute bottom-4 left-4 right-4">
          <div style={{ backgroundColor: creative.primaryColor }} className="text-white text-xs px-3 py-1 rounded-full font-bold inline-block mb-2">{creative.offer}</div>
          <p className="text-white font-black text-xl leading-tight">{creative.headline}</p>
          <p className="text-white/80 text-sm">{creative.subheadline}</p>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex gap-4 mb-2"><span className="text-xl">❤️</span><span className="text-xl">💬</span><span className="text-xl">↗️</span><span className="text-xl ml-auto">🔖</span></div>
        <p className="text-xs font-bold text-gray-900 mb-0.5">2,847 likes</p>
        <p className="text-xs text-gray-700 line-clamp-2"><span className="font-bold">{creative.businessName.toLowerCase().replace(/\s+/g,'_')} </span>{creative.adCopy.slice(0,80)}...</p>
        <p className="text-xs text-blue-500 mt-1 line-clamp-1">{creative.hashtags.split(' ').slice(0,5).join(' ')}</p>
        <button style={{ backgroundColor: creative.primaryColor }} className="w-full text-white text-sm font-bold py-2 rounded-lg mt-2">{creative.ctaText} →</button>
      </div>
    </div>
  );
}

export default function CreativeStudioPage() {
  const [tab, setTab] = useState<Tab>('create');
  const [business, setBusiness] = useState('');
  const [offer, setOffer] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram', 'facebook']);
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [creative, setCreative] = useState<AdCreative | null>(null);
  const [activePreview, setActivePreview] = useState<Platform>('instagram');
  const [copied, setCopied] = useState('');

  async function handleGenerate() {
    if (!business.trim()) return;
    setGenerating(true);
    setCreative(null);
    try {
      const demo = getDemoCreative(business, offer);
      const imagePrompt = demo.imagePrompt || `${business} professional advertisement`;
      const encodedPrompt = encodeURIComponent(`${imagePrompt}, sharp focus, high quality commercial photography`);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1080&nologo=true&enhance=true`;
      setCreative({
        businessName: business,
        headline: demo.headline || `${business} — Excellence!`,
        subheadline: demo.subheadline || 'Trusted by Thousands in Indore',
        adCopy: demo.adCopy || 'Professional services you can trust.',
        ctaText: demo.ctaText || 'Contact Us Now',
        hashtags: demo.hashtags || '#Indore #Business #Quality',
        imageUrl,
        imagePrompt: imagePrompt,
        primaryColor: demo.primaryColor || selectedTheme.primary,
        textColor: '#FFFFFF',
        platform: selectedPlatforms[0],
        offer: demo.offer || offer || 'Special Offer!',
        phone: demo.phone || '+91 98765 43210',
      });
      setTab('preview');
    } catch (err) { console.error(err); }
    finally { setGenerating(false); }
  }

  function updateCreative(field: keyof AdCreative, value: string) {
    if (!creative) return;
    setCreative({ ...creative, [field]: value });
  }

  function regenerateImage() {
    if (!creative) return;
    const encodedPrompt = encodeURIComponent(`${creative.imagePrompt}, sharp focus, high quality commercial photography`);
    setCreative({ ...creative, imageUrl: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1080&nologo=true&enhance=true&seed=${Date.now()}` });
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">🎨 Ad Creative Studio</h1>
          <p className="text-gray-400 text-xs mt-0.5">AI generates complete ad creatives — image + copy + CTA + platform previews — ready to boost</p>
        </div>
        <div className="flex gap-2">
          {(['create', 'preview', 'export'] as Tab[]).map(t => (
            <button key={t} onClick={() => (creative || t === 'create') && setTab(t)}
              className={`text-xs px-4 py-2 rounded-lg capitalize font-medium transition-all ${tab === t ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'} ${!creative && t !== 'create' ? 'opacity-30 cursor-not-allowed' : ''}`}>
              {t === 'create' ? '✏️ Create' : t === 'preview' ? '👁️ Preview' : '📤 Export'}
            </button>
          ))}
        </div>
      </div>

      {/* CREATE TAB */}
      {tab === 'create' && (
        <div className="max-w-5xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Business / Product Name *</label>
                <input value={business} onChange={e => setBusiness(e.target.value)} placeholder="e.g. Best Dental Clinic Indore" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {NICHES.map(n => <button key={n} onClick={() => setBusiness(n + ' Indore')} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-2.5 py-1 rounded-full transition-colors">{n}</button>)}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Special Offer / Hook</label>
                <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="e.g. FREE First Consultation! or 30% OFF This Weekend" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Target Platforms</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p.id} onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                      className={`p-3 rounded-xl border text-left transition-all ${selectedPlatforms.includes(p.id) ? 'border-purple-500 bg-purple-900/30' : 'border-gray-700 bg-gray-900 hover:border-gray-500'}`}>
                      <div className="flex items-center gap-2">
                        <span>{p.icon}</span>
                        <div><p className="text-sm font-medium text-white">{p.label}</p><p className="text-xs text-gray-500">{p.size}</p></div>
                        {selectedPlatforms.includes(p.id) && <span className="ml-auto text-green-400">✓</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_THEMES.map(theme => (
                    <button key={theme.name} onClick={() => setSelectedTheme(theme)} style={{ backgroundColor: theme.primary }}
                      className={`py-2 rounded-lg text-white text-xs font-bold transition-all hover:scale-105 ${selectedTheme.name === theme.name ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-950 scale-105' : ''}`}>
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col">
              <h3 className="font-bold text-base mb-4">📦 What You Get in One Click</h3>
              <div className="space-y-3 flex-1">
                {[
                  { icon: '🖼️', title: 'AI Photo for Your Business', desc: 'Real AI-generated image matching your niche' },
                  { icon: '✍️', title: 'Headline + Subheadline', desc: 'Attention-grabbing copy that converts browsers to buyers' },
                  { icon: '📝', title: 'Full Ad Copy (150 words)', desc: 'Ready to paste in Facebook/Instagram Ads Manager' },
                  { icon: '🎯', title: 'CTA Button + Phone Overlay', desc: 'Clear action button shown on the image itself' },
                  { icon: '#️⃣', title: '8+ Hashtags', desc: 'Niche-specific hashtags for maximum organic reach' },
                  { icon: '📱', title: 'Platform Previews', desc: 'See exactly how it looks on Instagram, Facebook & Story' },
                  { icon: '✏️', title: 'Edit Everything', desc: 'Change text, colors, image after generation' },
                  { icon: '📤', title: 'Export Package', desc: 'Download image + copy for WhatsApp + LinkedIn format' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <div><p className="text-sm font-semibold text-white">{item.title}</p><p className="text-xs text-gray-400">{item.desc}</p></div>
                  </div>
                ))}
              </div>
              <button onClick={handleGenerate} disabled={!business.trim() || generating}
                className={`w-full mt-5 py-4 rounded-xl font-bold text-base transition-all ${!business.trim() || generating ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg'}`}>
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                    Generating Your Complete Ad Creative...
                  </span>
                ) : '⚡ Generate Complete Ad Creative'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW TAB */}
      {tab === 'preview' && creative && (
        <div className="flex flex-col xl:flex-row" style={{ minHeight: 'calc(100vh - 73px)' }}>
          {/* Left Edit Panel */}
          <div className="w-full xl:w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto shrink-0">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">✏️ Edit</h3>
                <button onClick={regenerateImage} className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg">🔄 New Image</button>
              </div>
              {[
                { field: 'headline', label: 'Headline', rows: 0 },
                { field: 'subheadline', label: 'Subheadline', rows: 0 },
                { field: 'offer', label: 'Offer Badge', rows: 0 },
                { field: 'ctaText', label: 'CTA Button', rows: 0 },
                { field: 'phone', label: 'Phone', rows: 0 },
                { field: 'adCopy', label: 'Ad Copy', rows: 3 },
                { field: 'hashtags', label: 'Hashtags', rows: 2 },
              ].map(({ field, label, rows }) => (
                <div key={field}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  {rows > 0 ? (
                    <textarea value={creative[field as keyof AdCreative]} onChange={e => updateCreative(field as keyof AdCreative, e.target.value)} rows={rows} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 resize-none" />
                  ) : (
                    <input value={creative[field as keyof AdCreative]} onChange={e => updateCreative(field as keyof AdCreative, e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500" />
                  )}
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Brand Color</label>
                <div className="flex gap-2">
                  <input type="color" value={creative.primaryColor} onChange={e => updateCreative('primaryColor', e.target.value)} className="w-10 h-9 rounded cursor-pointer" />
                  <input value={creative.primaryColor} onChange={e => updateCreative('primaryColor', e.target.value)} className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-300">Text Overlay on Image</span>
                <button onClick={() => setShowOverlay(!showOverlay)} className={`w-10 h-5 rounded-full transition-all relative shrink-0 ${showOverlay ? 'bg-purple-600' : 'bg-gray-600'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${showOverlay ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
              <button onClick={() => setTab('export')} className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition-colors">📤 Export Package →</button>
            </div>
          </div>

          {/* Right Preview */}
          <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
            <div className="flex gap-2 mb-6 flex-wrap">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setActivePreview(p.id)}
                  className={`text-xs px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 transition-all ${activePreview === p.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                  {p.icon} {p.label} <span className="opacity-50">{p.size}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-xs text-gray-400 mb-2">🖼️ Ad Creative with Overlay</p>
                <AdImagePreview creative={creative} platform={activePreview} showOverlay={showOverlay} />
                <div className="mt-3 flex gap-2">
                  <a href={creative.imageUrl} download target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium">⬇️ Download</a>
                  <button onClick={regenerateImage} className="flex-1 text-xs bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg">🔄 New Image</button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">{activePreview === 'instagram' || activePreview === 'story' ? '📸 Instagram Post Preview' : '👥 Facebook Ad Preview'}</p>
                {activePreview === 'instagram' || activePreview === 'story' ? <InstagramPreview creative={creative} /> : <FacebookPreview creative={creative} />}
              </div>
            </div>

            {/* Copy Package */}
            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4">📝 Complete Ad Copy Package</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'HEADLINE', color: 'text-purple-400', content: `${creative.headline}\n${creative.subheadline}` },
                  { label: 'OFFER + CTA', color: 'text-green-400', content: `${creative.offer}\nCTA: ${creative.ctaText}` },
                ].map(({ label, color, content }) => (
                  <div key={label} className="bg-gray-800 rounded-xl p-3">
                    <div className="flex justify-between mb-2">
                      <p className={`text-xs font-semibold ${color}`}>{label}</p>
                      <button onClick={() => copyText(content, label)} className="text-xs text-gray-500 hover:text-white">{copied === label ? '✅ Copied!' : '📋 Copy'}</button>
                    </div>
                    <p className="text-white text-sm whitespace-pre-line">{content}</p>
                  </div>
                ))}
                <div className="bg-gray-800 rounded-xl p-3 md:col-span-2">
                  <div className="flex justify-between mb-2">
                    <p className="text-xs font-semibold text-blue-400">AD COPY — Paste in Facebook/Instagram Ads Manager</p>
                    <button onClick={() => copyText(creative.adCopy, 'adcopy')} className="text-xs text-gray-500 hover:text-white">{copied === 'adcopy' ? '✅ Copied!' : '📋 Copy'}</button>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">{creative.adCopy}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 md:col-span-2">
                  <div className="flex justify-between mb-2">
                    <p className="text-xs font-semibold text-yellow-400">HASHTAGS</p>
                    <button onClick={() => copyText(creative.hashtags, 'hashtags')} className="text-xs text-gray-500 hover:text-white">{copied === 'hashtags' ? '✅ Copied!' : '📋 Copy'}</button>
                  </div>
                  <p className="text-gray-300 text-sm">{creative.hashtags}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT TAB */}
      {tab === 'export' && creative && (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
          <h2 className="text-xl font-bold mb-2">📤 Export Your Ad Creative Package</h2>
          <p className="text-gray-400 text-sm mb-6">Everything you need to run your ad campaign across all platforms</p>
          {[
            { icon: '🖼️', title: 'Download Ad Image', desc: 'High-res 1080×1080 image with AI generated photo', action: () => window.open(creative.imageUrl, '_blank'), btn: 'Download Image', color: 'bg-green-600 hover:bg-green-500' },
            { icon: '📋', title: 'Copy Full Ad Package', desc: 'Headline + copy + hashtags for Ads Manager', action: () => copyText(`${creative.headline}\n\n${creative.adCopy}\n\n${creative.hashtags}`, 'full'), btn: copied === 'full' ? '✅ Copied!' : 'Copy All', color: 'bg-blue-600 hover:bg-blue-500' },
            { icon: '📱', title: 'Copy WhatsApp Message', desc: 'Formatted message to blast via WhatsApp Business', action: () => copyText(`*${creative.headline}*\n\n${creative.offer}\n\n${creative.adCopy}\n\n📞 ${creative.phone}`, 'wa'), btn: copied === 'wa' ? '✅ Copied!' : 'Copy WhatsApp', color: 'bg-green-700 hover:bg-green-600' },
            { icon: '💼', title: 'Copy LinkedIn Post', desc: 'Professional format optimized for LinkedIn', action: () => copyText(`${creative.headline}\n\n${creative.subheadline}\n\n${creative.adCopy}\n\n${creative.hashtags.split(' ').slice(0,5).join(' ')}`, 'li'), btn: copied === 'li' ? '✅ Copied!' : 'Copy LinkedIn', color: 'bg-blue-800 hover:bg-blue-700' },
            { icon: '📲', title: 'Copy Instagram Caption', desc: 'With emojis and hashtags for IG post', action: () => copyText(`${creative.headline} 🔥\n\n${creative.offer}\n\n${creative.adCopy}\n\n📞 ${creative.phone}\n\n${creative.hashtags}`, 'ig'), btn: copied === 'ig' ? '✅ Copied!' : 'Copy Instagram', color: 'bg-pink-600 hover:bg-pink-500' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div><p className="font-semibold text-sm">{item.title}</p><p className="text-xs text-gray-400">{item.desc}</p></div>
              </div>
              <button onClick={item.action} className={`${item.color} text-white text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap transition-colors shrink-0`}>{item.btn}</button>
            </div>
          ))}
          <div className="bg-purple-900/20 border border-purple-600/30 rounded-xl p-4 mt-4">
            <p className="text-sm font-semibold text-purple-300 mb-1">🚀 Next Step: Boost This Ad</p>
            <p className="text-xs text-gray-400">Facebook Ads Manager → Create Campaign → Upload image → Paste ad copy → Set ₹200/day budget → Launch! Your ad will reach 5,000-15,000 people daily.</p>
          </div>
        </div>
      )}
    </div>
  );
}
