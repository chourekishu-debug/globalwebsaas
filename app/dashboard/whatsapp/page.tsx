'use client'
import { useState, useRef, useEffect } from 'react'

const CONVOS = [
  { id:1, name:'Rajan Mehta',    phone:'+91 98765 43210', last:'Yes! I want to start. Send me the link', time:'2 min ago', stage:'hot',       unread:2, initials:'RM', color:'#6c47ff' },
  { id:2, name:'Arvind Kapoor',  phone:'+91 87654 32109', last:'What is the pricing for real estate?',  time:'18 min ago',stage:'warm',      unread:1, initials:'AK', color:'#3b82f6' },
  { id:3, name:'Sunita Agarwal', phone:'+91 76543 21098', last:'My salon has 3 branches in Mumbai',     time:'1 hr ago',  stage:'warm',      unread:0, initials:'SA', color:'#10b981' },
  { id:4, name:'Meena Nair',     phone:'+91 65432 10987', last:'Payment done! When do we start?',       time:'2 hr ago',  stage:'converted', unread:0, initials:'MN', color:'#00d4aa' },
  { id:5, name:'Unknown Lead',   phone:'+91 54321 09876', last:'Hi, I saw your ad on Instagram',        time:'3 hr ago',  stage:'cold',      unread:1, initials:'??', color:'#9090b8' },
]

const INIT_MESSAGES: Record<number, any[]> = {
  1: [
    { dir:'in',  text:'Hi, I saw your ad. Tell me more about the marketing platform.', time:'10:02 AM' },
    { dir:'out', text:'Hi Rajan! 👋 Thank you for reaching out to GlobalWebSaaS!\n\nWe are an AI-powered marketing automation platform that manages Meta Ads, Google Ads, LinkedIn, WhatsApp & Google Business from one dashboard.\n\n✅ AI generates all your content\n✅ Campaigns launch automatically\n✅ All leads in one CRM\n\nWould you like a free demo call? 📞', time:'10:02 AM', auto:true },
    { dir:'in',  text:'Wow that sounds great! What are the pricing plans?', time:'10:15 AM' },
    { dir:'out', text:'Our plans start at ₹1,499/month!\n\n📦 Starter — ₹1,499/mo · 1 platform\n📦 Growth — ₹2,499/mo · 2 platforms\n📦 Enterprise — ₹4,599/mo · All 5 platforms\n\nAll plans include 7-day free trial! 🎁\n\nShall I schedule a 30-min demo call for you?', time:'10:16 AM', auto:true },
    { dir:'in',  text:'Yes! I want to start. Send me the link', time:'10:34 AM' },
  ],
  2: [
    { dir:'in',  text:'What is the pricing for real estate marketing?', time:'9:45 AM' },
    { dir:'out', text:'Hi Arvind! For real estate, we recommend our Growth plan at ₹2,499/month which includes Meta Ads + Google Ads.\n\nMost real estate clients see CPL drop by 60-70% within the first month. 🏠\n\nWant to schedule a quick demo?', time:'9:45 AM', auto:true },
  ],
  3: [
    { dir:'in',  text:'My salon has 3 branches in Mumbai', time:'8:30 AM' },
    { dir:'out', text:'Hi Sunita! Perfect — our platform works great for salon chains! 💅\n\nWe can manage ads and social media for all 3 branches from one dashboard, and auto-reply to every WhatsApp enquiry instantly.\n\nWould you like a free trial?', time:'8:30 AM', auto:true },
  ],
  4: [
    { dir:'in',  text:'Payment done! When do we start?', time:'Yesterday' },
    { dir:'out', text:'Welcome aboard Meena! 🎉 Your account is being set up. You will receive login details within 2 hours. Our team will call you to complete onboarding. Thank you for choosing GlobalWebSaaS!', time:'Yesterday', auto:true },
  ],
  5: [
    { dir:'in',  text:'Hi, I saw your ad on Instagram', time:'3 hr ago' },
    { dir:'out', text:'Hi there! 👋 Thanks for reaching out! We are GlobalWebSaaS — an AI-powered marketing platform.\n\nCould you tell me more about your business so I can show you how we can help?', time:'3 hr ago', auto:true },
  ],
}

const STAGE_COLORS: Record<string,string> = { cold:'#3b82f6', warm:'#ffd32a', hot:'#ff4757', converted:'#00d4aa' }
const STAGE_LABELS: Record<string,string> = { cold:'Cold', warm:'Warm', hot:'🔥 Hot', converted:'✓ Converted' }

const QUICK_REPLIES = [
  'Would you like to schedule a free demo call?',
  'Our 7-day free trial starts immediately — no credit card needed.',
  'I can share a detailed pricing breakdown. Which plan interests you?',
  'Let me know a good time for a 30-minute demo call.',
]

export default function WhatsAppPage() {
  const [active, setActive]   = useState(1)
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [reply, setReply]     = useState('')
  const [sending, setSending] = useState(false)
  const [convos, setConvos]   = useState(CONVOS)
  const bottomRef             = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, active])

  const activeConvo = convos.find(c => c.id === active)!
  const activeMsgs  = messages[active] || []

  const send = async () => {
    if (!reply.trim() || sending) return
    const text = reply.trim()
    setReply('')
    setSending(true)

    const now = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
    const newMsg = { dir:'out' as const, text, time:now }

    setMessages(p => ({ ...p, [active]: [...(p[active]||[]), newMsg] }))

    // Clear unread
    setConvos(p => p.map(c => c.id===active ? {...c, unread:0, last:text} : c))

    // Call WhatsApp API (works in demo mode too)
    try {
      await fetch('/api/whatsapp/reply', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ phone:activeConvo.phone, message:text }),
      })
    } catch {}

    setSending(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const switchConvo = (id: number) => {
    setActive(id)
    setConvos(p => p.map(c => c.id===id ? {...c, unread:0} : c))
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="fade-in" style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 100px)' }}>
      {/* Header */}
      <div style={{ marginBottom:12, flexShrink:0 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, margin:'0 0 4px' }}>💬 WhatsApp Automation</h2>
        <p style={{ color:'#9090b8', fontSize:13, margin:0 }}>Every lead auto-replied in &lt;30 seconds · 24/7</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:12, flexShrink:0 }}>
        {[{l:'Avg reply',v:'28 sec',c:'#25d366'},{l:'Today',v:'312',c:'#00d4aa'},{l:'This week',v:'847',c:'#6c47ff'},{l:'Conversion',v:'18.4%',c:'#ffd32a'}].map(m=>(
          <div key={m.l} className="card" style={{ textAlign:'center', padding:'10px 8px' }}>
            <div style={{ fontSize:20, fontWeight:800, fontFamily:'Syne,sans-serif', color:m.c }}>{m.v}</div>
            <div style={{ fontSize:10, color:'#9090b8' }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Chat UI */}
      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', flex:1, background:'rgba(13,13,31,.95)', border:'1px solid rgba(255,255,255,.07)', borderRadius:16, overflow:'hidden', minHeight:0 }}>

        {/* Contact list */}
        <div style={{ borderRight:'1px solid rgba(255,255,255,.07)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,.07)', fontSize:12, fontWeight:600, color:'#9090b8', flexShrink:0 }}>
            CONVERSATIONS ({convos.length})
          </div>
          <div style={{ overflowY:'auto', flex:1 }}>
            {convos.map(c => (
              <div key={c.id} onClick={() => switchConvo(c.id)}
                style={{ display:'flex', gap:10, padding:'11px 14px', cursor:'pointer', background:active===c.id?'rgba(108,71,255,.12)':'transparent', borderBottom:'1px solid rgba(255,255,255,.04)', transition:'background .15s' }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>{c.initials}</div>
                  <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderRadius:'50%', background:STAGE_COLORS[c.stage]||'#9090b8', border:'2px solid #0d0d1f' }}/>
                </div>
                <div style={{ flex:1, overflow:'hidden' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'#f0f0ff' }}>{c.name}</span>
                    <span style={{ fontSize:10, color:'#5a5a80' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize:11, color:'#9090b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:2 }}>{c.last}</div>
                </div>
                {c.unread > 0 && (
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'#25d366', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', flexShrink:0 }}>{c.unread}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* Chat header */}
          <div style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:activeConvo.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff' }}>
              {activeConvo.initials}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#f0f0ff' }}>{activeConvo.name}</div>
              <div style={{ fontSize:11, color:'#25d366' }}>{activeConvo.phone}</div>
            </div>
            <div style={{ padding:'3px 10px', background:`${STAGE_COLORS[activeConvo.stage]||'#9090b8'}18`, border:`1px solid ${STAGE_COLORS[activeConvo.stage]||'#9090b8'}40`, borderRadius:20, fontSize:11, color:STAGE_COLORS[activeConvo.stage]||'#9090b8' }}>
              {STAGE_LABELS[activeConvo.stage]}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
            {activeMsgs.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent:m.dir==='out'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'72%', padding:'10px 13px', borderRadius:m.dir==='out'?'14px 14px 4px 14px':'14px 14px 14px 4px', background:m.dir==='out'?'rgba(37,211,102,.15)':'var(--surface2)', border:`1px solid ${m.dir==='out'?'rgba(37,211,102,.25)':'rgba(255,255,255,.07)'}` }}>
                  {(m as any).auto && (
                    <div style={{ fontSize:9, color:'#25d366', marginBottom:4, fontWeight:700, letterSpacing:.5 }}>⚡ AUTO REPLY</div>
                  )}
                  <div style={{ fontSize:13, color:'#f0f0ff', lineHeight:1.65, whiteSpace:'pre-wrap' }}>{m.text}</div>
                  <div style={{ fontSize:10, color:'#9090b8', marginTop:5, textAlign:'right' }}>{m.time} {m.dir==='out'&&'✓✓'}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          {/* Quick replies */}
          <div style={{ padding:'8px 16px', borderTop:'1px solid rgba(255,255,255,.04)', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }}>
            {QUICK_REPLIES.map((q, i) => (
              <button key={i} onClick={() => setReply(q)}
                style={{ padding:'4px 10px', background:'rgba(37,211,102,.08)', border:'1px solid rgba(37,211,102,.2)', borderRadius:20, fontSize:11, color:'#25d366', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                {q.slice(0,30)}…
              </button>
            ))}
          </div>

          {/* Reply input */}
          <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
            <input
              ref={inputRef}
              className="input-field"
              placeholder="Type a message… (Enter to send)"
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ flex:1, padding:'10px 14px' }}
              autoFocus
            />
            <button
              onClick={send}
              disabled={sending || !reply.trim()}
              style={{ padding:'10px 20px', borderRadius:10, border:'none', background:reply.trim()?'#25d366':'rgba(37,211,102,.2)', color:'#fff', cursor:reply.trim()?'pointer':'not-allowed', fontSize:14, fontWeight:600, flexShrink:0, transition:'all .2s' }}>
              {sending ? '…' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
