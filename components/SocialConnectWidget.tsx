// components/SocialConnectWidget.tsx
// Add this to your Settings page and Social Media page

'use client';

import { useState, useEffect } from 'react';

interface Connection {
  platform: string;
  profile_name: string;
  profile_picture?: string;
  connected: boolean;
  expires_at?: string;
  org_id?: string;
  pages?: string;
}

interface SocialConnectWidgetProps {
  onConnectionChange?: (connections: Connection[]) => void;
  compact?: boolean;
}

export default function SocialConnectWidget({ onConnectionChange, compact = false }: SocialConnectWidgetProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postResult, setPostResult] = useState<any>(null);

  useEffect(() => {
    fetchConnections();

    // Check URL params for success/error after OAuth redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      fetchConnections();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  async function fetchConnections() {
    try {
      const res = await fetch('/api/social/connections');
      const data = await res.json();
      setConnections(data.connections || []);
      onConnectionChange?.(data.connections || []);
    } catch {}
    finally { setLoading(false); }
  }

  function connectPlatform(platform: string) {
    window.location.href = `/api/social/connect?platform=${platform}`;
  }

  async function disconnectPlatform(platform: string) {
    await fetch('/api/social/disconnect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform }) });
    fetchConnections();
  }

  async function testPost() {
    if (!postContent.trim()) return;
    setPosting(true);
    setPostResult(null);
    try {
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: postContent,
          platforms: connections.filter(c => c.connected).map(c => c.platform)
        })
      });
      const data = await res.json();
      setPostResult(data);
    } catch (err: any) {
      setPostResult({ error: err.message });
    } finally { setPosting(false); }
  }

  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: '#0A66C2',
      bgColor: 'rgba(10,102,194,0.1)',
      borderColor: 'rgba(10,102,194,0.3)',
      desc: 'Post to your profile & company pages',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      color: '#1877F2',
      bgColor: 'rgba(24,119,242,0.1)',
      borderColor: 'rgba(24,119,242,0.3)',
      desc: 'Post to your profile & Facebook pages',
    },
  ];

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
      <span className="w-4 h-4 border-2 border-gray-600 border-t-purple-500 rounded-full animate-spin" />
      Loading connections...
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Platform Cards */}
      {platforms.map(platform => {
        const conn = connections.find(c => c.platform === platform.id);
        const isConnected = conn?.connected;
        const fbPages = isConnected && platform.id === 'facebook' && conn.pages ? JSON.parse(conn.pages) : [];

        return (
          <div key={platform.id} style={{ background: isConnected ? platform.bgColor : 'rgba(255,255,255,0.02)', border: `1px solid ${isConnected ? platform.borderColor : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: compact ? 16 : 20 }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: isConnected ? platform.color : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {platform.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{platform.name}</span>
                    {isConnected && (
                      <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: 100, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>
                        ✓ Connected
                      </span>
                    )}
                  </div>
                  {isConnected ? (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Connected as <span className="text-white font-medium">{conn.profile_name}</span>
                      {platform.id === 'facebook' && fbPages.length > 0 && (
                        <span> · {fbPages.length} page{fbPages.length > 1 ? 's' : ''}: {fbPages.map((p: any) => p.name).join(', ')}</span>
                      )}
                      {platform.id === 'linkedin' && conn.org_id && (
                        <span> · Company page connected</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">{platform.desc}</p>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {isConnected ? (
                  <button
                    onClick={() => disconnectPlatform(platform.id)}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 hover:border-red-700 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connectPlatform(platform.id)}
                    style={{ background: platform.color, color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Connect →
                  </button>
                )}
              </div>
            </div>

            {/* Show connected pages for Facebook */}
            {isConnected && platform.id === 'facebook' && fbPages.length > 0 && !compact && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-400 mb-2">📄 Connected Pages (posts will go to these pages):</p>
                <div className="flex flex-wrap gap-2">
                  {fbPages.map((page: any) => (
                    <span key={page.id} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
                      👥 {page.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Test Post Section (only show if at least one connected) */}
      {!compact && connections.some(c => c.connected) && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mt-2">
          <h4 className="text-sm font-bold text-white mb-3">🚀 Test Auto-Post</h4>
          <textarea
            value={postContent}
            onChange={e => setPostContent(e.target.value)}
            placeholder="Write a test post... This will be published to all connected platforms instantly!"
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none mb-3"
          />
          <button
            onClick={testPost}
            disabled={!postContent.trim() || posting}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${!postContent.trim() || posting ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'}`}
          >
            {posting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                Publishing to {connections.filter(c => c.connected).map(c => c.platform).join(' & ')}...
              </span>
            ) : `⚡ Publish to ${connections.filter(c => c.connected).map(c => c.platform === 'linkedin' ? 'LinkedIn' : 'Facebook').join(' & ')}`}
          </button>

          {postResult && (
            <div className={`mt-3 p-3 rounded-xl ${postResult.error ? 'bg-red-900/20 border border-red-600/30' : 'bg-green-900/20 border border-green-600/30'}`}>
              {postResult.error ? (
                <p className="text-red-400 text-xs">❌ {postResult.error}</p>
              ) : (
                <div>
                  {postResult.results?.map((r: any, i: number) => (
                    <p key={i} className={`text-xs ${r.success ? 'text-green-400' : 'text-red-400'}`}>
                      {r.success ? '✅' : '❌'} {r.platform} — {r.success ? 'Posted successfully!' : r.error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info if nothing connected */}
      {connections.filter(c => c.connected).length === 0 && (
        <div className="bg-blue-900/10 border border-blue-600/20 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-300 font-medium mb-1">Connect your social accounts above</p>
          <p className="text-xs text-gray-400">Once connected, every article and post generated will publish automatically to your pages</p>
        </div>
      )}
    </div>
  );
}
