import { useState, useEffect } from 'react';
import { Sparkles, Youtube, FileText, Repeat, Network, MessageSquare, Loader2, Check } from 'lucide-react';
import api from '../lib/api';

export default function AITools() {
  const [activeTab, setActiveTab] = useState<'video' | 'summarize' | 'repurpose' | 'expand' | 'rewrite'>('video');

  const tabs = [
    { id: 'video', label: 'Video Summary', icon: <Youtube size={16} /> },
    { id: 'summarize', label: 'Summarize Text', icon: <FileText size={16} /> },
    { id: 'repurpose', label: 'Repurpose', icon: <Repeat size={16} /> },
    { id: 'expand', label: 'Expand Idea', icon: <Network size={16} /> },
    { id: 'rewrite', label: 'Humanize Text', icon: <MessageSquare size={16} /> },
  ] as const;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dash-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', background: 'var(--dash-surface)', borderBottom: '1px solid var(--dash-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--dash-purple-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 20, height: 20, color: 'var(--dash-purple)' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--dash-text)', margin: '0 0 4px' }}>
              AI Content Tools
            </h1>
            <p style={{ fontSize: 14, color: 'var(--dash-text-mid)', margin: 0 }}>
              Supercharge your workflow with intelligent utilities
            </p>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--dash-surface)', padding: 6, borderRadius: 99, border: '1px solid var(--dash-border)', marginBottom: 32, maxWidth: '100%', overflowX: 'auto', flexWrap: 'wrap', justifyContent: 'center' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, border: 'none', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600,
                background: activeTab === t.id ? 'var(--dash-purple)' : 'transparent',
                color: activeTab === t.id ? '#FFF' : 'var(--dash-text-mid)',
                transition: 'all 0.2s'
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ width: '100%', maxWidth: 700, background: 'var(--dash-surface)', borderRadius: 24, border: '1px solid var(--dash-border)', padding: 32, boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
          {activeTab === 'video' && <VideoSummaryTool />}
          {activeTab === 'summarize' && <SummarizeStoreTool />}
          {activeTab === 'repurpose' && <RepurposeTool />}
          {activeTab === 'expand' && <ExpandIdeaTool />}
          {activeTab === 'rewrite' && <HumanizeTextTool />}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                VIDEO SUMMARY                               */
/* -------------------------------------------------------------------------- */
function VideoSummaryTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleRun = async () => {
    if (!url) return;
    setLoading(true); setError(''); setResult('');
    try {
      const data = await api.post<any>('/ai/video-summary', { body: { url } });
      if (data.success) setResult(data.data);
      else setError(data.error || data.message || 'Failed to summarize video.');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="YouTube Video Summarizer" desc="Paste a YouTube URL to get an instant AI-generated summary of its transcript.">
      <Input label="YouTube URL" placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={setUrl} />
      <ActionRow loading={loading} onRun={handleRun} disabled={!url} btnLabel="Summarize Video" />
      <ResultBox result={result} error={error} loading={loading} />
    </ToolLayout>
  );
}

/* -------------------------------------------------------------------------- */
/*                               SUMMARIZE & STORE                            */
/* -------------------------------------------------------------------------- */
function SummarizeStoreTool() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleRun = async () => {
    if (!content) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await api.post<any>('/ai/summarize-store', { body: { content } });
      if (data.success) setResult(data.data);
      else setError(data.error || data.message || 'Failed to summarize and store.');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Summarize & Store" desc="Paste any long article or document text. The AI will summarize it and automatically save it as a new Idea.">
      <Textarea label="Content to Summarize" placeholder="Paste your text here..." value={content} onChange={setContent} />
      <ActionRow loading={loading} onRun={handleRun} disabled={!content} btnLabel="Summarize & Store Idea" />
      {loading && <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--dash-text-muted)' }}><Loader2 className="spinner" style={{ width: 24, height: 24, animation: 'spin 1s linear infinite', margin: '0 auto' }} /></div>}
      {error && <div style={{ marginTop: 24, padding: 16, background: 'var(--dash-red-soft)', color: 'var(--dash-red)', borderRadius: 12, fontSize: 14 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24, padding: 24, background: 'var(--dash-surface-2)', borderRadius: 16, border: '1px solid var(--dash-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--dash-green)', fontWeight: 600, marginBottom: 12 }}>
            <Check size={18} /> Successfully saved as an Idea!
          </div>
          <h4 style={{ margin: '0 0 8px', fontSize: 16, color: 'var(--dash-text)' }}>{result.title}</h4>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--dash-text-mid)', whiteSpace: 'pre-wrap' }}>{result.content}</p>
        </div>
      )}
    </ToolLayout>
  );
}

/* -------------------------------------------------------------------------- */
/*                             REPURPOSE CONTENT                              */
/* -------------------------------------------------------------------------- */
function RepurposeTool() {
  const [content, setContent] = useState('');
  const [format, setFormat] = useState('LinkedIn Post');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleRun = async () => {
    if (!content) return;
    setLoading(true); setError(''); setResult('');
    try {
      const data = await api.post<any>('/ai/repurpose', { body: { content, format } });
      if (data.success) setResult(data.data);
      else setError(data.error || data.message || 'Failed to repurpose.');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Content Repurposer" desc="Turn a TikTok script into a LinkedIn post, or a blog post into a Twitter thread.">
      <Textarea label="Original Content" placeholder="Paste the content you want to repurpose..." value={content} onChange={setContent} />
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--dash-text-mid)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Format</label>
        <select value={format} onChange={e => setFormat(e.target.value)} style={{ width: '100%', background: 'var(--dash-surface-2)', border: '1.5px solid var(--dash-border)', borderRadius: 12, padding: '12px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'var(--dash-text)', outline: 'none' }}>
          <option value="LinkedIn Post">LinkedIn Post</option>
          <option value="Twitter Thread">Twitter Thread</option>
          <option value="TikTok Script">TikTok Script</option>
          <option value="Blog Post Outline">Blog Post Outline</option>
          <option value="Newsletter Email">Newsletter Email</option>
        </select>
      </div>
      <ActionRow loading={loading} onRun={handleRun} disabled={!content} btnLabel="Repurpose Content" />
      <ResultBox result={result} error={error} loading={loading} />
    </ToolLayout>
  );
}

/* -------------------------------------------------------------------------- */
/*                                EXPAND IDEA                                 */
/* -------------------------------------------------------------------------- */
function ExpandIdeaTool() {
  const [ideaId, setIdeaId] = useState('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const [error, setError] = useState('');

  // Fetch ideas for the dropdown
  useEffect(() => {
    const fetchIdeas = async () => {
      setLoadingFetch(true);
      try {
        const data = await api.get<any>('/ideas');
        if (data.success) {
          setIdeas(data.data || []);
          if (data.data?.length > 0) setIdeaId(data.data[0]._id);
        }
      } catch (e) { console.error(e); } finally { setLoadingFetch(false); }
    };
    fetchIdeas();
  }, []);

  const handleRun = async () => {
    if (!ideaId) return;
    setLoading(true); setError(''); setResult([]);
    try {
      const data = await api.post<any>('/ai/expand', { body: { ideaId } });
      // The backend returns { sucess: true, data: [...] } Note the typo in 'sucess' in your backend code.
      if (data.sucess || data.success) setResult(data.data);
      else setError(data.error || data.message || 'Failed to expand idea.');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Expand Idea" desc="Select an existing idea and the AI will expand it into 5 related, interconnected ideas automatically saved to your board.">
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--dash-text-mid)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select an Idea</label>
        {loadingFetch ? (
          <div style={{ padding: 12, color: 'var(--dash-text-muted)' }}>Loading ideas...</div>
        ) : ideas.length === 0 ? (
          <div style={{ padding: 12, color: 'var(--dash-text-muted)', border: '1px solid var(--dash-border)', borderRadius: 12, background: 'var(--dash-surface-2)' }}>No ideas found. Please create one first.</div>
        ) : (
          <select value={ideaId} onChange={e => setIdeaId(e.target.value)} style={{ width: '100%', background: 'var(--dash-surface-2)', border: '1.5px solid var(--dash-border)', borderRadius: 12, padding: '12px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'var(--dash-text)', outline: 'none' }}>
            {ideas.map(i => (
              <option key={i._id} value={i._id}>{i.title}</option>
            ))}
          </select>
        )}
      </div>
      <ActionRow loading={loading} onRun={handleRun} disabled={!ideaId || ideas.length === 0} btnLabel="Expand Idea" />
      
      {loading && <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--dash-text-muted)' }}><Loader2 className="spinner" style={{ width: 24, height: 24, animation: 'spin 1s linear infinite', margin: '0 auto' }} /></div>}
      {error && <div style={{ marginTop: 24, padding: 16, background: 'var(--dash-red-soft)', color: 'var(--dash-red)', borderRadius: 12, fontSize: 14 }}>{error}</div>}
      {result && result.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--dash-green)', fontWeight: 600, marginBottom: 16 }}>
            <Check size={18} /> Created {result.length} new related ideas!
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.map((idea, idx) => (
              <div key={idx} style={{ padding: 16, background: 'var(--dash-surface-2)', borderRadius: 12, border: '1px solid var(--dash-border)' }}>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--dash-text)' }}>{idea.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}

/* -------------------------------------------------------------------------- */
/*                               HUMANIZE TEXT                                */
/* -------------------------------------------------------------------------- */
function HumanizeTextTool() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleRun = async () => {
    if (!content) return;
    setLoading(true); setError(''); setResult('');
    try {
      const data = await api.post<any>('/ai/humanize', { body: { text: content } });
      if (data.success) setResult(data.data);
      else setError(data.error || data.message || 'Failed to humanize text.');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <ToolLayout title="Text Rewriter / Humanizer" desc="Make AI-generated text sound human, natural, and engaging to evade detection.">
      <Textarea label="AI Generated Text" placeholder="Paste the robotic text here..." value={content} onChange={setContent} />
      <ActionRow loading={loading} onRun={handleRun} disabled={!content} btnLabel="Humanize Text" />
      <ResultBox result={result} error={error} loading={loading} />
    </ToolLayout>
  );
}


/* -------------------------------------------------------------------------- */
/*                             SHARED COMPONENTS                              */
/* -------------------------------------------------------------------------- */
function ToolLayout({ title, desc, children }: { title: string, desc: string, children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--dash-text)', margin: '0 0 8px' }}>{title}</h2>
      <p style={{ fontSize: 14, color: 'var(--dash-text-mid)', margin: '0 0 32px', lineHeight: 1.6 }}>{desc}</p>
      {children}
    </div>
  );
}

function Input({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--dash-text-mid)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: 'var(--dash-surface-2)', border: '1.5px solid var(--dash-border)', borderRadius: 12, padding: '12px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'var(--dash-text)', outline: 'none', transition: 'border-color 0.2s' }}
        onFocus={e => e.target.style.borderColor = 'var(--dash-purple)'}
        onBlur={e => e.target.style.borderColor = 'var(--dash-border)'}
      />
    </div>
  );
}

function Textarea({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--dash-text-mid)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={5}
        style={{ width: '100%', background: 'var(--dash-surface-2)', border: '1.5px solid var(--dash-border)', borderRadius: 12, padding: '16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'var(--dash-text)', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical' }}
        onFocus={e => e.target.style.borderColor = 'var(--dash-purple)'}
        onBlur={e => e.target.style.borderColor = 'var(--dash-border)'}
      />
    </div>
  );
}

function ActionRow({ loading, disabled, onRun, btnLabel }: { loading: boolean, disabled: boolean, onRun: () => void, btnLabel: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--dash-border)' }}>
      <button
        onClick={onRun}
        disabled={disabled || loading}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--dash-purple)', color: '#FFFFFF', border: 'none',
          borderRadius: 99, padding: '12px 28px',
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled || loading ? 0.6 : 1,
          boxShadow: disabled || loading ? 'none' : '0 4px 14px rgba(108,92,231,0.25)',
          transition: 'all 0.2s'
        }}
      >
        {loading ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Sparkles size={18} /> {btnLabel}</>}
      </button>
    </div>
  );
}

function ResultBox({ result, error, loading }: { result: string, error: string, loading: boolean }) {
  if (loading) return (
    <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--dash-text-muted)' }}>
      <Loader2 className="spinner" style={{ width: 24, height: 24, animation: 'spin 1s linear infinite', margin: '0 auto' }} />
    </div>
  );
  if (error) return (
    <div style={{ marginTop: 24, padding: 16, background: 'var(--dash-red-soft)', color: 'var(--dash-red)', borderRadius: 12, fontSize: 14 }}>
      {error}
    </div>
  );
  if (!result) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--dash-text-mid)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</label>
      <div style={{ padding: 20, background: 'var(--dash-surface-2)', borderRadius: 16, border: '1px solid var(--dash-border)', fontSize: 14, color: 'var(--dash-text)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
        {result}
      </div>
    </div>
  );
}
