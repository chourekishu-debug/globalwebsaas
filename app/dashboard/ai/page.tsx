'use client';

import { useState } from 'react';

const TOOLS = [
  { id: 'ad-copy', label: 'Ad Copy', icon: '📢', desc: '3 variations with quality scores' },
  { id: 'headlines', label: 'Headlines', icon: '🎯', desc: '5 powerful headline variants' },
  { id: 'social-post', label: 'Social Post', icon: '📱', desc: 'Full post with hook & CTA' },
  { id: 'article', label: 'Article', icon: '📄', desc: '700+ word long-form content' },
  { id: 'reel-script', label: 'Reel Script', icon: '🎬', desc: 'Hook + voiceover + slides' },
  { id: 'hashtags', label: 'Hashtags', icon: '#️⃣', desc: '20 high-reach tags + strategy' },
  { id: 'captions', label: 'Captions', icon: '✍️', desc: '2 platform-specific captions' },
  { id: 'audience-ai', label: 'Audience AI', icon: '👥', desc: '3 targeting segments with CPL' },
];

const TONES = ['Professional', 'Casual', 'Urgent', 'Inspirational', 'Humorous', 'Luxury'];
const PLATFORMS = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube', 'WhatsApp'];

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function flattenToText(obj: any, indent = 0): string {
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number') return String(obj);
  if (Array.isArray(obj)) return obj.map(v => flattenToText(v, indent)).join('\n');
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj)
      .map(([k, v]) => `${' '.repeat(indent)}${k}: ${flattenToText(v, indent + 2)}`)
      .join('\n');
  }
  return '';
}

// ─── RENDERERS ────────────────────────────────────────────────
function AdCopyResult({ data }: { data: any }) {
  const variations = data?.variations || [];
  return (
    <div className="space-y-4">
      {variations.map((v: any, i: number) => (
        <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">{v.platform || `Variation ${i + 1}`}</span>
            {v.score && <span className="text-xs text-green-400 font-bold">Score: {v.score}/100</span>}
          </div>
          <h3 className="text-white font-bold text-base mb-1">{v.headline}</h3>
          <p className="text-gray-300 text-sm mb-3">{v.body}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">{v.cta}</span>
            <button onClick={() => copyToClipboard(`${v.headline}\n\n${v.body}\n\n${v.cta}`)} className="text-xs text-gray-400 hover:text-white">📋 Copy</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeadlinesResult({ data }: { data: any }) {
  const headlines = data?.headlines || [];
  return (
    <div className="space-y-3">
      {headlines.map((h: any, i: number) => (
        <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-start justify-between gap-3">
          <div>
            <p className="text-white font-semibold mb-1">{h.text}</p>
            <span className="text-xs text-purple-400">{h.type}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {h.score && <span className="text-xs text-green-400 font-bold">{h.score}</span>}
            <button onClick={() => copyToClipboard(h.text)} className="text-xs text-gray-400 hover:text-white">📋</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SocialPostResult({ data }: { data: any }) {
  const fullText = `${data?.hook || ''}\n\n${data?.body || ''}\n\n${data?.cta || ''}\n\n${data?.hashtags || ''}`;
  return (
    <div className="space-y-3">
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs bg-pink-600 text-white px-2 py-0.5 rounded-full">{data?.platform || 'Instagram'}</span>
          <button onClick={() => copyToClipboard(fullText)} className="text-xs text-gray-400 hover:text-white">📋 Copy All</button>
        </div>
        {data?.hook && <p className="text-yellow-400 font-bold text-sm mb-2">🪝 {data.hook}</p>}
        {data?.body && <p className="text-gray-200 text-sm whitespace-pre-line mb-3">{data.body}</p>}
        {data?.cta && <p className="text-blue-400 text-sm mb-2">📲 {data.cta}</p>}
        {data?.hashtags && <p className="text-purple-400 text-xs">{data.hashtags}</p>}
      </div>
    </div>
  );
}

function ArticleResult({ data }: { data: any }) {
  const sections = data?.sections || [];
  const fullText = [data?.title, data?.intro, ...sections.map((s: any) => `${s.heading}\n${s.content}`), data?.conclusion].filter(Boolean).join('\n\n');
  return (
    <div className="space-y-3">
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex justify-between mb-3">
          {data?.wordCount && <span className="text-xs text-green-400">~{data.wordCount} words</span>}
          <button onClick={() => copyToClipboard(fullText)} className="text-xs text-gray-400 hover:text-white">📋 Copy Article</button>
        </div>
        {data?.title && <h2 className="text-white font-bold text-lg mb-2">{data.title}</h2>}
        {data?.intro && <p className="text-gray-300 text-sm mb-3">{data.intro}</p>}
        {sections.map((s: any, i: number) => (
          <div key={i} className="mb-3">
            <h3 className="text-purple-400 font-semibold text-sm mb-1">{s.heading}</h3>
            <p className="text-gray-300 text-sm">{s.content}</p>
          </div>
        ))}
        {data?.conclusion && (
          <div className="border-t border-gray-700 pt-3 mt-3">
            <p className="text-gray-300 text-sm italic">{data.conclusion}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReelScriptResult({ data }: { data: any }) {
  const voiceover = data?.voiceover || [];
  const slides = data?.slides || [];
  return (
    <div className="space-y-3">
      {data?.hook && (
        <div className="bg-yellow-900/30 border border-yellow-600/40 rounded-xl p-3">
          <p className="text-xs text-yellow-400 mb-1">🪝 HOOK</p>
          <p className="text-white font-bold">{data.hook}</p>
        </div>
      )}
      {voiceover.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-xs text-purple-400 mb-2">🎙️ VOICEOVER SCRIPT</p>
          <div className="space-y-2">
            {voiceover.map((v: any, i: number) => (
              <div key={i} className="flex gap-3">
                <span className="text-xs text-gray-500 shrink-0 w-14">{v.time}</span>
                <p className="text-gray-200 text-sm">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {slides.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-xs text-blue-400 mb-2">🎞️ SLIDES</p>
          <ol className="list-decimal list-inside space-y-1">
            {slides.map((s: string, i: number) => (
              <li key={i} className="text-gray-300 text-sm">{s}</li>
            ))}
          </ol>
        </div>
      )}
      {data?.music && (
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
          <p className="text-xs text-green-400 mb-1">🎵 MUSIC</p>
          <p className="text-gray-300 text-sm">{data.music}</p>
        </div>
      )}
    </div>
  );
}

function HashtagsResult({ data }: { data: any }) {
  const allTags = [
    ...(data?.primary || []),
    ...(data?.niche || []),
    ...(data?.trending || []),
    ...(data?.engagement || [])
  ].join(' ');
  return (
    <div className="space-y-3">
      {[
        { key: 'primary', label: '🔵 Primary', color: 'bg-blue-600' },
        { key: 'niche', label: '🟣 Niche', color: 'bg-purple-600' },
        { key: 'trending', label: '🔴 Trending', color: 'bg-red-600' },
        { key: 'engagement', label: '🟢 Engagement', color: 'bg-green-600' },
      ].map(({ key, label, color }) => (
        data?.[key]?.length > 0 && (
          <div key={key} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
              {data[key].map((tag: string, i: number) => (
                <span key={i} className={`text-xs ${color} text-white px-2 py-1 rounded-full`}>{tag}</span>
              ))}
            </div>
          </div>
        )
      ))}
      {data?.strategy && (
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
          <p className="text-xs text-yellow-400 mb-1">💡 Strategy</p>
          <p className="text-gray-300 text-sm">{data.strategy}</p>
        </div>
      )}
      <button onClick={() => copyToClipboard(allTags)} className="w-full text-sm text-gray-400 hover:text-white border border-gray-600 rounded-lg py-2">📋 Copy All Hashtags</button>
    </div>
  );
}

function CaptionsResult({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data?.instagram && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-xs bg-pink-600 text-white px-2 py-0.5 rounded-full">Instagram</span>
            <button onClick={() => copyToClipboard(data.instagram.caption)} className="text-xs text-gray-400 hover:text-white">📋 Copy</button>
          </div>
          <p className="text-gray-200 text-sm whitespace-pre-line">{data.instagram.caption}</p>
          {data.instagram.length && <p className="text-xs text-gray-500 mt-2">{data.instagram.length}</p>}
        </div>
      )}
      {data?.facebook && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Facebook</span>
            <button onClick={() => copyToClipboard(data.facebook.caption)} className="text-xs text-gray-400 hover:text-white">📋 Copy</button>
          </div>
          <p className="text-gray-200 text-sm whitespace-pre-line">{data.facebook.caption}</p>
          {data.facebook.length && <p className="text-xs text-gray-500 mt-2">{data.facebook.length}</p>}
        </div>
      )}
    </div>
  );
}

function AudienceResult({ data }: { data: any }) {
  const segments = data?.segments || [];
  const colors = [
    { border: 'border-blue-600/40', badge: 'bg-blue-600', dot: 'bg-blue-400' },
    { border: 'border-orange-600/40', badge: 'bg-orange-600', dot: 'bg-orange-400' },
    { border: 'border-emerald-600/40', badge: 'bg-emerald-600', dot: 'bg-emerald-400' },
  ];
  return (
    <div className="space-y-4">
      {segments.map((seg: any, i: number) => {
        const c = colors[i % colors.length];
        return (
          <div key={i} className={`bg-gray-800 rounded-xl p-4 border ${c.border}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${c.dot} shrink-0 mt-0.5`} />
                <h3 className="text-white font-bold text-sm">{seg.name}</h3>
              </div>
              <span className="text-xs text-green-400 font-bold shrink-0 ml-2 bg-green-900/30 px-2 py-0.5 rounded-full">CPL: {seg.cpl}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-900/50 rounded-lg p-2">
                <p className="text-xs text-gray-500 mb-0.5">📍 Audience Size</p>
                <p className="text-gray-100 text-xs font-semibold">{seg.size}</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-2">
                <p className="text-xs text-gray-500 mb-0.5">💰 Income Range</p>
                <p className="text-gray-100 text-xs font-semibold">{seg.income}</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-2">
                <p className="text-xs text-gray-500 mb-0.5">🕐 Best Time</p>
                <p className="text-gray-100 text-xs font-semibold">{seg.bestTime}</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-2">
                <p className="text-xs text-gray-500 mb-0.5">📱 Platforms</p>
                <p className="text-gray-100 text-xs font-semibold">{Array.isArray(seg.platforms) ? seg.platforms.join(' + ') : seg.platforms}</p>
              </div>
            </div>

            {/* Pain Points */}
            {seg.painPoints?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-red-400 mb-1.5">😣 Pain Points (what they struggle with)</p>
                <div className="space-y-1">
                  {(Array.isArray(seg.painPoints) ? seg.painPoints : [seg.painPoints]).map((p: string, j: number) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <span className="text-red-500 text-xs mt-0.5">•</span>
                      <p className="text-gray-300 text-xs">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {seg.interests?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1.5">❤️ Interests & Behaviours</p>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(seg.interests) ? seg.interests : [seg.interests]).map((int: string, j: number) => (
                    <span key={j} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{int}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Ad Angle */}
            {seg.adAngle && (
              <div className="mb-3 bg-yellow-900/20 border border-yellow-600/20 rounded-lg p-2">
                <p className="text-xs text-yellow-400 mb-0.5">🎯 Ad Strategy Angle</p>
                <p className="text-gray-200 text-xs">{seg.adAngle}</p>
              </div>
            )}

            {/* Ad Message */}
            {seg.message && (
              <div className={`bg-purple-900/30 border border-purple-600/30 rounded-lg p-2.5`}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-purple-400">💬 Winning Ad Message</p>
                  <button onClick={() => copyToClipboard(seg.message)} className="text-xs text-gray-500 hover:text-white">📋</button>
                </div>
                <p className="text-white text-xs font-medium">{seg.message}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ResultRenderer({ tool, data }: { tool: string; data: any }) {
  if (!data) return null;

  switch (tool) {
    case 'ad-copy': return <AdCopyResult data={data} />;
    case 'headlines': return <HeadlinesResult data={data} />;
    case 'social-post': return <SocialPostResult data={data} />;
    case 'article': return <ArticleResult data={data} />;
    case 'reel-script': return <ReelScriptResult data={data} />;
    case 'hashtags': return <HashtagsResult data={data} />;
    case 'captions': return <CaptionsResult data={data} />;
    case 'audience-ai': return <AudienceResult data={data} />;
    default:
      return (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <pre className="text-gray-200 text-xs whitespace-pre-wrap">{flattenToText(data)}</pre>
        </div>
      );
  }
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function AIGeneratorPage() {
  const [selectedTool, setSelectedTool] = useState('ad-copy');
  const [business, setBusiness] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!business.trim()) {
      setError('Please enter your product or business description.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: selectedTool, business: business.trim(), platform, tone })
      });

      const json = await res.json();

      if (json?.result) {
        setResult(json.result);
        setIsDemo(json.demo === true);
      } else {
        setError('No content returned. Please try again.');
      }
    } catch (err: any) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const activeTool = TOOLS.find(t => t.id === selectedTool);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">🤖 AI Content Generator</h1>
        <p className="text-gray-400 text-sm mt-1">Powered by AI · Type your business → get ready-to-publish content instantly</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT — Input Panel */}
        <div className="space-y-5">
          {/* Tool Selector */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">CONTENT TYPE</label>
            <div className="grid grid-cols-2 gap-2">
              {TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => { setSelectedTool(tool.id); setResult(null); setError(''); }}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    selectedTool === tool.id
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                  }`}
                >
                  <div className="text-lg mb-1">{tool.icon}</div>
                  <div className="text-sm font-semibold text-white">{tool.label}</div>
                  <div className="text-xs text-gray-400">{tool.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Business Input */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Product / Business *</label>
            <textarea
              value={business}
              onChange={e => setBusiness(e.target.value)}
              placeholder="e.g. Best dental hospital in Indore, create content for LinkedIn and Facebook with image to get more engagement"
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Platform & Tone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Platform</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
              >
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Tone</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
              >
                {TONES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-600/40 rounded-xl p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
              loading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/30'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                Generating {activeTool?.label}...
              </span>
            ) : (
              `⚡ Generate ${activeTool?.label}`
            )}
          </button>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2">
            {['Works for any niche', '8 content formats', 'Copy in one click', 'Platform-specific'].map(tag => (
              <span key={tag} className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — Output Panel */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 min-h-[400px]">
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to Generate</h3>
              <p className="text-gray-400 text-sm max-w-xs">Fill in your product/business details on the left, select a content type, then click Generate.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm">AI is crafting your {activeTool?.label}...</p>
            </div>
          )}

          {result && !loading && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">{activeTool?.icon} {activeTool?.label}</h2>
                  {isDemo && (
                    <span className="text-xs text-yellow-400 bg-yellow-900/30 border border-yellow-600/30 px-2 py-0.5 rounded-full">
                      Demo mode — AI response unavailable
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { setResult(null); setError(''); }}
                  className="text-xs text-gray-500 hover:text-white"
                >
                  ✕ Clear
                </button>
              </div>
              <div className="overflow-y-auto max-h-[70vh] pr-1 custom-scroll">
                <ResultRenderer tool={selectedTool} data={result} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
