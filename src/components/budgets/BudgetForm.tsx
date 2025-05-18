
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ExpenseCategory } from '@/lib/types';

interface BudgetFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: {
    name: string;
    amount: string;
    category: ExpenseCategory;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    amount: string;
    category: ExpenseCategory;
  }>>;
  editBudgetId: number | null;
  setEditBudgetId: React.Dispatch<React.SetStateAction<number | null>>;
  categoryOptions: { value: string; label: string; color: string }[];
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  open,
  setOpen,
  formData,
  setFormData,
  editBudgetId,
  setEditBudgetId,
  categoryOptions
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: editBudgetId ? "Budget Updated" : "Budget Created",
      description: `${formData.name} budget has been ${editBudgetId ? "updated" : "created"} successfully.`,
    });
    
    // Reset form and close dialog
    setFormData({ 
      name: '', 
      amount: '', 
      category: formData.category 
    });
    setOpen(false);
    setEditBudgetId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editBudgetId ? "Edit Budget" : "Create New Budget"}</DialogTitle>
          <DialogDescription>
            {editBudgetId ? "Update your budget details below." : "Add a new budget to track your expenses."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Budget Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Groceries, Rent, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Monthly Amount</Label>
            <Input 
              id="amount" 
              value={formData.amount} 
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value as ExpenseCategory})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value.toString()} value={option.value.toString()}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => {
              setOpen(false);
              setFormData({ 
                name: '', 
                amount: '', 
                category: formData.category 
              });
              setEditBudgetId(null);
            }}>
              Cancel
            </Button>
            <Button type="submit">
              {editBudgetId ? "Update Budget" : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;
