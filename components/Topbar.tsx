'use client'
import { usePathname } from 'next/navigation'

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/campaigns': 'Campaigns',
  '/dashboard/ai': 'AI Generator',
  '/dashboard/social': 'Social Media',
  '/dashboard/creative': 'Creative Studio',
  '/dashboard/leads': 'Lead Manager',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/whatsapp': 'WhatsApp',
  '/dashboard/clients': 'Clients',
  '/dashboard/settings': 'Settings',
}

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const title = TITLES[pathname] || 'Dashboard'
  const date = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  return (
    <div style={{ height:60, background:'rgba(13,13,31,.9)', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:50 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onMenuClick} style={{ display:'none', background:'none', border:'none', color:'#9090b8', cursor:'pointer', fontSize:20, padding:4 }} className="menu-btn">☰</button>
        <div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#f0f0ff', margin:0 }}>{title}</h2>
          <div style={{ fontSize:11, color:'#5a5a80' }}>{date}</div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 12px', background:'rgba(108,71,255,.1)', border:'1px solid rgba(108,71,255,.25)', borderRadius:20 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#6c47ff', boxShadow:'0 0 6px #6c47ff' }}/>
          <span style={{ fontSize:11, color:'#c4b5fd', fontWeight:600 }}>GlobalWebSaaS</span>
        </div>
        <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6c47ff,#ff4791)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff' }}>GC</div>
      </div>
      <style>{`.menu-btn{display:none!important} @media(max-width:768px){.menu-btn{display:flex!important}}`}</style>
    </div>
  )
}
