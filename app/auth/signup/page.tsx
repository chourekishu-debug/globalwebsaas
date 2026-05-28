'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name:'', email:'', password:'', business:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name, business_name: form.business } }
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060610', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'rgba(13,13,31,.95)', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:28, width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ width:48, height:48, borderRadius:13, background:'linear-gradient(135deg,#6c47ff,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22 }}>⚡</div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:800, color:'#f0f0ff' }}>Create Your Account</h1>
          <p style={{ color:'#9090b8', fontSize:12, marginTop:4 }}>7-day free trial · No credit card</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Your Name</label>
            <input className="input-field" placeholder="Graicy Choure" value={form.name} onChange={e => set('name', e.target.value)} required/>
          </div>
          <div className="input-group">
            <label>Business Name</label>
            <input className="input-field" placeholder="GlobalWebSaaS" value={form.business} onChange={e => set('business', e.target.value)}/>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input className="input-field" type="email" placeholder="contact@globalwebsaas.org" value={form.email} onChange={e => set('email', e.target.value)} required/>
          </div>
          <div className="input-group">
            <label>Password</label>
            <input className="input-field" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required minLength={8}/>
          </div>
          {error && <div style={{ color:'#ff4757', fontSize:12, marginBottom:12, padding:'8px 12px', background:'rgba(255,71,87,.08)', borderRadius:8 }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ padding:'12px', fontSize:14 }}>
            {loading ? 'Creating account...' : 'Start Free Trial'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:14, fontSize:12, color:'#5a5a80' }}>
          Already have an account? <a href="/auth/login" style={{ color:'#6c47ff' }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}
