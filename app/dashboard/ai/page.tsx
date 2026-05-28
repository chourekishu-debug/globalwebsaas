'use client'
import { useState } from 'react'

const TOOLS = [
  { key:'adcopy',   label:'Ad Copy',      icon:'📢', desc:'3 variations with quality scores' },
  { key:'headline', label:'Headlines',    icon:'🎯', desc:'5 powerful headline variants' },
  { key:'post',     label:'Social Post',  icon:'📱', desc:'Full post with hook & CTA' },
  { key:'article',  label:'Article',      icon:'📰', desc:'700+ word long-form content' },
  { key:'reel',     label:'Reel Script',  icon:'🎬', desc:'Hook + voiceover + slides' },
  { key:'hashtags', label:'Hashtags',     icon:'#️⃣', desc:'20 high-reach tags' },
  { key:'caption',  label:'Captions',     icon:'✍️', desc:'Platform-specific captions' },
  { key:'audience', label:'Audience AI',  icon:'👥', desc:'3 targeting segments' },
]
const PLATFORMS = ['Meta','Google','LinkedIn','Instagram','WhatsApp']
const TONES     = ['Professional','Casual & Friendly','Humorous','Inspirational','Educational','Promotional']

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

  const generate = async () => {
    if (!product.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai/generate', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ type:tool, product, platform:platform.toLowerCase(), tone, cta }),
      })
      const { data, demo } = await res.json()
      setResult({ data, demo, type:tool })
      setHistory(p => [{ tool, platform, product, data, time:new Date().toLocaleTimeString() }, ...p.slice(0,4)])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom:18 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, margin:'0 0 4px' }}>🤖 AI Content Generator</h2>
        <p style={{ color:'#9090b8', fontSize:13, margin:0 }}>Powered by AI · Describe your product → Get ready-to-publish content instantly</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:16 }}>
        {/* Left: Controls */}
        <div>
          {/* Tool selector */}
          <div className="card" style={{ marginBottom:12 }}>
            <div style={{ fontSize:12, color:'#9090b8', fontWeight:600, marginBottom:10 }}>CONTENT TYPE</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
              {TOOLS.map(t => (
                <div key={t.key} onClick={() => setTool(t.key)}
                  style={{ padding:'9px 10px', borderRadius:10, border:`1.5px solid ${tool===t.key?'#6c47ff':'rgba(255,255,255,.07)'}`, background:tool===t.key?'rgba(108,71,255,.1)':'rgba(255,255,255,.03)', cursor:'pointer', transition:'all .2s' }}>
                  <div style={{ fontSize:16, marginBottom:3 }}>{t.icon}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:tool===t.key?'#c4b5fd':'#f0f0ff' }}>{t.label}</div>
                  <div style={{ fontSize:9, color:'#5a5a80', marginTop:2 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="card" style={{ marginBottom:12 }}>
            <div className="input-group">
              <label>Product / Business *</label>
              <textarea className="input-field" rows={3}
                placeholder="e.g. Health supplement for men over 40 that boosts energy and stamina naturally"
                value={product} onChange={e => setProduct(e.target.value)} style={{ resize:'none' }}/>
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
              <input className="input-field" placeholder="e.g. Shop Now, Book Free Demo, Learn More"
                value={cta} onChange={e => setCta(e.target.value)}/>
            </div>
          </div>

          <button onClick={generate} disabled={loading || !product.trim()} className="btn btn-primary btn-full" style={{ padding:'13px', fontSize:14 }}>
            {loading ? (
              <><div className="spin-anim" style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%' }}/> AI Writing…</>
            ) : '⚡ Generate with AI'}
          </button>
        </div>

        {/* Right: Results */}
        <div>
          {!result && !loading && (
            <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400, textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🤖</div>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, marginBottom:8 }}>Ready to Generate</h3>
              <p style={{ color:'#9090b8', fontSize:13, maxWidth:320 }}>Fill in your product details on the left and click Generate. Your AI content appears here in seconds.</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', marginTop:16 }}>
                {['Score: 94/100','Platform-specific','Ready in seconds','Copy with one click'].map(t => (
                  <div key={t} style={{ padding:'4px 12px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:11, color:'#c4b5fd' }}>{t}</div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400 }}>
              <div className="spin-anim" style={{ width:36, height:36, border:'3px solid rgba(108,71,255,.2)', borderTopColor:'#6c47ff', borderRadius:'50%', marginBottom:16 }}/>
              <p style={{ color:'#9090b8', fontSize:13 }}>AI is writing your content…</p>
            </div>
          )}

          {result && !loading && (
            <div className="fade-in">
              {result.demo && (
                <div style={{ padding:'8px 14px', background:'rgba(255,211,42,.08)', border:'1px solid rgba(255,211,42,.2)', borderRadius:10, marginBottom:12, fontSize:12, color:'#ffd32a' }}>
                  ⚠️ Demo content · Add OpenRouter key in Settings → API Keys for real AI generation
                </div>
              )}

              {/* Ad Copy */}
              {tool === 'adcopy' && Array.isArray(result.data) && result.data.map((ad: any, i: number) => (
                <div key={i} className="card" style={{ marginBottom:12, borderLeft:`3px solid ${['#6c47ff','#ff4791','#00d4aa'][i]}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div>
                      <div style={{ fontSize:11, color:'#9090b8', marginBottom:4 }}>Variation {i+1}</div>
                      <div style={{ fontSize:15, fontWeight:700, color:'#f0f0ff', marginBottom:6 }}>{ad.headline}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:22, fontWeight:800, fontFamily:'Syne,sans-serif', color:'#00d4aa' }}>{ad.score}</div>
                      <div style={{ fontSize:9, color:'#9090b8' }}>Score/100</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, color:'#9090b8', lineHeight:1.6, marginBottom:10 }}>{ad.description}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ padding:'3px 10px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:11, color:'#c4b5fd' }}>CTA: {ad.cta}</div>
                    <button onClick={() => copy(`${ad.headline}\n\n${ad.description}\n\n${ad.cta}`, `ad-${i}`)} className="btn btn-secondary btn-sm">
                      {copied===`ad-${i}` ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Post */}
              {tool === 'post' && result.data && (
                <div className="card" style={{ borderLeft:'3px solid #3b82f6' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <h4 style={{ margin:0, fontSize:14, fontWeight:700 }}>📱 Social Post</h4>
                    <button onClick={() => copy(result.data.caption, 'post')} className="btn btn-secondary btn-sm">{copied==='post'?'✓ Copied':'📋 Copy'}</button>
                  </div>
                  <div style={{ background:'rgba(255,255,255,.04)', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#f0f0ff', lineHeight:1.75, whiteSpace:'pre-wrap', marginBottom:12 }}>{result.data.caption}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {result.data.hashtags?.map((h: string) => (
                      <div key={h} style={{ padding:'2px 8px', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', borderRadius:20, fontSize:10, color:'#93c5fd' }}>{h}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {tool === 'hashtags' && result.data && (
                <div className="card">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <h4 style={{ margin:0, fontSize:14, fontWeight:700 }}>#️⃣ 20 AI Hashtags</h4>
                    <button onClick={() => copy(result.data.hashtags?.join(' '), 'hash')} className="btn btn-secondary btn-sm">{copied==='hash'?'✓ Copied':'📋 Copy All'}</button>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:12 }}>
                    {result.data.hashtags?.map((h: string) => (
                      <div key={h} onClick={() => copy(h, h)} style={{ cursor:'pointer', padding:'3px 10px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:11, color:'#c4b5fd' }}>{h}</div>
                    ))}
                  </div>
                  <div style={{ padding:'10px 12px', background:'rgba(108,71,255,.06)', borderRadius:10, fontSize:12, color:'#9090b8' }}>💡 {result.data.strategy}</div>
                </div>
              )}

              {/* Reel */}
              {tool === 'reel' && result.data && (
                <div className="card">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <h4 style={{ margin:0, fontSize:14, fontWeight:700 }}>🎬 Reel Script</h4>
                    <div style={{ display:'flex', gap:8 }}>
                      <div style={{ padding:'2px 8px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:10, color:'#c4b5fd' }}>{result.data.duration}</div>
                      <div style={{ padding:'2px 8px', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', borderRadius:20, fontSize:10, color:'#93c5fd' }}>🎵 {result.data.musicMood}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#ff4791', letterSpacing:1, marginBottom:6 }}>🎣 HOOK (First 3 seconds)</div>
                    <div style={{ background:'rgba(255,71,145,.08)', border:'1px solid rgba(255,71,145,.2)', borderRadius:10, padding:'10px 12px', fontSize:15, fontWeight:700 }}>{result.data.hook}</div>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#6c47ff', letterSpacing:1, marginBottom:6 }}>🎙️ VOICEOVER</div>
                    <div style={{ background:'rgba(255,255,255,.04)', borderRadius:10, padding:'10px 12px', fontSize:13, color:'#9090b8', lineHeight:1.6 }}>{result.data.voiceover}</div>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#00d4aa', letterSpacing:1, marginBottom:8 }}>📱 ON-SCREEN TEXT</div>
                    {result.data.onScreenText?.map((t: string, i: number) => (
                      <div key={i} style={{ display:'flex', gap:10, marginBottom:6 }}>
                        <div style={{ width:20, height:20, borderRadius:6, background:'rgba(0,212,170,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#00d4aa', flexShrink:0 }}>{i+1}</div>
                        <div style={{ fontSize:12, color:'#9090b8' }}>{t}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => copy(`HOOK: ${result.data.hook}\n\nVOICEOVER:\n${result.data.voiceover}\n\nCTA: ${result.data.cta}`, 'reel')} className="btn btn-secondary btn-sm">
                    {copied==='reel'?'✓ Copied':'📋 Copy Script'}
                  </button>
                </div>
              )}

              {/* Article */}
              {tool === 'article' && result.data && (
                <div className="card">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <div>
                      <h4 style={{ margin:'0 0 4px', fontSize:15, fontWeight:700 }}>{result.data.title}</h4>
                      <div style={{ display:'flex', gap:8 }}>
                        <div style={{ padding:'2px 8px', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', borderRadius:20, fontSize:10, color:'#93c5fd' }}>{result.data.wordCount} words</div>
                        <div style={{ padding:'2px 8px', background:'rgba(0,212,170,.15)', border:'1px solid rgba(0,212,170,.3)', borderRadius:20, fontSize:10, color:'#00d4aa' }}>{result.data.readTime} read</div>
                      </div>
                    </div>
                    <button onClick={() => copy([result.data.title, result.data.intro, ...(result.data.sections||[]).map((s:any)=>`${s.heading}\n${s.content}`), result.data.conclusion].join('\n\n'), 'art')} className="btn btn-secondary btn-sm">
                      {copied==='art'?'✓ Copied':'📋 Copy'}
                    </button>
                  </div>
                  <div style={{ fontSize:13, color:'#9090b8', lineHeight:1.65, marginBottom:10 }}><strong style={{ color:'#f0f0ff' }}>Intro:</strong> {result.data.intro}</div>
                  {result.data.sections?.map((s:any, i:number) => (
                    <div key={i} style={{ marginBottom:10, paddingLeft:12, borderLeft:'2px solid #6c47ff' }}>
                      <div style={{ fontSize:13, fontWeight:700, marginBottom:3 }}>{s.heading}</div>
                      <div style={{ fontSize:12, color:'#9090b8', lineHeight:1.6 }}>{s.content}</div>
                    </div>
                  ))}
                  <div style={{ fontSize:12, color:'#9090b8', lineHeight:1.65 }}><strong style={{ color:'#f0f0ff' }}>Conclusion:</strong> {result.data.conclusion}</div>
                </div>
              )}

              {/* Audience */}
              {tool === 'audience' && Array.isArray(result.data) && result.data.map((seg: any, i: number) => (
                <div key={i} className="card" style={{ marginBottom:12 }}>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>{seg.segment}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
                    {[['Age',seg.age],['Gender',seg.gender],['Est. Size',seg.size],['Est. CPL',seg.cpl]].map(([k,v]) => (
                      <div key={k} style={{ background:'rgba(255,255,255,.04)', borderRadius:8, padding:'7px 10px' }}>
                        <div style={{ fontSize:10, color:'#5a5a80' }}>{k}</div>
                        <div style={{ fontSize:12, fontWeight:600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {seg.interests?.map((int: string) => (
                      <div key={int} style={{ padding:'2px 8px', background:'rgba(108,71,255,.15)', border:'1px solid rgba(108,71,255,.3)', borderRadius:20, fontSize:10, color:'#c4b5fd' }}>{int}</div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Headline */}
              {tool === 'headline' && Array.isArray(result.data) && result.data.map((h: any, i: number) => (
                <div key={i} className="card" style={{ marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:5 }}>{h.headline}</div>
                    <div style={{ padding:'2px 8px', background:'rgba(59,130,246,.15)', border:'1px solid rgba(59,130,246,.3)', borderRadius:20, fontSize:10, color:'#93c5fd', display:'inline-block' }}>{h.type}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5 }}>
                    <div style={{ fontSize:20, fontWeight:800, fontFamily:'Syne,sans-serif', color:'#00d4aa' }}>{h.score}</div>
                    <button onClick={() => copy(h.headline, `h${i}`)} className="btn btn-secondary btn-sm">{copied===`h${i}`?'✓':'📋'}</button>
                  </div>
                </div>
              ))}

              {/* Caption */}
              {tool === 'caption' && Array.isArray(result.data) && result.data.map((c: any, i: number) => (
                <div key={i} className="card" style={{ marginBottom:12, borderLeft:'3px solid #a855f7' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <div style={{ padding:'2px 8px', background:'rgba(168,85,247,.15)', border:'1px solid rgba(168,85,247,.3)', borderRadius:20, fontSize:10, color:'#d8b4fe' }}>{c.tone}</div>
                    <button onClick={() => copy(c.caption, `cap${i}`)} className="btn btn-secondary btn-sm">{copied===`cap${i}`?'✓ Copied':'📋 Copy'}</button>
                  </div>
                  <div style={{ fontSize:13, color:'#f0f0ff', lineHeight:1.65 }}>{c.caption}</div>
                </div>
              ))}

              {/* History */}
              {history.length > 0 && (
                <div className="card" style={{ marginTop:14 }}>
                  <div style={{ fontSize:12, color:'#9090b8', fontWeight:600, marginBottom:10 }}>RECENT GENERATIONS</div>
                  {history.slice(0,3).map((h, i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:500 }}>{h.product.slice(0,40)}…</div>
                        <div style={{ fontSize:10, color:'#9090b8' }}>{h.tool} · {h.platform}</div>
                      </div>
                      <div style={{ fontSize:10, color:'#5a5a80' }}>{h.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
