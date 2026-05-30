'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', type: 'General Inquiry' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setSending(false);
  }

  const contactTypes = ['General Inquiry', 'Book a Demo', 'Technical Support', 'Billing & Payments', 'Partnership', 'Press & Media'];

  return (
    <div style={{ backgroundColor: '#07070f', color: '#f0f0ff', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: 'rgba(7,7,15,0.95)', backdropFilter: 'blur(20px)', zIndex: 40 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/globalwebsaas-logo.png" alt="GlobalWebSaaS" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 16, color: '#f0f0ff' }}>GlobalWebSaaS</span>
        </a>
        <a href="/" style={{ color: '#9090b8', fontSize: 13, textDecoration: 'none' }}>← Back to Home</a>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ color: '#6c47ff', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Get In Touch</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>We'd Love to Hear From You</h1>
          <p style={{ color: '#9090b8', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>Whether you have a question, want to book a demo, or need support — our team is here to help.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>
          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 32 }}>Contact Information</h2>

            {[
              { icon: '📧', title: 'Email Us', value: 'contact@globalwebsaas.org', link: 'mailto:contact@globalwebsaas.org', desc: 'We reply within 24 hours' },
              { icon: '💬', title: 'WhatsApp', value: '+91 99814 32684', link: 'https://wa.me/919981432648', desc: 'Chat with us directly' },
              { icon: '📍', title: 'Location', value: 'Indore, Madhya Pradesh', link: null, desc: 'India (Serving worldwide)' },
              { icon: '🕐', title: 'Working Hours', value: 'Mon – Sat: 9 AM – 7 PM IST', link: null, desc: 'Sunday by appointment' },
            ].map(({ icon, title, value, link, desc }) => (
              <div key={title} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(108,71,255,0.1)', border: '1px solid rgba(108,71,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
                <div>
                  <p style={{ fontSize: 12, color: '#6060a0', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{title}</p>
                  {link ? (
                    <a href={link} style={{ fontSize: 15, fontWeight: 700, color: '#a78bfa', textDecoration: 'none' }}>{value}</a>
                  ) : (
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#f0f0ff' }}>{value}</p>
                  )}
                  <p style={{ fontSize: 12, color: '#6060a0', marginTop: 2 }}>{desc}</p>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="https://wa.me/919981199648?text=Hi! I want to book a free demo of GlobalWebSaaS" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, textDecoration: 'none', color: '#4ade80', fontWeight: 700, fontSize: 14 }}>
                  💬 WhatsApp for Instant Reply
                </a>
                <a href="mailto:contact@globalwebsaas.org?subject=Book a Demo&body=Hi! I'd like to book a free demo of GlobalWebSaaS."
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(108,71,255,0.08)', border: '1px solid rgba(108,71,255,0.2)', borderRadius: 12, textDecoration: 'none', color: '#a78bfa', fontWeight: 700, fontSize: 14 }}>
                  📧 Email for Demo Request
                </a>
                <a href="/dashboard"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, textDecoration: 'none', color: '#c0c0e0', fontWeight: 700, fontSize: 14 }}>
                  👁️ Try Live Demo Dashboard
                </a>
              </div>
            </div>

            {/* Response time */}
            <div style={{ marginTop: 32, padding: 20, background: 'rgba(108,71,255,0.06)', border: '1px solid rgba(108,71,255,0.15)', borderRadius: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>⚡ Our Response Promise</p>
              <p style={{ fontSize: 13, color: '#7070a0', lineHeight: 1.6 }}>
                📧 Email — within 24 hours<br />
                💬 WhatsApp — within 2 hours<br />
                📞 Demo call — within same day<br />
                🛠️ Support — within 4 hours
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 24 }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
                <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, color: '#4ade80' }}>Message Sent!</h3>
                <p style={{ color: '#9090b8', marginBottom: 8 }}>Thank you <strong style={{ color: '#f0f0ff' }}>{form.name}</strong>!</p>
                <p style={{ color: '#9090b8', fontSize: 14, marginBottom: 32 }}>We've received your message and will reply to <strong style={{ color: '#f0f0ff' }}>{form.email}</strong> within 24 hours.</p>
                <a href="https://wa.me/919981199648" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg,#6c47ff,#a855f7)', borderRadius: 12, color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                  💬 WhatsApp for Faster Reply
                </a>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 32 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Send Us a Message</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Type */}
                  <div>
                    <label style={{ fontSize: 12, color: '#6060a0', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>I'm contacting about</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {contactTypes.map(type => (
                        <button key={type} onClick={() => setForm(p => ({ ...p, type }))}
                          style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: form.type === type ? 'linear-gradient(135deg,#6c47ff,#a855f7)' : 'rgba(255,255,255,0.05)', color: form.type === type ? 'white' : '#7070a0', transition: 'all 0.2s' }}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#6060a0', marginBottom: 6, display: 'block' }}>Full Name *</label>
                      <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Rajesh Sharma"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#f0f0ff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#6060a0', marginBottom: 6, display: 'block' }}>Email *</label>
                      <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@business.com" type="email"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#f0f0ff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  {/* Phone & Subject */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#6060a0', marginBottom: 6, display: 'block' }}>Phone / WhatsApp</label>
                      <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#f0f0ff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#6060a0', marginBottom: 6, display: 'block' }}>Subject</label>
                      <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="How can we help?"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#f0f0ff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ fontSize: 12, color: '#6060a0', marginBottom: 6, display: 'block' }}>Message *</label>
                    <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us about your business and how we can help you grow..."
                      rows={5}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: '#f0f0ff', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>

                  <button onClick={handleSubmit} disabled={!form.name || !form.email || !form.message || sending}
                    style={{ width: '100%', padding: '16px', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: !form.name || !form.email || !form.message || sending ? 'not-allowed' : 'pointer', border: 'none', background: !form.name || !form.email || !form.message || sending ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#6c47ff,#a855f7)', color: !form.name || !form.email || !form.message || sending ? '#4040a0' : 'white', transition: 'all 0.2s' }}>
                    {sending ? '⏳ Sending...' : '📤 Send Message'}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: 12, color: '#4040a0' }}>
                    Or reach us directly at{' '}
                    <a href="mailto:contact@globalwebsaas.org" style={{ color: '#6c47ff', textDecoration: 'none' }}>contact@globalwebsaas.org</a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, textAlign: 'center', marginBottom: 40 }}>Common Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {[
              { q: 'How quickly can I get started?', a: 'Book a free demo call today. After the demo, you can start using the platform immediately upon subscription.' },
              { q: 'Do you offer a free trial?', a: 'Yes! We offer a 7-day free trial on all plans. No credit card required for the demo.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your dashboard. Monthly plans stop at end of billing period. No penalties.' },
              { q: 'Do you support businesses outside India?', a: 'Absolutely! We serve businesses worldwide. Pricing available in USD and INR.' },
              { q: 'Is my data secure?', a: 'Yes. We use bank-grade encryption and store data on secure cloud servers. Read our Privacy Policy for details.' },
              { q: 'What platforms can I post to?', a: 'LinkedIn, Facebook, Instagram (via Facebook), and more coming soon including YouTube and Twitter.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: '#f0f0ff' }}>{q}</p>
                <p style={{ fontSize: 14, color: '#7070a0', lineHeight: 1.6 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center', marginTop: 80 }}>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <a href="/" style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>Home</a>
          <a href="/privacy" style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>Terms & Conditions</a>
        </div>
        <p style={{ color: '#40405a', fontSize: 12 }}>© 2026 GlobalWebSaaS · contact@globalwebsaas.org</p>
      </footer>
    </div>
  );
}