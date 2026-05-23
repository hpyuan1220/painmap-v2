/**
 * WorksheetStub — placeholder block for cards whose UI is being built.
 * Used by Phase 4 Wave 1 stub routes; replaced by real UI in Wave 2.
 */

export function WorksheetStub({
  cardLabel,
  fieldPath,
}: {
  cardLabel: string;
  fieldPath: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border-hairline bg-canvas-raised p-6 text-[14px] text-text-secondary leading-relaxed">
      <p className="font-medium text-text-primary mb-2">{cardLabel} — UI 正在搭建中</p>
      <p>
        這張卡片的完整輸入介面會在下一波交付加入。schema 欄位（
        <code className="text-text-primary">{fieldPath}</code>
        ）已經就緒，可以從開發者工具直接寫入測試資料。
      </p>
    </div>
  );
}
