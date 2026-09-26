import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Zap, 
  Users, 
  Shield, 
  BarChart3,
  ChevronLeft, 
  ChevronRight,
  Settings,
  Key,
  Sparkles,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Sidebar } from './Sidebar';
import { SkillsDiscoveryChat } from '../agents/SkillsDiscoveryChat';
import { MatchingDashboard } from '../agents/MatchingDashboard';
import { ComplianceAuditPanel } from '../agents/ComplianceAuditPanel';
import { ApiKeyModal } from '../modals/ApiKeyModal';
import { useApiConfig } from '../../context/ApiConfigContext';

export type ViewType = 'skills-discovery' | 'inclusive-match' | 'compliance-audit';

const agents = [
  { id: 'skills-discovery' as ViewType, icon: Brain, label: 'Skills Discovery', status: 'idle' as const },
  { id: 'inclusive-match' as ViewType, icon: Users, label: 'Inclusive Matching', status: 'idle' as const },
  { id: 'compliance-audit' as ViewType, icon: BarChart3, label: 'Compliance Audit', status: 'idle' as const },
];

const otherAgents = [
  { id: 'market-intelligence', icon: Target, label: 'Market Intelligence', status: 'idle' as const },
  { id: 'learning-pathway', icon: Zap, label: 'Learning Pathway', status: 'idle' as const },
  { id: 'employer-readiness', icon: Shield, label: 'Employer Readiness', status: 'idle' as const },
];

export function Dashboard() {
  const { isConfigured, apiKey, model, clearApiKey } = useApiConfig();
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('skills-discovery');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md"
        >
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
          <h2 className="text-2xl font-bold mb-2">Configuration Required</h2>
          <p className="text-slate-400 mb-6">Please configure your OpenRouter API key to access the orchestrator.</p>
          <Button onClick={() => setShowKeyModal(true)} className="w-full">
            <Key className="w-4 h-4 mr-2" />
            Configure API Key
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        activeView={activeView}
        onViewChange={setActiveView}
        agents={agents}
        otherAgents={otherAgents}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {agents.find(a => a.id === activeView)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-slate-300 font-medium">Connected</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowKeyModal(true)} className="text-slate-400 hover:text-white">
                <Key className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeView === 'skills-discovery' && <SkillsDiscoveryChat />}
              {activeView === 'inclusive-match' && <MatchingDashboard />}
              {activeView === 'compliance-audit' && <ComplianceAuditPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={showKeyModal} 
        onClose={() => setShowKeyModal(false)} 
      />
    </div>
  );
}