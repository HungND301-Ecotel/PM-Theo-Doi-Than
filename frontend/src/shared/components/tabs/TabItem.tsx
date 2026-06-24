import React from 'react';
import { cn } from "@/shared/utils/cn";
import { 
  X, 
  RotateCcw, 
  Copy, 
  ArrowRight, 
  Layers 
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu"
import type { Tab } from './AppTabs';

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
  onCloseOthers: () => void;
  onCloseRight: () => void;
  onRefresh?: () => void;
  onDuplicate?: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  tab,
  isActive,
  onClick,
  onClose,
  onCloseOthers,
  onCloseRight,
  onRefresh,
  onDuplicate,
}) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(e);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div data-tab-id={tab.id} className="h-full">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  onClick={onClick}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 cursor-pointer transition-all duration-200 min-w-[100px] max-w-[240px] rounded-[18px] select-none h-[36px] my-1.5 mx-1",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-[0px_0px_1px_rgba(0,0,0,0.4)]" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.icon && (
                    <span className={cn("flex shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")}>
                      {tab.icon}
                    </span>
                  )}
                  
                  <span className={cn(
                    "text-sm truncate flex-1",
                    isActive ? "font-medium" : "font-normal"
                  )}>
                    {tab.label}
                  </span>

                  {tab.closeable !== false && (
                    <button
                      onClick={handleClose}
                      className={cn(
                        "p-0.5 rounded-full transition-colors",
                        isActive 
                          ? "text-primary-foreground/75 hover:bg-white/20 hover:text-primary-foreground" 
                          : "text-muted-foreground/50 hover:bg-black/5 hover:text-destructive"
                      )}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">{tab.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {onRefresh && (
          <ContextMenuItem onClick={onRefresh}>
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>Tải lại</span>
          </ContextMenuItem>
        )}
        {onDuplicate && (
          <ContextMenuItem onClick={onDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Nhân bản</span>
          </ContextMenuItem>
        )}
        {(onRefresh || onDuplicate) && <ContextMenuSeparator />}
        <ContextMenuItem onClick={() => onClose(null as any)} className="text-destructive focus:text-destructive">
          <X className="mr-2 h-4 w-4" />
          <span>Đóng tab này</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCloseOthers}>
          <Layers className="mr-2 h-4 w-4" />
          <span>Đóng các tab khác</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCloseRight}>
          <ArrowRight className="mr-2 h-4 w-4" />
          <span>Đóng các tab bên phải</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TabItem;
