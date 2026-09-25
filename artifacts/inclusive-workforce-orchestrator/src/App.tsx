import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Eye,
  EyeOff,
  FileCheck2,
  Gauge,
  GitCompareArrows,
  KeyRound,
  LockKeyhole,
  Network,
  Radar,
  RefreshCw,
  ScanSearch,
  Scale,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  useCalculateInclusiveMatch,
  useDiscoverSkills,
  useGenerateAuditCompliance,
} from '@workspace/api-client-react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import '@/index.css';

const queryClient = new QueryClient();

type WorkspaceView = 'skills' | 'match' | 'audit';
type AgentId = 'skills' | 'match' | 'audit' | 'fairness' | 'mobility' | 'narrative';

const agents: Array<{ id: AgentId; label: string; icon: typeof Sparkles }> = [
  { id: 'skills', label: 'Skills discovery', icon: Sparkles },
  { id: 'match', label: 'Capability match', icon: GitCompareArrows },
  { id: 'audit', label: 'Compliance audit', icon: ClipboardCheck },
  { id: 'fairness', label: 'Fairness lens', icon: Scale },
  { id: 'mobility', label: 'Mobility map', icon: Network },
  { id: 'narrative', label: 'Decision narrative', icon: FileCheck2 },
];

const demoSkillsResult = {
  reply:
    'This transition story contains strong signals for stakeholder orchestration, process design, and coaching through change. I found evidence of capability beyond the candidate’s current title.',
  capabilities: [
    { id: 'demo-1', label: 'Stakeholder orchestration', category: 'People leadership', confidence: 0.94, source: 'Narrative evidence' },
    { id: 'demo-2', label: 'Change enablement', category: 'Transformation', confidence: 0.88, source: 'Narrative evidence' },
    { id: 'demo-3', label: 'Process design', category: 'Operations', confidence: 0.81, source: 'Transferable pattern' },
    { id: 'demo-4', label: 'Coaching & facilitation', category: 'People leadership', confidence: 0.79, source: 'Narrative evidence' },
  ],
  nextPrompt: 'What outcome did your work make possible for the people or customers involved?',
  provider: 'Local demo · no key required',
};

const landingAgents: Array<[string, string, string, typeof Sparkles]> = [
  ['01', 'Skills discovery', 'Translate lived experience into capability evidence.', Sparkles],
  ['02', 'Inclusive matching', 'Compare potential, not just conventional pedigree.', GitCompareArrows],
  ['03', 'Fairness lens', 'Surface where process design creates uneven outcomes.', Scale],
  ['04', 'Mobility mapping', 'Make adjacent pathways visible to every person.', Network],
  ['05', 'Compliance audit', 'Turn governance into a living operating rhythm.', ClipboardCheck],
  ['06', 'Decision narrative', 'Explain the why behind a high-stakes call.', FileCheck2],
];

function errorMessage(error: unknown) {
  if (!error) return 'The agent could not complete this run.';
  if (error instanceof Error) return error.message;
  return 'The agent could not complete this run. Try again in a moment.';
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className="brand-mark" style={light ? { color: '#eef2ff' } : undefined}>
      <span className="brand-symbol"><Radar /></span>
      <span>fairwork<span style={{ color: '#6ee7b7' }}> / </span>orchestrator</span>
    </span>
  );
}

function LandingPage() {
  const [, setLocation] = useLocation();
  const [vaultOpen, setVaultOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="ambient-orb orb-indigo" />
      <div className="ambient-orb orb-emerald" />
      <div className="container-wide">
        <nav className="landing-nav rise">
          <Link href="/" aria-label="Fairwork orchestrator home" data-testid="link-home"><Brand /></Link>
          <div className="nav-status"><span className="pulse-dot" /> SAP BTP AI Core Connected</div>
          <div className="nav-actions">
            <button className="button button-ghost" onClick={() => setVaultOpen(true)} data-testid="button-open-vault">
              <KeyRound size={15} /> API vault
            </button>
            <Link className="button button-primary" href="/dashboard" data-testid="link-launch-nav">
              Launch workspace <ArrowRight size={15} />
            </Link>
          </div>
        </nav>

        <main>
          <section className="landing-hero">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
              <div className="hero-kicker"><span className="pulse-dot" /> Executive preview · capability intelligence</div>
              <h1 className="hero-title">Make every <span className="gradient-word">capability</span> count.</h1>
              <p className="hero-copy">
                Fairwork turns the hidden signal in career stories into defensible workforce decisions.
                Discover transferable skills, match people to possibility, and leave a clear trail of fairness.
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/dashboard" data-testid="link-launch-hero">
                  Enter the orchestrator <ArrowRight size={16} />
                </Link>
                <button className="button button-ghost" onClick={() => setVaultOpen(true)} data-testid="button-hero-vault">
                  <LockKeyhole size={15} /> Configure OpenRouter
                </button>
              </div>
              <div className="hero-annotation"><Zap size={14} /> Runs locally in demo mode. Bring your own key when you want deeper discovery.</div>
            </motion.div>

            <motion.div className="hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .12 }}>
              <div className="command-card glass">
                <div className="command-top">
                  <div>
                    <div className="command-label">Decision signal / 07:42</div>
                    <div style={{ color: '#e2e8f0', fontWeight: 700, marginTop: 7 }}>Capability equity monitor</div>
                  </div>
                  <div className="status-live"><span /> live</div>
                </div>
                <div className="signal-grid">
                  <div className="signal-panel">
                    <div className="signal-title">Hidden capability lift</div>
                    <div className="signal-value">+31<span style={{ color: '#6ee7b7', fontSize: '1.2rem' }}>%</span></div>
                    <div style={{ color: '#6ee7b7', fontSize: '.67rem', marginTop: 7 }}>semantic match vs. title screen</div>
                  </div>
                  <div className="signal-panel">
                    <div className="signal-title">Fairness index</div>
                    <div className="signal-value">84<span style={{ color: '#a5b4fc', fontSize: '1.2rem' }}>/100</span></div>
                    <div style={{ color: '#a5b4fc', fontSize: '.67rem', marginTop: 7 }}>within guardrails</div>
                  </div>
                </div>
                <div className="mini-bars">
                  <div className="mini-bar"><div><div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '91%' }} /></div></div><div className="mini-bar-value">91.0</div></div>
                  <div className="mini-bar"><div><div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '76%' }} /></div></div><div className="mini-bar-value">76.0</div></div>
                  <div className="mini-bar"><div><div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: '84%' }} /></div></div><div className="mini-bar-value">84.0</div></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, color: '#475569', fontSize: '.63rem' }}>
                  <span>Evidence-backed, not proxy-led</span><span className="mono">FW / 01</span>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="agents-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">A six-agent command center</div>
                <h2 className="section-title">One workspace. More signal. Less bias.</h2>
              </div>
              <p className="section-copy">The orchestrator keeps human judgment in the loop while specialized agents make the invisible legible.</p>
            </div>
            <div className="agent-grid">
              {landingAgents.map(([number, title, copy, Icon]) => (
                <motion.div className="agent-card glass-subtle" key={String(number)} whileHover={{ y: -4 }}>
                  <div className="agent-index"><span>{number}</span><Icon className="agent-icon" size={17} /></div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section style={{ padding: '25px 0 92px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, borderTop: '1px solid rgba(148,163,184,.1)' }}>
            {[
              ['$5.5T', 'annual value at stake in the global skills gap'],
              ['120M', 'workers whose roles are at risk of major change'],
              ['01', 'fairness layer between a signal and a decision'],
            ].map(([value, label]) => (
              <div key={value} style={{ padding: '28px 22px 0' }}>
                <div style={{ color: '#e0e7ff', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-.08em' }}>{value}</div>
                <div style={{ maxWidth: 190, marginTop: 9, color: '#64748b', fontSize: '.71rem', lineHeight: 1.5 }}>{label}</div>
              </div>
            ))}
          </section>

          <section className="glass" style={{ padding: '37px 39px', marginBottom: 70, borderRadius: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
            <div>
              <div className="eyebrow">The mandate</div>
              <p style={{ margin: '12px 0 0', maxWidth: 640, color: '#dbeafe', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', lineHeight: 1.25, letterSpacing: '-.045em' }}>
                “AI is rewriting who works. <span style={{ color: '#6ee7b7' }}>We rewrite it fairly.</span>”
              </p>
            </div>
            <button className="button button-primary" onClick={() => setLocation('/dashboard')} data-testid="button-cta-workspace">
              See the signal <ChevronRight size={16} />
            </button>
          </section>
        </main>

        <footer className="landing-footer"><span>FAIRWORK / INCLUSIVE WORKFORCE ORCHESTRATOR</span><span>Built for people leaders making consequential calls.</span></footer>
      </div>
      <VaultModal open={vaultOpen} onClose={() => setVaultOpen(false)} />
    </div>
  );
}

function SideNav({ onSelectView }: { onSelectView: (view: WorkspaceView) => void }) {
  const [location] = useLocation();
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand"><Link href="/" data-testid="link-sidebar-home"><Brand /></Link></div>
        <div className="side-kicker">Workspace</div>
        <div className="side-nav">
          <Link className={`side-link ${location === '/dashboard' ? 'side-link-active' : ''}`} href="/dashboard" data-testid="link-sidebar-dashboard"><Gauge /> Command center</Link>
          <button className="side-link" style={{ border: 0, width: '100%', background: 'transparent' }} onClick={() => onSelectView('audit')} data-testid="button-sidebar-audit"><ShieldCheck /> Audit trail</button>
          <button className="side-link" style={{ border: 0, width: '100%', background: 'transparent' }} onClick={() => onSelectView('match')} data-testid="button-sidebar-match"><UsersRound /> Match review</button>
        </div>
        <div className="sidebar-bottom">
          <button className="vault-button" onClick={() => window.dispatchEvent(new Event('open-vault'))} data-testid="button-sidebar-vault">
            <KeyRound size={17} />
            <span><strong>OpenRouter API vault</strong><small>Session-only encryption</small></span>
          </button>
        </div>
        <div className="mobile-menu">
          <Link className="side-link side-link-active" href="/dashboard" data-testid="link-mobile-dashboard"><Gauge /> Command center</Link>
          <button className="side-link" onClick={() => onSelectView('audit')} data-testid="button-mobile-audit"><ShieldCheck /> Audit</button>
          <button className="side-link" onClick={() => onSelectView('match')} data-testid="button-mobile-match"><UsersRound /> Matches</button>
        </div>
      </aside>
    </>
  );
}

function DashboardPage() {
  const [vaultOpen, setVaultOpen] = useState(false);
  const [view, setView] = useState<WorkspaceView>('skills');
  const [selectedAgent, setSelectedAgent] = useState<AgentId>('skills');
  const [apiKey, setApiKey] = useState(() => typeof window === 'undefined' ? '' : sessionStorage.getItem('openrouter-api-key') ?? '');
  const [skillsPrompt, setSkillsPrompt] = useState('');
  const [candidate, setCandidate] = useState('');
  const [role, setRole] = useState('');
  const [auditScope, setAuditScope] = useState('Promotion readiness · Q3');
  const [sampleSize, setSampleSize] = useState('240');
  const [skillsResult, setSkillsResult] = useState<typeof demoSkillsResult | null>(null);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [skillsError, setSkillsError] = useState('');
  const [matchError, setMatchError] = useState('');
  const [auditError, setAuditError] = useState('');

  const discoverSkills = useDiscoverSkills();
  const calculateMatch = useCalculateInclusiveMatch();
  const generateAudit = useGenerateAuditCompliance();

  const activeAgent = useMemo(() => agents.find((agent) => agent.id === selectedAgent) ?? agents[0], [selectedAgent]);
  const selectWorkspaceView = (nextView: WorkspaceView) => {
    setView(nextView);
    setSelectedAgent(nextView);
  };

  const submitSkills = () => {
    if (!skillsPrompt.trim()) return;
    setSkillsError('');
    if (!apiKey) {
      setSkillsResult({
        ...demoSkillsResult,
        reply: `Demo read: ${skillsPrompt.trim()} This story contains evidence of stakeholder orchestration, process design, and coaching through change.`,
      });
      return;
    }
    discoverSkills.mutate({ data: { prompt: skillsPrompt.trim(), apiKey } }, {
      onSuccess: (result) => setSkillsResult(result),
      onError: (error) => setSkillsError(errorMessage(error)),
    });
  };

  const submitMatch = () => {
    if (!candidate.trim() || !role.trim()) return;
    setMatchError('');
    calculateMatch.mutate({ data: { candidate: candidate.trim(), role: role.trim() } }, {
      onSuccess: (result) => setMatchResult(result),
      onError: (error) => setMatchError(errorMessage(error)),
    });
  };

  const submitAudit = () => {
    if (!auditScope.trim()) return;
    setAuditError('');
    generateAudit.mutate({ data: { scope: auditScope.trim(), sampleSize: Number(sampleSize) || 1 } }, {
      onSuccess: (result) => setAuditResult(result),
      onError: (error) => setAuditError(errorMessage(error)),
    });
  };

  const selectAgent = (agent: AgentId) => {
    setSelectedAgent(agent);
    if (agent === 'skills') setView('skills');
    if (agent === 'match') setView('match');
    if (agent === 'audit') setView('audit');
  };

  return (
    <div className="app-shell dashboard-shell">
      <div className="ambient-orb orb-indigo" />
      <div className="ambient-orb orb-emerald" />
       <SideNav onSelectView={selectWorkspaceView} />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-page">Orchestrator / <span>Executive workspace</span></div>
          <div className="header-actions">
            <div className="connection-pill"><i /> API layer connected</div>
            <button className="avatar" onClick={() => setVaultOpen(true)} aria-label="Open API vault" data-testid="button-header-vault">PL</button>
          </div>
        </header>
        <main className="dashboard-content">
          <div className="workspace-intro">
            <div>
              <div className="eyebrow">Decision workspace / live session</div>
              <h1>Make the invisible legible.</h1>
              <p>Move from career signal to capability evidence, then test the decision before it tests your culture.</p>
            </div>
            <div className="workspace-meta"><span className="meta-ring" /> Six agents standing by</div>
          </div>

          <div className="workspace-layout">
            <nav className="agent-rail" aria-label="Specialized agents">
              <div className="rail-label">Select an agent</div>
              {agents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <button key={agent.id} className={`agent-select ${selectedAgent === agent.id ? 'agent-select-active' : ''}`} onClick={() => selectAgent(agent.id)} data-testid={`button-agent-${agent.id}`}>
                    <Icon /> <span>{agent.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="workspace-main">
              <div className="view-tabs" role="tablist" aria-label="Workspace views">
                <button className={`view-tab ${view === 'skills' ? 'view-tab-active' : ''}`} onClick={() => { setView('skills'); setSelectedAgent('skills'); }} data-testid="tab-skills"><Sparkles size={14} /> Discover skills</button>
                <button className={`view-tab ${view === 'match' ? 'view-tab-active' : ''}`} onClick={() => { setView('match'); setSelectedAgent('match'); }} data-testid="tab-match"><GitCompareArrows size={14} /> Inclusive match</button>
                <button className={`view-tab ${view === 'audit' ? 'view-tab-active' : ''}`} onClick={() => { setView('audit'); setSelectedAgent('audit'); }} data-testid="tab-audit"><ShieldCheck size={14} /> Bias &amp; audit</button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: .24 }}>
                  {view === 'skills' && (
                    <SkillsView
                      prompt={skillsPrompt}
                      setPrompt={setSkillsPrompt}
                      onSubmit={submitSkills}
                      loading={discoverSkills.isPending}
                      result={skillsResult}
                      error={skillsError}
                      onRetry={submitSkills}
                      hasKey={Boolean(apiKey)}
                      provider={activeAgent.label}
                    />
                  )}
                  {view === 'match' && (
                    <MatchView
                      candidate={candidate}
                      role={role}
                      setCandidate={setCandidate}
                      setRole={setRole}
                      onSubmit={submitMatch}
                      loading={calculateMatch.isPending}
                      result={matchResult}
                      error={matchError}
                      onRetry={submitMatch}
                    />
                  )}
                  {view === 'audit' && (
                    <AuditView
                      scope={auditScope}
                      sampleSize={sampleSize}
                      setScope={setAuditScope}
                      setSampleSize={setSampleSize}
                      onSubmit={submitAudit}
                      loading={generateAudit.isPending}
                      result={auditResult}
                      error={auditError}
                      onRetry={submitAudit}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
      <VaultModal open={vaultOpen} onClose={() => setVaultOpen(false)} apiKey={apiKey} onSaved={setApiKey} />
      <VaultEventBridge onOpen={() => setVaultOpen(true)} />
    </div>
  );
}

function SkillsView({ prompt, setPrompt, onSubmit, loading, result, error, onRetry, hasKey, provider }: {
  prompt: string; setPrompt: (value: string) => void; onSubmit: () => void; loading: boolean;
  result: typeof demoSkillsResult | null; error: string; onRetry: () => void; hasKey: boolean; provider: string;
}) {
  return (
    <section className="workspace-card glass" data-testid="view-skills">
      <div className="card-heading">
        <div><h2>Skills discovery <span className="mono" style={{ color: '#475569', fontSize: '.65rem', marginLeft: 6 }}>AGENT 01</span></h2><p>Extract capability evidence from the way someone describes their work, not the title on their profile.</p></div>
        <Sparkles size={18} color="#a5b4fc" />
      </div>
      <label className="form-label" htmlFor="skills-prompt">A career moment, project, or transition story</label>
      <textarea id="skills-prompt" className="field" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="For example: I coordinated a service redesign across three teams while caring for a new child..." data-testid="input-skills-prompt" />
      <div className="form-actions">
        {!hasKey ? <div className="demo-note"><CircleHelp size={13} /> Demo mode · connect a key for live discovery</div> : <div className="helper-copy">OpenRouter key is present for this session.</div>}
        <button className="button button-primary" onClick={onSubmit} disabled={loading || !prompt.trim()} data-testid="button-submit-skills">{loading ? <RefreshCw size={14} className="spin" /> : <ScanSearch size={14} />} {loading ? 'Reading signal' : 'Discover capabilities'}</button>
      </div>
      <div className="result-divider" />
      {loading && <div className="loading-skeleton"><div className="skeleton-line wide" /><div className="skeleton-line" /><div className="skeleton-line short" /><div className="skeleton-line wide" /></div>}
      {error && <div className="error-state" data-testid="status-skills-error">{error}<br /><button onClick={onRetry} data-testid="button-retry-skills">Retry discovery</button></div>}
      {!loading && !error && result && (
        <div className="rise" data-testid="result-skills">
          <div className="result-title"><span>Agent reading</span><span className="mono" style={{ color: '#6ee7b7', textTransform: 'none', letterSpacing: 0 }}>{result.provider}</span></div>
          <div className="reply-box">{result.reply}</div>
          <div className="result-title" style={{ marginTop: 18 }}><span>Capability nodes</span><span>{result.capabilities.length} surfaced</span></div>
          <div className="capability-list">
            {result.capabilities.map((capability) => <div className="capability-chip" key={capability.id} data-testid={`chip-capability-${capability.id}`}><span>{capability.label}</span><span className="confidence">{Math.round(capability.confidence * 100)}%</span></div>)}
          </div>
          <div className="next-prompt"><strong>Continue the interview</strong>{result.nextPrompt}</div>
        </div>
      )}
      {!loading && !error && !result && <div className="empty-state"><div><Sparkles /><strong>Start with a lived-work signal</strong><p>The agent will turn a real story into a capability map you can use in the next decision.</p></div></div>}
      <div style={{ marginTop: 20, color: '#475569', fontSize: '.63rem' }}>Active agent: <span style={{ color: '#a5b4fc' }}>{provider}</span> · no title-screen assumptions</div>
    </section>
  );
}

function MatchView({ candidate, role, setCandidate, setRole, onSubmit, loading, result, error, onRetry }: {
  candidate: string; role: string; setCandidate: (value: string) => void; setRole: (value: string) => void; onSubmit: () => void; loading: boolean; result: any; error: string; onRetry: () => void;
}) {
  return (
    <section className="workspace-card glass" id="match-view" data-testid="view-match">
      <div className="card-heading"><div><h2>Inclusive capability match <span className="mono" style={{ color: '#475569', fontSize: '.65rem', marginLeft: 6 }}>AGENT 02</span></h2><p>Put conventional screening beside semantic overlap so hidden potential is visible before a decision hardens.</p></div><GitCompareArrows size={18} color="#a5b4fc" /></div>
      <div className="form-row">
        <div><label className="form-label" htmlFor="candidate-profile">Candidate evidence</label><textarea id="candidate-profile" className="field" value={candidate} onChange={(event) => setCandidate(event.target.value)} placeholder="Experience, projects, constraints, strengths..." data-testid="input-candidate" /></div>
        <div><label className="form-label" htmlFor="role-profile">Role / opportunity</label><textarea id="role-profile" className="field" value={role} onChange={(event) => setRole(event.target.value)} placeholder="What success looks like in this role..." data-testid="input-role" /></div>
      </div>
      <div className="form-actions"><div className="helper-copy">No demographic proxies. Capability vectors only.</div><button className="button button-primary" onClick={onSubmit} disabled={loading || !candidate.trim() || !role.trim()} data-testid="button-submit-match">{loading ? <RefreshCw size={14} /> : <GitCompareArrows size={14} />} {loading ? 'Comparing evidence' : 'Calculate inclusive match'}</button></div>
      <div className="result-divider" />
      {loading && <div className="loading-skeleton"><div className="skeleton-line wide" /><div className="skeleton-line short" /><div className="skeleton-line" /></div>}
      {error && <div className="error-state" data-testid="status-match-error">{error}<br /><button onClick={onRetry} data-testid="button-retry-match">Retry match</button></div>}
      {!loading && !error && result && <MatchResult result={result} />}
      {!loading && !error && !result && <div className="empty-state"><div><GitCompareArrows /><strong>Compare potential, not pedigree</strong><p>Add a candidate story and a role brief to reveal where the traditional screen misses capability.</p></div></div>}
    </section>
  );
}

function MatchResult({ result }: { result: any }) {
  const traditional = Math.round(result.traditionalScore);
  const inclusive = Math.round(result.inclusiveScore);
  return (
    <div className="rise" data-testid="result-match">
      <div className="score-layout">
        <div className="score-orb" style={{ background: `conic-gradient(#6ee7b7 0 ${inclusive}%, rgba(51,65,85,.6) ${inclusive}% 100%)` }}><div className="score-number">{inclusive}<small>inclusive fit</small></div></div>
        <div className="signal-bars">
          <div className="signal-row"><div><div className="signal-row-head"><span>Traditional screen</span><span>{traditional}</span></div><div className="signal-track"><span style={{ width: `${traditional}%`, background: '#818cf8' }} /></div></div></div>
          <div className="signal-row"><div><div className="signal-row-head"><span>Capability match</span><span>{inclusive}</span></div><div className="signal-track"><span style={{ width: `${inclusive}%` }} /></div></div></div>
          <div className="signal-row"><div><div className="signal-row-head"><span>Capability overlap</span><span>{Math.round(result.capabilityOverlap)}</span></div><div className="signal-track"><span style={{ width: `${result.capabilityOverlap}%` }} /></div></div></div>
        </div>
      </div>
      <div className="metric-grid" style={{ marginTop: 24 }}>
        {[['Traditional signals', result.traditionalSignals], ['Inclusive signals', result.inclusiveSignals]].map(([label, signals]) => (
          <div className="metric-card" key={String(label)} style={{ gridColumn: 'span 1' }}><small>{label}</small><strong>{(signals as unknown[]).length}</strong><em>evidence threads</em></div>
        ))}
        <div className="metric-card"><small>Lift unlocked</small><strong>+{inclusive - traditional}</strong><em>points above screen</em></div>
      </div>
      <div className="recommendation"><strong>Recommendation</strong><br />{result.recommendation}</div>
      <div style={{ marginTop: 15, display: 'grid', gap: 7 }}>
        {[...result.inclusiveSignals, ...result.traditionalSignals].slice(0, 4).map((signal: { label: string; note: string; value: number }, index: number) => <div key={`${signal.label}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: '#7c8aa1', fontSize: '.67rem' }}><span>{signal.label} · {signal.note}</span><span className="mono" style={{ color: '#a5b4fc' }}>{Math.round(signal.value)}</span></div>)}
      </div>
    </div>
  );
}

function AuditView({ scope, sampleSize, setScope, setSampleSize, onSubmit, loading, result, error, onRetry }: {
  scope: string; sampleSize: string; setScope: (value: string) => void; setSampleSize: (value: string) => void; onSubmit: () => void; loading: boolean; result: any; error: string; onRetry: () => void;
}) {
  return (
    <section className="workspace-card glass" id="audit-view" data-testid="view-audit">
      <div className="card-heading"><div><h2>Bias &amp; compliance audit <span className="mono" style={{ color: '#475569', fontSize: '.65rem', marginLeft: 6 }}>AGENT 03</span></h2><p>Stress-test a decision scope, inspect fairness metrics, and leave an auditable record for the next review.</p></div><ShieldCheck size={18} color="#6ee7b7" /></div>
      <div className="form-row">
        <div><label className="form-label" htmlFor="audit-scope">Audit scope</label><input id="audit-scope" className="field" value={scope} onChange={(event) => setScope(event.target.value)} data-testid="input-audit-scope" /></div>
        <div><label className="form-label" htmlFor="audit-sample">Sample size</label><input id="audit-sample" className="field" type="number" min="1" value={sampleSize} onChange={(event) => setSampleSize(event.target.value)} data-testid="input-audit-sample" /></div>
      </div>
      <div className="form-actions"><div className="helper-copy">Preview only · designed for leadership review before export.</div><button className="button button-primary" onClick={onSubmit} disabled={loading || !scope.trim()} data-testid="button-submit-audit">{loading ? <RefreshCw size={14} /> : <ShieldCheck size={14} />} {loading ? 'Auditing scope' : 'Run compliance audit'}</button></div>
      <div className="result-divider" />
      {loading && <div className="loading-skeleton"><div className="skeleton-line short" /><div className="skeleton-line wide" /><div className="skeleton-line" /></div>}
      {error && <div className="error-state" data-testid="status-audit-error">{error}<br /><button onClick={onRetry} data-testid="button-retry-audit">Retry audit</button></div>}
      {!loading && !error && result && <AuditResult result={result} />}
      {!loading && !error && !result && <div className="empty-state"><div><ShieldCheck /><strong>Make the decision inspectable</strong><p>Run an audit preview to see fairness metrics and a compact event trail for this scope.</p></div></div>}
    </section>
  );
}

function AuditResult({ result }: { result: any }) {
  return (
    <div className="rise" data-testid="result-audit">
      <div className="audit-summary">
        <div className="audit-score"><strong>{Math.round(result.overallScore)}</strong><span>fairness score</span></div>
        <div className="audit-metrics">{result.metrics.map((metric: { label: string; value: number; delta: number; status: string }) => <div className="audit-metric" key={metric.label}><span>{metric.label}</span><div className="audit-track"><span style={{ width: `${Math.min(100, Math.max(0, metric.value))}%` }} /></div><span className="audit-delta">{metric.delta > 0 ? '+' : ''}{metric.delta.toFixed(1)}</span></div>)}</div>
      </div>
      <div className="result-divider" />
      <div className="result-title"><span>Decision event trail</span><span className="status-live"><span /> auditable</span></div>
      <div className="table-scroll">
        <table className="log-table"><thead><tr><th>Timestamp</th><th>Event</th><th>Actor</th><th>Result</th></tr></thead><tbody>{result.logs.map((log: { timestamp: string; event: string; actor: string; result: string }, index: number) => <tr key={`${log.timestamp}-${index}`}><td>{log.timestamp}</td><td>{log.event}</td><td>{log.actor}</td><td className="log-result"><Check size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{log.result}</td></tr>)}</tbody></table>
      </div>
      <div style={{ marginTop: 17, color: '#64748b', fontSize: '.64rem' }}>Success factors payload attached · <span className="mono" style={{ color: '#a5b4fc' }}>{Object.keys(result.successFactorsPayload ?? {}).length} governance signals</span></div>
    </div>
  );
}

function VaultEventBridge({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const handler = () => onOpen();
    window.addEventListener('open-vault', handler);
    return () => window.removeEventListener('open-vault', handler);
  }, [onOpen]);
  return null;
}

function VaultModal({ open, onClose, apiKey = '', onSaved }: { open: boolean; onClose: () => void; apiKey?: string; onSaved?: (key: string) => void }) {
  const [value, setValue] = useState(apiKey);
  const [visible, setVisible] = useState(false);
  if (!open) return null;
  const save = () => {
    if (value.trim()) sessionStorage.setItem('openrouter-api-key', value.trim());
    else sessionStorage.removeItem('openrouter-api-key');
    onSaved?.(value.trim());
    onClose();
  };
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="vault-title" data-testid="modal-vault">
      <motion.div className="modal glass" initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .22 }}>
        <button className="modal-close" onClick={onClose} aria-label="Close API vault" data-testid="button-close-vault"><X size={16} /></button>
        <div className="eyebrow">Private connection</div>
        <h2 id="vault-title">OpenRouter API vault</h2>
        <p className="modal-intro">Bring a key when you want live model-assisted discovery. It stays in this browser session only and is never persisted by Fairwork.</p>
        <label className="form-label" htmlFor="openrouter-key">API key</label>
        <div className="vault-input-wrap"><input id="openrouter-key" className="field" type={visible ? 'text' : 'password'} value={value} onChange={(event) => setValue(event.target.value)} placeholder="sk-or-v1-..." data-testid="input-openrouter-key" /><button className="visibility-button" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Hide API key' : 'Show API key'} data-testid="button-toggle-key">{visible ? <EyeOff size={15} /> : <Eye size={15} />}</button></div>
        <div className="vault-meta"><LockKeyhole /><span>Session storage only. Clearing this session or choosing Remove clears the key from this workspace.</span></div>
        <div className="modal-actions"><button className="button button-ghost" onClick={() => { setValue(''); sessionStorage.removeItem('openrouter-api-key'); onSaved?.(''); onClose(); }} data-testid="button-remove-key">Remove key</button><button className="button button-primary" onClick={save} data-testid="button-save-key"><CheckCircle2 size={15} /> Save for session</button></div>
      </motion.div>
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark"><Router /></div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;