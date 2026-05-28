'use client'
import { useState, useEffect, useRef } from 'react'
import AutoPost from './AutoPost'

// ── Types ─────────────────────────────────────────────────────
interface Post {
  id: string
  title: string
  content: string
  type: string
  platforms: string[]
  status: string
  scheduledAt: string | null
  hashtags: string[]
  imageUrl: string | null
  reach?: number
  likes?: number
  shares?: number
}

interface PublishResult {
  platform: string
  success: boolean
  postId?: string
  postUrl?: string
  error?: string
  demo?: boolean
}

interface PlatformStatus {
  connected: boolean
  features: string[]
  docs: string
  setupUrl: string
}

// ── Constants ─────────────────────────────────────────────────
const PLATFORMS = [
  { key:'facebook',  label:'Facebook',  icon:'📘', color:'#1877F2' },
  { key:'linkedin',  label:'LinkedIn',  icon:'💼', color:'#0A66C2' },
  { key:'instagram', label:'Instagram', icon:'📷', color:'#E1306C' },
]

const CONTENT_TYPES = [
  { key:'post',     label:'Social Post',   icon:'📝', desc:'Short caption + hashtags' },
  { key:'article',  label:'Article',       icon:'📰', desc:'700+ word long-form post' },
  { key:'reel',     label:'Reel Script',   icon:'🎬', desc:'Video script + captions' },
  { key:'carousel', label:'Carousel',      icon:'🎠', desc:'Multi-slide post' },
]

const TONES = ['Professional','Casual','Inspirational','Educational','Promotional','Humorous']

const PLATFORM_SUPPORTS: Record<string, string[]> = {
  facebook:  ['post','article','reel','carousel'],
  linkedin:  ['post','article','carousel'],
  instagram: ['post','reel','carousel','story'],
}

// ── Publish Terminal Component ─────────────────────────────────
function PublishTerminal({ results, onClose }: { results: PublishResult[], onClose: () => void }) {
  const PLATFORM_COLORS: Record<string,string> = { facebook:'#1877F2', linkedin:'#0A66C2', instagram:'#E1306C' }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', backdropFilter:'blur(8px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#0a0a1a', border:'1px solid rgba(108,71,255,.4)', borderRadius:18, width:'100%', maxWidth:520, overflow:'hidden' }}>
        {/* Terminal header */}
        <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#ff5f57' }}/>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#ffc12d' }}/>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#27c840' }}/>
          </div>
          <span style={{ fontFamily:'monospace', fontSize:12, color:'#9090b8' }}>global-web-ai — social publisher</span>
        </div>

        {/* Terminal body */}
        <div style={{ padding:20, fontFamily:'monospace', fontSize:13 }}>
          <div style={{ color:'#00d4aa', marginBottom:14 }}>$ publishing content to selected platforms...</div>

          {results.map((r, i) => (
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <span style={{ color:PLATFORM_COLORS[r.platform]||'#6c47ff', fontWeight:700 }}>[{r.platform.toUpperCase()}]</span>
                {r.success ? (
                  <span style={{ color:'#00d4aa' }}>✓ PUBLISHED SUCCESSFULLY</span>
                ) : (
                  <span style={{ color:'#ff4757' }}>✗ FAILED: {r.error}</span>
                )}
              </div>
              {r.demo && <div style={{ color:'#ffd32a', fontSize:11, paddingLeft:4 }}>  ⚠ Demo mode — add API keys in Settings to go live</div>}
              {r.postUrl && !r.demo && (
                <div style={{ paddingLeft:4 }}>
                  <span style={{ color:'#9090b8' }}>  Post URL: </span>
                  <a href={r.postUrl} target="_blank" style={{ color:'#6c47ff' }}>{r.postUrl}</a>
                </div>
              )}
              {r.postId && <div style={{ color:'#5a5a80', paddingLeft:4, fontSize:11 }}>  Post ID: {r.postId}</div>}
            </div>
          ))}

          <div style={{ marginTop:14, color:'#00d4aa' }}>
            {results.every(r=>r.success) ? '$ All platforms published ✓' : '$ Publishing complete (some platforms in demo mode)'}
          </div>
          <div style={{ color:'#5a5a80', marginTop:4, fontSize:11 }}>$ Press any key to close...</div>
        </div>

        <div style={{ padding:'12px 18px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', gap:10 }}>
          {results.filter(r=>r.postUrl&&!r.demo).map(r=>(
            <a key={r.platform} href={r.postUrl!} target="_blank"
              style={{ padding:'7px 14px', background:`${PLATFORM_COLORS[r.platform]||'#6c47ff'}20`, border:`1px solid ${PLATFORM_COLORS[r.platform]||'#6c47ff'}50`, borderRadius:9, fontSize:12, color:PLATFORM_COLORS[r.platform]||'#6c47ff', textDecoration:'none' }}>
              View on {r.platform} →
            </a>
          ))}
          <button onClick={onClose} style={{ marginLeft:'auto', padding:'7px 18px', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', borderRadius:9, fontSize:12, color:'#9090b8', cursor:'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Image Uploader Component ───────────────────────────────────
function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string|null>(null)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    if (!file) return
    setError(''); setUploading(true)

    // Preview
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/social/upload', { method:'POST', body:formData })
      const data = await res.json()
      if (data.success) {
        onUpload(data.url)
        if (data.demo) setError('Demo URL used — configure Supabase Storage for real uploads')
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (e) {
      setError('Upload failed — check your connection')
    }
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}/>

      {preview ? (
        <div style={{ position:'relative', borderRadius:12, overflow:'hidden', marginBottom:8 }}>
          <img src={preview} alt="Preview" style={{ width:'100%', height:140, objectFit:'cover', display:'block' }}/>
          <button onClick={() => { setPreview(null); onUpload('') }}
            style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,.7)', border:'none', borderRadius:'50%', width:28, height:28, color:'#fff', cursor:'pointer', fontSize:14 }}>×</button>
          {uploading && (
            <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:24, height:24, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{ border:'2px dashed rgba(108,71,255,.3)', borderRadius:12, padding:'24px 16px', textAlign:'center', cursor:'pointer', transition:'all .2s', background:'rgba(108,71,255,.04)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(108,71,255,.6)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(108,71,255,.3)')}>
          {uploading ? (
            <><div style={{ fontSize:20, marginBottom:6 }}>⏳</div><div style={{ fontSize:12, color:'#9090b8' }}>Uploading…</div></>
          ) : (
            <><div style={{ fontSize:28, marginBottom:8 }}>🖼️</div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Drop image or click to upload</div>
            <div style={{ fontSize:11, color:'#9090b8' }}>JPEG, PNG, GIF, WebP · Max 10MB</div>
            <div style={{ fontSize:11, color:'#9090b8' }}>Recommended: 1080×1080px for Instagram, 1200×630px for Facebook/LinkedIn</div></>
          )}
        </div>
      )}

      {error && <div style={{ fontSize:11, color:error.includes('Demo')?'#ffd32a':'#ff4757', marginTop:6, padding:'6px 10px', background:'rgba(255,71,87,.06)', borderRadius:7 }}>{error}</div>}
    </div>
  )
}

// ── Platform Status Badge ──────────────────────────────────────
function PlatformBadge({ platform, status }: { platform: any, status: PlatformStatus | undefined }) {
  const connected = status?.connected
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px', background:connected?`${platform.color}15`:'rgba(255,255,255,.04)', border:`1px solid ${connected?platform.color+'50':'rgba(255,255,255,.08)'}`, borderRadius:20 }}>
      <div style={{ width:7, height:7, borderRadius:'50%', background:connected?'#00d4aa':'#ff4757' }}/>
      <span style={{ fontSize:11, color:connected?platform.color:'#9090b8', fontWeight:600 }}>{platform.label}</span>
      <span style={{ fontSize:9, color:'#5a5a80' }}>{connected?'Connected':'Demo'}</span>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function SocialPage() {
  const [tab, setTab] = useState<'autopost'|'create'|'scheduled'|'published'>('autopost')
  const [step, setStep] = useState(0) // 0=type 1=platforms 2=content 3=image 4=schedule 5=publish

  // Form state
  const [contentType, setContentType] = useState('post')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook','linkedin'])
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Professional')
  const [cta, setCta] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<any>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [autoRepeat, setAutoRepeat] = useState(false)
  const [repeatFreq, setRepeatFreq] = useState('weekly')

  // Publish state
  const [publishing, setPublishing] = useState(false)
  const [publishResults, setPublishResults] = useState<PublishResult[]|null>(null)
  const [scheduling, setScheduling] = useState(false)
  const [scheduled, setScheduled] = useState(false)

  // Data
  const [posts, setPosts] = useState<Post[]>([])
  const [platformStatus, setPlatformStatus] = useState<Record<string,PlatformStatus>>({})
  const [loadingPosts, setLoadingPosts] = useState(true)

  // Init
  useEffect(() => {
    const tmrw = new Date(); tmrw.setDate(tmrw.getDate()+1)
    setScheduleDate(tmrw.toISOString().split('T')[0])

    Promise.all([
      fetch('/api/social/posts').then(r=>r.json()),
      fetch('/api/social/schedule').then(r=>r.json()),
      fetch('/api/social/status').then(r=>r.json()),
    ]).then(([postsData, schedData, statData]) => {
      const allPosts = [...(postsData.data||[]), ...(schedData.data||[])]
      setPosts(allPosts)
      setPlatformStatus(statData.data||{})
      setLoadingPosts(false)
    }).catch(() => setLoadingPosts(false))
  }, [])

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p])
  }

  // AI Generate
  const generate = async () => {
    if (!topic.trim()) return
    setGenerating(true); setGenerated(null)
    try {
      const res = await fetch('/api/ai/generate', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ type:contentType, product:topic, platform:selectedPlatforms[0]||'facebook', tone, cta }),
      })
      const { data, demo } = await res.json()
      setGenerated({ data, demo, type:contentType })
    } catch(e) { console.error(e) }
    setGenerating(false)
    setStep(3) // Move to image step
  }

  // Publish Now
  const publishNow = async () => {
    if (!generated) return
    setPublishing(true)
    const content = getContent()
    try {
      const res = await fetch('/api/social/publish', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ content, title:getTitle(), hashtags:getHashtags(), imageUrl, type:contentType, platforms:selectedPlatforms }),
      })
      const data = await res.json()
      setPublishResults(data.results)
      // Add to posts list
      setPosts(p => [{ id:Date.now().toString(), title:getTitle().slice(0,60), content, type:contentType, platforms:selectedPlatforms, status:'published', scheduledAt:new Date().toISOString(), hashtags:getHashtags(), imageUrl, reach:0, likes:0, shares:0 }, ...p])
    } catch(e) { console.error(e) }
    setPublishing(false)
  }

  // Schedule
  const schedulePost = async () => {
    if (!generated || !scheduleDate) return
    setScheduling(true)
    const content = getContent()
    const scheduledAt = `${scheduleDate}T${scheduleTime}:00.000Z`
    try {
      const res = await fetch('/api/social/schedule', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ content, title:getTitle(), hashtags:getHashtags(), imageUrl, type:contentType, platforms:selectedPlatforms, scheduledAt, autoRepeat, repeatFrequency:repeatFreq }),
      })
      const data = await res.json()
      setScheduled(true)
      setPosts(p => [{ id:Date.now().toString(), title:getTitle().slice(0,60), content, type:contentType, platforms:selectedPlatforms, status:'scheduled', scheduledAt, hashtags:getHashtags(), imageUrl }, ...p])
      setTimeout(() => { setScheduled(false); resetForm() }, 3000)
    } catch(e) { console.error(e) }
    setScheduling(false)
  }

  const resetForm = () => {
    setStep(0); setGenerated(null); setTopic(''); setImageUrl('')
    setSelectedPlatforms(['facebook','linkedin']); setScheduled(false)
  }

  // Content extractors
  const getContent = (): string => {
    if (!generated?.data) return ''
    const d = generated.data
    if (contentType === 'post' || contentType === 'story') return d.caption || d.text || ''
    if (contentType === 'article') return [d.title, d.intro, ...(d.sections||[]).map((s:any)=>`${s.heading}\n\n${s.content}`), d.conclusion].join('\n\n')
    if (contentType === 'reel') return `HOOK: ${d.hook}\n\nVOICEOVER:\n${d.voiceover}\n\nCTA: ${d.cta}`
    if (contentType === 'carousel') return `${d.caption}\n\n${(d.slides||[]).map((s:any,i:number)=>`Slide ${i+1}: ${s.title}\n${s.body}`).join('\n\n')}`
    return d.caption || d.text || ''
  }
  const getTitle = (): string => {
    if (!generated?.data) return topic
    return generated.data.title || topic
  }
  const getHashtags = (): string[] => {
    if (!generated?.data) return []
    return generated.data.hashtags || []
  }

  const STEP_LABELS = ['Type','Platforms','Content','Image','Schedule']

  // STATUS COLORS
  const STATUS_COLORS: Record<string,string> = { scheduled:'#3b82f6', published:'#00d4aa', draft:'#9090b8', failed:'#ff4757' }
  const TYPE_COLORS: Record<string,string> = { post:'#6c47ff', article:'#0a66c2', reel:'#e1306c', carousel:'#f97316', story:'#ffd32a' }

  return (
    <div className="fade-in">
      {/* Publish Terminal Overlay */}
      {publishResults && <PublishTerminal results={publishResults} onClose={() => { setPublishResults(null); resetForm() }}/>}

      {/* Header */}
      <div style={{ marginBottom:18 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, margin:'0 0 4px' }}>📱 Social Media Automation</h2>
        <p style={{ color:'#9090b8', fontSize:13, margin:'0 0 12px' }}>AI writes → you review → auto-publishes to Facebook, LinkedIn & Instagram</p>

        {/* Platform connection status */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {PLATFORMS.map(p => <PlatformBadge key={p.key} platform={p} status={platformStatus[p.key]}/>)}
          <a href="/dashboard/settings" style={{ fontSize:11, color:'#6c47ff', textDecoration:'none', padding:'4px 10px', background:'rgba(108,71,255,.08)', border:'1px solid rgba(108,71,255,.2)', borderRadius:20, alignSelf:'center' }}>
            + Connect Platforms →
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom:18 }}>
        <div className={`tab ${tab==='autopost'?'active':''}`} onClick={()=>setTab('autopost')} style={{ background:tab==='autopost'?'linear-gradient(135deg,#6c47ff,#ff4791)':'transparent' }}>⚡ Auto-Post</div>
        <div className={`tab ${tab==='create'?'active':''}`} onClick={()=>setTab('create')}>✍️ Manual Create</div>
        <div className={`tab ${tab==='scheduled'?'active':''}`} onClick={()=>setTab('scheduled')}>
          📅 Scheduled {posts.filter(p=>p.status==='scheduled').length > 0 && <span style={{ background:'#6c47ff', color:'#fff', borderRadius:'50%', width:18, height:18, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10, marginLeft:5 }}>{posts.filter(p=>p.status==='scheduled').length}</span>}
        </div>
        <div className={`tab ${tab==='published'?'active':''}`} onClick={()=>setTab('published')}>✅ Published</div>
      </div>

      {/* AUTO-POST TAB */}
      {tab === 'autopost' && (
        <AutoPost
          platformStatus={platformStatus}
          onPostCreated={post => setPosts(p => [post, ...p])}
        />
      )}

      {/* CREATE TAB */}
      {tab === 'create' && (
        <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:16 }}>

          {/* Left: Step-by-step form */}
          <div>
            {/* Progress */}
            <div style={{ display:'flex', gap:4, marginBottom:16 }}>
              {STEP_LABELS.map((l,i) => (
                <div key={l} onClick={() => generated && i<=3 ? setStep(i) : null}
                  style={{ flex:1, padding:'6px 4px', textAlign:'center', borderRadius:8, background:step===i?'rgba(108,71,255,.2)':i<step?'rgba(0,212,170,.1)':'rgba(255,255,255,.04)', border:`1px solid ${step===i?'#6c47ff':i<step?'#00d4aa':'rgba(255,255,255,.07)'}`, cursor:generated&&i<=3?'pointer':'default', transition:'all .2s' }}>
                  <div style={{ fontSize:10, fontWeight:600, color:step===i?'#c4b5fd':i<step?'#00d4aa':'#5a5a80' }}>{i<step?'✓ ':''}{l}</div>
                </div>
              ))}
            </div>

            {/* STEP 0: Content Type */}
            {step === 0 && (
              <div className="card" style={{ marginBottom:12 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:12 }}>STEP 1 — CONTENT TYPE</div>
                {CONTENT_TYPES.map(ct => (
                  <div key={ct.key} onClick={() => setContentType(ct.key)}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 12px', borderRadius:11, border:`1.5px solid ${contentType===ct.key?'#6c47ff':'rgba(255,255,255,.07)'}`, background:contentType===ct.key?'rgba(108,71,255,.1)':'rgba(255,255,255,.03)', cursor:'pointer', marginBottom:7, transition:'all .2s' }}>
                    <span style={{ fontSize:20 }}>{ct.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:contentType===ct.key?'#c4b5fd':'#f0f0ff' }}>{ct.label}</div>
                      <div style={{ fontSize:11, color:'#9090b8' }}>{ct.desc}</div>
                    </div>
                    {contentType===ct.key && <span style={{ color:'#6c47ff', fontSize:16 }}>✓</span>}
                  </div>
                ))}
                <button className="btn btn-primary btn-full" style={{ marginTop:8 }} onClick={() => setStep(1)}>
                  Continue →
                </button>
              </div>
            )}

            {/* STEP 1: Platforms */}
            {step === 1 && (
              <div className="card" style={{ marginBottom:12 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:12 }}>STEP 2 — PUBLISH TO</div>
                {PLATFORMS.map(p => {
                  const supports = PLATFORM_SUPPORTS[p.key]?.includes(contentType)
                  const selected = selectedPlatforms.includes(p.key)
                  const isConnected = platformStatus[p.key]?.connected
                  return (
                    <div key={p.key} onClick={() => supports && togglePlatform(p.key)}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 13px', borderRadius:12, border:`1.5px solid ${selected?p.color:'rgba(255,255,255,.07)'}`, background:selected?`${p.color}12`:'rgba(255,255,255,.03)', cursor:supports?'pointer':'not-allowed', marginBottom:8, opacity:supports?1:.5, transition:'all .2s' }}>
                      <span style={{ fontSize:22 }}>{p.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{p.label}</div>
                        <div style={{ fontSize:11, color:'#9090b8' }}>
                          {isConnected ? '🟢 Connected' : '🟡 Demo mode'} · {supports?'Supports '+contentType:'Does not support '+contentType}
                        </div>
                      </div>
                      <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${selected?p.color:'rgba(255,255,255,.2)'}`, background:selected?p.color:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {selected && <span style={{ color:'#fff', fontSize:12 }}>✓</span>}
                      </div>
                    </div>
                  )
                })}
                <div style={{ display:'flex', gap:8, marginTop:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary" style={{ flex:1 }} disabled={selectedPlatforms.length===0} onClick={() => setStep(2)}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 2: Content Details */}
            {step === 2 && (
              <div className="card" style={{ marginBottom:12 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:12 }}>STEP 3 — CONTENT DETAILS</div>
                <div className="input-group">
                  <label>What to write about *</label>
                  <textarea className="input-field" rows={3} placeholder="e.g. AI marketing automation for small businesses in India — saves ₹50,000/month in marketing costs"
                    value={topic} onChange={e=>setTopic(e.target.value)} style={{ resize:'none' }}/>
                </div>
                <div className="input-group">
                  <label>Tone</label>
                  <select className="input-field" value={tone} onChange={e=>setTone(e.target.value)}>
                    {TONES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Call to Action</label>
                  <input className="input-field" placeholder="e.g. Book free demo, Learn more, DM us" value={cta} onChange={e=>setCta(e.target.value)}/>
                </div>
                <div style={{ display:'flex', gap:8, marginTop:4 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary" style={{ flex:1 }} disabled={generating||!topic.trim()} onClick={generate}>
                    {generating ? (
                      <><div style={{ width:13,height:13,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 1s linear infinite' }}/> AI Writing…</>
                    ) : '🤖 Generate with AI'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Image Upload */}
            {step === 3 && generated && (
              <div className="card" style={{ marginBottom:12 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:12 }}>STEP 4 — ADD IMAGE</div>
                <div style={{ padding:'8px 12px', background:'rgba(0,212,170,.06)', border:'1px solid rgba(0,212,170,.15)', borderRadius:9, marginBottom:12, fontSize:12, color:'#00d4aa' }}>
                  ✓ AI content generated! Now add an image to boost engagement by 3x.
                </div>
                <ImageUploader onUpload={url => setImageUrl(url)}/>
                <div style={{ display:'flex', gap:8, marginTop:12 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-secondary" style={{ flex:1 }} onClick={() => setStep(4)}>Skip image →</button>
                  {imageUrl && <button className="btn btn-primary btn-sm" onClick={() => setStep(4)}>Next →</button>}
                </div>
              </div>
            )}

            {/* STEP 4: Schedule */}
            {step === 4 && generated && (
              <div className="card">
                <div style={{ fontSize:12, fontWeight:700, color:'#9090b8', marginBottom:12 }}>STEP 5 — SCHEDULE & PUBLISH</div>

                {/* Platforms summary */}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
                  {selectedPlatforms.map(p => {
                    const cfg = PLATFORMS.find(x=>x.key===p)!
                    const isConn = platformStatus[p]?.connected
                    return <div key={p} style={{ padding:'3px 10px', background:`${cfg.color}18`, border:`1px solid ${cfg.color}40`, borderRadius:20, fontSize:11, color:cfg.color, display:'flex', alignItems:'center', gap:5 }}>
                      {cfg.icon} {cfg.label} {isConn?'🟢':'🟡'}
                    </div>
                  })}
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
                  <div className="input-group" style={{ marginBottom:0 }}>
                    <label>Date</label>
                    <input type="date" className="input-field" value={scheduleDate} min={new Date().toISOString().split('T')[0]} onChange={e=>setScheduleDate(e.target.value)}/>
                  </div>
                  <div className="input-group" style={{ marginBottom:0 }}>
                    <label>Time</label>
                    <input type="time" className="input-field" value={scheduleTime} onChange={e=>setScheduleTime(e.target.value)}/>
                  </div>
                </div>

                {/* Auto-repeat */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid rgba(255,255,255,.06)', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>Auto-repeat</div>
                    <div style={{ fontSize:11, color:'#9090b8' }}>Automatically repost this content</div>
                  </div>
                  <div onClick={() => setAutoRepeat(p=>!p)}
                    style={{ width:40, height:22, borderRadius:11, background:autoRepeat?'#6c47ff':'rgba(255,255,255,.1)', cursor:'pointer', position:'relative', transition:'background .2s' }}>
                    <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:autoRepeat?21:3, transition:'left .2s' }}/>
                  </div>
                </div>

                {autoRepeat && (
                  <div className="input-group" style={{ marginBottom:12 }}>
                    <label>Repeat every</label>
                    <select className="input-field" value={repeatFreq} onChange={e=>setRepeatFreq(e.target.value)}>
                      {['daily','weekly','biweekly','monthly'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                )}

                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setStep(3)}>← Back</button>
                  <button className="btn btn-success" style={{ flex:1 }} disabled={scheduling||scheduled} onClick={schedulePost}>
                    {scheduled ? '✓ Scheduled!' : scheduling ? 'Scheduling…' : '📅 Schedule & Auto-Publish'}
                  </button>
                  <button className="btn btn-primary btn-sm" disabled={publishing} onClick={publishNow}>
                    {publishing ? '…' : '⚡ Now'}
                  </button>
                </div>
                <div style={{ fontSize:11, color:'#9090b8', marginTop:8, textAlign:'center' }}>
                  "Now" publishes immediately · "Schedule" auto-publishes at chosen time
                </div>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div>
            {!generated && !generating && (
              <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:440, textAlign:'center' }}>
                <div style={{ fontSize:52, marginBottom:16 }}>✨</div>
                <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, marginBottom:8 }}>AI Will Write Everything</h3>
                <p style={{ color:'#9090b8', fontSize:13, maxWidth:320, lineHeight:1.6 }}>
                  Fill in the details on the left. Our AI writes platform-specific content, captions, hashtags and full articles — review and publish in one click.
                </p>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', marginTop:16 }}>
                  {['Auto-formatted per platform','Image attachment support','Auto-schedule & repeat','Real Facebook & LinkedIn API'].map(t=>(
                    <div key={t} className="badge badge-purple" style={{ fontSize:11 }}>✓ {t}</div>
                  ))}
                </div>
              </div>
            )}

            {generating && (
              <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:440 }}>
                <div style={{ width:40, height:40, border:'3px solid rgba(108,71,255,.2)', borderTopColor:'#6c47ff', borderRadius:'50%', animation:'spin 1s linear infinite', marginBottom:16 }}/>
                <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>AI is writing your content…</div>
                <div style={{ fontSize:12, color:'#9090b8' }}>Optimising for {selectedPlatforms.join(', ')}</div>
              </div>
            )}

            {generated && !generating && (
              <div className="fade-in">
                {generated.demo && (
                  <div style={{ padding:'8px 14px', background:'rgba(255,211,42,.08)', border:'1px solid rgba(255,211,42,.2)', borderRadius:10, marginBottom:12, fontSize:12, color:'#ffd32a', display:'flex', alignItems:'center', gap:8 }}>
                    ⚠️ Demo content · Add Anthropic key in Settings → API Keys for real custom AI generation
                  </div>
                )}

                {/* Platform previews */}
                {selectedPlatforms.map(platform => {
                  const cfg = PLATFORMS.find(p=>p.key===platform)!
                  const content = getContent()
                  const title = getTitle()
                  const hashtags = getHashtags()

                  return (
                    <div key={platform} className="card" style={{ marginBottom:14, border:`1px solid ${cfg.color}30` }}>
                      {/* Platform header */}
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingBottom:12, borderBottom:'1px solid rgba(255,255,255,.07)' }}>
                        <span style={{ fontSize:20 }}>{cfg.icon}</span>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700 }}>{cfg.label} Preview</div>
                          <div style={{ fontSize:11, color:'#9090b8' }}>{platformStatus[platform]?.connected ? '🟢 Will post to your real account' : '🟡 Demo — connect account in Settings'}</div>
                        </div>
                        <div className="badge badge-purple" style={{ marginLeft:'auto', fontSize:10, textTransform:'capitalize' }}>{contentType}</div>
                      </div>

                      {/* Simulated post preview */}
                      <div style={{ background:'rgba(255,255,255,.03)', borderRadius:12, padding:14 }}>
                        {/* Author */}
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                          <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#6c47ff,#ff4791)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff' }}>GC</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700 }}>GlobalWebSaaS</div>
                            <div style={{ fontSize:11, color:'#9090b8' }}>Just now · 🌐 Public</div>
                          </div>
                        </div>

                        {/* Article title */}
                        {contentType === 'article' && title && (
                          <div style={{ fontSize:16, fontWeight:800, fontFamily:'Syne,sans-serif', marginBottom:8, lineHeight:1.3 }}>{title}</div>
                        )}

                        {/* Content */}
                        <div style={{ fontSize:13, color:'#d0d0e8', lineHeight:1.7, whiteSpace:'pre-wrap', marginBottom:imageUrl?12:0 }}>
                          {content.slice(0, 300)}{content.length > 300 ? '… See more' : ''}
                        </div>

                        {/* Image preview */}
                        {imageUrl && (
                          <img src={imageUrl} alt="Post image" style={{ width:'100%', borderRadius:10, marginBottom:12, maxHeight:220, objectFit:'cover' }}/>
                        )}

                        {/* Hashtags */}
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
                          {hashtags.slice(0,6).map((h,i) => (
                            <span key={i} style={{ fontSize:12, color:cfg.color }}>{h.startsWith('#')?h:`#${h}`}</span>
                          ))}
                          {hashtags.length > 6 && <span style={{ fontSize:11, color:'#9090b8' }}>+{hashtags.length-6} more</span>}
                        </div>

                        {/* Engagement bar */}
                        <div style={{ display:'flex', gap:16, paddingTop:10, borderTop:'1px solid rgba(255,255,255,.06)', color:'#9090b8', fontSize:12 }}>
                          <span>👍 Like</span>
                          <span>💬 Comment</span>
                          <span>↗️ Share</span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Full content (copyable) */}
                <div className="card" style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#9090b8' }}>FULL CONTENT (editable)</div>
                    <button onClick={() => navigator.clipboard.writeText(getContent())} className="btn btn-secondary btn-sm">📋 Copy All</button>
                  </div>
                  <textarea
                    value={getContent()}
                    onChange={() => {}}
                    rows={8}
                    className="input-field"
                    style={{ resize:'vertical', fontFamily:'DM Sans,sans-serif', lineHeight:1.6, fontSize:12 }}
                  />
                  <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                    {getHashtags().map((h,i) => (
                      <div key={i} className="badge badge-blue" style={{ fontSize:10, cursor:'pointer' }} onClick={() => navigator.clipboard.writeText(h)}>{h}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCHEDULED & PUBLISHED TABS */}
      {(tab === 'scheduled' || tab === 'published') && (
        <div>
          {loadingPosts ? <div style={{ textAlign:'center', padding:60, color:'#9090b8' }}>Loading…</div> : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {posts
                .filter(p => tab==='scheduled' ? p.status==='scheduled' : p.status==='published')
                .map(p => (
                  <div key={p.id} className="card card-hover">
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                      {/* Type icon */}
                      <div style={{ width:40, height:40, borderRadius:11, background:`${TYPE_COLORS[p.type]||'#6c47ff'}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ fontSize:18 }}>{CONTENT_TYPES.find(t=>t.key===p.type)?.icon||'📝'}</span>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                          <span style={{ fontSize:14, fontWeight:700 }}>{p.title}</span>
                          <div style={{ padding:'2px 8px', borderRadius:20, background:`${STATUS_COLORS[p.status]}15`, border:`1px solid ${STATUS_COLORS[p.status]}35`, fontSize:10, color:STATUS_COLORS[p.status], textTransform:'capitalize' }}>{p.status}</div>
                        </div>
                        <div style={{ fontSize:12, color:'#9090b8', marginBottom:6, lineHeight:1.5 }}>{p.content?.slice(0,100)}…</div>
                        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                          {/* Platforms */}
                          <div style={{ display:'flex', gap:5 }}>
                            {p.platforms?.map(pl => {
                              const cfg = PLATFORMS.find(x=>x.key===pl)
                              return cfg ? <span key={pl} style={{ fontSize:15 }} title={cfg.label}>{cfg.icon}</span> : null
                            })}
                          </div>
                          {p.scheduledAt && <span style={{ fontSize:11, color:'#9090b8' }}>🕐 {new Date(p.scheduledAt).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span>}
                          {p.reach && p.reach > 0 && <span style={{ fontSize:11, color:'#9090b8' }}>👁 {p.reach.toLocaleString()} reach</span>}
                          {p.likes && p.likes > 0 && <span style={{ fontSize:11, color:'#9090b8' }}>👍 {p.likes} · 🔁 {p.shares}</span>}
                        </div>
                        {p.hashtags?.length > 0 && (
                          <div style={{ display:'flex', gap:5, marginTop:6, flexWrap:'wrap' }}>
                            {p.hashtags.slice(0,4).map((h,i) => <div key={i} className="badge badge-purple" style={{ fontSize:9 }}>{h}</div>)}
                            {p.hashtags.length > 4 && <span style={{ fontSize:10, color:'#5a5a80' }}>+{p.hashtags.length-4}</span>}
                          </div>
                        )}
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                        {tab==='scheduled' && (
                          <button className="btn btn-primary btn-sm" onClick={async () => {
                            setPublishing(true)
                            const res = await fetch('/api/social/publish',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ content:p.content, title:p.title, hashtags:p.hashtags, imageUrl:p.imageUrl, type:p.type, platforms:p.platforms }) })
                            const data = await res.json()
                            setPublishResults(data.results)
                            setPublishing(false)
                          }}>⚡ Post Now</button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => setPosts(prev=>prev.filter(x=>x.id!==p.id))}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))
              }
              {posts.filter(p=>tab==='scheduled'?p.status==='scheduled':p.status==='published').length===0 && (
                <div style={{ textAlign:'center', padding:60 }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>{tab==='scheduled'?'📅':'✅'}</div>
                  <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>No {tab} posts yet</div>
                  <button className="btn btn-primary btn-sm" onClick={()=>setTab('create')}>Create your first post →</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
