import { create } from "zustand";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
}

export const useConfirmStore = create<ConfirmState>(() => ({
  isOpen: false,
  options: { title: "", message: "" },
  resolve: null,
}));

export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    useConfirmStore.setState({
      isOpen: true,
      options: {
        confirmText: "Confirm",
        cancelText: "Cancel",
        ...options,
      },
      resolve,
    });
  });
}

export function closeConfirm(result: boolean) {
  const state = useConfirmStore.getState();
  state.resolve?.(result);
  useConfirmStore.setState({ isOpen: false, resolve: null });
}
