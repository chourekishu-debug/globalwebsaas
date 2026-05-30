export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: '#07070f', color: '#f0f0ff', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' }}>
      {/* Nav */}
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
          <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ color: '#6060a0', fontSize: 14 }}>Last updated: May 30, 2026 · Effective: May 30, 2026</p>
        </div>

        {[
          {
            title: '1. Introduction',
            content: `GlobalWebSaaS ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered marketing automation platform at globalwebsaas.vercel.app and related services.\n\nBy using GlobalWebSaaS, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our services.`
          },
          {
            title: '2. Information We Collect',
            content: `We collect the following types of information:\n\n**Account Information:** Name, email address, business name, phone number, and password when you register.\n\n**Business Information:** Business type, location, target audience, marketing goals, and other details you provide to customize your experience.\n\n**Connected Platform Data:** When you connect LinkedIn, Facebook, or other social media accounts, we store OAuth tokens to enable automatic posting on your behalf.\n\n**Usage Data:** Pages visited, features used, content generated, time spent, and actions taken within the platform.\n\n**Payment Information:** Billing details processed securely through Razorpay or Stripe. We do not store card numbers.\n\n**Communications:** Messages, support requests, and demo booking information you submit.`
          },
          {
            title: '3. How We Use Your Information',
            content: `We use your information to:\n\n• Provide, operate, and maintain our marketing automation services\n• Generate AI-powered content tailored to your business\n• Automatically publish posts to your connected social media accounts\n• Process payments and send billing invoices\n• Send service updates, security alerts, and support messages\n• Improve our AI models and platform features\n• Respond to your inquiries and demo requests\n• Comply with legal obligations\n\nWe do NOT sell your personal information to third parties.`
          },
          {
            title: '4. Social Media Integrations',
            content: `When you connect LinkedIn, Facebook, Instagram, or other platforms:\n\n• We store OAuth access tokens securely in our database\n• These tokens allow us to post content on your behalf\n• We only post content that you create or approve through our platform\n• You can disconnect any platform at any time from Settings\n• Disconnecting removes your access token from our systems\n• We do not access your private messages or contacts on these platforms`
          },
          {
            title: '5. Data Storage & Security',
            content: `Your data is stored on Supabase (hosted on AWS in Mumbai region for Indian users). We implement industry-standard security measures including:\n\n• AES-256 encryption for data at rest\n• TLS 1.3 encryption for data in transit\n• Row-Level Security (RLS) policies in our database\n• Regular security audits and vulnerability assessments\n• Secure OAuth token storage\n\nHowever, no method of transmission over the Internet is 100% secure. We strive to use commercially acceptable means to protect your data but cannot guarantee absolute security.`
          },
          {
            title: '6. Data Sharing',
            content: `We share your data only with:\n\n**Service Providers:** Supabase (database), OpenRouter (AI generation), Pollinations (image generation), Razorpay/Stripe (payments), Vercel (hosting). These providers are bound by data processing agreements.\n\n**Social Platforms:** When posting content, relevant data is shared with LinkedIn, Facebook, Instagram as required for the posting functionality.\n\n**Legal Requirements:** We may disclose your information if required by law, court order, or government authority.\n\nWe do not share your data for advertising or marketing purposes without your explicit consent.`
          },
          {
            title: '7. Your Rights',
            content: `You have the right to:\n\n• **Access:** Request a copy of all data we hold about you\n• **Correction:** Update incorrect or incomplete information\n• **Deletion:** Request deletion of your account and all associated data\n• **Portability:** Export your data in a machine-readable format\n• **Objection:** Opt out of certain data processing activities\n• **Withdraw Consent:** Disconnect social accounts or cancel your subscription at any time\n\nTo exercise these rights, contact us at contact@globalwebsaas.org`
          },
          {
            title: '8. Cookies',
            content: `We use essential cookies and local storage to:\n\n• Maintain your login session\n• Remember your preferences and settings\n• Analyze platform usage (anonymized)\n\nWe do not use advertising or tracking cookies. You can control cookies through your browser settings, though disabling essential cookies may affect platform functionality.`
          },
          {
            title: '9. Children\'s Privacy',
            content: `GlobalWebSaaS is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, please contact us immediately.`
          },
          {
            title: '10. Changes to This Policy',
            content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by:\n\n• Sending an email to your registered address\n• Displaying a notice on our platform\n• Updating the "Last updated" date above\n\nContinued use of GlobalWebSaaS after changes constitutes acceptance of the updated policy.`
          },
          {
            title: '11. Contact Us',
            content: `For privacy-related questions or to exercise your rights:\n\n📧 Email: contact@globalwebsaas.org\n🌐 Website: globalwebsaas.vercel.app\n📍 Address: Indore, Madhya Pradesh, India\n\nWe will respond to all privacy requests within 30 days.`
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

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <a href="/" style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>Home</a>
          <a href="/terms" style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>Terms & Conditions</a>
          <a href="/contact" style={{ color: '#6060a0', fontSize: 13, textDecoration: 'none' }}>Contact Us</a>
        </div>
        <p style={{ color: '#40405a', fontSize: 12 }}>© 2026 GlobalWebSaaS · contact@globalwebsaas.org</p>
      </footer>
    </div>
  );
}