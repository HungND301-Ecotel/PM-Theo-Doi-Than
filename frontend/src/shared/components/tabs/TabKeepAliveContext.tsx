import React, { useState, useCallback } from 'react';
import { TabKeepAliveContext } from './TabKeepAliveContextDef';
import type { TabKeepAliveContextType, CachedComponent } from './TabKeepAliveContextDef';

export const TabKeepAliveProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cacheMap, setCacheMap] = useState<Map<string, CachedComponent>>(new Map());

  const addComponent = useCallback(
    (tabId: string, component: React.ReactNode, state: Record<string, unknown> = {}) => {
      setCacheMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(tabId, { component, state });
        return newMap;
      });
    },
    []
  );

  const getComponent = useCallback((tabId: string) => {
    return cacheMap.get(tabId)?.component || null;
  }, [cacheMap]);

  const saveState = useCallback((tabId: string, state: Record<string, unknown>) => {
    setCacheMap((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(tabId);
      if (existing) {
        newMap.set(tabId, { ...existing, state });
      }
      return newMap;
    });
  }, []);

  const getState = useCallback((tabId: string) => {
    return cacheMap.get(tabId)?.state || {};
  }, [cacheMap]);

  const removeComponent = useCallback((tabId: string) => {
    setCacheMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(tabId);
      return newMap;
    });
  }, []);

  const clearCache = useCallback(() => {
    setCacheMap(new Map());
  }, []);

  const value: TabKeepAliveContextType = {
    cacheMap,
    addComponent,
    getComponent,
    saveState,
    getState,
    removeComponent,
    clearCache,
  };

  return (
    <TabKeepAliveContext.Provider value={value}>
      {children}
    </TabKeepAliveContext.Provider>
  );
};
