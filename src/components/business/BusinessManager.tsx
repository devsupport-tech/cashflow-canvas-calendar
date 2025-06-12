
import React, { useState } from 'react';
import { useBusinessData } from '@/hooks/useBusinessData';
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
  const { businesses, isLoading, error, addBusiness, deleteBusiness } = useBusinessData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [selectedColor, setSelectedColor] = useState(BUSINESS_COLORS[0].value);

  const handleAddBusiness = async () => {
    if (!newBusinessName.trim()) {
      toast({
        title: "Business name required",
        description: "Please enter a name for your business.",
        variant: "destructive"
      });
      return;
    }
    try {
      await addBusiness({ name: newBusinessName.trim(), color: selectedColor });
      toast({
        title: "Business created",
        description: `${newBusinessName.trim()} has been added to your businesses.`
      });
      setNewBusinessName('');
      setSelectedColor(BUSINESS_COLORS[0].value);
      setDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Failed to add business",
        description: err.message || 'Could not add business.',
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setBusinessToDelete(id);
    setConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (businessToDelete) {
      try {
        await deleteBusiness(businessToDelete);
        toast({
          title: "Business deleted",
          description: "The business has been removed."
        });
      } catch (err: any) {
        toast({
          title: "Failed to delete business",
          description: err.message || 'Could not delete business.',
          variant: "destructive"
        });
      }
      setConfirmDeleteDialogOpen(false);
      setBusinessToDelete(null);
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
      
      {isLoading ? (
        <div className="flex flex-col gap-4 py-8">
          {/* Premium animated skeletons for business cards */}
          {[1,2,3].map(i => (
            <div key={i} className="w-full animate-fade-in">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-muted to-secondary/80 rounded-lg animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-muted-foreground/20" />
                  <div className="h-3 w-1/4 rounded bg-muted-foreground/10" />
                </div>
                <div className="h-6 w-16 rounded bg-muted-foreground/20" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8 text-destructive animate-fade-in">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-2 animate-bounce">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
          <div>Failed to load businesses.</div>
          <button className="mt-2 underline" onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : businesses.length === 0 ? (
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
