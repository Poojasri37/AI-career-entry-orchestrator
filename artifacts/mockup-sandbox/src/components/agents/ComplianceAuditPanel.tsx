import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  BarChart2, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Copy,
  RefreshCw,
  Building2,
  Users,
  Award,
  Clock,
  Brain,
  Link2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { useApiConfig } from '../../context/ApiConfigContext';
import { generateAuditCompliance, AuditComplianceResult, FairnessMetric, AuditLog } from '../../lib/api';

export function ComplianceAuditPanel() {
  const { apiKey } = useApiConfig();
  const [result, setResult] = useState<AuditComplianceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scope, setScope] = useState('Enterprise-wide hiring pipeline Q4 2024');
  const [sampleSize, setSampleSize] = useState(1280);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'logs' | 'export'>('overview');

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const auditResult = await generateAuditCompliance({ scope, sampleSize });
      setResult(auditResult);
    } catch (error) {
      console.error('Audit generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-compliance-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMetricIcon = (metric: FairnessMetric) => {
    if (metric.delta > 0) return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (metric.delta < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Within guardrail': return 'text-emerald-400 bg-emerald-400/20';
      case 'Protected': return 'text-emerald-400 bg-emerald-400/20';
      case 'Improving': return 'text-amber-400 bg-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getLogIcon = (resultStr: string) => {
    switch (resultStr) {
      case 'Pass': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'Ready': return <Shield className="w-4 h-4 text-indigo-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/20 rounded-xl">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Compliance Audit Agent</h2>
            <p className="text-sm text-slate-400">Enterprise fairness metrics & SAP SuccessFactors preview</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Building2 className="w-3 h-3" />
            SAP SuccessFactors Ready
          </Badge>
        </div>
      </div>

      {!result ? (
        <div className="flex-1 flex flex-col gap-4">
          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardHeader className="border-b border-slate-800/50">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Audit Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scope">Audit Scope</Label>
                <Input
                  id="scope"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="e.g., Enterprise-wide hiring pipeline Q4 2024"
                  className="bg-slate-800/50 border-slate-700 focus:border-violet-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sample-size">Sample Size</Label>
                <Input
                  id="sample-size"
                  type="number"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(parseInt(e.target.value) || 0)}
                  className="bg-slate-800/50 border-slate-700 focus:border-violet-500 w-48"
                />
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading}
                className="bg-violet-600 hover:bg-violet-500 w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Generating Audit...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Generate Compliance Audit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardHeader className="border-b border-slate-800/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Audit Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: BarChart2, label: 'Fairness Metrics', desc: 'Selection rate parity, capability evidence coverage, timeline penalty removal, explainability coverage' },
                  { icon: Clock, label: 'Audit Trail', desc: 'Timestamped events: capability vector generation, timeline proxy neutralization, SuccessFactors payload signing' },
                  { icon: Award, label: 'SAP Payload', desc: 'Schema: SAP.SuccessFactors.TalentIntelligence.v1 with fairness status, scope, sample size, generated timestamp' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl"
                  >
                    <div className="p-2 bg-violet-500/20 rounded-lg mb-3">
                      <item.icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <h4 className="font-medium mb-1">{item.label}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-r from-slate-900/50 to-violet-500/10 border border-violet-500/20 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-slate-400 mb-1">Overall Compliance Score</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                    {result.overallScore}
                  </span>
                  <Badge variant="secondary" className="px-3 py-1">
                    {result.successFactorsPayload.fairnessStatus === 'green' && (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Green Status
                      </>
                    )}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Scope</p>
                <p className="font-medium text-slate-300 truncate max-w-xs">{result.successFactorsPayload.scope}</p>
                <p className="text-xs text-slate-500">Sample: {result.successFactorsPayload.sampleSize} | {new Date(result.successFactorsPayload.generatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'metrics' | 'logs' | 'export')} className="flex-1 flex flex-col">
            <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1 rounded-xl">
              <TabsTrigger value="overview" className="px-4 py-2">Overview</TabsTrigger>
              <TabsTrigger value="metrics" className="px-4 py-2">Fairness Metrics</TabsTrigger>
              <TabsTrigger value="logs" className="px-4 py-2">Audit Trail</TabsTrigger>
              <TabsTrigger value="export" className="px-4 py-2">SAP Export</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1">
              <ScrollArea className="flex-1 p-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-slate-800/50 bg-slate-900/50">
                    <CardHeader className="border-b border-slate-800/50 pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        Demographic Parity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.metrics.filter(m => m.label.includes('Selection') || m.label.includes('parity')).map((metric, i) => (
                        <div key={i} className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-300">{metric.label}</span>
                            <Badge variant="secondary" className={getStatusColor(metric.status)}>
                              {metric.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-2xl font-bold text-white">{Math.round(metric.value * 100)}%</span>
                            <span className={metric.delta > 0 ? 'text-emerald-400' : 'text-red-400'}>
                              {metric.delta > 0 ? '+' : ''}{Math.round(metric.delta * 100)}pp
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-slate-800/50 bg-slate-900/50">
                    <CardHeader className="border-b border-slate-800/50 pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Brain className="w-4 h-4 text-indigo-400" />
                        Capability Coverage
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.metrics.filter(m => m.label.includes('Capability') || m.label.includes('Explainability') || m.label.includes('Timeline')).map((metric, i) => (
                        <div key={i} className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-300">{metric.label}</span>
                            <Badge variant="secondary" className={getStatusColor(metric.status)}>
                              {metric.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-2xl font-bold text-white">{Math.round(metric.value * 100)}%</span>
                            <span className={metric.delta > 0 ? 'text-emerald-400' : 'text-red-400'}>
                              {metric.delta > 0 ? '+' : ''}{Math.round(metric.delta * 100)}pp
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: 'Selection Rate Parity', value: '92%', icon: Users, color: 'text-emerald-400' },
                    { label: 'Capability Evidence', value: '88%', icon: Brain, color: 'text-indigo-400' },
                    { label: 'Timeline Penalty Removal', value: '97%', icon: Shield, color: 'text-emerald-400' },
                    { label: 'Explainability', value: '95%', icon: FileText, color: 'text-violet-400' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800/50 rounded-lg">
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="metrics" className="flex-1">
              <ScrollArea className="flex-1 p-4 space-y-3">
                {result.metrics.map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                    className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-500/20 rounded-lg">
                          <BarChart2 className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{metric.label}</h4>
                          <p className="text-xs text-slate-400">Guardrail threshold monitoring</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                        {getMetricIcon(metric)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Current Value</p>
                        <p className="text-2xl font-bold text-white">{Math.round(metric.value * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Delta</p>
                        <p className={`text-2xl font-bold ${metric.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {metric.delta > 0 ? '+' : ''}{Math.round(metric.delta * 100)}pp
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Threshold</p>
                        <p className="text-2xl font-bold text-slate-300">80%</p>
                      </div>
                    </div>
                    <Progress value={metric.value * 100} className="mt-3 h-1.5" />
                  </motion.div>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="logs" className="flex-1">
              <ScrollArea className="flex-1 p-4 space-y-2">
                {result.logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800/50 rounded-xl"
                  >
                    <div className="p-2 bg-slate-800/50 rounded-lg flex-shrink-0">
                      {getLogIcon(log.result)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-300">{log.event}</span>
                        <Badge variant="secondary" className="text-xs capitalize">{log.result.toLowerCase()}</Badge>
                      </div>
                      <p className="text-sm text-slate-400">Actor: {log.actor}</p>
                      <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="export" className="flex-1">
              <ScrollArea className="flex-1 p-4 space-y-6">
                <Card className="border-slate-800/50 bg-slate-900/50 border-violet-500/20">
                  <CardHeader className="border-b border-slate-800/50">
                    <CardTitle className="text-base flex items-center gap-2 text-violet-400">
                      <Building2 className="w-4 h-4" />
                      SAP SuccessFactors Preview Payload
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-950 border border-slate-800/50 rounded-xl p-4 font-mono text-sm overflow-auto max-h-96">
                      <pre className="text-slate-300">{JSON.stringify(result.successFactorsPayload, null, 2)}</pre>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(result.successFactorsPayload, null, 2))}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy JSON
                      </Button>
                      <Button onClick={downloadJSON}>
                        <Download className="w-4 h-4 mr-2" />
                        Download .json
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-800/50 bg-slate-900/50">
                  <CardHeader className="border-b border-slate-800/50">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Full Audit Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-950 border border-slate-800/50 rounded-xl p-4 font-mono text-sm overflow-auto max-h-96">
                      <pre className="text-slate-300">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Full Report
                      </Button>
                      <Button onClick={() => {
                        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `full-audit-${Date.now()}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Full Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-800/50 bg-slate-900/50 border-emerald-500/20">
                  <CardHeader className="border-b border-slate-800/50">
                    <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Integration Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-300">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <p><strong>Schema:</strong> SAP.SuccessFactors.TalentIntelligence.v1</p>
                      <p><strong>Endpoint:</strong> POST /odata/v2/TalentIntelligenceAudit</p>
                      <p><strong>Auth:</strong> OAuth 2.0 Client Credentials (SAP BTP)</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-xs">
                      <div className="p-2 bg-slate-800/50 rounded">
                        <p className="text-slate-400">Fairness Status</p>
                        <p className="font-medium text-emerald-400">{result.successFactorsPayload.fairnessStatus}</p>
                      </div>
                      <div className="p-2 bg-slate-800/50 rounded">
                        <p className="text-slate-400">Generated</p>
                        <p className="font-medium">{new Date(result.successFactorsPayload.generatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}