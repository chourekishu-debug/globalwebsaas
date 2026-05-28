'use client'
import { useState } from 'react'

const CONVOS = [
  { id:1, name:'Rajan Mehta', phone:'+91 98765 43210', last:'Yes! I want to start. Send me the link', time:'2 min ago', stage:'hot', unread:2, initials:'RM' },
  { id:2, name:'Arvind Kapoor', phone:'+91 87654 32109', last:'What is the pricing for real estate?', time:'18 min ago', stage:'warm', unread:1, initials:'AK' },
  { id:3, name:'Sunita Agarwal', phone:'+91 76543 21098', last:'My salon has 3 branches in Mumbai', time:'1 hr ago', stage:'warm', unread:0, initials:'SA' },
  { id:4, name:'Meena Nair', phone:'+91 65432 10987', last:'Payment done! When do we start?', time:'2 hr ago', stage:'converted', unread:0, initials:'MN' },
  { id:5, name:'Unknown Lead', phone:'+91 54321 09876', last:'Hi, I saw your ad on Instagram', time:'3 hr ago', stage:'cold', unread:1, initials:'??' },
]

const MESSAGES: Record<number, any[]> = {
  1: [
    { dir:'in',  text:'Hi, I saw your ad. Tell me more about the marketing platform.', time:'10:02 AM' },
    { dir:'out', text:'Hi Rajan! 👋 Thank you for reaching out to GlobalWebSaaS!\n\nWe are an AI-powered marketing automation platform that manages Meta Ads, Google Ads, LinkedIn, WhatsApp & Google Business from one dashboard.\n\n✅ AI generates all your content\n✅ Campaigns launch automatically\n✅ All leads in one CRM\n\nWould you like a free demo call? 🚀', time:'10:02 AM', auto:true },
    { dir:'in',  text:'Wow that sounds great! What are the pricing plans?', time:'10:15 AM' },
    { dir:'out', text:'Our plans start at ₹1,499/month (₹20K for full service).\n\n📦 Starter — ₹1,499/mo · 1 platform\n📦 Growth — ₹2,499/mo · 2 platforms\n📦 Enterprise — ₹4,599/mo · All 5 platforms\n\nAll plans include 7-day free trial! 🎁', time:'10:16 AM', auto:true },
    { dir:'in',  text:'Yes! I want to start. Send me the link', time:'10:34 AM' },
  ],
  2: [
    { dir:'in',  text:'What is the pricing for real estate marketing?', time:'9:45 AM' },
    { dir:'out', text:'Hi Arvind! For real estate, we recommend our Growth plan at ₹2,499/month which includes Meta Ads + Google Ads — the two best platforms for real estate leads. Most real estate clients see CPL drop by 60-70% within the first month. Want to schedule a demo?', time:'9:45 AM', auto:true },
  ],
}

const STAGE_COLORS: Record<string,string> = { cold:'#3b82f6', warm:'#ffd32a', hot:'#ff4757', converted:'#00d4aa' }

export default function WhatsAppPage() {
  const [active, setActive] = useState(1)
  const [reply, setReply] = useState('')
  const [messages, setMessages] = useState(MESSAGES)
  const [sending, setSending] = useState(false)

  const send = async () => {
    if (!reply.trim()) return
    setSending(true)
    const convo = CONVOS.find(c => c.id === active)!
    const newMsg = { dir:'out' as const, text:reply, time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) }
    setMessages(p => ({ ...p, [active]: [...(p[active]||[]), newMsg] }))
    setReply('')
    // Call WhatsApp API
    await fetch('/api/whatsapp/reply', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ phone:convo.phone, message:reply })
    })
    setSending(false)
  }

  const activeMsgs = messages[active] || []

  return (
    <div className="fade-in" style={{ height:'calc(100vh - 120px)', display:'flex', flexDirection:'column' }}>
      <div style={{ marginBottom:14 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, margin:'0 0 4px' }}>💬 WhatsApp Automation</h2>
        <p style={{ color:'#9090b8', fontSize:13, margin:0 }}>Every lead auto-replied in &lt;30 seconds · 24/7</p>
      </div>

      {/* Stats strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:14 }}>
        {[{l:'Avg reply',v:'28 sec',c:'#25d366'},{l:'Today',v:'312',c:'#00d4aa'},{l:'This week',v:'847',c:'#6c47ff'},{l:'Conversion',v:'18.4%',c:'#ffd32a'}].map(m=>(
          <div key={m.l} className="card" style={{ textAlign:'center', padding:'10px' }}>
            <div style={{ fontSize:18, fontWeight:800, fontFamily:'Syne,sans-serif', color:m.c }}>{m.v}</div>
            <div style={{ fontSize:10, color:'#9090b8' }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Chat UI */}
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:0, flex:1, background:'rgba(13,13,31,.95)', border:'1px solid rgba(255,255,255,.07)', borderRadius:16, overflow:'hidden' }}>
        {/* Contact list */}
        <div style={{ borderRight:'1px solid rgba(255,255,255,.07)', overflowY:'auto' }}>
          <div style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,.07)', fontSize:12, fontWeight:600, color:'#9090b8' }}>CONVERSATIONS</div>
          {CONVOS.map(c => (
            <div key={c.id} onClick={() => setActive(c.id)} style={{ display:'flex', gap:10, padding:'12px 14px', cursor:'pointer', background:active===c.id?'rgba(108,71,255,.1)':'transparent', borderBottom:'1px solid rgba(255,255,255,.04)', transition:'background .2s' }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#6c47ff,#ff4791)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>{c.initials}</div>
                <div style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderRadius:'50%', background:STAGE_COLORS[c.stage], border:'2px solid #0d0d1f' }}/>
              </div>
              <div style={{ flex:1, overflow:'hidden' }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#f0f0ff' }}>{c.name}</span>
                  <span style={{ fontSize:10, color:'#5a5a80' }}>{c.time}</span>
                </div>
                <div style={{ fontSize:11, color:'#9090b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.last}</div>
              </div>
              {c.unread > 0 && <div style={{ width:16, height:16, borderRadius:'50%', background:'#25d366', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', flexShrink:0 }}>{c.unread}</div>}
            </div>
          ))}
        </div>

        {/* Chat window */}
        <div style={{ display:'flex', flexDirection:'column' }}>
          {/* Chat header */}
          <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:12 }}>
            {(() => { const c=CONVOS.find(x=>x.id===active)!; return <>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#6c47ff,#ff4791)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff' }}>{c.initials}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:'#f0f0ff' }}>{c.name}</div>
                <div style={{ fontSize:11, color:'#25d366' }}>{c.phone}</div>
              </div>
              <div style={{ marginLeft:'auto' }}>
                <div style={{ padding:'3px 10px', background:`${STAGE_COLORS[c.stage]}18`, border:`1px solid ${STAGE_COLORS[c.stage]}40`, borderRadius:20, fontSize:11, color:STAGE_COLORS[c.stage], textTransform:'capitalize' }}>{c.stage}</div>
              </div>
            </> })()}
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
            {activeMsgs.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent:m.dir==='out'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'72%', padding:'10px 13px', borderRadius:12, background:m.dir==='out'?'rgba(37,211,102,.15)':'var(--surface2)', border:`1px solid ${m.dir==='out'?'rgba(37,211,102,.25)':'rgba(255,255,255,.07)'}` }}>
                  {(m as any).auto && <div style={{ fontSize:9, color:'#25d366', marginBottom:4, fontWeight:600 }}>⚡ AUTO REPLY</div>}
                  <div style={{ fontSize:13, color:'#f0f0ff', lineHeight:1.6, whiteSpace:'pre-wrap' }}>{m.text}</div>
                  <div style={{ fontSize:10, color:'#9090b8', marginTop:4, textAlign:'right' }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply box */}
          <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', gap:10 }}>
            <input className="input-field" placeholder="Type a message…" value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} style={{ flex:1 }}/>
            <button onClick={send} disabled={sending||!reply.trim()} className="btn btn-primary btn-sm" style={{ padding:'8px 16px' }}>
              {sending ? '…' : '➤ Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
