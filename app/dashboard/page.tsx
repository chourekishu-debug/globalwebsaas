'use client'
import { useState, useEffect } from 'react'
import { formatCurrency, formatNumber, PLATFORM_COLORS } from '@/lib/utils'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// Live ticker hook
function useTicker(base: number, variance: number, interval = 4000) {
  const [val, setVal] = useState(base)
  useEffect(() => {
    const iv = setInterval(() => setVal(v => Math.max(0, v + Math.floor((Math.random() - 0.4) * variance))), interval)
    return () => clearInterval(iv)
  }, [])
  return val
}

const WEEK_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const WEEK_LEADS  = [182, 201, 178, 245, 267, 289, 312]
const WEEK_SPEND  = [42, 38, 51, 47, 58, 62, 71]
const PLATFORM_DATA = [
  { name:'Meta',     leads:1243, spend:842000, roas:5.8, color:'#1877F2' },
  { name:'Google',   leads:1089, spend:694000, roas:7.2, color:'#4285F4' },
  { name:'LinkedIn', leads:312,  spend:213000, roas:4.1, color:'#0A66C2' },
  { name:'GMB',      leads:203,  spend:91000,  roas:6.0, color:'#00D4AA' },
]
const CAMPAIGNS = [
  { name:'GlobalWebSaaS — Agency Meta',  platform:'meta',     status:'active', spent:5420,  leads:198, roas:5.8, cpl:27.4 },
  { name:'GlobalWebSaaS — Google Brand', platform:'google',   status:'active', spent:8940,  leads:412, roas:7.2, cpl:21.7 },
  { name:'GlobalWebSaaS — LinkedIn B2B', platform:'linkedin', status:'active', spent:4100,  leads:87,  roas:4.1, cpl:47.1 },
  { name:'GlobalWebSaaS — Reel Demo',    platform:'meta',     status:'active', spent:2800,  leads:134, roas:6.4, cpl:20.9 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#0d0d1f', border:'1px solid rgba(108,71,255,.3)', borderRadius:10, padding:'10px 14px' }}>
      <div style={{ fontSize:12, color:'#9090b8', marginBottom:4 }}>{label}</div>
      {payload.map((p: any) => <div key={p.name} style={{ fontSize:13, color:p.color, fontWeight:600 }}>{p.name}: {p.value}</div>)}
    </div>
  )
}

export default function DashboardPage() {
  const liveLeads   = useTicker(907,  3, 4000)
  const liveSpend   = useTicker(58400, 180, 5000)
  const liveReplies = useTicker(312,  2, 3500)
  const [chartData] = useState(() => WEEK_LABELS.map((day, i) => ({ day, leads: WEEK_LEADS[i], spend: WEEK_SPEND[i] })))

  const STATS = [
    { label:'Total Spend',  val:'₹18.4L', change:'+12.4%', up:true,  color:'#6c47ff', icon:'💰' },
    { label:'Total Leads',  val:'2,847',  change:'+23.1%', up:true,  color:'#00d4aa', icon:'👥' },
    { label:'Avg ROAS',     val:'6.24x',  change:'+8.3%',  up:true,  color:'#ff4791', icon:'📈' },
    { label:'Avg CPL',      val:'₹246',   change:'-14.2%', up:false, color:'#ffd32a', icon:'🎯' },
  ]

  return (
    <div className="fade-in">
      {/* Live demo banner */}
      <div style={{ background:'linear-gradient(90deg,rgba(108,71,255,.15),rgba(0,212,170,.1),rgba(108,71,255,.15))', border:'1px solid rgba(108,71,255,.3)', borderRadius:13, padding:'10px 16px', marginBottom:18, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <div className="live-dot"/>
          <span style={{ fontSize:12, fontWeight:700, color:'#00d4aa', letterSpacing:.5 }}>LIVE — GlobalWebSaaS Platform</span>
        </div>
        <div style={{ display:'flex', gap:24, marginLeft:'auto', flexWrap:'wrap' }}>
          {[
            { l:'Leads today',   v:liveLeads,                    c:'#00d4aa' },
            { l:'Ad spend (₹)',  v:liveSpend.toLocaleString(),   c:'#6c47ff' },
            { l:'WA replies',    v:liveReplies,                  c:'#25d366' },
          ].map(m => (
            <div key={m.l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:800, fontFamily:'Syne,sans-serif', color:m.c, transition:'all .3s', animation:'ticker .4s ease' }}>{m.v}</div>
              <div style={{ fontSize:10, color:'#9090b8' }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:18 }}>
        {STATS.map(s => (
          <div key={s.label} className="card card-hover">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <span className={`badge ${s.up ? 'badge-green' : 'badge-red'}`} style={{ fontSize:10 }}>
                {s.up ? '↑' : '↓'} {s.change}
              </span>
            </div>
            <div style={{ fontSize:26, fontWeight:800, fontFamily:'Syne,sans-serif', color:s.color, marginBottom:3 }}>{s.val}</div>
            <div style={{ fontSize:11, color:'#9090b8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
        {/* Leads trend */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, margin:0 }}>Weekly Leads</h3>
              <div style={{ fontSize:11, color:'#9090b8' }}>This week vs target</div>
            </div>
            <div className="badge badge-green" style={{ fontSize:10 }}>↑ 23.1%</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill:'#9090b8', fontSize:10 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="leads" stroke="#00d4aa" strokeWidth={2} fill="url(#leadGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform breakdown */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, margin:0 }}>Leads by Platform</h3>
              <div style={{ fontSize:11, color:'#9090b8' }}>Total: 2,847 leads</div>
            </div>
            <div className="badge badge-purple" style={{ fontSize:10 }}>4 platforms</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={PLATFORM_DATA} barSize={28}>
              <XAxis dataKey="name" tick={{ fill:'#9090b8', fontSize:10 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="leads" radius={[6,6,0,0]}>
                {PLATFORM_DATA.map((p, i) => <Cell key={i} fill={p.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign table + Platform ROAS */}
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14, marginBottom:18 }}>
        {/* Campaigns */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:0 }}>Active Campaigns</h3>
            <a href="/dashboard/campaigns" style={{ fontSize:11, color:'#6c47ff', textDecoration:'none' }}>View all →</a>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {/* Table header */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 70px 60px 50px', gap:8, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,.06)', marginBottom:4 }}>
              {['Campaign','Spend','Leads','ROAS'].map(h => <div key={h} style={{ fontSize:10, color:'#5a5a80', fontWeight:600 }}>{h}</div>)}
            </div>
            {CAMPAIGNS.map((c, i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 70px 60px 50px', gap:8, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.04)', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:12, color:'#f0f0ff', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:PLATFORM_COLORS[c.platform] }}/>
                    <span style={{ fontSize:10, color:'#9090b8', textTransform:'capitalize' }}>{c.platform}</span>
                  </div>
                </div>
                <div style={{ fontSize:12, color:'#f0f0ff' }}>₹{c.spent.toLocaleString()}</div>
                <div style={{ fontSize:12, color:'#00d4aa', fontWeight:600 }}>{c.leads}</div>
                <div style={{ fontSize:12, color:'#6c47ff', fontWeight:600 }}>{c.roas}x</div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform ROAS */}
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:700, margin:'0 0 14px' }}>ROAS by Platform</h3>
          {PLATFORM_DATA.map(p => (
            <div key={p.name} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:p.color }}/>
                  <span style={{ fontSize:13, color:'#f0f0ff' }}>{p.name}</span>
                </div>
                <span style={{ fontSize:13, color:p.color, fontWeight:700 }}>{p.roas}x</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${(p.roas/8)*100}%`, background:p.color }}/>
              </div>
            </div>
          ))}

          {/* Quick actions */}
          <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:7 }}>
            <a href="/dashboard/ai" className="btn btn-primary btn-sm btn-full" style={{ justifyContent:'center', textDecoration:'none' }}>🤖 Generate AI Content</a>
            <a href="/dashboard/campaigns" className="btn btn-secondary btn-sm btn-full" style={{ justifyContent:'center', textDecoration:'none' }}>📢 Launch Campaign</a>
          </div>
        </div>
      </div>

      {/* WhatsApp + Recent leads */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {/* WhatsApp stats */}
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <span style={{ fontSize:20 }}>💬</span>
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, margin:0 }}>WhatsApp Automation</h3>
              <div style={{ fontSize:11, color:'#9090b8' }}>Live reply status</div>
            </div>
          </div>
          {[
            { l:'Avg reply time',    v:'28 sec',    c:'#25d366' },
            { l:'Leads replied',     v:'312 today', c:'#00d4aa' },
            { l:'Follow-ups sent',   v:'847 week',  c:'#6c47ff' },
            { l:'Conversion rate',   v:'18.4%',     c:'#ffd32a' },
          ].map(m => (
            <div key={m.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
              <span style={{ fontSize:12, color:'#9090b8' }}>{m.l}</span>
              <span style={{ fontSize:13, color:m.c, fontWeight:700 }}>{m.v}</span>
            </div>
          ))}
          <a href="/dashboard/whatsapp" style={{ display:'block', marginTop:12, textAlign:'center', fontSize:12, color:'#25d366', textDecoration:'none' }}>Open WhatsApp inbox →</a>
        </div>

        {/* Recent leads */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:0 }}>Hot Leads 🔥</h3>
            <a href="/dashboard/leads" style={{ fontSize:11, color:'#6c47ff', textDecoration:'none' }}>View all →</a>
          </div>
          {[
            { n:'Rajan Mehta',   v:'₹20K/mo',   src:'Meta',    stage:'hot',       initials:'RM' },
            { n:'Arvind Kapoor', v:'Real Estate',src:'LinkedIn', stage:'hot',      initials:'AK' },
            { n:'Amit Shah',     v:'F&B Chain',  src:'Meta',    stage:'hot',       initials:'AS' },
            { n:'Meena Nair',    v:'Healthcare', src:'Google',  stage:'converted', initials:'MN' },
          ].map((l, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6c47ff,#ff4791)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>{l.initials}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#f0f0ff' }}>{l.n}</div>
                <div style={{ fontSize:10, color:'#9090b8' }}>{l.v} · via {l.src}</div>
              </div>
              <div className={`badge ${l.stage === 'converted' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize:9 }}>
                {l.stage === 'converted' ? '✓ Paid' : '🔥 Hot'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
