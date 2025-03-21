"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  label?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, label, ...props }, ref) => (
  <div className="relative w-full">
    {/* Progress Bar */}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>

    {/* Progress Label */}
    {/* <div
      className="absolute left-1/2 transform -translate-x-1/2 text-xs font-medium text-background rounded-full bg-primary flex items-center justify-center"
      style={{ left: `${value}%`, top: "-4rem", height: "3rem", width: "3rem" }}
    >
      {label || `${value}%`}
    </div> */}
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
