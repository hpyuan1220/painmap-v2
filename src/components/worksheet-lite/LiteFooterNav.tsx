import { Button } from "@/components/ui/button";

type Props = {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  blockedMessage?: string | null;
};

export function LiteFooterNav({
  onBack,
  onNext,
  nextLabel = "下一張卡",
  backLabel = "上一張",
  blockedMessage,
}: Props) {
  return (
    <div className="mt-10 border-t border-border-hairline pt-6 space-y-4">
      {blockedMessage && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-[14px] text-text-primary">
          {blockedMessage}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            {backLabel}
          </Button>
        )}
        <Button type="button" onClick={onNext}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
