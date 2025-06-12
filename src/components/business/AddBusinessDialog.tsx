
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { BUSINESS_COLORS } from './businessConstants';

interface AddBusinessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newBusinessName: string;
  onBusinessNameChange: (name: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  onAddBusiness: () => void;
}

export const AddBusinessDialog = ({
  open,
  onOpenChange,
  newBusinessName,
  onBusinessNameChange,
  selectedColor,
  onColorChange,
  onAddBusiness
}: AddBusinessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-labelledby="add-business-dialog-title"
        aria-describedby="add-business-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="add-business-dialog-title">Add New Business</DialogTitle>
          <DialogDescription id="add-business-dialog-description">
            Create a new business profile to track business finances separately.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input 
              id="business-name"
              value={newBusinessName}
              onChange={(e) => onBusinessNameChange(e.target.value)}
              placeholder="My Business"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Business Color</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Select business color"
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${selectedColor} mr-2`} aria-hidden="true" />
                    {BUSINESS_COLORS.find(c => c.value === selectedColor)?.name || 'Select a color'}
                  </div>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {BUSINESS_COLORS.map((color) => (
                  <DropdownMenuItem
                    key={color.value}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onColorChange(color.value)}
                  >
                    <div className={`w-4 h-4 rounded-full ${color.value}`} aria-hidden="true" />
                    {color.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddBusiness}>
            Add Business
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
