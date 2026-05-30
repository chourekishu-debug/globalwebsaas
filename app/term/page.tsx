export default function TermsAndConditions() {
  return (
    <div style={{ backgroundColor: '#07070f', color: '#f0f0ff', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: 'rgba(7,7,15,0.95)', backdropFilter: 'blur(20px)', zIndex: 40 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/globalwebsaas-logo.png" alt="GlobalWebSaaS" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 16, color: '#f0f0ff' }}>GlobalWebSaaS</span>
        </a>
        <a href="/" style={{ color: '#9090b8', fontSize: 13, textDecoration: 'none' }}>← Back to Home</a>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ color: '#6c47ff', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Legal</p>
          <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 12 }}>Terms & Conditions</h1>
          <p style={{ color: '#6060a0', fontSize: 14 }}>Last updated: May 30, 2026 · Effective: May 30, 2026</p>
        </div>

        {[
          {
            title: '1. Acceptance of Terms',
            content: `By accessing or using GlobalWebSaaS ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.\n\nThese Terms apply to all users, including those who register for a free demo, trial, or paid subscription.`
          },
          {
            title: '2. Description of Service',
            content: `GlobalWebSaaS is an AI-powered marketing automation platform that provides:\n\n• AI content generation (ad copy, headlines, articles, social posts)\n• Ad creative generation with AI images\n• Landing page builder\n• WhatsApp automation and broadcasting\n• Social media auto-posting (LinkedIn, Facebook, Instagram)\n• Client CRM and pipeline management\n• Campaign analytics and reporting\n\nWe reserve the right to modify, suspend, or discontinue any feature at any time with reasonable notice.`
          },
          {
            title: '3. Subscription Plans & Payments',
            content: `**Basic Plan:** $4,999/year or $499/month (India: ₹4,999/month) — 1 social media platform\n\n**Professional Plan:** $6,999/year or $699/month (India: ₹6,999/month) — 2 social media platforms\n\n**Premium Plan:** $8,999/year or $899/month (India: ₹8,999/month) — All platforms\n\nAll subscriptions are billed in advance. Payments are non-refundable except as specified in our Refund Policy. We reserve the right to change pricing with 30 days notice to existing subscribers.`
          },
          {
            title: '4. Free Demo & Trial',
            content: `We offer a free demo call before any payment is required. During the demo:\n\n• You will see a live demonstration of all platform features\n• No payment information is required for the demo\n• The demo does not constitute a binding commitment\n\nAfter the demo, you may choose to subscribe to any plan. Trial periods (if offered) are subject to separate terms communicated at the time of the trial offer.`
          },
          {
            title: '5. Refund Policy',
            content: `• **Within 7 days:** Full refund if you are not satisfied — no questions asked\n• **After 7 days:** No refunds for the current billing period\n• **Annual plans:** Pro-rated refund for unused months if cancelled after 30 days\n• **Demo bookings:** Free — no payment required, no refund needed\n\nTo request a refund, contact contact@globalwebsaas.org with your account email and reason.`
          },
          {
            title: '6. User Responsibilities',
            content: `You are responsible for:\n\n• Maintaining the confidentiality of your account credentials\n• All content generated and published through your account\n• Ensuring you have rights to connect and post to social media accounts\n• Complying with the terms of service of connected platforms (LinkedIn, Facebook, etc.)\n• Not using the platform to generate spam, misleading content, or illegal material\n• Keeping your payment information current\n\nYou must be at least 18 years old to use GlobalWebSaaS.`
          },
          {
            title: '7. Acceptable Use Policy',
            content: `You may NOT use GlobalWebSaaS to:\n\n• Generate or distribute spam, phishing, or fraudulent content\n• Violate any applicable laws or regulations\n• Infringe intellectual property rights of others\n• Harass, defame, or harm any individual or group\n• Generate content that is illegal, harmful, or offensive\n• Attempt to reverse engineer or hack the platform\n• Resell or sublicense access without written permission\n• Exceed API rate limits or attempt to circumvent usage restrictions\n\nViolation may result in immediate account termination without refund.`
          },
          {
            title: '8. Social Media Platform Compliance',
            content: `When using our social media posting features, you agree to:\n\n• Comply with LinkedIn's User Agreement and Professional Community Policies\n• Comply with Facebook's Terms of Service and Community Standards\n• Comply with Instagram's Terms of Use\n• Only post content to accounts you own or are authorized to manage\n• Take responsibility for all content published through our platform\n\nGlobalWebSaaS is not responsible for actions taken by social media platforms regarding your account, including suspensions or bans resulting from content posted through our platform.`
          },
          {
            title: '9. Intellectual Property',
            content: `**Your Content:** You retain ownership of all content you create using GlobalWebSaaS. By using our platform, you grant us a limited license to process, store, and transmit your content to provide the service.\n\n**Our Platform:** GlobalWebSaaS, its features, design, code, and AI models are owned by GlobalWebSaaS. You may not copy, modify, or distribute our platform without written permission.\n\n**AI-Generated Content:** Content generated by our AI tools is provided to you for your use. We make no copyright claims on AI-generated output.`
          },
          {
            title: '10. Limitation of Liability',
            content: `To the maximum extent permitted by law:\n\n• GlobalWebSaaS is provided "as is" without warranties of any kind\n• We are not liable for indirect, incidental, or consequential damages\n• Our total liability is limited to the amount paid in the last 3 months\n• We are not responsible for third-party platform outages or policy changes\n• We do not guarantee specific results from AI-generated content or marketing campaigns\n\nSome jurisdictions do not allow limitation of liability — in such cases, our liability is limited to the fullest extent permitted by law.`
          },
          {
            title: '11. Termination',
            content: `Either party may terminate the subscription:\n\n• **You:** Cancel anytime from your account settings. Access continues until end of billing period.\n• **Us:** We may terminate your account immediately for violations of these Terms, non-payment, or fraudulent activity.\n\nUpon termination, your data will be retained for 30 days before permanent deletion, during which you may export your data.`
          },
          {
            title: '12. Governing Law',
            content: `These Terms are governed by the laws of India. Any disputes shall be resolved through:\n\n1. Good faith negotiation (30 days)\n2. Mediation in Indore, Madhya Pradesh\n3. Courts of competent jurisdiction in Indore, India\n\nFor international users, we follow GDPR (EU) and applicable data protection regulations.`
          },
          {
            title: '13. Contact',
            content: `For questions about these Terms:\n\n📧 Email: contact@globalwebsaas.org\n🌐 Website: globalwebsaas.vercel.app\n📍 GlobalWebSaaS, Indore, Madhya Pradesh, India\n\nWe will respond within 5 business days.`
          },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: '#f0f0ff' }}>{title}</h2>
            <div style={{ color: '#9090b8', fontSize: 15, lineHeight: 1.8 }}>
              {content.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: line === '' ? 8 : 4 }}>
                  {line.startsWith('**') ? (
                    <><strong style={{ color: '#c0c0e0' }}>{line.replace(/\*\*/g, '').split(':')[0]}:</strong>{line.replace(/\*\*/g, '').split(':').slice(1).join(':')}</>
                  ) : line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <a href="/" style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>Home</a>
          <a href="/privacy" style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/contact" style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>Contact Us</a>
        </div>
        <p style={{ color: '#40405a', fontSize: 12 }}>© 2026 GlobalWebSaaS · contact@globalwebsaas.org</p>
      </footer>
    </div>
  );
}