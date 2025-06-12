import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

export interface AccountFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: {
    name: string;
    type: string;
    balance: string;
    category: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    type: string;
    balance: string;
    category: string;
  }>>;
  editAccountId: string | null;
  setEditAccountId: React.Dispatch<React.SetStateAction<string | null>>;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  open,
  setOpen,
  formData,
  setFormData,
  editAccountId,
  setEditAccountId,
  onSubmit,
  loading
}) => {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSubmitting(loading);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.balance || !formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(formData);
      toast({
        title: editAccountId ? 'Account Updated' : 'Account Created',
        description: `${formData.name} has been ${editAccountId ? 'updated' : 'created'} successfully.`
      });
      setOpen(false);
      setEditAccountId(null);
      setFormData({ name: '', type: '', balance: '', category: '' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save account.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-labelledby="account-form-dialog-title"
        aria-describedby="account-form-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="account-form-dialog-title">{editAccountId ? 'Edit Account' : 'Add Account'}</DialogTitle>
          <DialogDescription id="account-form-dialog-description">
            {editAccountId ? 'Update your account details below.' : 'Add a new account to your finances.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="name">Account Name</label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Main Checking"
              aria-required="true"
              required
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="type">Account Type</label>
            <Select
              value={formData.type}
              onValueChange={value => setFormData({ ...formData, type: value })}
              required
            >
              <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary" aria-required="true">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="balance">Balance</label>
            <Input
              id="balance"
              type="number"
              value={formData.balance}
              onChange={e => setFormData({ ...formData, balance: e.target.value })}
              placeholder="0.00"
              min="0"
              step="0.01"
              aria-required="true"
              required
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category">Category</label>
            <Select
              value={formData.category}
              onValueChange={value => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary" aria-required="true">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setOpen(false);
                setEditAccountId(null);
                setFormData({ name: '', type: '', balance: '', category: '' });
              }}
              className="focus-visible:ring-2 focus-visible:ring-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="focus-visible:ring-2 focus-visible:ring-primary"
            >
              {editAccountId ? 'Update Account' : 'Add Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountForm;
