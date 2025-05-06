
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isEditing?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel,
  isEditing = false
}) => {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? 'Update' : 'Save'}
      </Button>
    </div>
  );
};
