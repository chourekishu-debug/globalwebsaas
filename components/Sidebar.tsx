'use client'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const NAV = [
  { icon:'📊', label:'Dashboard',      path:'/dashboard' },
  { icon:'📢', label:'Campaigns',      path:'/dashboard/campaigns' },
  { icon:'🤖', label:'AI Generator',   path:'/dashboard/ai' },
  { icon:'📱', label:'Social Media',   path:'/dashboard/social' },
  { icon:'🎨', label:'Creative Studio',path:'/dashboard/creative' },
  { icon:'🌐', label:'Landing Pages',  path:'/dashboard/landing' },
  { icon:'👥', label:'Lead Manager',   path:'/dashboard/leads' },
  { icon:'📈', label:'Analytics',      path:'/dashboard/analytics' },
  { icon:'💬', label:'WhatsApp',       path:'/dashboard/whatsapp' },
  { icon:'🏢', label:'Clients',        path:'/dashboard/clients' },
  { icon:'⚙️', label:'Settings',       path:'/dashboard/settings' },
]

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const go = (path: string) => {
    router.push(path)
    onClose?.()
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Logo */}
      <div style={{ padding:'20px 16px 14px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#6c47ff,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>⚡</div>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:800, color:'#f0f0ff' }}>Global Web AI</div>
            <div style={{ fontSize:10, color:'#9090b8' }}>Marketing Automation</div>
          </div>
        </div>
        {/* Live indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:10, padding:'5px 10px', background:'rgba(0,212,170,.06)', borderRadius:20, border:'1px solid rgba(0,212,170,.15)', width:'fit-content' }}>
          <div className="live-dot"/>
          <span style={{ fontSize:10, color:'#00d4aa', fontWeight:600 }}>LIVE DEMO</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px 0', overflowY:'auto' }}>
        {NAV.map(item => {
          const active = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path))
          return (
            <div key={item.path} className={`nav-item ${active ? 'active' : ''}`} onClick={() => go(item.path)}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding:'10px 8px 16px', borderTop:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ padding:'10px 14px', borderRadius:10, marginBottom:8 }}>
          <div style={{ fontSize:12, fontWeight:600, color:'#f0f0ff' }}>Graicy Choure</div>
          <div style={{ fontSize:11, color:'#9090b8' }}>contact@globalwebsaas.org</div>
          <div className="badge badge-purple" style={{ marginTop:5, fontSize:10 }}>Owner · Free Account</div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary btn-full btn-sm">
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
