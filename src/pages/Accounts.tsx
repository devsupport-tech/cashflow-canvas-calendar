
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAccountData } from '@/hooks/useAccountData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AccountForm } from '@/components/accounts/AccountForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Accounts = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  const { accounts, isLoading, error, addAccount, updateAccount, deleteAccount } = useAccountData();

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      await deleteAccount(id);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your financial accounts
            </p>
          </div>
          
          <Dialog open={formOpen} onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditingAccount(null);
          }}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <AccountForm 
              onClose={() => {
                setFormOpen(false);
                setEditingAccount(null);
              }}
              initialAccount={editingAccount}
            />
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-6 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading accounts. Please try again.
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No accounts yet</h3>
            <p className="text-muted-foreground mb-4">Add your first account to get started</p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Account
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <Card key={account.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{account.name}</span>
                    <Badge variant="outline">{account.type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${account.balance.toFixed(2)}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(account)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(account.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Accounts;
