const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface CapabilityNode {
  id: string;
  label: string;
  category: string;
  confidence: number;
  source: string;
}

export interface SkillsDiscoveryInput {
  prompt: string;
  model?: string;
  apiKey?: string;
}

export interface SkillsDiscoveryResult {
  reply: string;
  capabilities: CapabilityNode[];
  nextPrompt: string;
  provider: string;
}

export interface InclusiveMatchInput {
  candidate: string;
  role: string;
}

export interface MatchSignal {
  label: string;
  value: number;
  note: string;
}

export interface InclusiveMatchResult {
  traditionalScore: number;
  inclusiveScore: number;
  capabilityOverlap: number;
  traditionalSignals: MatchSignal[];
  inclusiveSignals: MatchSignal[];
  recommendation: string;
}

export interface AuditComplianceInput {
  scope: string;
  sampleSize?: number;
}

export interface FairnessMetric {
  label: string;
  value: number;
  delta: number;
  status: string;
}

export interface AuditLog {
  timestamp: string;
  event: string;
  actor: string;
  result: string;
}

export interface SuccessFactorsPayload {
  schema: string;
  scope: string;
  sampleSize: number;
  fairnessStatus: string;
  generatedAt: string;
}

export interface AuditComplianceResult {
  overallScore: number;
  metrics: FairnessMetric[];
  logs: AuditLog[];
  successFactorsPayload: SuccessFactorsPayload;
}

export interface HealthStatus {
  status: string;
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout = 30000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function healthCheck(): Promise<HealthStatus> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/healthz`, { method: 'GET' });
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  } catch {
    return { status: 'offline' };
  }
}

export async function discoverSkills(
  input: SkillsDiscoveryInput,
  apiKey?: string
): Promise<SkillsDiscoveryResult> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (apiKey || input.apiKey) {
    headers['X-OpenRouter-Key'] = apiKey || input.apiKey || '';
  }
  
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/agent/skills-discovery`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.warn('Backend unavailable, using mock:', error);
    return mockSkillsDiscovery(input);
  }
}

export async function calculateInclusiveMatch(
  input: InclusiveMatchInput
): Promise<InclusiveMatchResult> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/agent/inclusive-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.warn('Backend unavailable, using mock:', error);
    return mockInclusiveMatch(input);
  }
}

export async function generateAuditCompliance(
  input: AuditComplianceInput
): Promise<AuditComplianceResult> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/agent/audit-compliance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.warn('Backend unavailable, using mock:', error);
    return mockAuditCompliance(input);
  }
}

function mockSkillsDiscovery(input: SkillsDiscoveryInput): SkillsDiscoveryResult {
  const capabilities: CapabilityNode[] = [
    { id: 'systems-thinking', label: 'Systems thinking', category: 'Cognitive', confidence: 0.94, source: 'Pattern recognition' },
    { id: 'stakeholder-empathy', label: 'Stakeholder empathy', category: 'Human', confidence: 0.89, source: 'Cross-functional collaboration' },
    { id: 'operational-judgment', label: 'Operational judgment', category: 'Execution', confidence: 0.86, source: 'Decision ownership' },
    { id: 'continuous-learning', label: 'Continuous learning', category: 'Growth', confidence: 0.82, source: 'Career transition signal' },
  ];
  
  const normalized = input.prompt.toLowerCase();
  if (normalized.includes('care') || normalized.includes('health')) {
    capabilities.unshift({ id: 'care-coordination', label: 'Care coordination', category: 'Domain', confidence: 0.91, source: 'Domain context' });
  }
  
  return {
    reply: "I'm seeing a strong transfer pattern in your story. The work you've described points to capabilities that remain valuable even when the job title changes. I've mapped the clearest signals to the capability graph and separated evidence from assumptions.",
    capabilities: capabilities.slice(0, 5),
    nextPrompt: "What responsibilities did people trust you with, even when they were outside your formal role?",
    provider: 'local-demo',
  };
}

function mockInclusiveMatch(input: InclusiveMatchInput): InclusiveMatchResult {
  const candidateWords = new Set(input.candidate.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  const roleWords = new Set(input.role.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  const overlap = [...candidateWords].filter(w => roleWords.has(w));
  const capabilityOverlap = Math.min(96, Math.max(58, 68 + overlap.length * 5));
  
  return {
    traditionalScore: 42,
    inclusiveScore: capabilityOverlap,
    capabilityOverlap,
    traditionalSignals: [
      { label: 'Exact title history', value: 18, note: 'Penalty for adjacent titles and non-linear experience' },
      { label: 'Tenure continuity', value: 11, note: 'Gap penalty applied before capability review' },
      { label: 'Credential proximity', value: 13, note: 'Pedigree proxy outweighs demonstrated capability' },
    ],
    inclusiveSignals: [
      { label: 'Transferable capabilities', value: capabilityOverlap, note: 'Semantic overlap across work contexts' },
      { label: 'Learning agility', value: 84, note: 'Evidence of adapting to new systems and constraints' },
      { label: 'Contextual contribution', value: 79, note: 'Potential impact weighted above pedigree' },
    ],
    recommendation: 'Advance to a structured work sample. The candidate clears the capability threshold after timeline and pedigree bias are neutralized.',
  };
}

function mockAuditCompliance(input: AuditComplianceInput): AuditComplianceResult {
  const now = new Date().toISOString();
  return {
    overallScore: 91.4,
    metrics: [
      { label: 'Selection rate parity', value: 0.92, delta: 0.04, status: 'Within guardrail' },
      { label: 'Capability evidence coverage', value: 0.88, delta: 0.11, status: 'Improving' },
      { label: 'Timeline penalty removal', value: 0.97, delta: 0.22, status: 'Protected' },
      { label: 'Explainability coverage', value: 0.95, delta: 0.08, status: 'Within guardrail' },
    ],
    logs: [
      { timestamp: now, event: 'Capability vector generated', actor: 'Inclusive Matching Agent', result: 'Pass' },
      { timestamp: now, event: 'Timeline proxy neutralized', actor: 'Bias Audit Agent', result: 'Pass' },
      { timestamp: now, event: 'SuccessFactors preview payload signed', actor: 'Compliance Orchestrator', result: 'Ready' },
    ],
    successFactorsPayload: {
      schema: 'SAP.SuccessFactors.TalentIntelligence.v1',
      scope: input.scope,
      sampleSize: input.sampleSize ?? 1280,
      fairnessStatus: 'green',
      generatedAt: now,
    },
  };
}