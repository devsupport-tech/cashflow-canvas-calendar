
import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onConfirmDelete
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="delete-confirm-dialog-title">Confirm Deletion</DialogTitle>
          <DialogDescription id="delete-confirm-dialog-description">
            Are you sure you want to delete this business? This action cannot be undone.
            All associated budgets and transactions will be moved to the 'All' category.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="focus-visible:ring-2 focus-visible:ring-primary"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            className="focus-visible:ring-2 focus-visible:ring-destructive"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
