import React, { useEffect } from 'react';
import { useTabKeepAlive } from './useTabKeepAlive';

/**
 * Wrapper component to cache child component state
 * @example
 * <TabKeepAlive tabId="tab-1">
 *   <MyComponent />
 * </TabKeepAlive>
 */
interface TabKeepAliveProps {
  tabId: string;
  children: React.ReactNode;
}

export const TabKeepAlive: React.FC<TabKeepAliveProps> = ({ tabId, children }) => {
  const { addComponent, getComponent } = useTabKeepAlive();

  // Trigger addComponent but avoid unnecessary state in this component if possible.
  // Actually, to ensure it's in cache before rendering, we can do it in an effect.
  useEffect(() => {
    addComponent(tabId, children);
  }, [tabId, children, addComponent]);

  const cached = getComponent(tabId);

  return <>{cached || children}</>;
};

export default TabKeepAlive;
