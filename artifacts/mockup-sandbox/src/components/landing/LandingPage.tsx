import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  BarChart3, 
  Shield, 
  Users, 
  Zap, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Award
} from 'lucide-react';
import { Button } from '../ui/button';
import { ApiKeyModal } from '../modals/ApiKeyModal';
import { useApiConfig } from '../../context/ApiConfigContext';

const agents = [
  {
    id: 'skills-discovery',
    icon: Brain,
    title: 'Skills Discovery Agent',
    subtitle: 'Conversational Profile Translation',
    description: 'Uncovers transferable capabilities from non-linear careers, caregiving gaps, and unconventional experiences through empathetic dialogue.',
    gradient: 'from-indigo-500 to-purple-500',
    stats: ['94% accuracy', '8 languages', 'Real-time'],
  },
  {
    id: 'market-intelligence',
    icon: Target,
    title: 'Market Intelligence Agent',
    subtitle: 'Real-time Demand Correlation',
    description: 'Maps extracted capabilities to live labor market data, identifying high-growth roles and emerging skill adjacencies.',
    gradient: 'from-cyan-500 to-blue-500',
    stats: ['120M+ roles', 'Real-time API', '50+ sources'],
  },
  {
    id: 'learning-pathway',
    icon: Zap,
    title: 'Learning Pathway Agent',
    subtitle: 'Micro-credential Generation',
    description: 'Generates personalized, stackable learning pathways with verified micro-credentials aligned to target role requirements.',
    gradient: 'from-amber-500 to-orange-500',
    stats: ['Stackable creds', 'SAP integrated', 'Adaptive pacing'],
  },
  {
    id: 'inclusive-matching',
    icon: Users,
    title: 'Inclusive Matching Agent',
    subtitle: 'Bias-Neutral Semantic Matching',
    description: 'Matches capability vectors to requisitions using semantic embeddings, stripping timeline, pedigree, and demographic proxies.',
    gradient: 'from-emerald-500 to-teal-500',
    stats: ['Bias-neutral', 'Vector search', 'Explainable AI'],
  },
  {
    id: 'employer-readiness',
    icon: Shield,
    title: 'Employer Readiness Agent',
    subtitle: 'Workplace Accessibility Audit',
    description: 'Evaluates organizational policies, infrastructure, and culture for inclusive readiness, generating remediation roadmaps.',
    gradient: 'from-rose-500 to-pink-500',
    stats: ['WCAG 2.2', 'Policy scan', 'Remediation plan'],
  },
  {
    id: 'bias-audit',
    icon: BarChart3,
    title: 'Bias Audit Agent',
    subtitle: 'Compliance & Demographic Skew',
    description: 'Continuous fairness monitoring with demographic parity analysis, audit trails, and SAP SuccessFactors preview integration.',
    gradient: 'from-violet-500 to-indigo-500',
    stats: ['Real-time audit', 'SAP preview', 'Guardrails'],
  },
];

const metrics = [
  { value: '$5.5T', label: 'Global Skills Gap', icon: Globe },
  { value: '120M+', label: 'Workers at Risk', icon: Users },
  { value: '87%', label: 'Bias in Screening', icon: Award },
  { value: '6', label: 'Specialized Agents', icon: Sparkles },
];

export function LandingPage() {
  const { isConfigured } = useApiConfig();
  const [showModal, setShowModal] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);

  const handleLaunch = () => {
    if (isConfigured) {
      window.location.href = '/dashboard';
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-indigo-500/20 via-transparent to-transparent rounded-full animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-emerald-500/15 via-transparent to-transparent rounded-full animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent rounded-full animate-pulse-glow" />
        
        {/* Mesh gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-2 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl"
            >
              <Brain className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Inclusive Workforce Orchestrator
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                SAP BTP AI Core Connected
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>$5.5T skills gap</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>120M workers at risk</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowArchitecture(true)}>
              Architecture
            </Button>
            <Button variant="ghost" size="sm">
              Documentation
            </Button>
            <Button 
              onClick={handleLaunch}
              className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 shadow-lg shadow-indigo-500/25"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Launch Orchestrator
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-emerald-400 rounded-full"
              />
              <span className="text-sm text-indigo-300 font-medium">SAP Hackfest 2026 • Theme 2 • Inclusive Workforce Orchestrator</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                AI is rewriting who works.
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                We rewrite it fairly.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              An agentic capability platform built for SAP SuccessFactors & Talent Intelligence Hub ecosystems.
              Six specialized AI agents transform how organizations discover, validate, and match human potential—
              without bias toward pedigree, chronology, or conventional credentials.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button 
              size="lg" 
              onClick={handleLaunch}
              className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 shadow-xl shadow-indigo-500/30 px-10 py-4 text-lg gap-3"
            >
              <Sparkles className="w-5 h-5" />
              Enter API Key & Launch App
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowArchitecture(true)}
              className="border-slate-700 hover:border-slate-500 px-10 py-4 text-lg gap-3"
            >
              <Brain className="w-5 h-5" />
              Explore 6-Agent Workflow
            </Button>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="p-6 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <metric.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {metric.value}
                </div>
                <div className="text-sm text-slate-400">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6-Agent Feature Grid */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">6-Agent Pipeline</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Each agent specializes in a critical phase of inclusive workforce orchestration, 
              communicating via structured capability vectors for transparent, auditable decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <motion.article
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-6 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-xl hover:border-slate-700/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-indigo-500/5 group-hover:to-emerald-500/5 rounded-2xl transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${agent.gradient} mb-4`}>
                    <agent.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-1">{agent.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{agent.subtitle}</p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{agent.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.stats.map((stat, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-300">
                        {stat}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium group-hover:gap-3 transition-all">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Preview */}
      <section className="relative py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Enterprise Scale</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Native SAP BTP integration with SuccessFactors Talent Intelligence Hub, 
              real-time OpenRouter LLM routing, and enterprise-grade audit compliance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'SAP BTP Native', desc: 'Deployed on SAP Business Technology Platform with AI Core integration for enterprise-grade scalability and security.' },
              { icon: Shield, title: 'OpenRouter Routing', desc: 'Dynamic model selection across 200+ LLMs via OpenRouter with per-request key injection and cost optimization.' },
              { icon: Award, title: 'Compliance Ready', desc: 'Built-in fairness metrics, demographic parity analysis, and SAP SuccessFactors preview payload generation.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="p-6 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-xl"
              >
                <div className="p-3 bg-indigo-500/20 rounded-xl w-fit mb-4">
                  <item.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="p-12 bg-gradient-to-br from-indigo-500/10 via-slate-900/50 to-emerald-500/10 border border-slate-800/50 rounded-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to orchestrate inclusive hiring?
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              Connect your OpenRouter key and experience the full 6-agent pipeline 
              transforming how organizations evaluate human potential.
            </p>
            <Button 
              size="lg" 
              onClick={handleLaunch}
              className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 shadow-xl shadow-indigo-500/30 px-10 py-4 text-lg gap-3"
            >
              <Sparkles className="w-5 h-5" />
              Launch Orchestrator
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSuccess={() => window.location.href = '/dashboard'}
      />

      {/* Architecture Modal */}
      {showArchitecture && (
        <ArchitectureModal onClose={() => setShowArchitecture(false)} />
      )}
    </div>
  );
}

import { useState } from 'react';

function ArchitectureModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Agent Pipeline Architecture</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-slate-300">The 6 agents operate as a directed acyclic graph (DAG) with capability vectors as the universal data contract.</p>
          <div className="space-y-4">
            {agents.map((agent, i) => (
              <div key={agent.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.gradient}`}>
                  <agent.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{agent.title}</h4>
                  <p className="text-sm text-slate-400">{agent.description}</p>
                </div>
                {i < agents.length - 1 && (
                  <div className="text-slate-600">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { X } from 'lucide-react';