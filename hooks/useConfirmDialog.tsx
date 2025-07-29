// hooks/useConfirmDialog.ts

import { useState } from "react";
import ConfirmDialog from "@/components/confirmDialog";

export function useConfirmDialog() {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState({
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    destructive: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showDialog = (opts: Partial<typeof options>) => {
    setOptions({
      ...options,
      ...opts,
      onConfirm: () => {
        opts.onConfirm?.();
        setVisible(false);
      },
      onCancel: () => {
        opts.onCancel?.();
        setVisible(false);
      },
    });
    setVisible(true);
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog visible={visible} {...options} onConfirm={options.onConfirm} onCancel={options.onCancel} />
  );

  return { showDialog, ConfirmDialogComponent };
}
