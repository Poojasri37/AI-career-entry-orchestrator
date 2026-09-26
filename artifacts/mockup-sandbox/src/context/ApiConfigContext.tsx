import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiConfig {
  apiKey: string;
  model: string;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  clearApiKey: () => void;
  isConfigured: boolean;
}

const ApiConfigContext = createContext<ApiConfig | undefined>(undefined);

const MODELS = [
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek' },
  { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B', provider: 'Meta' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini 1.5 Pro', provider: 'Google' },
] as const;

export function useModels() {
  return MODELS;
}

export function ApiConfigProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openrouter_api_key') || '';
    }
    return '';
  });
  const [model, setModelState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openrouter_model') || MODELS[0].id;
    }
    return MODELS[0].id;
  });

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (typeof window !== 'undefined') {
      if (key) localStorage.setItem('openrouter_api_key', key);
      else localStorage.removeItem('openrouter_api_key');
    }
  };

  const setModel = (model: string) => {
    setModelState(model);
    if (typeof window !== 'undefined') {
      localStorage.setItem('openrouter_model', model);
    }
  };

  const clearApiKey = () => {
    setApiKeyState('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('openrouter_api_key');
    }
  };

  return (
    <ApiConfigContext.Provider value={{ apiKey, model, setApiKey, setModel, clearApiKey, isConfigured: !!apiKey }}>
      {children}
    </ApiConfigContext.Provider>
  );
}

export function useApiConfig() {
  const context = useContext(ApiConfigContext);
  if (!context) throw new Error('useApiConfig must be used within ApiConfigProvider');
  return context;
}