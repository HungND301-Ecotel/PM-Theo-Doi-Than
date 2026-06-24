import { createContext } from 'react';

export interface CachedComponent {
  component: React.ReactNode;
  state: Record<string, unknown>;
}

export interface TabKeepAliveContextType {
  cacheMap: Map<string, CachedComponent>;
  addComponent: (tabId: string, component: React.ReactNode, state?: Record<string, unknown>) => void;
  getComponent: (tabId: string) => React.ReactNode | null;
  saveState: (tabId: string, state: Record<string, unknown>) => void;
  getState: (tabId: string) => Record<string, unknown>;
  removeComponent: (tabId: string) => void;
  clearCache: () => void;
}

export const TabKeepAliveContext = createContext<TabKeepAliveContextType | undefined>(undefined);
