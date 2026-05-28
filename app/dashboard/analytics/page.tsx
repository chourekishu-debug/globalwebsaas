'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { fetch('/api/analytics').then(r=>r.json()).then(d=>setData(d.data)) },[])

  if (!data) return <div style={{ textAlign:'center', padding:80, color:'#9090b8' }}>Loading analytics…</div>

  const COLORS = ['#1877F2','#4285F4','#0A66C2','#00D4AA']
  const weekData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day,i)=>({ day, leads:[182,201,178,245,267,289,312][i], spend:[42,38,51,47,58,62,71][i] }))

  return (
    <div className="fade-in">
      <div style={{ marginBottom:18 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, margin:'0 0 4px' }}>📈 Analytics</h2>
        <p style={{ color:'#9090b8', fontSize:13, margin:0 }}>Real-time performance across all platforms</p>
      </div>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:18 }}>
        {[
          { label:'Total Spend', val:'₹18.4L', color:'#6c47ff' },
          { label:'Total Leads', val:'2,847', color:'#00d4aa' },
          { label:'Avg ROAS', val:`${data.summary.avgRoas.toFixed(2)}x`, color:'#ff4791' },
          { label:'Avg CPL', val:`₹${Math.round(data.summary.avgCpl)}`, color:'#ffd32a' },
          { label:'Impressions', val:'14.7M', color:'#3b82f6' },
        ].map(k => (
          <div key={k.label} className="card" style={{ textAlign:'center', borderTop:`3px solid ${k.color}` }}>
            <div style={{ fontSize:22, fontWeight:800, fontFamily:'Syne,sans-serif', color:k.color, marginBottom:3 }}>{k.val}</div>
            <div style={{ fontSize:11, color:'#9090b8' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:700, margin:'0 0 14px' }}>Weekly Leads Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weekData}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6c47ff" stopOpacity={0.3}/><stop offset="95%" stopColor="#6c47ff" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="day" tick={{fill:'#9090b8',fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#0d0d1f',border:'1px solid rgba(108,71,255,.3)',borderRadius:10}}/>
              <Area type="monotone" dataKey="leads" stroke="#6c47ff" strokeWidth={2} fill="url(#ag)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:700, margin:'0 0 14px' }}>Leads by Platform</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.byPlatform} barSize={32}>
              <XAxis dataKey="platform" tick={{fill:'#9090b8',fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#0d0d1f',border:'1px solid rgba(108,71,255,.3)',borderRadius:10}}/>
              <Bar dataKey="leads" radius={[6,6,0,0]}>{COLORS.map((c,i)=><Cell key={i} fill={c}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead pipeline */}
      <div className="card">
        <h3 style={{ fontSize:14, fontWeight:700, margin:'0 0 14px' }}>Lead Pipeline Value</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 }}>
          {data.pipeline.map((p:any) => {
            const PCOL: Record<string,string> = { cold:'#3b82f6', warm:'#ffd32a', hot:'#ff4757', converted:'#00d4aa', lost:'#9090b8' }
            return (
              <div key={p.stage} style={{ textAlign:'center', padding:'12px', background:'var(--surface2)', borderRadius:12, borderTop:`3px solid ${PCOL[p.stage]}` }}>
                <div style={{ fontSize:22, fontWeight:800, fontFamily:'Syne,sans-serif', color:PCOL[p.stage], marginBottom:3 }}>{p.count}</div>
                <div style={{ fontSize:11, color:'#9090b8', textTransform:'capitalize', marginBottom:4 }}>{p.stage}</div>
                <div style={{ fontSize:11, fontWeight:600, color:'#f0f0ff' }}>₹{(p.value/100000).toFixed(1)}L</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
