import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closeConfirm, useConfirmStore } from "@/lib/confirm";

export default function ConfirmModal() {
  const { isOpen, options } = useConfirmStore();

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && closeConfirm(false)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{options.title}</DialogTitle>
          <DialogDescription>{options.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => closeConfirm(false)}>
            {options.cancelText}
          </Button>
          <Button
            variant="danger-secondary"
            style={
              options.confirmColor
                ? { backgroundColor: options.confirmColor }
                : undefined
            }
            onClick={() => closeConfirm(true)}
          >
            {options.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
