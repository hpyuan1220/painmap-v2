import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  helper?: ReactNode;
  error?: string | null;
  children: ReactNode;
  className?: string;
};

export function LiteField({ label, helper, error, children, className }: Props) {
  return (
    <label className={cn("block space-y-2", className)}>
      <div className="space-y-1">
        <span className="block text-[14px] font-semibold text-text-primary">{label}</span>
        {helper && <p className="text-[13px] leading-[1.6] text-text-secondary">{helper}</p>}
      </div>
      {children}
      {error && <p className="text-[13px] text-destructive">{error}</p>}
    </label>
  );
}
