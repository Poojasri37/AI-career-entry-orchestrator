import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Zap, Users, Shield, BarChart3, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import type { ViewType } from './Dashboard';

interface SidebarProps {
  collapsed: boolean;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  agents: Array<{ id: ViewType; icon: any; label: string; status: 'idle' | 'processing' | 'active' | 'complete' }>;
  otherAgents: Array<{ id: string; icon: any; label: string; status: 'idle' | 'processing' | 'active' | 'complete' }>;
  onToggleCollapse: () => void;
}

const statusColors = {
  idle: 'text-slate-500 bg-slate-500/20',
  processing: 'text-amber-400 bg-amber-400/20 animate-pulse',
  active: 'text-emerald-400 bg-emerald-400/20',
  complete: 'text-indigo-400 bg-indigo-400/20',
};

const statusLabels = {
  idle: 'Idle',
  processing: 'Processing',
  active: 'Active',
  complete: 'Complete',
};

export function Sidebar({ 
  collapsed, 
  activeView, 
  onViewChange, 
  agents, 
  otherAgents,
  onToggleCollapse 
}: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? '80px' : '256px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col overflow-hidden md:relative"
      style={{ width: collapsed ? '80px' : '256px' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
        <motion.div
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-white truncate">Workforce Orchestrator</h1>
            <p className="text-xs text-slate-400 truncate">6-Agent Pipeline</p>
          </div>
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white flex-shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Primary Agents */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto" role="navigation" aria-label="Primary agents">
        <div className="px-3 py-2">
          <motion.span
            animate={{ opacity: collapsed ? 0 : 1 }}
            className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
          >
            Active Pipeline
          </motion.span>
        </div>
        
        {agents.map((agent, index) => (
          <motion.button
            key={agent.id}
            initial={false}
            animate={{ x: collapsed ? 0 : (activeView === agent.id ? 2 : 0) }}
            transition={{ duration: 0.2 }}
            onClick={() => onViewChange(agent.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              activeView === agent.id
                ? 'bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30'
                : 'hover:bg-slate-800/50 border border-transparent'
            }`}
            style={{ opacity: collapsed && activeView !== agent.id ? 0.6 : 1 }}
          >
            <div className={`relative p-2 rounded-lg flex-shrink-0 ${statusColors[agent.status]}`}>
              <agent.icon className="w-5 h-5" />
              <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${statusColors[agent.status].replace('text-', 'bg-')}`} />
            </div>
            
            <AnimatePresence mode="popLayout">
              {!collapsed && (
                <motion.div
                  key="label"
                  initial={{ opacity: 0, x: -10, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto' }}
                  exit={{ opacity: 0, x: -10, width: 0 }}
                  className="flex-1 min-w-0 flex flex-col"
                >
                  <span className="font-medium text-white truncate">{agent.label}</span>
                  <span className={`text-xs truncate ${statusColors[agent.status]}`}>{statusLabels[agent.status]}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {activeView === agent.id && !collapsed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-indigo-400"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Other Agents */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="px-3 pb-2">
          <motion.span
            animate={{ opacity: collapsed ? 0 : 1 }}
            className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
          >
            Available Agents
          </motion.span>
        </div>
        
        <div className="space-y-1">
          {otherAgents.map((agent) => (
            <button
              key={agent.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-slate-800/50 opacity-60 hover:opacity-100 ${
                collapsed ? 'justify-center' : ''
              }`}
              disabled
            >
              <div className="p-1.5 rounded-lg bg-slate-800/50 flex-shrink-0">
                <agent.icon className="w-4 h-4 text-slate-400" />
              </div>
              
              <AnimatePresence mode="popLayout">
                {!collapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, x: -10, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                    exit={{ opacity: 0, x: -10, width: 0 }}
                    className="text-sm text-slate-300 truncate"
                  >
                    {agent.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              <span className={`ml-auto w-2 h-2 rounded-full ${statusColors[agent.status].replace('text-', 'bg-')} opacity-50`} />
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <motion.div
          animate={{ opacity: collapsed ? 0 : 1, height: collapsed ? 0 : 'auto' }}
          className="overflow-hidden"
        >
          <div className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Powered by OpenRouter</span>
            </div>
            <p className="text-xs text-slate-500">Keys stored in session only</p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}