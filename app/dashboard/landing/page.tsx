'use client';

import { useState, useRef } from 'react';

// ─── TYPES ────────────────────────────────────────────────────
interface Section {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'cta' | 'gallery' | 'faq';
  visible: boolean;
}

interface PageData {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  ctaText: string;
  ctaSecondary: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
  fontStyle: 'modern' | 'elegant' | 'bold' | 'friendly';
  features: { icon: string; title: string; desc: string }[];
  testimonials: { name: string; text: string; rating: number; role: string }[];
  faqs: { q: string; a: string }[];
  offer: string;
  badge: string;
  heroImage: string;
  sections: Section[];
}

type EditTab = 'content' | 'design' | 'sections';

const DEFAULT_SECTIONS: Section[] = [
  { id: 'hero', type: 'hero', visible: true },
  { id: 'features', type: 'features', visible: true },
  { id: 'testimonials', type: 'testimonials', visible: true },
  { id: 'pricing', type: 'pricing', visible: false },
  { id: 'faq', type: 'faq', visible: true },
  { id: 'cta', type: 'cta', visible: true },
];

const FONT_STYLES = {
  modern: { heading: 'font-sans font-bold tracking-tight', body: 'font-sans' },
  elegant: { heading: 'font-serif font-semibold tracking-wide', body: 'font-serif' },
  bold: { heading: 'font-sans font-black tracking-tighter uppercase', body: 'font-sans font-medium' },
  friendly: { heading: 'font-sans font-bold', body: 'font-sans' },
};

const COLOR_PRESETS = [
  { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#0369A1', bg: '#F0F9FF', text: '#0C4A6E' },
  { name: 'Royal Purple', primary: '#7C3AED', secondary: '#5B21B6', bg: '#F5F3FF', text: '#2E1065' },
  { name: 'Emerald', primary: '#10B981', secondary: '#065F46', bg: '#ECFDF5', text: '#064E3B' },
  { name: 'Crimson', primary: '#DC2626', secondary: '#991B1B', bg: '#FFF5F5', text: '#7F1D1D' },
  { name: 'Gold Luxury', primary: '#D4AF37', secondary: '#92400E', bg: '#1C1917', text: '#F5F5F4' },
  { name: 'Hot Pink', primary: '#DB2777', secondary: '#9D174D', bg: '#FDF2F8', text: '#500724' },
  { name: 'Indigo', primary: '#4F46E5', secondary: '#3730A3', bg: '#EEF2FF', text: '#1E1B4B' },
  { name: 'Slate Dark', primary: '#38BDF8', secondary: '#0284C7', bg: '#0F172A', text: '#E2E8F0' },
];

// ─── AI GENERATOR ─────────────────────────────────────────────
async function generatePageWithAI(businessInput: string): Promise<PageData> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tool: 'landing-page',
      business: businessInput,
      platform: 'Website',
      tone: 'Professional'
    })
  });

  const data = await response.json();

  if (data?.result && typeof data.result === 'object') {
    const r = data.result;
    return {
      businessName: r.businessName || businessInput,
      tagline: r.tagline || `The Best ${businessInput} in Your City`,
      description: r.description || `We provide exceptional services with a focus on quality and customer satisfaction. Trusted by thousands of happy customers.`,
      phone: r.phone || '+91 98765 43210',
      email: r.email || 'info@yourbusiness.com',
      address: r.address || 'Indore, Madhya Pradesh',
      ctaText: r.ctaText || 'Book Free Consultation',
      ctaSecondary: r.ctaSecondary || 'Learn More',
      primaryColor: r.primaryColor || '#0EA5E9',
      secondaryColor: r.secondaryColor || '#0369A1',
      bgColor: r.bgColor || '#F0F9FF',
      textColor: r.textColor || '#0C4A6E',
      fontStyle: r.fontStyle || 'modern',
      offer: r.offer || 'Special Offer: First consultation FREE!',
      badge: r.badge || '⭐ Trusted by 500+ Customers',
      heroImage: '',
      features: r.features || [
        { icon: '✅', title: 'Expert Team', desc: 'Years of experience in delivering quality results' },
        { icon: '🏆', title: 'Proven Results', desc: 'Track record of satisfied customers across the city' },
        { icon: '💰', title: 'Best Value', desc: 'Premium quality services at competitive prices' },
        { icon: '📞', title: '24/7 Support', desc: 'Always available to help you whenever you need us' },
      ],
      testimonials: r.testimonials || [
        { name: 'Rajesh Sharma', role: 'Customer', text: 'Absolutely amazing service! Highly recommended to everyone.', rating: 5 },
        { name: 'Priya Patel', role: 'Regular Client', text: 'Best in Indore! Professional team and great results every time.', rating: 5 },
        { name: 'Amit Verma', role: 'Happy Customer', text: 'Trusted them completely. Will definitely come back again!', rating: 5 },
      ],
      faqs: r.faqs || [
        { q: 'What services do you offer?', a: 'We offer a comprehensive range of services tailored to meet your specific needs and requirements.' },
        { q: 'How can I book an appointment?', a: 'You can book an appointment by calling us, WhatsApp, or filling out the form on this page.' },
        { q: 'What are your working hours?', a: 'We are open Monday to Saturday, 9 AM to 7 PM. Sunday by appointment only.' },
        { q: 'Do you offer home visits?', a: 'Yes, we offer home visits for select services. Please contact us for more details.' },
      ],
      sections: DEFAULT_SECTIONS,
    };
  }

  // Fallback demo data
  return generateDemoData(businessInput);
}

function generateDemoData(businessInput: string): PageData {
  const b = businessInput.trim();
  const lower = b.toLowerCase();

  let config = {
    tagline: `Your Trusted ${b} in Indore`,
    description: `We deliver exceptional results with professional expertise. Join thousands of satisfied customers who trust us for quality service.`,
    ctaText: 'Book Free Consultation',
    ctaSecondary: 'Call Us Now',
    offer: '🎁 First Visit FREE! Limited time offer.',
    badge: '⭐ 500+ Happy Customers',
    primaryColor: '#0EA5E9',
    secondaryColor: '#0369A1',
    bgColor: '#F0F9FF',
    textColor: '#0C4A6E',
    features: [
      { icon: '✅', title: 'Expert Team', desc: 'Highly qualified professionals with years of experience' },
      { icon: '🏆', title: 'Proven Results', desc: '500+ satisfied customers across Indore' },
      { icon: '💰', title: 'Best Pricing', desc: 'Quality services at competitive prices' },
      { icon: '📞', title: 'Easy Booking', desc: 'Book online, WhatsApp or walk-in anytime' },
    ],
    testimonials: [
      { name: 'Rajesh Sharma', role: 'Indore', text: `${b} is simply the best! Amazing service and professional team.`, rating: 5 },
      { name: 'Priya Patel', role: 'Vijay Nagar', text: 'Trusted them completely. Results exceeded my expectations!', rating: 5 },
      { name: 'Amit Gupta', role: 'Palasia', text: 'Excellent experience from start to finish. Highly recommended!', rating: 5 },
    ],
    faqs: [
      { q: 'Where are you located?', a: 'We are located in Indore, Madhya Pradesh. Contact us for exact address.' },
      { q: 'How to book an appointment?', a: 'Call, WhatsApp or fill the form below. We respond within 30 minutes.' },
      { q: 'What are your timings?', a: 'Monday to Saturday: 9 AM - 7 PM. Sunday: By appointment.' },
      { q: 'Do you offer home visits?', a: 'Yes! Home visits available for select services. Contact us for details.' },
    ],
  };

  if (/dental|dentist|teeth|tooth/.test(lower)) {
    config = { ...config, tagline: 'Painless Dental Care for Your Family', description: 'Modern dental clinic with latest technology. Specializing in painless treatments, cosmetic dentistry, and complete family dental care.', ctaText: 'Book Free Checkup', offer: '🦷 FREE Dental Checkup This Month!', badge: '🏥 10+ Years of Trusted Care', primaryColor: '#0EA5E9', bgColor: '#F0F9FF', features: [{ icon: '😁', title: 'Painless Treatments', desc: 'Advanced techniques for comfortable, pain-free procedures' }, { icon: '✨', title: 'Cosmetic Dentistry', desc: 'Teeth whitening, braces, veneers and smile makeovers' }, { icon: '👨‍👩‍👧', title: 'Family Dentistry', desc: 'Dental care for all ages from children to seniors' }, { icon: '🚨', title: 'Emergency Care', desc: '24/7 emergency dental services available' }] };
  } else if (/coaching|academy|institute|classes/.test(lower)) {
    config = { ...config, tagline: 'Crack NEET/JEE/Govt Exams in 2026', description: `${b} has helped 500+ students achieve their dreams. Expert faculty, proven methodology, and personalized attention for every student.`, ctaText: 'Join Free Demo Class', offer: '📚 FREE Demo Class + Study Material!', badge: '🏆 500+ Students Selected', primaryColor: '#7C3AED', bgColor: '#F5F3FF', textColor: '#2E1065', features: [{ icon: '👨‍🏫', title: 'Expert Faculty', desc: 'IIT/AIIMS qualified teachers with 10+ years experience' }, { icon: '📊', title: 'Proven Results', desc: '90% success rate in competitive exams' }, { icon: '📱', title: 'Hybrid Classes', desc: 'Online + Offline flexible learning options' }, { icon: '📝', title: 'Free Test Series', desc: 'Weekly mock tests with detailed performance analysis' }] };
  } else if (/salon|beauty|spa|hair|parlour/.test(lower)) {
    config = { ...config, tagline: 'Look Beautiful, Feel Confident', description: `${b} is Indore's premium beauty destination. Expert stylists, luxury treatments, and a relaxing ambiance for your complete beauty experience.`, ctaText: 'Book Your Session', offer: '💅 30% OFF on First Visit!', badge: '✨ 1000+ Happy Clients', primaryColor: '#DB2777', bgColor: '#FDF2F8', textColor: '#500724', features: [{ icon: '💇', title: 'Hair Styling', desc: 'Cuts, coloring, keratin, and all hair treatments' }, { icon: '✨', title: 'Skin Care', desc: 'Facials, cleanup, brightening and anti-aging treatments' }, { icon: '💅', title: 'Nail Art', desc: 'Manicure, pedicure, nail extensions and designs' }, { icon: '👰', title: 'Bridal Package', desc: 'Complete bridal makeup and styling packages' }] };
  } else if (/gym|fitness|workout/.test(lower)) {
    config = { ...config, tagline: 'Transform Your Body. Transform Your Life.', description: `${b} is Indore's premier fitness center with modern equipment, expert trainers, and proven transformation programs.`, ctaText: 'Get 7-Day Free Trial', offer: '💪 7 Days FREE Trial!', badge: '🏋️ 300+ Members Transformed', primaryColor: '#EF4444', bgColor: '#0F172A', textColor: '#F1F5F9', features: [{ icon: '🏋️', title: 'Modern Equipment', desc: 'State-of-the-art machines for every muscle group' }, { icon: '👨‍💼', title: 'Personal Trainers', desc: 'Certified trainers who create personalized workout plans' }, { icon: '🥗', title: 'Diet Planning', desc: 'Custom nutrition plans to accelerate your results' }, { icon: '📱', title: 'Progress Tracking', desc: 'Monthly body measurements and progress photos' }] };
  } else if (/restaurant|food|dhaba|cafe/.test(lower)) {
    config = { ...config, tagline: 'Authentic Flavours, Unforgettable Memories', description: `${b} brings you the finest culinary experience in Indore. Fresh ingredients, traditional recipes, and warm hospitality.`, ctaText: 'Reserve Your Table', offer: '🍽️ 20% OFF on First Order!', badge: '⭐ 4.8/5 Rating on Zomato', primaryColor: '#DC2626', bgColor: '#FFF5F5', textColor: '#7F1D1D', features: [{ icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Trained culinary professionals with 15+ years experience' }, { icon: '🌿', title: 'Fresh Ingredients', desc: 'Daily sourced fresh vegetables, meats and spices' }, { icon: '🏠', title: 'Cozy Ambiance', desc: 'Perfect setting for family dinners and celebrations' }, { icon: '🚗', title: 'Home Delivery', desc: 'Fast delivery within 5 km radius' }] };
  }

  return {
    businessName: b,
    phone: '+91 98765 43210',
    email: `info@${b.toLowerCase().replace(/\s+/g, '')}.com`,
    address: 'Indore, Madhya Pradesh',
    fontStyle: 'modern',
    heroImage: '',
    sections: DEFAULT_SECTIONS,
    ...config,
  };
}

// ─── PREVIEW COMPONENT ────────────────────────────────────────
function LandingPagePreview({ page, scale = 1 }: { page: PageData; scale?: number }) {
  const font = FONT_STYLES[page.fontStyle];
  const visibleSections = page.sections.filter(s => s.visible);
  const isDark = page.bgColor.startsWith('#0') || page.bgColor.startsWith('#1') || page.bgColor.startsWith('#2');
  const textMuted = isDark ? 'opacity-60' : 'opacity-70';

  return (
    <div style={{ backgroundColor: page.bgColor, color: page.textColor, fontFamily: 'system-ui' }} className="w-full">
      {/* NAV */}
      <nav style={{ backgroundColor: page.primaryColor }} className="px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="text-white font-bold text-lg">{page.businessName}</div>
        <div className="flex gap-3">
          <a href={`tel:${page.phone}`} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} className="text-white text-xs px-3 py-1.5 rounded-full hidden sm:block">
            📞 {page.phone}
          </a>
          <button style={{ backgroundColor: page.bgColor, color: page.primaryColor }} className="text-xs px-4 py-1.5 rounded-full font-bold">
            {page.ctaText}
          </button>
        </div>
      </nav>

      {/* HERO */}
      {visibleSections.find(s => s.type === 'hero') && (
        <section className="px-6 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, ${page.primaryColor}, transparent 50%), radial-gradient(circle at 80% 20%, ${page.secondaryColor}, transparent 50%)` }} />
          <div className="relative z-10 max-w-3xl mx-auto">
            {page.badge && (
              <div style={{ backgroundColor: page.primaryColor + '20', color: page.primaryColor, border: `1px solid ${page.primaryColor}40` }} className="inline-block text-xs px-4 py-1.5 rounded-full mb-4 font-medium">
                {page.badge}
              </div>
            )}
            <h1 className={`text-3xl md:text-5xl mb-4 leading-tight ${font.heading}`} style={{ color: page.textColor }}>
              {page.tagline}
            </h1>
            <p className={`text-base md:text-lg mb-6 max-w-2xl mx-auto ${textMuted} ${font.body}`}>
              {page.description}
            </p>
            {page.offer && (
              <div style={{ backgroundColor: page.primaryColor + '15', border: `1px dashed ${page.primaryColor}` }} className="inline-block px-6 py-2 rounded-lg mb-6 text-sm font-semibold" style2={{ color: page.primaryColor }}>
                <span style={{ color: page.primaryColor }}>{page.offer}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button style={{ backgroundColor: page.primaryColor }} className="text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg hover:opacity-90 transition-opacity">
                {page.ctaText}
              </button>
              <button style={{ border: `2px solid ${page.primaryColor}`, color: page.primaryColor }} className="px-8 py-3.5 rounded-xl font-semibold text-base hover:opacity-80 transition-opacity bg-transparent">
                {page.ctaSecondary}
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs opacity-60">
              <span>✓ No Commitment</span>
              <span>✓ Free Consultation</span>
              <span>✓ Instant Response</span>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      {visibleSections.find(s => s.type === 'features') && (
        <section className="px-6 py-14" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl md:text-3xl text-center mb-2 ${font.heading}`}>Why Choose {page.businessName}?</h2>
            <p className={`text-center mb-10 text-sm ${textMuted}`}>We go above and beyond for every customer</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {page.features.map((f, i) => (
                <div key={i} style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white', border: `1px solid ${page.primaryColor}20` }} className="p-4 rounded-xl text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className={`text-sm font-bold mb-1 ${font.heading}`}>{f.title}</h3>
                  <p className={`text-xs ${textMuted}`}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {visibleSections.find(s => s.type === 'testimonials') && (
        <section className="px-6 py-14">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl md:text-3xl text-center mb-2 ${font.heading}`}>What Our Customers Say</h2>
            <p className={`text-center mb-10 text-sm ${textMuted}`}>Real reviews from real customers</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {page.testimonials.map((t, i) => (
                <div key={i} style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white', borderLeft: `3px solid ${page.primaryColor}` }} className="p-5 rounded-xl shadow-sm">
                  <div className="flex mb-2">{'⭐'.repeat(t.rating)}</div>
                  <p className={`text-sm mb-3 italic ${textMuted}`}>"{t.text}"</p>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className={`text-xs ${textMuted}`}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {visibleSections.find(s => s.type === 'faq') && (
        <section className="px-6 py-14" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className={`text-2xl md:text-3xl text-center mb-10 ${font.heading}`}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {page.faqs.map((faq, i) => (
                <div key={i} style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'white', border: `1px solid ${page.primaryColor}15` }} className="p-4 rounded-xl">
                  <h3 className={`text-sm font-bold mb-2 ${font.heading}`} style={{ color: page.primaryColor }}>Q: {faq.q}</h3>
                  <p className={`text-sm ${textMuted}`}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      {visibleSections.find(s => s.type === 'cta') && (
        <section style={{ backgroundColor: page.primaryColor }} className="px-6 py-14 text-center text-white">
          <h2 className={`text-2xl md:text-3xl mb-3 ${font.heading}`}>Ready to Get Started?</h2>
          <p className="opacity-80 mb-6 text-sm max-w-lg mx-auto">Contact us today and take the first step towards the results you deserve.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button style={{ backgroundColor: 'white', color: page.primaryColor }} className="px-8 py-3.5 rounded-xl font-bold text-base shadow-lg">
              {page.ctaText}
            </button>
            <a href={`tel:${page.phone}`} className="border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold text-base bg-transparent">
              📞 Call Now
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm opacity-80">
            <span>📞 {page.phone}</span>
            <span>📧 {page.email}</span>
            <span>📍 {page.address}</span>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : page.secondaryColor }} className="px-6 py-6 text-center text-white">
        <p className="text-sm font-bold mb-1">{page.businessName}</p>
        <p className="text-xs opacity-60">© 2026 All rights reserved | Built with GlobalWebSaaS</p>
      </footer>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function LandingPageBuilder() {
  const [step, setStep] = useState<'input' | 'edit' | 'preview'>('input');
  const [businessInput, setBusinessInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [page, setPage] = useState<PageData | null>(null);
  const [editTab, setEditTab] = useState<EditTab>('content');
  const [editingFeature, setEditingFeature] = useState<number | null>(null);
  const [editingFaq, setEditingFaq] = useState<number | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  async function handleGenerate() {
    if (!businessInput.trim()) return;
    setGenerating(true);
    try {
      const data = await generatePageWithAI(businessInput);
      setPage(data);
      setStep('edit');
    } catch {
      const data = generateDemoData(businessInput);
      setPage(data);
      setStep('edit');
    } finally {
      setGenerating(false);
    }
  }

  function updatePage(updates: Partial<PageData>) {
    setPage(prev => prev ? { ...prev, ...updates } : null);
  }

  function applyColorPreset(preset: typeof COLOR_PRESETS[0]) {
    updatePage({ primaryColor: preset.primary, secondaryColor: preset.secondary, bgColor: preset.bg, textColor: preset.text });
  }

  function toggleSection(id: string) {
    if (!page) return;
    updatePage({
      sections: page.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s)
    });
  }

  function exportHTML() {
    if (!previewRef.current) return;
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${page?.businessName}</title><script src="https://cdn.tailwindcss.com"></script></head><body>${previewRef.current.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page?.businessName?.replace(/\s+/g, '-').toLowerCase()}-landing.html`;
    a.click();
  }

  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          <div className="text-5xl mb-4">🌐</div>
          <h1 className="text-3xl font-bold mb-2">AI Landing Page Builder</h1>
          <p className="text-gray-400 mb-8">Type your business name — AI generates a complete, professional landing page in seconds</p>

          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
            <textarea
              value={businessInput}
              onChange={e => setBusinessInput(e.target.value)}
              placeholder="e.g. Best Dental Clinic Indore&#10;or: PSC Coaching Academy Indore&#10;or: Hyfy Salon Indore&#10;or: Iron Beast Gym Indore"
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-base placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none mb-4"
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
            />
            <button
              onClick={handleGenerate}
              disabled={!businessInput.trim() || generating}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                !businessInput.trim() || generating
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg'
              }`}
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                  AI is generating your landing page...
                </span>
              ) : '🚀 Generate Landing Page'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-400">
            {['Dental Clinic', 'Coaching Institute', 'Beauty Salon', 'Gym & Fitness', 'Restaurant', 'Real Estate', 'Hospital', 'Jewellery Store'].map(ex => (
              <button key={ex} onClick={() => setBusinessInput(ex + ' Indore')} className="bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 hover:border-purple-500 hover:text-white transition-all">
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('input')} className="text-gray-400 hover:text-white text-sm">← Back</button>
          <span className="text-gray-600">|</span>
          <span className="font-bold text-sm">{page.businessName}</span>
          <span className="text-xs bg-green-900/30 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full">Live Preview</span>
        </div>
        <div className="flex gap-2">
          <button onClick={exportHTML} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg transition-colors">
            ⬇️ Export HTML
          </button>
          <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg transition-colors">
            🌐 Publish
          </button>
          <button className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg transition-colors">
            📤 Share Link
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT EDITOR */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 overflow-hidden">
          {/* Edit Tabs */}
          <div className="flex border-b border-gray-800">
            {(['content', 'design', 'sections'] as EditTab[]).map(tab => (
              <button key={tab} onClick={() => setEditTab(tab)} className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${editTab === tab ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}>
                {tab === 'content' ? '✏️ Content' : tab === 'design' ? '🎨 Design' : '📐 Sections'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* CONTENT TAB */}
            {editTab === 'content' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Business Name</label>
                  <input value={page.businessName} onChange={e => updatePage({ businessName: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Main Headline (Tagline)</label>
                  <textarea value={page.tagline} onChange={e => updatePage({ tagline: e.target.value })} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Description</label>
                  <textarea value={page.description} onChange={e => updatePage({ description: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Special Offer Text</label>
                  <input value={page.offer} onChange={e => updatePage({ offer: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Badge Text</label>
                  <input value={page.badge} onChange={e => updatePage({ badge: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Primary CTA</label>
                    <input value={page.ctaText} onChange={e => updatePage({ ctaText: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Secondary CTA</label>
                    <input value={page.ctaSecondary} onChange={e => updatePage({ ctaSecondary: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Phone</label>
                  <input value={page.phone} onChange={e => updatePage({ phone: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email</label>
                  <input value={page.email} onChange={e => updatePage({ email: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Address</label>
                  <input value={page.address} onChange={e => updatePage({ address: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>

                {/* Features Editor */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Features (4 items)</label>
                  <div className="space-y-2">
                    {page.features.map((f, i) => (
                      <div key={i} className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                        <div className="flex gap-2 mb-1">
                          <input value={f.icon} onChange={e => { const features = [...page.features]; features[i] = { ...features[i], icon: e.target.value }; updatePage({ features }); }} className="w-10 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none" />
                          <input value={f.title} onChange={e => { const features = [...page.features]; features[i] = { ...features[i], title: e.target.value }; updatePage({ features }); }} className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none" placeholder="Title" />
                        </div>
                        <input value={f.desc} onChange={e => { const features = [...page.features]; features[i] = { ...features[i], desc: e.target.value }; updatePage({ features }); }} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none" placeholder="Description" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials Editor */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Testimonials</label>
                  <div className="space-y-2">
                    {page.testimonials.map((t, i) => (
                      <div key={i} className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                        <div className="grid grid-cols-2 gap-1 mb-1">
                          <input value={t.name} onChange={e => { const testimonials = [...page.testimonials]; testimonials[i] = { ...testimonials[i], name: e.target.value }; updatePage({ testimonials }); }} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none" placeholder="Name" />
                          <input value={t.role} onChange={e => { const testimonials = [...page.testimonials]; testimonials[i] = { ...testimonials[i], role: e.target.value }; updatePage({ testimonials }); }} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none" placeholder="Role/City" />
                        </div>
                        <textarea value={t.text} onChange={e => { const testimonials = [...page.testimonials]; testimonials[i] = { ...testimonials[i], text: e.target.value }; updatePage({ testimonials }); }} rows={2} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none resize-none" placeholder="Review text" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Editor */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">FAQs</label>
                  <div className="space-y-2">
                    {page.faqs.map((faq, i) => (
                      <div key={i} className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                        <input value={faq.q} onChange={e => { const faqs = [...page.faqs]; faqs[i] = { ...faqs[i], q: e.target.value }; updatePage({ faqs }); }} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none mb-1" placeholder="Question" />
                        <textarea value={faq.a} onChange={e => { const faqs = [...page.faqs]; faqs[i] = { ...faqs[i], a: e.target.value }; updatePage({ faqs }); }} rows={2} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none resize-none" placeholder="Answer" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* DESIGN TAB */}
            {editTab === 'design' && (
              <>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Color Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_PRESETS.map(preset => (
                      <button key={preset.name} onClick={() => applyColorPreset(preset)} style={{ backgroundColor: preset.primary }} className="p-2 rounded-lg text-white text-xs font-medium text-left hover:opacity-90 transition-opacity">
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Primary Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={page.primaryColor} onChange={e => updatePage({ primaryColor: e.target.value })} className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent" />
                      <input value={page.primaryColor} onChange={e => updatePage({ primaryColor: e.target.value })} className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Secondary Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={page.secondaryColor} onChange={e => updatePage({ secondaryColor: e.target.value })} className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent" />
                      <input value={page.secondaryColor} onChange={e => updatePage({ secondaryColor: e.target.value })} className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Background</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={page.bgColor} onChange={e => updatePage({ bgColor: e.target.value })} className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent" />
                      <input value={page.bgColor} onChange={e => updatePage({ bgColor: e.target.value })} className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Text Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={page.textColor} onChange={e => updatePage({ textColor: e.target.value })} className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent" />
                      <input value={page.textColor} onChange={e => updatePage({ textColor: e.target.value })} className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Font Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['modern', 'elegant', 'bold', 'friendly'] as const).map(style => (
                      <button key={style} onClick={() => updatePage({ fontStyle: style })} className={`py-2 px-3 rounded-lg text-xs capitalize transition-all border ${page.fontStyle === style ? 'border-purple-500 bg-purple-900/30 text-purple-300' : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'}`}>
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* SECTIONS TAB */}
            {editTab === 'sections' && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 mb-3">Toggle sections on/off</p>
                {page.sections.map(section => (
                  <div key={section.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${section.visible ? 'border-purple-500/40 bg-purple-900/10' : 'border-gray-700 bg-gray-800'}`}>
                    <div>
                      <p className="text-sm font-medium capitalize">{section.type}</p>
                      <p className="text-xs text-gray-500">{section.visible ? 'Visible' : 'Hidden'}</p>
                    </div>
                    <button onClick={() => toggleSection(section.id)} className={`w-12 h-6 rounded-full transition-all relative ${section.visible ? 'bg-purple-600' : 'bg-gray-600'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${section.visible ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-700">
                  <button
                    onClick={() => handleGenerate()}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    🔄 Regenerate with AI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="flex-1 overflow-y-auto bg-gray-800">
          <div className="min-h-full" ref={previewRef}>
            <LandingPagePreview page={page} />
          </div>
        </div>
      </div>
    </div>
  );
}
