import React, { useState, useCallback, useEffect } from 'react';
import TabItem from './TabItem';
import TabActions from './TabActions';
import TabScroll from './TabScroll';
import { Separator } from "../ui/separator"

export interface Tab {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  closeable?: boolean;
  active?: boolean;
  componentKey?: string;
}

export interface AppTabsProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabsChange?: (tabs: Tab[]) => void;
  showActions?: boolean;
  maxTabs?: number;
  persistent?: boolean;
}

const AppTabs: React.FC<AppTabsProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onTabsChange,
  showActions = true,
  persistent = true,
}) => {
  const [localTabs, setLocalTabs] = useState<Tab[]>(tabs);
  const [prevTabs, setPrevTabs] = useState<Tab[]>(tabs);

  if (tabs.length !== prevTabs.length || tabs.some((t, i) => t.id !== prevTabs[i]?.id)) {
    setLocalTabs(tabs);
    setPrevTabs(tabs);
  }

  useEffect(() => {
    if (persistent && localTabs.length > 0) {
      const tabIds = localTabs.map(t => t.id);
      localStorage.setItem('app_tabs', JSON.stringify(tabIds));
      localStorage.setItem('active_tab', activeTabId);
    }
  }, [localTabs, activeTabId, persistent]);

  const handleTabClick = useCallback(
    (tabId: string) => {
      onTabChange(tabId);
    },
    [onTabChange]
  );

  const handleTabClose = useCallback(
    (tabId: string) => {
      onTabClose(tabId);
      const newTabs = localTabs.filter((t) => t.id !== tabId);
      setLocalTabs(newTabs);
      onTabsChange?.(newTabs);

      if (activeTabId === tabId && newTabs.length > 0) {
        onTabChange(newTabs[0].id);
      }
    },
    [localTabs, activeTabId, onTabClose, onTabsChange, onTabChange]
  );

  const handleCloseAll = useCallback(() => {
    const remaining = localTabs.filter((t) => t.closeable === false);
    setLocalTabs(remaining);
    onTabsChange?.(remaining);

    if (!remaining.find((t) => t.id === activeTabId)) {
      onTabChange(remaining[0]?.id || '');
    }
  }, [localTabs, activeTabId, onTabsChange, onTabChange]);

  const handleCloseOthers = useCallback(
    (tabId: string) => {
      const remaining = localTabs.filter(
        (t) => t.id === tabId || t.closeable === false
      );
      setLocalTabs(remaining);
      onTabsChange?.(remaining);
      onTabChange(tabId);
    },
    [localTabs, onTabsChange, onTabChange]
  );

  const handleCloseRight = useCallback(
    (tabId: string) => {
      const index = localTabs.findIndex((t) => t.id === tabId);
      const remaining = localTabs.slice(0, index + 1);
      setLocalTabs(remaining);
      onTabsChange?.(remaining);
    },
    [localTabs, onTabsChange]
  );

  return (
    <div className="flex flex-col border-b bg-card w-full">
      <div className="flex items-center justify-between min-h-[48px]">
        <div className="flex-1 overflow-hidden">
          <TabScroll
            tabs={localTabs}
            activeTabId={activeTabId}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
          >
            {localTabs.map((tab) => (
              <TabItem
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onClick={() => handleTabClick(tab.id)}
                onClose={() => handleTabClose(tab.id)}
                onCloseOthers={() => handleCloseOthers(tab.id)}
                onCloseRight={() => handleCloseRight(tab.id)}
              />
            ))}
          </TabScroll>
        </div>

        {showActions && (
          <div className="flex items-center">
            <Separator orientation="vertical" className="h-6 mx-1" />
            <TabActions
              onCloseAll={handleCloseAll}
              onCloseOthers={() => handleCloseOthers(activeTabId)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppTabs;
