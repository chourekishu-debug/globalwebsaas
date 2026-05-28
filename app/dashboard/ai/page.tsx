'use client'
import { useState } from 'react'

const TOOLS = [
  { key:'adcopy',   label:'Ad Copy',      icon:'📢', desc:'3 variations with quality scores' },
  { key:'headline', label:'Headlines',    icon:'🎯', desc:'5 powerful headline variants' },
  { key:'post',     label:'Social Post',  icon:'📱', desc:'Full post with hook & CTA' },
  { key:'article',  label:'Article',      icon:'📰', desc:'700+ word long-form content' },
  { key:'reel',     label:'Reel Script',  icon:'🎬', desc:'Hook + voiceover + slides' },
  { key:'hashtags', label:'Hashtags',     icon:'#️⃣', desc:'20 high-reach tags + strategy' },
  { key:'caption',  label:'Captions',     icon:'✍️', desc:'2 platform-specific captions' },
  { key:'audience', label:'Audience AI',  icon:'👥', desc:'3 targeting segments with CPL' },
]
const PLATFORMS = ['Meta','Google','LinkedIn','Instagram','WhatsApp']
const TONES     = ['Professional','Casual & Friendly','Humorous','Inspirational','Promotional']

export default function AIGeneratorPage() {
  const [tool, setTool]         = useState('adcopy')
  const [platform, setPlatform] = useState('Meta')
  const [tone, setTone]         = useState('Professional')
  const [product, setProduct]   = useState('')
  const [cta, setCta]           = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [copied, setCopied]     = useState<string|null>(null)
  const [history, setHistory]   = useState<any[]>([])
  const [error, setError]       = useState('')

  const generate = async () => {
    if (!product.trim() || loading) return
    setLoading(true); setResult(null); setError('')
    try {
      const res = await fetch('/api/ai/generate', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ type:tool, product, platform:platform.toLowerCase(), tone:tone.toLowerCase(), cta }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        setResult({ data: json.data, demo: json.demo, type: tool })
        setHistory(p => [{ tool, platform, product, time:new Date().toLocaleTimeString() }, ...p.slice(0,4)])
      } else {
        setError('Generation failed — please try again')
      }
    } catch(e) {
      setError('Network error — please check connection')
    }
    setLoading(false)
  }

  const copy = (text: string, id: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const d = result?.data

  return (
    <div className="fade-in">
      <div style={{ marginBottom:16 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, margin:'0 0 4px' }}>🤖 AI Content Generator</h2>
        <p style={{ color:'#9090b8', fontSize:13, margin:0 }}>Powered by AI · Type your business → get ready-to-publish content instantly</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:16 }}>
        {/* ── LEFT PANEL ── */}
        <div>
          <div className="card" style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:'#9090b8', fontWeight:600, marginBottom:10, letterSpacing:1 }}>CONTENT TYPE</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
              {TOOLS.map(t => (
                <div key={t.key} onClick={() => { setTool(t.key); setResult(null) }}
                  style={{ padding:'9px 10px', borderRadius:10, border:`1.5px solid ${tool===t.key?'#6c47ff':'rgba(255,255,255,.07)'}`, background:tool===t.key?'rgba(108,71,255,.12)':'rgba(255,255,255,.03)', cursor:'pointer', transition:'all .15s' }}>
                  <div style={{ fontSize:16, marginBottom:3 }}>{t.icon}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:tool===t.key?'#c4b5fd':'#f0f0ff' }}>{t.label}</div>
                  <div style={{ fontSize:9, color:'#5a5a80', marginTop:2 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom:12 }}>
            <div className="input-group">
              <label>Product / Business *</label>
              <textarea className="input-field" rows={3} style={{ resize:'none' }}
                placeholder="e.g. PSC Coaching Institute Indore, batch starts June 2026"
                value={product} onChange={e => setProduct(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter' && e.ctrlKey) generate() }}/>
            </div>
            <div className="input-group">
              <label>Platform</label>
              <select className="input-field" value={platform} onChange={e => setPlatform(e.target.value)}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Tone</label>
              <select className="input-field" value={tone} onChange={e => setTone(e.target.value)}>
                {TONES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom:0 }}>
              <label>Call to Action</label>
              <input className="input-field" placeholder="e.g. Book Free Demo, Enroll Now"
                value={cta} onChange={e => setCta(e.target.value)}/>
            </div>
          </div>

          <button onClick={generate} disabled={loading || !product.trim()} className="btn btn-primary btn-full" style={{ padding:'13px', fontSize:14 }}>
            {loading
              ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }}/>
                  AI Writing…
                </span>
              : '⚡ Generate with AI'}
          </button>

          {/* History */}
          {history.length > 0 && (
            <div className="card" style={{ marginTop:12 }}>
              <div style={{ fontSize:11, color:'#9090b8', fontWeight:600, marginBottom:8, letterSpacing:1 }}>RECENT</div>
              {history.map((h,i) => (
                <div key={i} style={{ padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,.04)', fontSize:11 }}>
                  <div style={{ color:'#f0f0ff', fontWeight:500 }}>{h.product.slice(0,30)}…</div>
                  <div style={{ color:'#5a5a80' }}>{h.tool} · {h.platform} · {h.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div>
          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400, textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🤖</div>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, marginBottom:8 }}>Ready to Generate</h3>
              <p style={{ color:'#9090b8', fontSize:13, maxWidth:320, lineHeight:1.6 }}>
                Fill in your product/business details on the left, select a content type, then click Generate.
              </p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', marginTop:16 }}>
                {['Works for any niche','8 content formats','Copy in one click','Platform-specific'].map(t => (
                  <div key={t} style={{ padding:'4px 12px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:11, color:'#c4b5fd' }}>{t}</div>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400 }}>
              <div style={{ width:40, height:40, border:'3px solid rgba(108,71,255,.2)', borderTopColor:'#6c47ff', borderRadius:'50%', animation:'spin 0.7s linear infinite', marginBottom:16 }}/>
              <p style={{ color:'#9090b8', fontSize:13 }}>AI is writing your content…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="card" style={{ textAlign:'center', padding:40 }}>
              <div style={{ fontSize:32, marginBottom:12 }}>⚠️</div>
              <div style={{ color:'#ff4757', fontSize:14 }}>{error}</div>
              <button onClick={generate} className="btn btn-secondary" style={{ marginTop:16 }}>Try Again</button>
            </div>
          )}

          {/* Results */}
          {result && !loading && d && (
            <div className="fade-in">
              {result.demo && (
                <div style={{ padding:'8px 14px', background:'rgba(255,211,42,.08)', border:'1px solid rgba(255,211,42,.2)', borderRadius:10, marginBottom:12, fontSize:12, color:'#ffd32a' }}>
                  ⚠️ Demo content based on your input · Add OpenRouter key in Settings → API Keys for real AI
                </div>
              )}

              {/* ── AD COPY ── */}
              {tool==='adcopy' && Array.isArray(d) && d.map((ad:any, i:number) => (
                <div key={i} className="card" style={{ marginBottom:12, borderLeft:`3px solid ${['#6c47ff','#ff4791','#00d4aa'][i]||'#6c47ff'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, color:'#9090b8', marginBottom:4 }}>Variation {i+1}</div>
                      <div style={{ fontSize:15, fontWeight:700, color:'#f0f0ff', marginBottom:6 }}>{ad.headline}</div>
                    </div>
                    <div style={{ textAlign:'right', marginLeft:12 }}>
                      <div style={{ fontSize:22, fontWeight:800, fontFamily:'Syne,sans-serif', color:'#00d4aa' }}>{ad.score}</div>
                      <div style={{ fontSize:9, color:'#9090b8' }}>Score/100</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, color:'#9090b8', lineHeight:1.6, marginBottom:10 }}>{ad.description}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ padding:'3px 10px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:11, color:'#c4b5fd' }}>CTA: {ad.cta}</div>
                    <button onClick={() => copy(`${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}`, `ad-${i}`)} className="btn btn-secondary btn-sm">
                      {copied===`ad-${i}` ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>
              ))}

              {/* ── HEADLINES ── */}
              {tool==='headline' && Array.isArray(d) && d.map((h:any, i:number) => (
                <div key={i} className="card" style={{ marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:6, color:'#f0f0ff' }}>{h.headline}</div>
                    <div style={{ padding:'2px 8px', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', borderRadius:20, fontSize:10, color:'#93c5fd', display:'inline-block' }}>{h.type}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, flexShrink:0 }}>
                    <div style={{ fontSize:22, fontWeight:800, fontFamily:'Syne,sans-serif', color:'#00d4aa' }}>{h.score}</div>
                    <button onClick={() => copy(h.headline, `h${i}`)} className="btn btn-secondary btn-sm">{copied===`h${i}`?'✓':'📋'}</button>
                  </div>
                </div>
              ))}

              {/* ── SOCIAL POST ── */}
              {tool==='post' && d && (
                <div className="card" style={{ borderLeft:'3px solid #3b82f6' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <h4 style={{ margin:0, fontSize:14, fontWeight:700 }}>📱 Social Post</h4>
                    <button onClick={() => copy(`${d.caption}\n\n${(d.hashtags||[]).join(' ')}`, 'post')} className="btn btn-secondary btn-sm">{copied==='post'?'✓ Copied':'📋 Copy'}</button>
                  </div>
                  {d.hook && <div style={{ padding:'8px 12px', background:'rgba(59,130,246,.1)', border:'1px solid rgba(59,130,246,.2)', borderRadius:8, fontSize:12, color:'#93c5fd', marginBottom:10 }}>🎣 Hook: {d.hook}</div>}
                  <div style={{ background:'rgba(255,255,255,.04)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#f0f0ff', lineHeight:1.75, whiteSpace:'pre-wrap', marginBottom:12 }}>
                    {d.caption || 'No caption generated'}
                  </div>
                  {d.cta && <div style={{ fontSize:12, color:'#00d4aa', marginBottom:10 }}>📢 CTA: {d.cta}</div>}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {(d.hashtags||[]).map((h:string) => (
                      <div key={h} onClick={() => copy(h,h)} style={{ cursor:'pointer', padding:'2px 8px', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', borderRadius:20, fontSize:10, color:'#93c5fd' }}>{h}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ARTICLE ── */}
              {tool==='article' && d && (
                <div className="card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                    <div>
                      <h4 style={{ margin:'0 0 6px', fontSize:15, fontWeight:700, color:'#f0f0ff' }}>{d.title}</h4>
                      <div style={{ display:'flex', gap:8 }}>
                        <div style={{ padding:'2px 8px', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', borderRadius:20, fontSize:10, color:'#93c5fd' }}>{d.wordCount||600} words</div>
                        <div style={{ padding:'2px 8px', background:'rgba(0,212,170,.15)', border:'1px solid rgba(0,212,170,.3)', borderRadius:20, fontSize:10, color:'#00d4aa' }}>{d.readTime||'3 min'} read</div>
                      </div>
                    </div>
                    <button onClick={() => copy([d.title, d.intro, ...(d.sections||[]).map((s:any)=>`${s.heading}\n\n${s.content}`), d.conclusion].join('\n\n'), 'art')} className="btn btn-secondary btn-sm">
                      {copied==='art'?'✓ Copied':'📋 Copy All'}
                    </button>
                  </div>
                  <div style={{ fontSize:13, color:'#9090b8', lineHeight:1.65, marginBottom:12 }}>
                    <strong style={{ color:'#f0f0ff' }}>Intro: </strong>{d.intro}
                  </div>
                  {(d.sections||[]).map((s:any, i:number) => (
                    <div key={i} style={{ marginBottom:12, paddingLeft:12, borderLeft:'2px solid #6c47ff' }}>
                      <div style={{ fontSize:13, fontWeight:700, marginBottom:4, color:'#f0f0ff' }}>{s.heading}</div>
                      <div style={{ fontSize:12, color:'#9090b8', lineHeight:1.65 }}>{s.content}</div>
                    </div>
                  ))}
                  <div style={{ fontSize:12, color:'#9090b8', lineHeight:1.65 }}>
                    <strong style={{ color:'#f0f0ff' }}>Conclusion: </strong>{d.conclusion}
                  </div>
                  {(d.hashtags||[]).length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:12 }}>
                      {d.hashtags.map((h:string) => <div key={h} style={{ padding:'2px 8px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:10, color:'#c4b5fd' }}>{h}</div>)}
                    </div>
                  )}
                </div>
              )}

              {/* ── REEL SCRIPT ── */}
              {tool==='reel' && d && (
                <div className="card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                    <h4 style={{ margin:0, fontSize:14, fontWeight:700 }}>🎬 Reel Script</h4>
                    <div style={{ display:'flex', gap:8 }}>
                      <div style={{ padding:'2px 8px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:10, color:'#c4b5fd' }}>{d.duration||'45s'}</div>
                      <div style={{ padding:'2px 8px', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', borderRadius:20, fontSize:10, color:'#93c5fd' }}>🎵 {d.musicMood||'upbeat'}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#ff4791', letterSpacing:1, marginBottom:6 }}>🎣 HOOK (First 3 seconds)</div>
                    <div style={{ background:'rgba(255,71,145,.08)', border:'1px solid rgba(255,71,145,.25)', borderRadius:10, padding:'12px 14px', fontSize:15, fontWeight:700, color:'#f0f0ff' }}>{d.hook}</div>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#6c47ff', letterSpacing:1, marginBottom:6 }}>🎙️ VOICEOVER</div>
                    <div style={{ background:'rgba(255,255,255,.04)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#9090b8', lineHeight:1.65 }}>{d.voiceover}</div>
                  </div>
                  {(d.onScreenText||[]).length > 0 && (
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'#00d4aa', letterSpacing:1, marginBottom:8 }}>📱 ON-SCREEN TEXT</div>
                      {d.onScreenText.map((t:string, i:number) => (
                        <div key={i} style={{ display:'flex', gap:10, marginBottom:6, alignItems:'flex-start' }}>
                          <div style={{ width:22, height:22, borderRadius:6, background:'rgba(0,212,170,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#00d4aa', flexShrink:0 }}>{i+1}</div>
                          <div style={{ fontSize:12, color:'#9090b8', paddingTop:3 }}>{t}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ padding:'8px 12px', background:'rgba(0,212,170,.08)', border:'1px solid rgba(0,212,170,.2)', borderRadius:8, fontSize:12, color:'#00d4aa', marginBottom:12 }}>
                    📢 CTA: {d.cta}
                  </div>
                  <button onClick={() => copy(`HOOK:\n${d.hook}\n\nVOICEOVER:\n${d.voiceover}\n\nON-SCREEN TEXT:\n${(d.onScreenText||[]).join('\n')}\n\nCTA: ${d.cta}`, 'reel')} className="btn btn-secondary btn-sm">
                    {copied==='reel'?'✓ Script Copied':'📋 Copy Full Script'}
                  </button>
                </div>
              )}

              {/* ── HASHTAGS ── */}
              {tool==='hashtags' && d && (
                <div className="card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <h4 style={{ margin:0, fontSize:14, fontWeight:700 }}>#️⃣ {(d.hashtags||[]).length} AI Hashtags</h4>
                    <button onClick={() => copy((d.hashtags||[]).join(' '), 'hash')} className="btn btn-secondary btn-sm">{copied==='hash'?'✓ Copied':'📋 Copy All'}</button>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:12 }}>
                    {(d.hashtags||[]).map((h:string) => (
                      <div key={h} onClick={() => copy(h,h)} style={{ cursor:'pointer', padding:'4px 12px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:11, color:'#c4b5fd', transition:'all .15s' }}>{h}</div>
                    ))}
                  </div>
                  {d.strategy && <div style={{ padding:'10px 14px', background:'rgba(108,71,255,.06)', borderRadius:10, fontSize:12, color:'#9090b8', lineHeight:1.6 }}>💡 Strategy: {d.strategy}</div>}
                </div>
              )}

              {/* ── CAPTIONS ── */}
              {tool==='caption' && Array.isArray(d) && d.map((c:any, i:number) => (
                <div key={i} className="card" style={{ marginBottom:12, borderLeft:'3px solid #a855f7' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <div style={{ padding:'3px 10px', background:'rgba(168,85,247,.15)', border:'1px solid rgba(168,85,247,.3)', borderRadius:20, fontSize:11, color:'#d8b4fe', fontWeight:600 }}>
                      {c.tone || `Version ${i+1}`}
                    </div>
                    <button onClick={() => copy(c.caption, `cap${i}`)} className="btn btn-secondary btn-sm">{copied===`cap${i}`?'✓ Copied':'📋 Copy'}</button>
                  </div>
                  <div style={{ fontSize:13, color:'#f0f0ff', lineHeight:1.75, whiteSpace:'pre-wrap' }}>{c.caption}</div>
                </div>
              ))}

              {/* ── AUDIENCE ── */}
              {tool==='audience' && Array.isArray(d) && d.map((seg:any, i:number) => (
                <div key={i} className="card" style={{ marginBottom:12 }}>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:10, color:'#f0f0ff' }}>
                    {['🥇','🥈','🥉'][i]} {seg.segment}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                    {[['Age',seg.age],['Gender',seg.gender],['Est. Size',seg.size],['Est. CPL',seg.cpl]].map(([k,v]) => (
                      <div key={String(k)} style={{ background:'rgba(255,255,255,.04)', borderRadius:8, padding:'8px 10px' }}>
                        <div style={{ fontSize:10, color:'#5a5a80', marginBottom:2 }}>{k}</div>
                        <div style={{ fontSize:12, fontWeight:600, color:'#f0f0ff' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:11, color:'#9090b8', marginBottom:8 }}>📍 {seg.locations}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {(seg.interests||[]).map((int:string) => (
                      <div key={int} style={{ padding:'2px 8px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:10, color:'#c4b5fd' }}>{int}</div>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
