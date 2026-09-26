import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  BarChart2,
  ArrowRightLeft,
  Brain,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useApiConfig } from '../../context/ApiConfigContext';
import { calculateInclusiveMatch, InclusiveMatchResult, MatchSignal } from '../../lib/api';

const candidateTemplates = [
  { label: 'Career Returner (Caregiving)', value: 'Managed household of 4 for 7 years including special needs child. Coordinated 15+ medical/therapy appointments monthly. Managed $60k annual budget. Advocated for IEP accommodations. Volunteer crisis line counselor 2yrs.' },
  { label: 'Military Veteran Transition', value: '8 years Army logistics. Led supply chain for 500+ personnel. Managed $2M equipment inventory. Trained 50+ soldiers. Coordinated multi-agency disaster relief. Security clearance.' },
  { label: 'Self-Taught Developer', value: 'Warehouse associate 5 years. Self-taught Python, SQL, React via freeCodeCamp. Built 3 internal tools automating inventory tracking. Contributed to open source. No CS degree.' },
  { label: 'First-Gen Professional', value: 'First in family to graduate college. Worked retail/food service through school. Led student org 200+ members. Organized career fair. Internship at nonprofit. Bilingual.' },
];

const roleTemplates = [
  { label: 'Project Manager', value: 'Lead cross-functional projects. Manage timelines, budgets, stakeholders. Coordinate resources. Risk mitigation. Agile/Scrum. 3+ years exp. PMP preferred.' },
  { label: 'Operations Analyst', value: 'Analyze operational data. Identify inefficiencies. Build dashboards. SQL, Python, Tableau. Process improvement. Supply chain experience a plus.' },
  { label: 'Customer Success Manager', value: 'Manage enterprise accounts. Drive adoption, retention, expansion. Build relationships. Technical aptitude. CRM experience. Renewal ownership.' },
  { label: 'Technical Program Manager', value: 'Manage complex technical programs. Coordinate engineering, product, design. System architecture understanding. Risk management. Stakeholder communication.' },
];

export function MatchingDashboard() {
  const { apiKey } = useApiConfig();
  const [candidate, setCandidate] = useState(candidateTemplates[0].value);
  const [role, setRole] = useState(roleTemplates[0].value);
  const [result, setResult] = useState<InclusiveMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const handleAnalyze = async () => {
    if (!candidate.trim() || !role.trim()) return;
    setIsLoading(true);
    try {
      const matchResult = await calculateInclusiveMatch({ candidate, role });
      setResult(matchResult);
    } catch (error) {
      console.error('Matching failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (index: number) => {
    setSelectedTemplate(index);
    setCandidate(candidateTemplates[index].value);
    setRole(roleTemplates[index].value);
    setResult(null);
  };

  if (!result) {
    return (
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Inclusive Matching Agent</h2>
              <p className="text-sm text-slate-400">Bias-neutral semantic matching vs traditional screening</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Brain className="w-3 h-3" />
            Semantic Vector Matching
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 flex-1">
          {/* Candidate Input */}
          <Card className="flex flex-col border-slate-800/50 bg-slate-900/50">
            <CardHeader className="border-b border-slate-800/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  Candidate Profile
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 space-y-4">
              <Select value={candidateTemplates[selectedTemplate].label} onValueChange={(v) => handleTemplateSelect(candidateTemplates.findIndex(t => t.label === v))}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {candidateTemplates.map(t => <SelectItem key={t.label} value={t.label}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                placeholder="Paste candidate background, experience, capabilities..."
                className="flex-1 bg-slate-800/50 border-slate-700 focus:border-emerald-500 min-h-[200px] font-mono text-sm"
                rows={8}
              />
            </CardContent>
          </Card>

          {/* Role Input */}
          <Card className="flex flex-col border-slate-800/50 bg-slate-900/50">
            <CardHeader className="border-b border-slate-800/50">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                Job Requisition
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 space-y-4">
              <Select value={roleTemplates[0].label} onValueChange={(v) => setRole(roleTemplates.find(t => t.label === v)?.value || '')}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {roleTemplates.map(t => <SelectItem key={t.label} value={t.label}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Paste job requirements, responsibilities, qualifications..."
                className="flex-1 bg-slate-800/50 border-slate-700 focus:border-emerald-500 min-h-[200px] font-mono text-sm"
                rows={8}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || !candidate.trim() || !role.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 px-10 py-3 text-lg gap-3"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-5 h-5" />
                Run Inclusive Match Analysis
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Results view
  const biasReduction = ((result.inclusiveScore - result.traditionalScore) / Math.max(1, 100 - result.traditionalScore) * 100).toFixed(0);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Inclusive Matching Results</h2>
            <p className="text-sm text-slate-400">Capability-vector match with bias neutralization</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setResult(null)}>
            <RefreshCw className="w-4 h-4 mr-1" />
            New Analysis
          </Button>
          <Badge variant="secondary" className="gap-1">
            <Filter className="w-3 h-3" />
            {biasReduction}% bias reduction
          </Badge>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-slate-900/50 to-red-500/10 border border-red-500/20 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-sm text-slate-400">Traditional Screening</span>
            </div>
            <Badge variant="destructive" className="text-xs">{result.traditionalScore}%</Badge>
          </div>
          <div className="text-5xl font-bold text-red-400 mb-2">{result.traditionalScore}%</div>
          <p className="text-sm text-slate-400">Penalizes gaps, non-linear paths, non-pedigree backgrounds</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-gradient-to-br from-slate-900/50 to-emerald-500/10 border border-emerald-500/20 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-slate-400">Inclusive Match</span>
            </div>
            <Badge variant="default" className="text-xs">{result.inclusiveScore}%</Badge>
          </div>
          <div className="text-5xl font-bold text-emerald-400 mb-2">{result.inclusiveScore}%</div>
          <p className="text-sm text-slate-400">Semantic capability matching, timeline/pedigree neutral</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gradient-to-br from-slate-900/50 to-indigo-500/10 border border-indigo-500/20 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Brain className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-sm text-slate-400">Capability Overlap</span>
            </div>
            <Badge variant="secondary" className="text-xs">{result.capabilityOverlap}%</Badge>
          </div>
          <div className="text-5xl font-bold text-indigo-400 mb-2">{result.capabilityOverlap}%</div>
          <Progress value={result.capabilityOverlap} className="h-2" />
        </motion.div>
      </div>

      {/* Signal Comparison */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Traditional Signals */}
        <Card className="border-slate-800/50 bg-slate-900/50 border-red-500/20">
          <CardHeader className="border-b border-slate-800/50">
            <CardTitle className="text-base flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              Traditional Screening Signals (Bias Sources)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.traditionalSignals.map((signal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-300">{signal.label}</span>
                  <span className="text-sm text-red-400 font-mono">{signal.value}%</span>
                </div>
                <Progress value={signal.value} className="h-1.5 bg-red-500/20" />
                <p className="text-xs text-slate-500 mt-1">{signal.note}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Inclusive Signals */}
        <Card className="border-slate-800/50 bg-slate-900/50 border-emerald-500/20">
          <CardHeader className="border-b border-slate-800/50">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
              <Shield className="w-4 h-4" />
              Inclusive Matching Signals (Bias-Neutral)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.inclusiveSignals.map((signal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-300">{signal.label}</span>
                  <span className="text-sm text-emerald-400 font-mono">{signal.value}%</span>
                </div>
                <Progress value={signal.value} className="h-1.5 bg-emerald-500/20" />
                <p className="text-xs text-slate-500 mt-1">{signal.note}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendation */}
      <Card className="border-slate-800/50 bg-slate-900/50 border-indigo-500/20">
        <CardHeader className="border-b border-slate-800/50">
          <CardTitle className="text-base flex items-center gap-2 text-indigo-400">
            <Target className="w-4 h-4" />
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300">{result.recommendation}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}