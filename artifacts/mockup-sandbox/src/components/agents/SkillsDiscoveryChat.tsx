import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Loader2, 
  Brain, 
  Sparkles, 
  Zap, 
  Link2, 
  Minimize2, 
  Maximize2,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useApiConfig } from '../../context/ApiConfigContext';
import { discoverSkills, CapabilityNode, SkillsDiscoveryResult } from '../../lib/api';

const initialPrompts = [
  "I spent 5 years managing a household and caring for two children, including one with special needs. I coordinated medical appointments, therapy schedules, managed a complex budget, and advocated for educational accommodations.",
  "I've been a volunteer firefighter for 8 years while working retail. I've led emergency responses, trained new recruits, maintained equipment, and coordinated with multiple agencies during crises.",
  "I ran a small catering business for 3 years before closing due to the pandemic. I handled client relations, menu planning, supply chain, staff scheduling, and financial management.",
  "I'm a first-generation college graduate who worked warehouse jobs while studying. I taught myself Python and SQL through free courses and built inventory tools for my employers.",
];

export function SkillsDiscoveryChat() {
  const { apiKey, model } = useApiConfig();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; capabilities?: CapabilityNode[] }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [capabilities, setCapabilities] = useState<CapabilityNode[]>([]);
  const [showGraph, setShowGraph] = useState(true);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const prompt = customPrompt || input.trim();
    if (!prompt || isLoading) return;

    setInput('');
    setIsLoading(true);
    
    const userMessage = { role: 'user' as const, content: prompt };
    setMessages(prev => [...prev, userMessage]);

    try {
      const result: SkillsDiscoveryResult = await discoverSkills(
        { prompt, model },
        apiKey || undefined
      );
      
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: result.reply, 
        capabilities: result.capabilities 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      if (result.capabilities.length > 0) {
        setCapabilities(prev => [...prev, ...result.capabilities]);
      }
      
      if (result.nextPrompt && !customPrompt) {
        setCurrentPromptIndex(i => (i + 1) % initialPrompts.length);
      }
    } catch (error) {
      console.error('Skills discovery failed:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: 'I encountered an error. Please check your API key and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getUniqueCapabilities = () => {
    const seen = new Set<string>();
    return capabilities.filter(cap => {
      if (seen.has(cap.id)) return false;
      seen.add(cap.id);
      return true;
    });
  };

  const copyCapability = (cap: CapabilityNode) => {
    navigator.clipboard.writeText(`${cap.label} (${cap.category}) - ${cap.source}`);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Skills Discovery Agent</h2>
            <p className="text-sm text-slate-400">Conversational profile translation → Capability extraction</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {apiKey ? 'LLM Active' : 'Demo Mode'}
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col border-slate-800/50 bg-slate-900/50">
            <CardHeader className="border-b border-slate-800/50 pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                Conversation
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setShowGraph(!showGraph)} className="text-slate-400 hover:text-white">
                    {showGraph ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block px-4 py-2.5 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-500/30 text-white' : 'bg-slate-800/50 text-slate-300 border border-slate-700/50'}`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                        {msg.capabilities && msg.capabilities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1 justify-end">
                            {msg.capabilities.slice(0, 3).map((cap, ci) => (
                              <motion.span
                                key={ci}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 * ci }}
                                className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full"
                              >
                                {cap.label}
                              </motion.span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[75%]">
                        <div className="inline-block px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                            <span className="text-sm">Analyzing capabilities...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              <Separator className="mx-4 border-slate-800/50" />
              
              <div className="p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="flex flex-wrap gap-2">
                    {initialPrompts.slice(0, 3).map((prompt, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSend(prompt)}
                        className="text-xs h-auto px-3 py-1.5"
                      >
                        {prompt.slice(0, 30)}...
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your experience, responsibilities, or challenges..."
                    className="flex-1 bg-slate-800/50 border-slate-700 focus:border-indigo-500"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={() => handleSend()} 
                    disabled={isLoading || !input.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Knowledge Graph Panel */}
        <AnimatePresence>
          {showGraph && (
            <motion.div
              initial={{ opacity: 0, x: 50, width: 0 }}
              animate={{ opacity: 1, x: 0, width: '380px' }}
              exit={{ opacity: 0, x: 50, width: 0 }}
              transition={{ duration: 0.3 }}
              className="w-96 flex-shrink-0 flex flex-col hidden lg:block"
            >
              <Card className="flex-1 flex flex-col border-slate-800/50 bg-slate-900/50 h-full">
                <CardHeader className="border-b border-slate-800/50 pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                        <Link2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span>Extracted Capabilities</span>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      {getUniqueCapabilities().length} nodes
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-3">
                      {getUniqueCapabilities().length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                          <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">Start a conversation to extract capabilities</p>
                          <p className="text-xs mt-1">The agent will identify transferable skills from your story</p>
                        </div>
                      ) : (
                        getUniqueCapabilities().map((cap, i) => (
                          <motion.div
                            key={cap.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="group p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:border-slate-600/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-white truncate">{cap.label}</span>
                                  <Badge variant="secondary" className="text-xs">{cap.category}</Badge>
                                </div>
                                <p className="text-xs text-slate-400 truncate">{cap.source}</p>
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${cap.confidence * 100}%` }}
                                      transition={{ delay: 0.1 * i, duration: 0.5 }}
                                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                                    />
                                  </div>
                                  <span className="text-xs text-slate-400 w-10 text-right">{Math.round(cap.confidence * 100)}%</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyCapability(cap)}
                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}