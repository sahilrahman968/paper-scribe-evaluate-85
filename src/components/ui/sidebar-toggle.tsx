
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggle({
  isCollapsed,
  onToggle,
  className,
  ...props
}: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={onToggle}
      {...props}
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
