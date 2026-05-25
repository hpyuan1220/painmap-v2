import * as React from "react";

import { useImeSafeOnChange } from "@/lib/useImeSafeOnChange";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, onChange, onCompositionStart, onCompositionEnd, ...props }, ref) => {
    const ime = useImeSafeOnChange<HTMLTextAreaElement>(onChange);
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        onChange={ime.onChange}
        onCompositionStart={(e) => {
          ime.onCompositionStart();
          onCompositionStart?.(e);
        }}
        onCompositionEnd={(e) => {
          ime.onCompositionEnd(e);
          onCompositionEnd?.(e);
        }}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
