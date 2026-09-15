import * as React from "react"
import { Button } from "./button"
import { Dialog } from "./dialog"

const AlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} description={description}>
      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button 
          variant={variant} 
          onClick={onConfirm} 
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Dialog>
  );
};

export { AlertDialog }
