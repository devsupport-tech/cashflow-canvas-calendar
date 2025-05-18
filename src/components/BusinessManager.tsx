import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Business } from '@/lib/types';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Briefcase, Plus, Trash2, ChevronDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BUSINESS_COLORS = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Amber', value: 'bg-amber-500' },
  { name: 'Teal', value: 'bg-teal-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Indigo', value: 'bg-indigo-500' }
];

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
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <Briefcase className="h-10 w-10 mx-auto text-muted-foreground" />
          <h3 className="mt-2 font-medium">No businesses yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first business to organize your finances separately from personal expenses.
          </p>
          <Button 
            onClick={() => setDialogOpen(true)} 
            variant="outline" 
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Business
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {businesses.map((business) => (
            <div 
              key={business.id}
              className="border rounded-lg p-4 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full ${business.color}`} />
                <h3 className="font-medium">{business.name}</h3>
              </div>
              
              <div className="flex justify-end mt-2 gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteClick(business.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Business Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Business</DialogTitle>
            <DialogDescription>
              Create a new business profile to track business finances separately.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input 
                id="business-name"
                value={newBusinessName}
                onChange={(e) => setNewBusinessName(e.target.value)}
                placeholder="My Business"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Business Color</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${selectedColor} mr-2`} />
                      {BUSINESS_COLORS.find(c => c.value === selectedColor)?.name || 'Select a color'}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {BUSINESS_COLORS.map((color) => (
                    <DropdownMenuItem
                      key={color.value}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setSelectedColor(color.value)}
                    >
                      <div className={`w-4 h-4 rounded-full ${color.value}`} />
                      {color.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBusiness}>
              Add Business
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this business? This action cannot be undone.
              All associated budgets and transactions will be moved to the 'All' category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
