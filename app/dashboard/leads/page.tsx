'use client'
import { useState, useEffect } from 'react'

const STAGE_COLORS: Record<string,string> = { cold:'#3b82f6', warm:'#ffd32a', hot:'#ff4757', converted:'#00d4aa', lost:'#9090b8' }

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [stage, setStage] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leads').then(r=>r.json()).then(d=>{ setLeads(d.data||[]); setLoading(false) })
  },[])

  const filtered = leads.filter(l => {
    const matchStage = stage==='all' || l.stage===stage
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase())
    return matchStage && matchSearch
  })

  const updateStage = async (id: string, newStage: string) => {
    setLeads(p => p.map(l => l.id===id ? {...l, stage:newStage} : l))
    await fetch('/api/leads', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id, stage:newStage}) })
  }

  const STAGES = ['all','cold','warm','hot','converted','lost']
  const counts = STAGES.slice(1).map(s => ({ s, n:leads.filter(l=>l.stage===s).length }))

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
        <div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, margin:'0 0 4px' }}>👥 Lead Manager</h2>
          <p style={{ color:'#9090b8', fontSize:13, margin:0 }}>All leads from Meta, Google, LinkedIn, WhatsApp — one place</p>
        </div>
        <button className="btn btn-primary btn-sm">+ Add Lead</button>
      </div>

      {/* Pipeline counters */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:16 }}>
        {counts.map(({s,n}) => (
          <div key={s} className="card" style={{ textAlign:'center', cursor:'pointer', border:`1px solid ${stage===s?STAGE_COLORS[s]:'rgba(255,255,255,.07)'}`, transition:'all .2s' }} onClick={() => setStage(s)}>
            <div style={{ fontSize:24, fontWeight:800, fontFamily:'Syne,sans-serif', color:STAGE_COLORS[s], marginBottom:3 }}>{n}</div>
            <div style={{ fontSize:11, color:'#9090b8', textTransform:'capitalize' }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display:'flex', gap:10, marginBottom:14 }}>
        <input className="input-field" placeholder="🔍 Search leads…" value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1 }}/>
        <div className="tab-bar">
          {STAGES.map(s => <div key={s} className={`tab ${stage===s?'active':''}`} onClick={()=>setStage(s)} style={{ textTransform:'capitalize', fontSize:12 }}>{s}</div>)}
        </div>
      </div>

      {/* Leads table */}
      {loading ? <div style={{ textAlign:'center', padding:60, color:'#9090b8' }}>Loading leads…</div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(l => (
            <div key={l.id} className="card card-hover" style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#6c47ff,#ff4791)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', flexShrink:0 }}>
                {l.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:'#f0f0ff' }}>{l.name}</span>
                  <div style={{ padding:'2px 8px', borderRadius:20, background:`${STAGE_COLORS[l.stage]}18`, border:`1px solid ${STAGE_COLORS[l.stage]}40`, fontSize:10, color:STAGE_COLORS[l.stage], textTransform:'capitalize' }}>{l.stage}</div>
                </div>
                <div style={{ fontSize:12, color:'#9090b8' }}>{l.email} · via {l.source}</div>
                <div style={{ display:'flex', gap:6, marginTop:4 }}>
                  {l.tags?.map((t:string) => <div key={t} className="badge badge-purple" style={{ fontSize:9 }}>{t}</div>)}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#00d4aa', marginBottom:4 }}>₹{(l.value/12000).toFixed(0)}K/yr</div>
                <select value={l.stage} onChange={e=>updateStage(l.id,e.target.value)} style={{ fontSize:11, background:'var(--surface2)', border:'1px solid rgba(255,255,255,.08)', borderRadius:7, color:'#9090b8', padding:'3px 7px', cursor:'pointer' }}>
                  {['cold','warm','hot','converted','lost'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
