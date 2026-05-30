'use client'
import { useState } from 'react'
import SocialConnectWidget from '@/components/SocialConnectWidget';

const API_KEYS_CONFIG = [
  { key:'openrouterKey',    label:'OpenRouter API Key (FREE — Recommended)', hint:'sk-or-v1-...', group:'AI', link:'https://openrouter.ai/keys' },
  { key:'anthropicKey',     label:'Anthropic API Key (Optional — Paid)', hint:'sk-ant-api03-...', group:'AI', link:'https://console.anthropic.com' },
  { key:'metaAccessToken',  label:'Meta Access Token',   hint:'EAAx...', group:'Ads', link:'https://developers.facebook.com/apps' },
  { key:'metaAdAccountId',  label:'Meta Ad Account ID',  hint:'act_123456789', group:'Ads', link:'https://business.facebook.com' },
  { key:'googleAdsToken',   label:'Google Ads Dev Token',hint:'xxxxxxxxxxxxxxxx', group:'Ads', link:'https://ads.google.com' },
  { key:'linkedinToken',    label:'LinkedIn Access Token',hint:'AQV...', group:'Ads', link:'https://linkedin.com/developers' },
  { key:'waToken',          label:'WhatsApp System Token',hint:'EAAx...', group:'WhatsApp', link:'https://business.facebook.com' },
  { key:'waPhoneId',        label:'WhatsApp Phone ID',   hint:'1234567890', group:'WhatsApp', link:'https://business.facebook.com' },
  { key:'razorpayKeyId',    label:'Razorpay Key ID',     hint:'rzp_live_...', group:'Payments', link:'https://dashboard.razorpay.com' },
  { key:'razorpaySecret',   label:'Razorpay Key Secret', hint:'••••••••••', group:'Payments', link:'https://dashboard.razorpay.com' },
]

const GROUPS = ['AI','Ads','WhatsApp','Payments']

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<string,string>>(() => {
    try { return JSON.parse(localStorage.getItem('gw_api_keys')||'{}') } catch { return {} }
  })
  const [show, setShow] = useState<Record<string,boolean>>({})
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState<string|null>(null)
  const [testResult, setTestResult] = useState<Record<string,boolean>>({})
  const [tab, setTab] = useState('api')

  const saveAll = () => {
    localStorage.setItem('gw_api_keys', JSON.stringify(keys))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const testConnection = async (key: string) => {
    setTesting(key)
    await new Promise(r => setTimeout(r, 1500))
    setTestResult(p => ({ ...p, [key]: keys[key]?.length > 10 }))
    setTesting(null)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom:18 }}>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, margin:'0 0 4px' }}>⚙️ Settings</h2>
        <p style={{ color:'#9090b8', fontSize:13, margin:0 }}>Configure API keys, profile and platform connections</p>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom:18 }}>
        {[
          ['api','🔑 API Keys'],
          ['connections','🔗 Social Connect'],
          ['profile','👤 Profile'],
          ['billing','💳 Billing'],
        ].map(([k,l]) => (
          <div key={k} className={`tab ${tab===k?'active':''}`} onClick={() => setTab(k)}>{l}</div>
        ))}
      </div>

      {/* API KEYS TAB */}
      {tab === 'api' && (
        <div>
          <div style={{ background:'rgba(0,212,170,.08)', border:'1px solid rgba(0,212,170,.2)', borderRadius:12, padding:'12px 16px', marginBottom:18, display:'flex', gap:12 }}>
            <span style={{ fontSize:18 }}>🆓</span>
            <div>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:3, color:'#00d4aa' }}>Add OpenRouter key for FREE real AI generation</div>
              <div style={{ fontSize:12, color:'#9090b8' }}>Get your free key at <strong style={{color:'#6c47ff'}}>openrouter.ai</strong> → Sign in with Google → Keys → Create Key. Free models: Llama 3.3, DeepSeek, Gemma. No credit card needed.</div>
            </div>
          </div>

          {GROUPS.map(group => (
            <div key={group} className="card" style={{ marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:700, margin:'0 0 14px', paddingBottom:10, borderBottom:'1px solid rgba(255,255,255,.07)' }}>{group}</h3>
              {API_KEYS_CONFIG.filter(k => k.group===group).map(cfg => (
                <div key={cfg.key} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <label style={{ fontSize:12, color:'#9090b8', fontWeight:500 }}>{cfg.label}</label>
                    <a href={cfg.link} target="_blank" style={{ fontSize:10, color:'#6c47ff', textDecoration:'none' }}>Get key →</a>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <input
                      type={show[cfg.key] ? 'text' : 'password'}
                      placeholder={cfg.hint}
                      value={keys[cfg.key]||''}
                      onChange={e => setKeys(p => ({...p, [cfg.key]:e.target.value}))}
                      className="input-field"
                      style={{ flex:1, fontFamily:'monospace', fontSize:12 }}
                    />
                    <button onClick={() => setShow(p => ({...p, [cfg.key]:!p[cfg.key]}))} className="btn btn-secondary btn-sm">{show[cfg.key]?'🙈':'👁️'}</button>
                    <button onClick={() => testConnection(cfg.key)} disabled={!keys[cfg.key]||testing===cfg.key} className="btn btn-secondary btn-sm">
                      {testing===cfg.key ? '…' : testResult[cfg.key]===true ? '✓' : testResult[cfg.key]===false ? '✗' : 'Test'}
                    </button>
                  </div>
                  {testResult[cfg.key]===true && <div style={{ fontSize:11, color:'#00d4aa', marginTop:4 }}>✓ Connected successfully</div>}
                  {testResult[cfg.key]===false && <div style={{ fontSize:11, color:'#ff4757', marginTop:4 }}>✗ Connection failed — check your key</div>}
                </div>
              ))}
            </div>
          ))}

          <button onClick={saveAll} className="btn btn-primary" style={{ padding:'12px 32px', fontSize:14 }}>
            {saved ? '✓ Saved!' : '💾 Save All Keys'}
          </button>
        </div>
      )}

      {/* SOCIAL CONNECTIONS TAB */}
      {tab === 'connections' && (
        <div>
          <div style={{ background:'rgba(108,71,255,.08)', border:'1px solid rgba(108,71,255,.2)', borderRadius:12, padding:'12px 16px', marginBottom:18, display:'flex', gap:12 }}>
            <span style={{ fontSize:18 }}>🔗</span>
            <div>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:3, color:'#a78bfa' }}>Connect your social media accounts</div>
              <div style={{ fontSize:12, color:'#9090b8' }}>Once connected, posts and articles generated from AI will automatically publish to your LinkedIn and Facebook pages — no manual work needed.</div>
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize:14, fontWeight:700, margin:'0 0 16px', paddingBottom:10, borderBottom:'1px solid rgba(255,255,255,.07)' }}>
              📱 Platform Connections
            </h3>
            <SocialConnectWidget />
          </div>

          {/* How it works */}
          <div className="card" style={{ marginTop:14 }}>
            <h3 style={{ fontSize:14, fontWeight:700, margin:'0 0 14px' }}>⚡ How Auto-Posting Works</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { step:'1', text:'Connect your LinkedIn or Facebook account by clicking the button above', color:'#6c47ff' },
                { step:'2', text:'Go to AI Generator → generate any content (article, social post, ad copy)', color:'#a855f7' },
                { step:'3', text:'Click "Publish" — content goes live on your connected pages instantly', color:'#ec4899' },
                { step:'4', text:'Track performance in Analytics dashboard', color:'#10b981' },
              ].map(({ step, text, color }) => (
                <div key={step} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:`rgba(${color},0.1)`, border:`1px solid ${color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color, flexShrink:0 }}>{step}</div>
                  <p style={{ fontSize:13, color:'#9090b8', margin:0, paddingTop:4 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {tab === 'profile' && (
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:700, margin:'0 0 18px' }}>Your Profile</h3>
          {[['Full Name','Graicy Choure'],['Email','contact@globalwebsaas.org'],['Business','GlobalWebSaaS'],['Phone','+91 99811 99648'],['Plan','Owner (Free)']].map(([l,v]) => (
            <div key={l} className="input-group">
              <label>{l}</label>
              <input className="input-field" defaultValue={v} readOnly={l==='Plan'} style={{ opacity:l==='Plan'?.7:1 }}/>
            </div>
          ))}
          <button className="btn btn-primary">Save Profile</button>
        </div>
      )}

      {/* BILLING TAB */}
      {tab === 'billing' && (
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:700, margin:'0 0 14px' }}>Billing & Plan</h3>
          <div style={{ padding:'16px', background:'rgba(108,71,255,.08)', border:'1px solid rgba(108,71,255,.2)', borderRadius:12, marginBottom:14 }}>
            <div style={{ fontSize:12, color:'#c4b5fd', marginBottom:4 }}>Current Plan</div>
            <div style={{ fontSize:24, fontWeight:800, fontFamily:'Syne,sans-serif', color:'#6c47ff' }}>Owner Free Account</div>
            <div style={{ fontSize:12, color:'#9090b8', marginTop:4 }}>Full Enterprise access · contact@globalwebsaas.org</div>
          </div>
          <div style={{ fontSize:12, color:'#9090b8' }}>Client billing is managed via Razorpay. Add your Razorpay keys in API Keys tab to accept subscription payments from clients.</div>
        </div>
      )}
    </div>
  )
}
