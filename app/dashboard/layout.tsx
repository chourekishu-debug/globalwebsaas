'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)}/>
      </div>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:99, display:'none' }} className="mobile-overlay"/>
      )}

      {/* Main */}
      <div className="main-content" style={{ flex:1 }}>
        <Topbar onMenuClick={() => setSidebarOpen(p => !p)}/>
        <div className="page-wrap">{children}</div>
      </div>

      <style>{`@media(max-width:768px){ .mobile-overlay{display:block!important} }`}</style>
    </div>
  )
}
