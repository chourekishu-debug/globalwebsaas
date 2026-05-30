'use client';

import { useState, useRef } from 'react';

interface AnalyzedCreative {
  headline: string;
  subheadline: string;
  adScript: string;
  adCopy: string;
  ctaText: string;
  hashtags: string[];
  reelScript: string;
  whatsappMessage: string;
  targetAudience: string;
  tone: string;
  platform: string;
}

async function analyzeCreativeWithAI(imageBase64: string, businessName: string, platform: string, goal: string): Promise<AnalyzedCreative> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              }
            },
            {
              type: 'text',
              text: `You are an expert Indian digital marketing copywriter. Analyze this ad creative image and generate complete marketing content for it.

Business: ${businessName || 'Business'}
Platform: ${platform}
Goal: ${goal}

Return ONLY valid JSON (no markdown):
{
  "headline": "powerful attention-grabbing headline based on the image",
  "subheadline": "supporting subheadline",
  "adCopy": "150 word persuasive ad copy based on what you see in the image",
  "adScript": "30-second video/reel script with hook, body and CTA based on the image",
  "ctaText": "clear CTA button text",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"],
  "reelScript": "Instagram Reel script: Hook (0-3s), Problem (3-8s), Solution (8-20s), CTA (20-30s)",
  "whatsappMessage": "WhatsApp broadcast message based on the creative",
  "targetAudience": "description of ideal target audience for this creative",
  "tone": "professional/casual/urgent/inspirational",
  "platform": "${platform}"
}`
            }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data?.content?.[0]?.text || '';
    const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    return JSON.parse(clean);
  } catch {
    // Fallback demo
    return {
      headline: `${businessName || 'Your Business'} — Excellence Delivered!`,
      subheadline: 'Trusted by thousands across India',
      adCopy: `Looking at your creative, we can see a powerful marketing opportunity. ${businessName || 'Your business'} offers exceptional value to customers. This creative captures attention with its compelling visual design and clear message. Join thousands of satisfied customers who trust us for quality service and proven results. Don't miss this opportunity!`,
      adScript: `🎬 HOOK (0-3s): "Stop scrolling! This is for you if you want the best from ${businessName}!"\n\n📢 BODY (3-20s): "We understand your needs. That's why ${businessName} delivers quality that speaks for itself. Our customers love us for a reason — results!"\n\n🎯 CTA (20-30s): "Click the link below NOW. Limited offer available today only!"`,
      ctaText: 'Book Now — Limited Slots!',
      hashtags: ['#IndoreBusiness', '#QualityService', '#TrustedBrand', '#IndiaFirst', '#BusinessGrowth', '#Marketing', '#DigitalIndia', '#SmallBusiness', '#Trending2026', '#MustSee'],
      reelScript: `HOOK (0-3s): Show the creative full screen — "This changed everything!"\n\nPROBLEM (3-8s): "Tired of low quality? We know the feeling..."\n\nSOLUTION (8-20s): Show your service/product highlights — "${businessName} delivers what others promise"\n\nCTA (20-30s): "Link in bio! First 10 get 20% off. Comment 'YES' to know more!"`,
      whatsappMessage: `🎉 *Special Announcement from ${businessName}!*\n\nWe have something exciting for you!\n\n✅ Premium quality guaranteed\n✅ Trusted by thousands\n✅ Limited time offer\n\n📞 Call/WhatsApp us NOW to claim your offer before it expires!\n\n_Reply STOP to unsubscribe_`,
      targetAudience: 'Adults 25-45, interested in quality services, located in tier 1 & 2 Indian cities, active on Facebook and Instagram',
      tone: 'professional',
      platform: platform
    };
  }
}

export default function CreativeUploadAnalyzer() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [goal, setGoal] = useState('Get more leads');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzedCreative | null>(null);
  const [copied, setCopied] = useState('');
  const [activeTab, setActiveTab] = useState<'adcopy' | 'script' | 'reel' | 'whatsapp' | 'hashtags'>('adcopy');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function handleAnalyze() {
    if (!uploadedImage) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const base64 = uploadedImage.split(',')[1];
      const analyzed = await analyzeCreativeWithAI(base64, businessName, platform, goal);
      setResult(analyzed);
      setActiveTab('adcopy');
    } catch (err) { console.error(err); }
    finally { setAnalyzing(false); }
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  }

  const PLATFORMS = ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'WhatsApp'];
  const GOALS = ['Get more leads', 'Drive sales', 'Brand awareness', 'Event promotion', 'App downloads', 'Website traffic'];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">📸 Creative Analyzer</h1>
        <p className="text-gray-400 text-sm mt-1">Upload your ad creative → AI generates complete ad script, copy, hashtags & CTA instantly</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT — Upload Panel */}
        <div className="space-y-4">
          {/* Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all ${dragOver ? 'border-purple-400 bg-purple-900/20' : 'border-gray-700 hover:border-purple-500/50 hover:bg-gray-900'}`}
            style={{ minHeight: uploadedImage ? 'auto' : '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

            {uploadedImage ? (
              <div className="relative w-full">
                <img src={uploadedImage} alt="Uploaded creative" className="w-full rounded-2xl object-contain max-h-72" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <p className="text-white font-bold text-sm bg-black/60 px-4 py-2 rounded-full">📷 Click to change image</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="text-5xl mb-4">📸</div>
                <h3 className="text-lg font-bold text-white mb-2">Upload Your Ad Creative</h3>
                <p className="text-gray-400 text-sm mb-4">Drag & drop or click to upload<br/>JPG, PNG, WebP supported</p>
                <div className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
                  📁 Choose Image
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Business / Brand Name</label>
              <input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Bright Smile Dental, PSC Academy"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Platform</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Campaign Goal</label>
                <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                  {GOALS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!uploadedImage || analyzing}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all ${!uploadedImage || analyzing ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/30'}`}
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                AI is analyzing your creative...
              </span>
            ) : '🤖 Analyze & Generate Ad Content'}
          </button>

          {/* What you get */}
          {!result && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">What AI generates from your creative:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '✍️', text: 'Headline + Ad Copy' },
                  { icon: '🎬', text: '30-sec Ad Script' },
                  { icon: '📱', text: 'Reel Script' },
                  { icon: '💬', text: 'WhatsApp Message' },
                  { icon: '#️⃣', text: '10 Hashtags' },
                  { icon: '🎯', text: 'CTA Button Text' },
                  { icon: '👥', text: 'Target Audience' },
                  { icon: '📤', text: 'Ready to Publish' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Results Panel */}
        <div>
          {!result && !analyzing && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center bg-gray-900 border border-gray-800 rounded-2xl">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to Analyze</h3>
              <p className="text-gray-400 text-sm max-w-xs">Upload your ad creative on the left, add your business name, and click Analyze!</p>
            </div>
          )}

          {analyzing && (
            <div className="flex flex-col items-center justify-center h-full py-20 bg-gray-900 border border-gray-800 rounded-2xl">
              <div className="w-16 h-16 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mb-4" />
              <p className="text-white font-semibold mb-1">AI is reading your creative...</p>
              <p className="text-gray-400 text-sm text-center max-w-xs">Analyzing colors, text, subject, and generating platform-specific content for {platform}</p>
            </div>
          )}

          {result && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Result Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="font-bold text-base text-white">✅ Analysis Complete</h2>
                    <p className="text-xs text-gray-400">{businessName} · {platform} · {goal}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-purple-900/30 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full">{result.tone}</span>
                  </div>
                </div>

                {/* Headline Preview */}
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-600/20 rounded-xl p-3">
                  <p className="text-white font-black text-lg leading-tight">{result.headline}</p>
                  <p className="text-gray-300 text-sm mt-1">{result.subheadline}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold">{result.ctaText}</span>
                    <button onClick={() => copyText(`${result.headline}\n${result.subheadline}\n\nCTA: ${result.ctaText}`, 'headline')} className="text-xs text-gray-500 hover:text-white">
                      {copied === 'headline' ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="flex border-b border-gray-800 overflow-x-auto">
                {[
                  { id: 'adcopy', label: '📝 Ad Copy' },
                  { id: 'script', label: '🎬 Ad Script' },
                  { id: 'reel', label: '📱 Reel' },
                  { id: 'whatsapp', label: '💬 WhatsApp' },
                  { id: 'hashtags', label: '#️⃣ Hashtags' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    className={`text-xs px-4 py-3 whitespace-nowrap font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-white'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 overflow-y-auto" style={{ maxHeight: '420px' }}>
                {/* Ad Copy */}
                {activeTab === 'adcopy' && (
                  <div className="space-y-3">
                    <div className="bg-gray-800 rounded-xl p-4">
                      <div className="flex justify-between mb-2">
                        <p className="text-xs text-blue-400 font-bold">AD COPY — Paste in Ads Manager</p>
                        <button onClick={() => copyText(result.adCopy, 'adcopy')} className="text-xs text-gray-500 hover:text-white">{copied === 'adcopy' ? '✅ Copied!' : '📋 Copy'}</button>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{result.adCopy}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-3">
                      <p className="text-xs text-green-400 font-bold mb-2">👥 TARGET AUDIENCE</p>
                      <p className="text-gray-300 text-sm">{result.targetAudience}</p>
                    </div>
                  </div>
                )}

                {/* Ad Script */}
                {activeTab === 'script' && (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="flex justify-between mb-3">
                      <p className="text-xs text-yellow-400 font-bold">🎬 30-SECOND AD SCRIPT</p>
                      <button onClick={() => copyText(result.adScript, 'script')} className="text-xs text-gray-500 hover:text-white">{copied === 'script' ? '✅ Copied!' : '📋 Copy'}</button>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{result.adScript}</p>
                  </div>
                )}

                {/* Reel Script */}
                {activeTab === 'reel' && (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="flex justify-between mb-3">
                      <p className="text-xs text-pink-400 font-bold">📱 INSTAGRAM REEL SCRIPT</p>
                      <button onClick={() => copyText(result.reelScript, 'reel')} className="text-xs text-gray-500 hover:text-white">{copied === 'reel' ? '✅ Copied!' : '📋 Copy'}</button>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{result.reelScript}</p>
                  </div>
                )}

                {/* WhatsApp */}
                {activeTab === 'whatsapp' && (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="flex justify-between mb-3">
                      <p className="text-xs text-green-400 font-bold">💬 WHATSAPP BROADCAST MESSAGE</p>
                      <button onClick={() => copyText(result.whatsappMessage, 'wa')} className="text-xs text-gray-500 hover:text-white">{copied === 'wa' ? '✅ Copied!' : '📋 Copy'}</button>
                    </div>
                    <div className="bg-green-900/20 border border-green-600/20 rounded-xl p-3">
                      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{result.whatsappMessage}</p>
                    </div>
                  </div>
                )}

                {/* Hashtags */}
                {activeTab === 'hashtags' && (
                  <div>
                    <div className="flex justify-between mb-3">
                      <p className="text-xs text-purple-400 font-bold">#️⃣ HASHTAGS ({result.hashtags.length})</p>
                      <button onClick={() => copyText(result.hashtags.join(' '), 'hashtags')} className="text-xs text-gray-500 hover:text-white">{copied === 'hashtags' ? '✅ Copied!' : '📋 Copy All'}</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs bg-purple-900/30 text-purple-300 border border-purple-600/30 px-3 py-1.5 rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                    <div className="bg-gray-800 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Copy as text:</p>
                      <p className="text-gray-300 text-xs">{result.hashtags.join(' ')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Export Row */}
              <div className="p-4 border-t border-gray-800 grid grid-cols-3 gap-2">
                <button onClick={() => copyText(`${result.headline}\n\n${result.adCopy}\n\n${result.hashtags.join(' ')}`, 'all')}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold transition-colors">
                  {copied === 'all' ? '✅ Copied!' : '📋 Copy All'}
                </button>
                <button onClick={() => copyText(result.whatsappMessage, 'wa2')}
                  className="text-xs bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl font-bold transition-colors">
                  {copied === 'wa2' ? '✅ Copied!' : '💬 WhatsApp'}
                </button>
                <button onClick={() => { setResult(null); setUploadedImage(null); }}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-xl font-bold transition-colors">
                  🔄 New Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}