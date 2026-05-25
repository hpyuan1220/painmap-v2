/**
 * WorksheetFormPrimitives — shared field components for v3 card forms.
 *
 * Pure presentational primitives. Each card route composes these with
 * store reads/writes; no schema knowledge lives here.
 *
 * Voice: labels and placeholders are caller-controlled, so each card
 * stays on the invitation tone defined in voice_and_tone.md.
 */

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

const inputClass =
  "w-full rounded-md border border-border-hairline bg-canvas-raised px-3 py-2.5 text-[15px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary";

type FieldEvent = { currentTarget: { value: string } };

/**
 * Controlled-input glue that survives IME (Chinese/Japanese) composition.
 *
 * A plain `value={store}` input drops half-formed Chinese input: each keystroke
 * updates the store, the parent re-renders, and React resets `value` mid-
 * composition. Here a local `draft` backs the input, the parent re-render is
 * ignored while the field is focused or composing, and the store update is held
 * back until composition ends — so typing is never interrupted.
 */
function useWritableDraft(value: string, onChange: (v: string) => void) {
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);
  const composing = useRef(false);

  useEffect(() => {
    if (!focused.current && !composing.current) {
      setDraft(value);
    }
  }, [value]);

  function commit(next: string) {
    setDraft(next);
    if (!composing.current) onChange(next);
  }

  return {
    value: draft,
    onFocus: () => {
      focused.current = true;
    },
    onBlur: () => {
      focused.current = false;
      onChange(draft);
    },
    onInput: (e: FieldEvent) => commit(e.currentTarget.value),
    onChange: (e: FieldEvent) => commit(e.currentTarget.value),
    onCompositionStart: () => {
      composing.current = true;
    },
    onCompositionEnd: (e: FieldEvent) => {
      composing.current = false;
      commit(e.currentTarget.value);
    },
  };
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "date" | "datetime-local" | "tel" | "email" | "url";
}) {
  const id = useId();
  const field = useWritableDraft(value, onChange);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-text-secondary">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={hint}
        autoComplete="off"
        className={inputClass}
        {...field}
      />
    </div>
  );
}

export function TextareaField({
  label,
  hint,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const id = useId();
  const field = useWritableDraft(value, onChange);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-text-secondary">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={hint}
        autoComplete="off"
        className={inputClass}
        {...field}
      />
    </div>
  );
}

function ListItemInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const field = useWritableDraft(value, onChange);

  return (
    <input
      type="text"
      placeholder={placeholder}
      autoComplete="off"
      className={inputClass}
      {...field}
    />
  );
}

export function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string; description?: string }>;
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-[13px] font-medium text-text-secondary mb-1">{label}</legend>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-start gap-3 rounded-md border border-border-hairline bg-canvas-raised px-3 py-2.5 cursor-pointer hover:border-border-default"
        >
          <input
            type="radio"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mt-1"
          />
          <div className="flex flex-col">
            <span className="text-[15px] text-text-primary">{opt.label}</span>
            {opt.description && (
              <span className="text-[13px] text-text-secondary">{opt.description}</span>
            )}
          </div>
        </label>
      ))}
    </fieldset>
  );
}

export function ListField({
  label,
  hint,
  items,
  onChange,
  addLabel = "＋ 再加一條",
  itemPlaceholder,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (next: string[]) => void;
  addLabel?: string;
  itemPlaceholder?: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      <p className="text-[13px] font-medium text-text-secondary">{label}</p>
      {hint && <p className="text-[12px] text-text-tertiary">{hint}</p>}
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-start">
          <ListItemInput
            value={item}
            onChange={(v) => {
              const next = [...items];
              next[idx] = v;
              onChange(next);
            }}
            placeholder={itemPlaceholder}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            aria-label="移除這條"
            className="px-3 py-2.5 rounded-md text-[13px] text-text-tertiary hover:text-text-primary hover:bg-canvas-raised"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
      >
        {addLabel}
      </button>
    </div>
  );
}

export function CardBlock({
  title,
  children,
  onRemove,
}: {
  title?: string;
  children: ReactNode;
  onRemove?: () => void;
}) {
  return (
    <section className="rounded-lg border border-border-hairline bg-canvas-raised p-5 flex flex-col gap-4">
      {(title || onRemove) && (
        <header className="flex items-center justify-between">
          {title && <h3 className="text-[14px] font-medium text-text-primary">{title}</h3>}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label="移除這張"
              className="text-[12px] text-text-tertiary hover:text-text-primary"
            >
              ✕
            </button>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
