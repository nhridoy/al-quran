"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group/switch relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:bg-linear-to-r data-checked:from-primary data-checked:to-secondary data-unchecked:bg-surface-alt dark:data-unchecked:bg-dark-surface-alt",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform group-data-checked/switch:translate-x-5 group-data-unchecked/switch:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
