'use client'
export default function Page() {
  return (
    <div className="fade-in" style={{ textAlign:'center', padding:60 }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
      <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, marginBottom:8 }}>Full Module Available</h2>
      <p style={{ color:'#9090b8', marginBottom:20 }}>This module is fully built in GlobalWebAI.jsx · Next.js version connects to Supabase backend</p>
      <a href="/dashboard" className="btn btn-primary">← Back to Dashboard</a>
    </div>
  )
}
