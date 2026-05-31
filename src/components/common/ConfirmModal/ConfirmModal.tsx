import { useEffect, useRef } from "react";
import { closeConfirm, useConfirmStore } from "../../../lib/confirm";

export default function ConfirmModal() {
  const { isOpen, options } = useConfirmStore();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeConfirm(false);
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={() => closeConfirm(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative mx-4 w-full max-w-sm animate-scale-in rounded-2xl border border-border/50 bg-dark-surface-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-dark-text-primary">
          {options.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-dark-text-muted">
          {options.message}
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => closeConfirm(false)}
            className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-dark-text-muted transition-colors hover:bg-dark-surface-alt"
          >
            {options.cancelText}
          </button>
          <button
            type="button"
            ref={confirmRef}
            onClick={() => closeConfirm(true)}
            className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{
              backgroundColor: options.confirmColor ?? "#ef4444",
            }}
          >
            {options.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
