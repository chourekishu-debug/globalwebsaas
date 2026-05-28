'use client'
import { useState, useEffect } from 'react'
import { PLATFORM_COLORS, PLATFORM_NAMES, formatCurrency } from '@/lib/utils'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/campaigns').then(r => r.json()).then(d => { setCampaigns(d.data||[]); setLoading(false) })
  }, [])

  const filtered = filter === 'all' ? campaigns : campaigns.filter(c => c.platform === filter)

  const STATUS_COLORS: Record<string,string> = { active:'#00d4aa', paused:'#ffd32a', draft:'#9090b8', completed:'#6c47ff' }

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
        <div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, margin:'0 0 4px' }}>📢 Campaigns</h2>
          <p style={{ color:'#9090b8', fontSize:13, margin:0 }}>Launch and manage ads across Meta, Google & LinkedIn</p>
        </div>
        <button className="btn btn-primary btn-sm">+ New Campaign</button>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
        {[
          { label:'Active', val:campaigns.filter(c=>c.status==='active').length, c:'#00d4aa' },
          { label:'Total Leads', val:campaigns.reduce((a,c)=>a+(c.leads||0),0), c:'#6c47ff' },
          { label:'Total Spent', val:`₹${(campaigns.reduce((a,c)=>a+(c.spent||0),0)/1000).toFixed(0)}K`, c:'#ff4791' },
          { label:'Avg ROAS', val:`${(campaigns.reduce((a,c)=>a+(c.roas||0),0)/Math.max(campaigns.length,1)).toFixed(1)}x`, c:'#ffd32a' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:800, fontFamily:'Syne,sans-serif', color:s.c, marginBottom:3 }}>{s.val}</div>
            <div style={{ fontSize:11, color:'#9090b8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Platform filter */}
      <div className="tab-bar" style={{ marginBottom:14 }}>
        {['all','meta','google','linkedin','instagram'].map(p => (
          <div key={p} className={`tab ${filter===p?'active':''}`} onClick={() => setFilter(p)} style={{ textTransform:'capitalize' }}>{p}</div>
        ))}
      </div>

      {/* Campaign cards */}
      {loading ? <div style={{ textAlign:'center', padding:60, color:'#9090b8' }}>Loading campaigns…</div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map(c => (
            <div key={c.id} className="card card-hover" style={{ display:'grid', gridTemplateColumns:'1fr 100px 80px 80px 80px 80px', gap:12, alignItems:'center' }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:'#f0f0ff', marginBottom:4 }}>{c.name}</div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:PLATFORM_COLORS[c.platform] }}/>
                  <span style={{ fontSize:11, color:'#9090b8', textTransform:'capitalize' }}>{c.platform}</span>
                  <div style={{ padding:'2px 8px', borderRadius:20, background:`${STATUS_COLORS[c.status]}18`, border:`1px solid ${STATUS_COLORS[c.status]}40`, fontSize:10, color:STATUS_COLORS[c.status], textTransform:'capitalize' }}>{c.status}</div>
                </div>
              </div>
              <div><div style={{ fontSize:12, color:'#9090b8', marginBottom:2 }}>Budget</div><div style={{ fontSize:13, fontWeight:600 }}>₹{(c.budget||0).toLocaleString()}</div></div>
              <div><div style={{ fontSize:12, color:'#9090b8', marginBottom:2 }}>Spent</div><div style={{ fontSize:13, fontWeight:600 }}>₹{(c.spent||0).toLocaleString()}</div></div>
              <div><div style={{ fontSize:12, color:'#9090b8', marginBottom:2 }}>Leads</div><div style={{ fontSize:13, fontWeight:600, color:'#00d4aa' }}>{c.leads||0}</div></div>
              <div><div style={{ fontSize:12, color:'#9090b8', marginBottom:2 }}>CPL</div><div style={{ fontSize:13, fontWeight:600 }}>₹{c.cpl||0}</div></div>
              <div><div style={{ fontSize:12, color:'#9090b8', marginBottom:2 }}>ROAS</div><div style={{ fontSize:13, fontWeight:600, color:'#6c47ff' }}>{c.roas||0}x</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
