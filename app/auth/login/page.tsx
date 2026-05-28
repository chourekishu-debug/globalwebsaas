'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: 'contact@globalwebsaas.org',
      password: 'GlobalWebAI@2026'
    })
    if (!error) { router.push('/dashboard'); return }
    // If demo account doesn't exist yet, go to dashboard anyway (demo mode)
    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060610', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ position:'absolute', top:-100, left:-100, width:500, height:500, background:'#6c47ff', borderRadius:'50%', filter:'blur(120px)', opacity:.08 }}/>
      <div style={{ position:'absolute', bottom:-80, right:-80, width:400, height:400, background:'#ff4791', borderRadius:'50%', filter:'blur(100px)', opacity:.06 }}/>

      <div style={{ textAlign:'center', marginBottom:32, position:'relative', zIndex:2 }}>
        <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#6c47ff,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:24 }}>⚡</div>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:800, color:'#f0f0ff', margin:0 }}>Global Web AI</h1>
        <p style={{ color:'#9090b8', fontSize:13, marginTop:4 }}>Sign in to your marketing dashboard</p>
      </div>

      <div style={{ background:'rgba(13,13,31,.95)', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:28, width:'100%', maxWidth:400, position:'relative', zIndex:2 }}>
        {/* Demo banner */}
        <div style={{ background:'rgba(0,212,170,.08)', border:'1px solid rgba(0,212,170,.2)', borderRadius:12, padding:'10px 14px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#00d4aa', boxShadow:'0 0 8px #00d4aa', flexShrink:0 }}/>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'#00d4aa' }}>Demo Mode Available</div>
            <div style={{ fontSize:11, color:'#9090b8' }}>Click "Enter Demo" to explore all features instantly</div>
          </div>
        </div>

        <button onClick={handleDemo} disabled={loading} className="btn btn-full" style={{ background:'linear-gradient(135deg,#6c47ff,#8b5cf6)', color:'#fff', marginBottom:16, padding:'12px', fontSize:14 }}>
          {loading ? '⏳ Loading...' : '🚀 Enter Demo Dashboard'}
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,.08)' }}/>
          <span style={{ fontSize:11, color:'#5a5a80' }}>or sign in with email</span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,.08)' }}/>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input className="input-field" type="email" placeholder="you@yourcompany.com" value={email} onChange={e => setEmail(e.target.value)} required/>
          </div>
          <div className="input-group">
            <label>Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required/>
          </div>
          {error && <div style={{ color:'#ff4757', fontSize:12, marginBottom:12, padding:'8px 12px', background:'rgba(255,71,87,.08)', borderRadius:8 }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn btn-secondary btn-full" style={{ marginTop:4 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:16, fontSize:12, color:'#5a5a80' }}>
          No account? <a href="/auth/signup" style={{ color:'#6c47ff' }}>Create free account</a>
        </p>
      </div>
    </div>
  )
}
