import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip"
import type { Tab } from './AppTabs';
import TabDropdown from './TabDropdown';

interface TabScrollProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onContextMenu?: (e: React.MouseEvent, tabId: string) => void;
  children: React.ReactNode;
}

const TabScroll: React.FC<TabScrollProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  children,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState<Tab[]>(tabs);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const updateVisibleTabs = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const tabElements = container.querySelectorAll('[data-tab-id]');
    const visible: Tab[] = [];

    tabElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const isVisible =
        rect.left >= containerRect.left - 1 &&
        rect.right <= containerRect.right + 1;

      if (isVisible) {
        const tabId = el.getAttribute('data-tab-id');
        const tab = tabs.find((t) => t.id === tabId);
        if (tab) visible.push(tab);
      }
    });

    setVisibleTabs(visible);
  }, [tabs]);

  useEffect(() => {
    checkScroll();
    const currentContainer = scrollContainerRef.current;
    
    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
      updateVisibleTabs();
    });

    if (currentContainer) {
      resizeObserver.observe(currentContainer);
      currentContainer.addEventListener('scroll', checkScroll);
    }

    return () => {
      resizeObserver.disconnect();
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, [checkScroll, updateVisibleTabs, tabs]);

  useEffect(() => {
    const activeTabElement = scrollContainerRef.current?.querySelector(
      `[data-tab-id="${activeTabId}"]`
    );

    if (activeTabElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = activeTabElement as HTMLElement;

      const isInView =
        element.offsetLeft >= container.scrollLeft &&
        element.offsetLeft + element.offsetWidth <=
          container.scrollLeft + container.clientWidth;

      if (!isInView) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTabId]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex items-center gap-1 px-1 w-full overflow-hidden h-12">
      {canScrollLeft && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll('left')}
                className="flex-shrink-0 h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cuộn sang trái</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-x-hidden overflow-y-hidden scroll-smooth gap-0 h-full"
      >
        <div className="flex gap-0 h-full">
          {React.Children.map(children, (child) => (
            <div
              data-tab-id={
                React.isValidElement(child)
                  ? (child.props as { tab?: Tab }).tab?.id
                  : undefined
              }
              className="h-full"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      <TabDropdown
        visibleTabs={visibleTabs}
        allTabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={onTabClick}
      />

      {canScrollRight && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll('right')}
                className="flex-shrink-0 h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cuộn sang phải</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default TabScroll;
