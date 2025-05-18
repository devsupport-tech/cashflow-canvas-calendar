
import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Business } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { BUSINESS_COLORS } from './businessConstants';
import { EmptyBusinessState } from './EmptyBusinessState';
import { BusinessGrid } from './BusinessGrid';
import { AddBusinessDialog } from './AddBusinessDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export const BusinessManager = () => {
  const { businesses, addBusiness, deleteBusiness } = useWorkspace();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [selectedColor, setSelectedColor] = useState(BUSINESS_COLORS[0].value);

  const handleAddBusiness = () => {
    if (!newBusinessName.trim()) {
      toast({
        title: "Business name required",
        description: "Please enter a name for your business.",
        variant: "destructive"
      });
      return;
    }

    addBusiness(newBusinessName.trim(), selectedColor);
    setNewBusinessName('');
    setSelectedColor(BUSINESS_COLORS[0].value);
    setDialogOpen(false);
    
    toast({
      title: "Business created",
      description: `${newBusinessName.trim()} has been added to your businesses.`
    });
  };

  const handleDeleteClick = (id: string) => {
    setBusinessToDelete(id);
    setConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (businessToDelete) {
      deleteBusiness(businessToDelete);
      setConfirmDeleteDialogOpen(false);
      setBusinessToDelete(null);
      
      toast({
        title: "Business deleted",
        description: "The business has been removed."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">My Businesses</h2>
        <Button 
          onClick={() => setDialogOpen(true)} 
          variant="outline" 
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Business
        </Button>
      </div>
      
      {businesses.length === 0 ? (
        <EmptyBusinessState onAddClick={() => setDialogOpen(true)} />
      ) : (
        <BusinessGrid 
          businesses={businesses}
          onDeleteClick={handleDeleteClick}
        />
      )}

      <AddBusinessDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        newBusinessName={newBusinessName}
        onBusinessNameChange={setNewBusinessName}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        onAddBusiness={handleAddBusiness}
      />

      <DeleteConfirmDialog
        open={confirmDeleteDialogOpen}
        onOpenChange={setConfirmDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};
