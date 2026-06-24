import { useContext } from 'react';
import { TabKeepAliveContext } from './TabKeepAliveContextDef';

export const useTabKeepAlive = () => {
  const context = useContext(TabKeepAliveContext);
  if (!context) {
    throw new Error('useTabKeepAlive must be used within TabKeepAliveProvider');
  }
  return context;
};
