'use client';

import { useState } from 'react';

// ─── TYPES ────────────────────────────────────────────────────
type Tab = 'generate' | 'templates';
type Format = 'square' | 'portrait' | 'landscape' | 'story';
type Style = 'photorealistic' | 'illustration' | 'minimalist' | 'bold' | '3d' | 'vintage';

interface Template {
  id: string;
  name: string;
  category: string;
  platform: string;
  colors: string[];
  emoji: string;
  tags: string[];
}

// ─── DEMO TEMPLATES ───────────────────────────────────────────
const TEMPLATES: Template[] = [
  { id: '1', name: 'Dental Clinic Promo', category: 'Healthcare', platform: 'Facebook', colors: ['#0EA5E9', '#FFFFFF', '#0369A1'], emoji: '🦷', tags: ['healthcare', 'clinic', 'promo'] },
  { id: '2', name: 'Coaching Institute Ad', category: 'Education', platform: 'Instagram', colors: ['#7C3AED', '#F59E0B', '#FFFFFF'], emoji: '📚', tags: ['education', 'coaching', 'students'] },
  { id: '3', name: 'Restaurant Special', category: 'Food', platform: 'Instagram', colors: ['#DC2626', '#F97316', '#FEF3C7'], emoji: '🍽️', tags: ['food', 'restaurant', 'offer'] },
  { id: '4', name: 'Salon Offer', category: 'Beauty', platform: 'Instagram', colors: ['#DB2777', '#F9A8D4', '#1F2937'], emoji: '💇', tags: ['beauty', 'salon', 'offer'] },
  { id: '5', name: 'Real Estate Launch', category: 'Real Estate', platform: 'Facebook', colors: ['#1E3A5F', '#C9A84C', '#FFFFFF'], emoji: '🏠', tags: ['realestate', 'property', 'launch'] },
  { id: '6', name: 'Gym Membership', category: 'Fitness', platform: 'Instagram', colors: ['#111827', '#EF4444', '#FFFFFF'], emoji: '💪', tags: ['gym', 'fitness', 'membership'] },
  { id: '7', name: 'Festival Sale', category: 'Retail', platform: 'Facebook', colors: ['#F59E0B', '#DC2626', '#1F2937'], emoji: '🎉', tags: ['sale', 'festival', 'discount'] },
  { id: '8', name: 'Product Launch', category: 'Business', platform: 'LinkedIn', colors: ['#0F172A', '#6366F1', '#E2E8F0'], emoji: '🚀', tags: ['product', 'launch', 'business'] },
  { id: '9', name: 'Jewellery Ad', category: 'Luxury', platform: 'Instagram', colors: ['#1C1917', '#D4AF37', '#F5F5F4'], emoji: '💍', tags: ['jewellery', 'luxury', 'gold'] },
  { id: '10', name: 'Hospital Campaign', category: 'Healthcare', platform: 'Facebook', colors: ['#065F46', '#ECFDF5', '#10B981'], emoji: '🏥', tags: ['hospital', 'health', 'campaign'] },
  { id: '11', name: 'Clothing Store', category: 'Fashion', platform: 'Instagram', colors: ['#F3F4F6', '#111827', '#F472B6'], emoji: '👗', tags: ['fashion', 'clothing', 'store'] },
  { id: '12', name: 'Tech Product', category: 'Technology', platform: 'LinkedIn', colors: ['#0F172A', '#38BDF8', '#818CF8'], emoji: '💻', tags: ['tech', 'product', 'software'] },
];

const CATEGORIES = ['All', 'Healthcare', 'Education', 'Food', 'Beauty', 'Real Estate', 'Fitness', 'Retail', 'Business', 'Luxury', 'Fashion', 'Technology'];

const FORMATS: { id: Format; label: string; size: string; icon: string }[] = [
  { id: 'square', label: 'Square', size: '1080×1080', icon: '⬜' },
  { id: 'portrait', label: 'Portrait', size: '1080×1350', icon: '📱' },
  { id: 'landscape', label: 'Landscape', size: '1200×628', icon: '🖥️' },
  { id: 'story', label: 'Story', size: '1080×1920', icon: '📲' },
];

const STYLES: { id: Style; label: string; desc: string }[] = [
  { id: 'photorealistic', label: 'Photo Realistic', desc: 'Real photo look' },
  { id: 'illustration', label: 'Illustration', desc: 'Hand-drawn style' },
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean & simple' },
  { id: 'bold', label: 'Bold & Vibrant', desc: 'High contrast' },
  { id: '3d', label: '3D Render', desc: 'Three dimensional' },
  { id: 'vintage', label: 'Vintage', desc: 'Retro aesthetic' },
];

const QUICK_PROMPTS = [
  'Dental clinic ad with happy smiling family, blue and white theme, professional',
  'Coaching institute Facebook ad, students studying, motivational, bright colors',
  'Restaurant special offer post, delicious food photography, warm colors',
  'Salon beauty offer Instagram post, elegant woman, pink and gold theme',
  'Real estate property launch, luxury apartment, gold and navy blue',
  'Gym membership offer, muscular person working out, dark theme red accents',
];

// ─── TEMPLATE CARD ────────────────────────────────────────────
function TemplateCard({ template, onUse }: { template: Template; onUse: (t: Template) => void }) {
  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-900/20">
      {/* Preview */}
      <div
        className="h-36 flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1] || template.colors[0]})` }}
      >
        <div className="text-5xl">{template.emoji}</div>
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(circle at 70% 30%, ${template.colors[2] || '#fff'}, transparent 60%)` }}
        />
        <div className="absolute top-2 right-2">
          <span className="text-xs bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">{template.platform}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white mb-0.5">{template.name}</h3>
        <p className="text-xs text-gray-400 mb-3">{template.category}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onUse(template)}
            className="flex-1 text-xs bg-purple-600 hover:bg-purple-500 text-white py-1.5 rounded-lg transition-colors font-medium"
          >
            Use Template
          </button>
          <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── GENERATED IMAGE MOCK ─────────────────────────────────────
function GeneratedImageMock({ prompt, style, format }: { prompt: string; style: Style; format: Format }) {
  const gradients: Record<Style, string> = {
    photorealistic: 'from-blue-900 via-blue-700 to-sky-500',
    illustration: 'from-purple-900 via-pink-700 to-orange-400',
    minimalist: 'from-gray-900 via-gray-700 to-gray-500',
    bold: 'from-red-900 via-orange-600 to-yellow-400',
    '3d': 'from-indigo-900 via-violet-700 to-purple-400',
    vintage: 'from-amber-900 via-yellow-700 to-orange-300',
  };

  const aspectRatios: Record<Format, string> = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    landscape: 'aspect-[1.91/1]',
    story: 'aspect-[9/16]',
  };

  return (
    <div className={`relative w-full ${aspectRatios[format]} max-h-80 rounded-xl overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[style]}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <div className="text-4xl mb-3">🎨</div>
        <p className="text-white text-xs font-medium opacity-80 line-clamp-3">{prompt}</p>
        <div className="mt-3 flex gap-2">
          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">{style}</span>
          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">{format}</span>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
        AI Generated Preview
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function CreativeStudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [prompt, setPrompt] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<Format>('square');
  const [selectedStyle, setSelectedStyle] = useState<Style>('photorealistic');
  const [platform, setPlatform] = useState('Instagram');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGenerated(false);
    // Simulate generation delay
    await new Promise(r => setTimeout(r, 2500));
    setGenerating(false);
    setGenerated(true);
  }

  function handleUseTemplate(template: Template) {
    setSelectedTemplate(template);
    setActiveTab('generate');
    setPrompt(`${template.name} - ${template.category} ad for ${template.platform}, ${template.tags.join(', ')}`);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">🎨 Creative Studio</h1>
          <p className="text-gray-400 text-sm mt-1">Generate AI images & use ready-made templates for your ads</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="bg-purple-900/30 border border-purple-600/30 text-purple-400 px-3 py-1 rounded-full">Powered by AI</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-900 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'generate' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          ✨ AI Generate
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'templates' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          📐 Templates ({TEMPLATES.length})
        </button>
      </div>

      {/* ─── AI GENERATE TAB ─── */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left — Controls */}
          <div className="space-y-5">
            {selectedTemplate && (
              <div className="bg-purple-900/20 border border-purple-600/30 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{selectedTemplate.emoji}</span>
                  <span className="text-sm text-purple-300">Using template: <strong>{selectedTemplate.name}</strong></span>
                </div>
                <button onClick={() => { setSelectedTemplate(null); setPrompt(''); }} className="text-gray-500 hover:text-white text-xs">✕</button>
              </div>
            )}

            {/* Prompt */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Describe your image *</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. Dental clinic Facebook ad with happy smiling family, blue and white professional theme, 'Book Your Appointment' text"
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Quick Prompts */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block">⚡ Quick prompts</label>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.slice(0, 3).map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(qp)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full transition-colors text-left"
                  >
                    {qp.split(',')[0]}...
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Format</label>
              <div className="grid grid-cols-4 gap-2">
                {FORMATS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${selectedFormat === f.id ? 'border-purple-500 bg-purple-900/30' : 'border-gray-700 bg-gray-900 hover:border-gray-500'}`}
                  >
                    <div className="text-lg mb-0.5">{f.icon}</div>
                    <div className="text-xs font-medium text-white">{f.label}</div>
                    <div className="text-xs text-gray-500">{f.size}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Style</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${selectedStyle === s.id ? 'border-purple-500 bg-purple-900/30' : 'border-gray-700 bg-gray-900 hover:border-gray-500'}`}
                  >
                    <div className="text-xs font-semibold text-white">{s.label}</div>
                    <div className="text-xs text-gray-500">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Platform</label>
              <div className="flex gap-2 flex-wrap">
                {['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'WhatsApp'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`text-sm px-4 py-2 rounded-xl border transition-all ${platform === p ? 'border-purple-500 bg-purple-900/30 text-white' : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
              className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                !prompt.trim() || generating
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/30'
              }`}
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                  Generating Image...
                </span>
              ) : '✨ Generate Image'}
            </button>
          </div>

          {/* Right — Output */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            {!generated && !generating && (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-lg font-bold text-white mb-2">Ready to Create</h3>
                <p className="text-gray-400 text-sm max-w-xs">Describe your image, choose format and style, then click Generate.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-xs">
                  {['Facebook Ad', 'Instagram Post', 'YouTube Thumb', 'WhatsApp Status'].map(t => (
                    <div key={t} className="bg-gray-800 rounded-lg p-2 text-xs text-gray-400 text-center">{t}</div>
                  ))}
                </div>
              </div>
            )}

            {generating && (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="w-16 h-16 rounded-full bg-purple-900/30 border-2 border-purple-500 flex items-center justify-center mb-4 animate-pulse">
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-white font-semibold mb-1">Creating your image...</p>
                <p className="text-gray-400 text-sm">AI is designing your {platform} {selectedFormat} in {selectedStyle} style</p>
                <div className="mt-4 w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {generated && !generating && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-base">✨ Generated Image</h2>
                  <button onClick={() => { setGenerated(false); setPrompt(''); }} className="text-xs text-gray-500 hover:text-white">✕ Clear</button>
                </div>
                <GeneratedImageMock prompt={prompt} style={selectedStyle} format={selectedFormat} />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button className="py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors">
                    ⬇️ Download
                  </button>
                  <button className="py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                    📤 Publish
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
                  >
                    🔄 Regenerate
                  </button>
                </div>
                <div className="mt-3 bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Prompt used:</p>
                  <p className="text-xs text-gray-200">{prompt}</p>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="text-xs bg-purple-900/30 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full">{selectedStyle}</span>
                  <span className="text-xs bg-blue-900/30 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full">{selectedFormat}</span>
                  <span className="text-xs bg-pink-900/30 text-pink-400 border border-pink-600/30 px-2 py-0.5 rounded-full">{platform}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TEMPLATES TAB ─── */}
      {activeTab === 'templates' && (
        <div>
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-3 py-2 rounded-xl whitespace-nowrap transition-all border ${
                    categoryFilter === cat
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* More categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
            {CATEGORIES.slice(6).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-2 rounded-xl whitespace-nowrap transition-all border ${
                  categoryFilter === cat
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{filteredTemplates.length} templates found</p>
            <div className="flex gap-2">
              <span className="text-xs text-gray-500">Sort by:</span>
              <select className="text-xs bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-gray-300 focus:outline-none">
                <option>Popular</option>
                <option>Newest</option>
                <option>Platform</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map(template => (
              <TemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-400">No templates found. Try a different search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
