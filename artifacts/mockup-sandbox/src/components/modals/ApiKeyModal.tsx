import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Shield, Eye, EyeOff, Check } from 'lucide-react';
import { useApiConfig, useModels } from '../../context/ApiConfigContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApiKeyModal({ isOpen, onClose, onSuccess }: ApiKeyModalProps) {
  const { apiKey, model, setApiKey, setModel, isConfigured } = useApiConfig();
  const models = useModels();
  const [localKey, setLocalKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(model);
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [keyValidated, setKeyValidated] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalKey(apiKey);
      setLocalModel(model);
      setKeyValidated(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, apiKey, model]);

  const handleSave = async () => {
    if (!localKey.trim()) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setApiKey(localKey.trim());
    setModel(localModel);
    setKeyValidated(true);
    setIsSaving(false);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1000);
  };

  const handleKeyChange = (value: string) => {
    setLocalKey(value);
    setKeyValidated(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        <motion.div
          ref={modalRef}
          className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Key className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">OpenRouter Configuration</h2>
                <p className="text-sm text-slate-400">Secure API key for LLM routing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-sm text-slate-300">
                <p className="font-medium text-emerald-300">Secure by Design</p>
                <p>Keys stored in browser session only. Never sent to our servers. Used exclusively for OpenRouter API calls during agent simulations.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm font-medium text-slate-200">
                OpenRouter API Key
              </Label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  id="api-key"
                  type={showKey ? 'text' : 'password'}
                  value={localKey}
                  onChange={(e) => handleKeyChange(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="pr-12 bg-slate-800/50 border-slate-700 focus:border-indigo-500"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Get your key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">openrouter.ai/keys</a></p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-select" className="text-sm font-medium text-slate-200">
                Model
              </Label>
              <Select value={localModel} onValueChange={setLocalModel}>
                <SelectTrigger id="model-select" className="bg-slate-800/50 border-slate-700 focus:border-indigo-500">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{m.name}</span>
                        <span className="text-xs text-slate-500">{m.provider}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {keyValidated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm"
              >
                <Check className="w-4 h-4 flex-shrink-0" />
                Configuration saved successfully
              </motion.div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                disabled={isSaving || !localKey.trim()}
              >
                {isSaving ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save & Launch'
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}