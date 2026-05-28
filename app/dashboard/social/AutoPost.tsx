// ============================================================
// AutoPost Component — One-Click Full Automation
// Topic → AI Content + AI Image → Published to FB/LI/IG
// ============================================================
'use client'
import { useState } from 'react'

interface AutoPostProps {
  platformStatus: Record<string, { connected: boolean }>
  onPostCreated: (post: any) => void
}

const IMAGE_STYLES = [
  { key:'photorealistic', label:'Photo',        icon:'📷', desc:'Real photography style' },
  { key:'digital-art',    label:'Digital Art',  icon:'🎨', desc:'Illustrated/graphic style' },
  { key:'minimalist',     label:'Minimalist',   icon:'⬜', desc:'Clean, white background' },
  { key:'corporate',      label:'Corporate',    icon:'🏢', desc:'Professional business style' },
]

const PLATFORMS_CFG = [
  { key:'facebook',  label:'Facebook',  icon:'📘', color:'#1877F2' },
  { key:'linkedin',  label:'LinkedIn',  icon:'💼', color:'#0A66C2' },
  { key:'instagram', label:'Instagram', icon:'📷', color:'#E1306C' },
]

const LOG_STEPS = [
  { icon:'🤖', label:'AI writing content…',      delay:0 },
  { icon:'🎨', label:'Generating image with AI…', delay:2000 },
  { icon:'📤', label:'Publishing to platforms…',  delay:4500 },
]

export default function AutoPost({ platformStatus, onPostCreated }: AutoPostProps) {
  const [topic, setTopic] = useState('')
  const [contentType, setContentType] = useState<'post'|'article'|'reel'>('post')
  const [platforms, setPlatforms] = useState<string[]>(['facebook','linkedin'])
  const [imageStyle, setImageStyle] = useState('photorealistic')
  const [tone, setTone] = useState('professional')
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)
  const [liveStep, setLiveStep] = useState(-1)
  const [imagePreview, setImagePreview] = useState('')

  const togglePlatform = (p: string) =>
    setPlatforms(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p])

  const run = async () => {
    if (!topic.trim() || platforms.length === 0) return
    setRunning(true); setLogs([]); setResult(null); setImagePreview(''); setLiveStep(0)

    // Animate live steps
    for (let i = 0; i < LOG_STEPS.length; i++) {
      setTimeout(() => setLiveStep(i), LOG_STEPS[i].delay)
    }

    // Show AI image preview from Pollinations while waiting
    setTimeout(() => {
      const previewUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + ', professional social media, high quality')}?width=400&height=300&nologo=true`
      setImagePreview(previewUrl)
    }, 2500)

    try {
      const res = await fetch('/api/social/auto-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          type: contentType,
          platforms,
          tone,
          style: imageStyle,
          generateImageAuto: true,
        }),
      })
      const data = await res.json()

      if (data.success) {
        setLogs(data.data.logs || [])
        setResult(data.data)
        setLiveStep(3)
        if (data.data.image?.url) setImagePreview(data.data.image.url)

        // Notify parent
        onPostCreated({
          id: Date.now().toString(),
          title: data.data.content.title || topic,
          content: data.data.content.text,
          type: contentType,
          platforms,
          status: 'published',
          scheduledAt: new Date().toISOString(),
          hashtags: data.data.content.hashtags,
          imageUrl: data.data.image?.url || null,
        })
      } else {
        setLogs([`Error: ${data.error}`])
      }
    } catch (e: any) {
      setLogs([`Error: ${e.message}`])
    }

    setRunning(false)
  }

  const reset = () => {
    setResult(null); setLogs([]); setTopic('')
    setLiveStep(-1); setImagePreview('')
  }

  return (
    <div>
      {/* Hero banner */}
      <div style={{ background:'linear-gradient(135deg,rgba(108,71,255,.15),rgba(255,71,145,.1))', border:'1px solid rgba(108,71,255,.3)', borderRadius:16, padding:20, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#6c47ff,#ff4791)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>⚡</div>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:800 }}>One-Click Full Automation</div>
            <div style={{ fontSize:13, color:'#9090b8' }}>Topic → AI writes content + AI generates image → Posts to all platforms automatically</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {['Zero manual work','AI image included','Real API posting','Facebook + LinkedIn + Instagram'].map(t => (
            <div key={t} className="badge badge-purple" style={{ fontSize:11 }}>✓ {t}</div>
          ))}
        </div>
      </div>

      {!result && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {/* Left: Config */}
          <div>
            {/* Topic */}
            <div className="card" style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:10 }}>WHAT TO POST ABOUT *</div>
              <textarea
                className="input-field"
                rows={3}
                placeholder="e.g. How AI marketing automation saves businesses ₹50,000 per month and delivers 6x better results"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                style={{ resize:'none', marginBottom:10 }}
              />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div>
                  <div style={{ fontSize:11, color:'#9090b8', marginBottom:6, fontWeight:600 }}>CONTENT TYPE</div>
                  <select className="input-field" value={contentType} onChange={e => setContentType(e.target.value as any)}>
                    <option value="post">📝 Social Post</option>
                    <option value="article">📰 Article (700 words)</option>
                    <option value="reel">🎬 Reel Script</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'#9090b8', marginBottom:6, fontWeight:600 }}>TONE</div>
                  <select className="input-field" value={tone} onChange={e => setTone(e.target.value)}>
                    {['professional','casual','inspirational','educational','promotional'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div className="card" style={{ marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:10 }}>POST TO PLATFORMS</div>
              {PLATFORMS_CFG.map(p => {
                const connected = platformStatus[p.key]?.connected
                const selected = platforms.includes(p.key)
                return (
                  <div key={p.key} onClick={() => togglePlatform(p.key)}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:11, border:`1.5px solid ${selected?p.color:'rgba(255,255,255,.07)'}`, background:selected?`${p.color}12`:'transparent', cursor:'pointer', marginBottom:7, transition:'all .2s' }}>
                    <span style={{ fontSize:18 }}>{p.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600 }}>{p.label}</div>
                      <div style={{ fontSize:10, color:'#9090b8' }}>{connected?'🟢 Real posting enabled':'🟡 Demo mode — add token in Settings'}</div>
                    </div>
                    <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${selected?p.color:'rgba(255,255,255,.2)'}`, background:selected?p.color:'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#fff' }}>
                      {selected && '✓'}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Image style */}
            <div className="card" style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:10 }}>AI IMAGE STYLE</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
                {IMAGE_STYLES.map(s => (
                  <div key={s.key} onClick={() => setImageStyle(s.key)}
                    style={{ padding:'9px 11px', borderRadius:10, border:`1.5px solid ${imageStyle===s.key?'#6c47ff':'rgba(255,255,255,.07)'}`, background:imageStyle===s.key?'rgba(108,71,255,.1)':'transparent', cursor:'pointer', transition:'all .2s' }}>
                    <div style={{ fontSize:18, marginBottom:3 }}>{s.icon}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:imageStyle===s.key?'#c4b5fd':'#f0f0ff' }}>{s.label}</div>
                    <div style={{ fontSize:10, color:'#5a5a80' }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, padding:'8px 10px', background:'rgba(0,212,170,.06)', border:'1px solid rgba(0,212,170,.15)', borderRadius:9, fontSize:11, color:'#00d4aa' }}>
                ✓ Free AI image via Pollinations.ai · No extra cost · No API key needed
              </div>
            </div>

            {/* Launch button */}
            <button
              onClick={run}
              disabled={running || !topic.trim() || platforms.length === 0}
              style={{ width:'100%', padding:'15px', borderRadius:13, border:'none', background:running?'rgba(108,71,255,.4)':'linear-gradient(135deg,#6c47ff,#ff4791)', color:'#fff', fontSize:15, fontWeight:700, cursor:running?'not-allowed':'pointer', fontFamily:'Syne,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all .3s' }}>
              {running ? (
                <><div style={{ width:18,height:18,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 1s linear infinite' }}/>Running Full Automation…</>
              ) : '⚡ Generate + Post Automatically'}
            </button>
            {platforms.length === 0 && <div style={{ fontSize:11, color:'#ff4757', textAlign:'center', marginTop:7 }}>Select at least one platform</div>}
          </div>

          {/* Right: Live preview / status */}
          <div>
            {liveStep === -1 && (
              <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400, textAlign:'center' }}>
                <div style={{ fontSize:52, marginBottom:16 }}>🚀</div>
                <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, marginBottom:8 }}>Full Automation Ready</h3>
                <p style={{ color:'#9090b8', fontSize:13, maxWidth:280, lineHeight:1.65 }}>
                  Fill in your topic → click the button → our system does everything in 10-15 seconds:
                </p>
                <div style={{ textAlign:'left', marginTop:16, display:'flex', flexDirection:'column', gap:8 }}>
                  {['AI writes your post or article','AI generates a matching image','Image auto-attaches to post','Posts to Facebook, LinkedIn & Instagram'].map((t,i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'center' }}>
                      <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(108,71,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#6c47ff', flexShrink:0 }}>{i+1}</div>
                      <span style={{ fontSize:13, color:'#9090b8' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {running && liveStep >= 0 && (
              <div>
                {/* Live steps */}
                <div className="card" style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:14 }}>AUTOMATION IN PROGRESS</div>
                  {LOG_STEPS.map((s, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<LOG_STEPS.length-1?'1px solid rgba(255,255,255,.05)':'none' }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:i<liveStep?'rgba(0,212,170,.2)':i===liveStep?'rgba(108,71,255,.2)':'rgba(255,255,255,.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, transition:'all .4s' }}>
                        {i < liveStep ? '✓' : s.icon}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:i<liveStep?'#00d4aa':i===liveStep?'#c4b5fd':'#9090b8' }}>{s.label}</div>
                        {i === liveStep && <div style={{ fontSize:11, color:'#6c47ff', marginTop:2 }}>Running…</div>}
                        {i < liveStep && <div style={{ fontSize:11, color:'#00d4aa', marginTop:2 }}>Done ✓</div>}
                      </div>
                      {i === liveStep && <div style={{ width:14,height:14,border:'2px solid rgba(108,71,255,.3)',borderTopColor:'#6c47ff',borderRadius:'50%',animation:'spin 1s linear infinite' }}/>}
                      {i < liveStep && <div style={{ color:'#00d4aa', fontSize:16 }}>✓</div>}
                    </div>
                  ))}
                </div>

                {/* AI Image preview */}
                {imagePreview && (
                  <div className="card">
                    <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:10 }}>AI GENERATED IMAGE</div>
                    <img
                      src={imagePreview}
                      alt="AI generated"
                      style={{ width:'100%', borderRadius:10, maxHeight:200, objectFit:'cover', background:'rgba(108,71,255,.1)' }}
                      onError={e => (e.currentTarget.style.display='none')}
                    />
                    <div style={{ fontSize:11, color:'#9090b8', marginTop:6 }}>Generated free via Pollinations.ai · Will attach to all posts</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {result && !running && (
        <div className="fade-in">
          {/* Success banner */}
          <div style={{ padding:'14px 18px', borderRadius:13, background:result.demo?'rgba(255,211,42,.08)':'rgba(0,212,170,.08)', border:`1px solid ${result.demo?'rgba(255,211,42,.25)':'rgba(0,212,170,.25)'}`, marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:26 }}>{result.demo ? '🟡' : '🎉'}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:result.demo?'#ffd32a':'#00d4aa', marginBottom:3 }}>
                {result.demo ? 'Auto-Posted in Demo Mode' : 'Successfully Auto-Posted!'}
              </div>
              <div style={{ fontSize:12, color:'#9090b8' }}>{result.summary}</div>
            </div>
            <div style={{ marginLeft:'auto', fontSize:12, color:'#5a5a80' }}>⏱ {result.elapsed}</div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            {/* Content preview */}
            <div className="card">
              <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:10 }}>GENERATED CONTENT</div>
              {result.content.title && <div style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>{result.content.title}</div>}
              <div style={{ fontSize:13, color:'#9090b8', lineHeight:1.65, marginBottom:10 }}>
                {result.content.text?.slice(0, 300)}{result.content.text?.length > 300 ? '…' : ''}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {result.content.hashtags?.slice(0,5).map((h: string, i: number) => (
                  <div key={i} className="badge badge-blue" style={{ fontSize:10 }}>{h}</div>
                ))}
              </div>
              <div style={{ fontSize:11, color:'#5a5a80', marginTop:8 }}>{result.content.wordCount} words · {result.content.type}</div>
            </div>

            {/* Image + publish results */}
            <div>
              {result.image && (
                <div className="card" style={{ marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:8 }}>AI GENERATED IMAGE</div>
                  <img src={result.image.url} alt="Generated" style={{ width:'100%', borderRadius:10, maxHeight:150, objectFit:'cover' }} onError={e=>(e.currentTarget.style.display='none')}/>
                  <div style={{ fontSize:10, color:'#9090b8', marginTop:5 }}>via {result.image.source}</div>
                </div>
              )}

              <div className="card">
                <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:10 }}>PLATFORM RESULTS</div>
                {result.published?.map((r: any, i: number) => {
                  const cfg = PLATFORMS_CFG.find(p=>p.key===r.platform)!
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                      <span style={{ fontSize:16 }}>{cfg?.icon||'📤'}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:r.success?'#f0f0ff':'#ff4757' }}>{cfg?.label||r.platform}</div>
                        <div style={{ fontSize:10, color:r.demo?'#ffd32a':r.success?'#00d4aa':'#ff4757' }}>
                          {r.demo ? 'Demo mode' : r.success ? 'Published ✓' : `Failed: ${r.error}`}
                        </div>
                      </div>
                      {r.postUrl && !r.demo && (
                        <a href={r.postUrl} target="_blank" style={{ fontSize:10, color:'#6c47ff', textDecoration:'none' }}>View →</a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Terminal logs */}
          <div style={{ background:'#060610', border:'1px solid rgba(108,71,255,.2)', borderRadius:12, padding:16, marginBottom:14 }}>
            <div style={{ fontFamily:'monospace', fontSize:11, color:'#9090b8' }}>
              {logs.map((l, i) => (
                <div key={i} style={{ marginBottom:3, color:l.includes('✓')?'#00d4aa':l.includes('✗')?'#ff4757':l.includes('Step')?'#c4b5fd':'#9090b8' }}>{l}</div>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={reset} className="btn btn-primary" style={{ flex:1 }}>⚡ Post Again</button>
            <button onClick={() => setResult(null)} className="btn btn-secondary">Edit Settings</button>
          </div>
        </div>
      )}
    </div>
  )
}
