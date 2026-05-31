import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closeConfirm, useConfirmStore } from "../../../lib/confirm";

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
            onClick={() => closeConfirm(true)}
            style={{
              backgroundColor: options.confirmColor ?? "#ef4444",
            }}
            className="text-white"
          >
            {options.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
