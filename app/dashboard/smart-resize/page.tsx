'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const PLATFORM_SIZES = [
  { id: 'fb_feed_square',     platform: 'Facebook',   name: 'Feed Square',      w: 1080, h: 1080, ratio: '1:1',      icon: '👥', color: '#1877F2' },
  { id: 'fb_feed_landscape',  platform: 'Facebook',   name: 'Feed Landscape',   w: 1200, h: 628,  ratio: '1.91:1',   icon: '👥', color: '#1877F2' },
  { id: 'fb_story',           platform: 'Facebook',   name: 'Story / Reel',     w: 1080, h: 1920, ratio: '9:16',     icon: '👥', color: '#1877F2' },
  { id: 'ig_feed_square',     platform: 'Instagram',  name: 'Feed Square',      w: 1080, h: 1080, ratio: '1:1',      icon: '📸', color: '#E1306C' },
  { id: 'ig_feed_portrait',   platform: 'Instagram',  name: 'Feed Portrait',    w: 1080, h: 1350, ratio: '4:5',      icon: '📸', color: '#E1306C' },
  { id: 'ig_story',           platform: 'Instagram',  name: 'Story / Reel',     w: 1080, h: 1920, ratio: '9:16',     icon: '📸', color: '#E1306C' },
  { id: 'li_feed',            platform: 'LinkedIn',   name: 'Feed Post',        w: 1200, h: 627,  ratio: '1.91:1',   icon: '💼', color: '#0A66C2' },
  { id: 'li_square',          platform: 'LinkedIn',   name: 'Square Post',      w: 1080, h: 1080, ratio: '1:1',      icon: '💼', color: '#0A66C2' },
  { id: 'yt_thumbnail',       platform: 'YouTube',    name: 'Thumbnail',        w: 1280, h: 720,  ratio: '16:9',     icon: '▶️', color: '#FF0000' },
  { id: 'yt_shorts',          platform: 'YouTube',    name: 'Shorts',           w: 1080, h: 1920, ratio: '9:16',     icon: '▶️', color: '#FF0000' },
  { id: 'wa_status',          platform: 'WhatsApp',   name: 'Status',           w: 1080, h: 1920, ratio: '9:16',     icon: '💬', color: '#25D366' },
  { id: 'wa_chat',            platform: 'WhatsApp',   name: 'Chat Image',       w: 800,  h: 800,  ratio: '1:1',      icon: '💬', color: '#25D366' },
];

const PLATFORMS = ['All', 'Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'WhatsApp'];

function resizeImageOnCanvas(
  imgSrc: string,
  targetW: number,
  targetH: number,
  fit: 'cover' | 'contain' | 'fill',
  bgColor: string
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, targetW, targetH);

      const imgAspect = img.width / img.height;
      const targetAspect = targetW / targetH;

      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      let dx = 0, dy = 0, dw = targetW, dh = targetH;

      if (fit === 'cover') {
        if (imgAspect > targetAspect) {
          sw = img.height * targetAspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetAspect;
          sy = (img.height - sh) / 2;
        }
      } else if (fit === 'contain') {
        if (imgAspect > targetAspect) {
          dw = targetW;
          dh = targetW / imgAspect;
          dy = (targetH - dh) / 2;
        } else {
          dh = targetH;
          dw = targetH * imgAspect;
          dx = (targetW - dw) / 2;
        }
      }

      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = imgSrc;
  });
}

interface ResizedImage {
  sizeId: string;
  dataUrl: string;
  loading: boolean;
}

export default function SmartResizeTool() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fit, setFit] = useState<'cover' | 'contain' | 'fill'>('cover');
  const [bgColor, setBgColor] = useState('#000000');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(PLATFORM_SIZES.map(s => s.id));
  const [resizedImages, setResizedImages] = useState<ResizedImage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setGenerated(false);
      setResizedImages([]);
    };
    reader.readAsDataURL(file);
  }

  function toggleSize(id: string) {
    setSelectedSizes(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  function togglePlatformAll(platform: string) {
    const platformSizes = PLATFORM_SIZES.filter(s => s.platform === platform).map(s => s.id);
    const allSelected = platformSizes.every(id => selectedSizes.includes(id));
    if (allSelected) {
      setSelectedSizes(prev => prev.filter(id => !platformSizes.includes(id)));
    } else {
      setSelectedSizes(prev => [...new Set([...prev, ...platformSizes])]);
    }
  }

  const filteredSizes = selectedPlatform === 'All'
    ? PLATFORM_SIZES
    : PLATFORM_SIZES.filter(s => s.platform === selectedPlatform);

  async function generateAll() {
    if (!uploadedImage) return;
    setGenerating(true);
    setGenerated(false);
    const toGenerate = PLATFORM_SIZES.filter(s => selectedSizes.includes(s.id));
    const results: ResizedImage[] = toGenerate.map(s => ({ sizeId: s.id, dataUrl: '', loading: true }));
    setResizedImages(results);

    for (let i = 0; i < toGenerate.size; i++) {
      const size = toGenerate[i];
      try {
        const dataUrl = await resizeImageOnCanvas(uploadedImage, size.w, size.h, fit, bgColor);
        setResizedImages(prev => prev.map(r => r.sizeId === size.id ? { ...r, dataUrl, loading: false } : r));
      } catch {
        setResizedImages(prev => prev.map(r => r.sizeId === size.id ? { ...r, loading: false } : r));
      }
    }

    // Fix: iterate correctly
    const results2: ResizedImage[] = [];
    for (const size of toGenerate) {
      try {
        const dataUrl = await resizeImageOnCanvas(uploadedImage, size.w, size.h, fit, bgColor);
        results2.push({ sizeId: size.id, dataUrl, loading: false });
      } catch {
        results2.push({ sizeId: size.id, dataUrl: '', loading: false });
      }
    }
    setResizedImages(results2);
    setGenerating(false);
    setGenerated(true);
  }

  function downloadImage(dataUrl: string, filename: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  function downloadAll() {
    resizedImages.forEach((img, i) => {
      if (!img.dataUrl) return;
      const size = PLATFORM_SIZES.find(s => s.id === img.sizeId);
      if (!size) return;
      setTimeout(() => downloadImage(img.dataUrl, `${size.platform}-${size.name}-${size.w}x${size.h}.jpg`), i * 300);
    });
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">🔄 Smart Resize</h1>
        <p className="text-gray-400 text-sm mt-1">Upload one creative → auto-resize to all platform sizes instantly</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT — Upload + Settings */}
        <div className="space-y-4">
          {/* Upload */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all ${dragOver ? 'border-purple-400 bg-purple-900/20' : 'border-gray-700 hover:border-purple-500/50'}`}
            style={{ minHeight: uploadedImage ? 'auto' : 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {uploadedImage ? (
              <div className="relative w-full">
                <img src={uploadedImage} alt="Source" className="w-full rounded-2xl object-contain max-h-52" />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <p className="text-white font-bold text-sm">Click to change</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-white font-bold text-sm mb-1">Upload Your Creative</p>
                <p className="text-gray-400 text-xs">Drag & drop or click · JPG, PNG, WebP</p>
              </div>
            )}
          </div>

          {/* Resize Options */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white">⚙️ Resize Options</h3>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">Fit Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cover', label: '📐 Cover', desc: 'Fill & crop' },
                  { id: 'contain', label: '🖼️ Contain', desc: 'Full image' },
                  { id: 'fill', label: '↔️ Stretch', desc: 'Stretch fit' },
                ].map(f => (
                  <button key={f.id} onClick={() => setFit(f.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all ${fit === f.id ? 'border-purple-500 bg-purple-900/30 text-purple-300' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                    <p className="text-xs font-bold">{f.label}</p>
                    <p className="text-xs opacity-60">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Background Color (for contain mode)</label>
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-9 rounded cursor-pointer border-0" />
                <div className="flex gap-1.5 flex-wrap">
                  {['#000000', '#FFFFFF', '#1a1a2e', '#0d1117', '#f5f5f5'].map(c => (
                    <button key={c} onClick={() => setBgColor(c)} style={{ backgroundColor: c, border: bgColor === c ? '2px solid #a78bfa' : '1px solid #4a4a6a' }}
                      className="w-7 h-7 rounded-lg transition-all" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">📐 Select Sizes</h3>
              <span className="text-xs text-purple-400">{selectedSizes.length}/{PLATFORM_SIZES.length} selected</span>
            </div>

            {/* Platform filter */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setSelectedPlatform(p)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-all ${selectedPlatform === p ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {filteredSizes.map(size => (
                <div key={size.id} onClick={() => toggleSize(size.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${selectedSizes.includes(size.id) ? 'border-purple-500/40 bg-purple-900/20' : 'border-gray-800 hover:border-gray-600'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{size.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-white">{size.platform} — {size.name}</p>
                      <p className="text-xs text-gray-500">{size.w}×{size.h} · {size.ratio}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selectedSizes.includes(size.id) ? 'bg-purple-600 border-purple-600' : 'border-gray-600'}`}>
                    {selectedSizes.includes(size.id) && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={generateAll} disabled={!uploadedImage || generating || selectedSizes.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all ${!uploadedImage || generating || selectedSizes.length === 0 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg'}`}>
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                Resizing {selectedSizes.length} creatives...
              </span>
            ) : `⚡ Generate ${selectedSizes.length} Sizes`}
          </button>
        </div>

        {/* RIGHT — Results Grid */}
        <div className="xl:col-span-2">
          {!generated && !generating && (
            <div className="flex flex-col items-center justify-center h-full py-20 bg-gray-900 border border-gray-800 rounded-2xl text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-lg font-bold text-white mb-2">One Creative, All Sizes</h3>
              <p className="text-gray-400 text-sm max-w-sm mb-6">Upload your creative, select platforms, and get perfectly resized versions for every platform instantly.</p>
              <div className="grid grid-cols-3 gap-3 max-w-xs">
                {['FB Feed 1:1', 'IG Story 9:16', 'LI Post', 'YT Thumb', 'WA Status', 'IG Portrait'].map(s => (
                  <div key={s} className="bg-gray-800 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-xs text-gray-300">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(generating || generated) && (
            <div>
              {generated && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-green-400">✅ {resizedImages.length} sizes generated!</p>
                  <button onClick={downloadAll} className="text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-bold transition-colors">
                    ⬇️ Download All
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PLATFORM_SIZES.filter(s => selectedSizes.includes(s.id)).map(size => {
                  const result = resizedImages.find(r => r.sizeId === size.id);
                  const isLoading = generating && !result?.dataUrl;

                  return (
                    <div key={size.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                      {/* Preview */}
                      <div className="relative bg-gray-800" style={{ paddingBottom: `${Math.min((size.h / size.w) * 100, 120)}%` }}>
                        {isLoading ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : result?.dataUrl ? (
                          <img src={result.dataUrl} alt={size.name} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gray-600 text-2xl">⏳</span>
                          </div>
                        )}

                        {/* Size badge */}
                        <div className="absolute top-1.5 left-1.5">
                          <span style={{ backgroundColor: size.color }} className="text-white text-xs px-2 py-0.5 rounded-full font-bold opacity-90">
                            {size.ratio}
                          </span>
                        </div>
                      </div>

                      {/* Info + Download */}
                      <div className="p-2.5">
                        <p className="text-xs font-bold text-white truncate">{size.platform}</p>
                        <p className="text-xs text-gray-400">{size.name}</p>
                        <p className="text-xs text-gray-500 mb-2">{size.w}×{size.h}px</p>
                        {result?.dataUrl && (
                          <button
                            onClick={() => downloadImage(result.dataUrl, `${size.platform}-${size.name}-${size.w}x${size.h}.jpg`)}
                            className="w-full text-xs bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white py-1.5 rounded-lg font-medium transition-all">
                            ⬇️ Download
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
