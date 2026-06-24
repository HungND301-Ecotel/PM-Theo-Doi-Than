import React from 'react';
import { MoreVertical, X } from "lucide-react"
import { Button } from "../ui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip"

interface TabActionsProps {
  onCloseAll: () => void;
  onCloseOthers: () => void;
}

const TabActions: React.FC<TabActionsProps> = ({ onCloseAll, onCloseOthers }) => {
  return (
    <div className="flex items-center">
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground mx-1">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Thao tác tab</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onCloseOthers}>
            <X className="mr-2 h-4 w-4" />
            <span>Đóng các tab khác</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCloseAll}>
            <X className="mr-2 h-4 w-4" />
            <span>Đóng tất cả</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TabActions;
