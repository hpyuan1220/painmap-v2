import * as React from "react";

/**
 * Suppresses `onChange` while an IME composition is in progress, then fires it
 * once with the final value on `compositionEnd`. Without this, every keystroke
 * during Chinese/Japanese input commits to parent state, the parent re-renders,
 * and React resets the input value mid-composition — wiping half-formed
 * characters as the user types.
 */
export function useImeSafeOnChange<
  T extends HTMLInputElement | HTMLTextAreaElement,
>(consumerOnChange?: (event: React.ChangeEvent<T>) => void) {
  const composingRef = React.useRef(false);

  return {
    onChange(event: React.ChangeEvent<T>) {
      if (!composingRef.current) consumerOnChange?.(event);
    },
    onCompositionStart() {
      composingRef.current = true;
    },
    onCompositionEnd(event: React.CompositionEvent<T>) {
      composingRef.current = false;
      consumerOnChange?.(event as unknown as React.ChangeEvent<T>);
    },
  };
}
