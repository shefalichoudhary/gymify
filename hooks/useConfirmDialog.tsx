import { useState } from "react";
import ConfirmDialog from "../components/confirmDialog";

export function useConfirmDialog() {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<{
    message: string;
    confirmText: string;
    cancelText: string;
    destructive: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    destructive: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showDialog = (opts: Partial<typeof options>) => {
    setOptions({
      message: opts.message ?? "", // <-- ensures message is always string
      confirmText: opts.confirmText ?? "Confirm",
      cancelText: opts.cancelText ?? "Cancel",
      destructive: opts.destructive ?? false,
      onConfirm: () => {
        opts.onConfirm?.();
        setVisible(false); // hide dialog
      },
      onCancel: () => {
        opts.onCancel?.();
        setVisible(false); // hide dialog
      },
    });
    setVisible(true);
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      visible={visible}
      message={options.message} // now always a string
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      destructive={options.destructive}
      onConfirm={options.onConfirm}
      onCancel={options.onCancel}
    />
  );

  return { showDialog, ConfirmDialogComponent, setVisible };
}
