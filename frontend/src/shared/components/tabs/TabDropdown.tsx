import React from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import type { Tab } from "./AppTabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface TabDropdownProps {
  visibleTabs: Tab[];
  allTabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
}

const TabDropdown: React.FC<TabDropdownProps> = ({
  visibleTabs,
  allTabs,
  activeTabId,
  onTabSelect,
}) => {
  const hiddenTabs = allTabs.filter(
    (tab) => !visibleTabs.find((vt) => vt.id === tab.id),
  );

  if (hiddenTabs.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 relative text-muted-foreground mx-1"
                >
                  <ChevronDown className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    {hiddenTabs.length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Xem thêm tab</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent
          align="end"
          className="w-56 max-h-[400px] overflow-auto custom-scrollbar"
        >
          {hiddenTabs.map((tab) => (
            <DropdownMenuItem
              key={tab.id}
              onClick={() => onTabSelect(tab.id)}
              className={activeTabId === tab.id ? "bg-muted" : ""}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              <span className="truncate">{tab.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TabDropdown;
