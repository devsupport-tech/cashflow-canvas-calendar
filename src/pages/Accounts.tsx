
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, CreditCard, Building, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useAccountData } from '@/hooks/useAccountData';
import AccountForm from '@/components/accounts/AccountForm';

interface AccountCardProps {
  account: {
    id: string | number;
    name: string;
    type: string;
    balance: number;
    category: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  const accountTypeIcon = {
    checking: <CreditCard className="h-5 w-5 text-primary" />,
    savings: <CreditCard className="h-5 w-5 text-emerald-500" />,
    credit: <CreditCard className="h-5 w-5 text-bright-orange" />
  }[account.type];
  
  return (
    <Card className="card-hover animate-slide-up">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {accountTypeIcon}
            <div>
              <h3 className="font-medium">{account.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <p className={`font-semibold text-lg ${account.balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {account.balance >= 0 ? '$' : '-$'}{Math.abs(account.balance).toFixed(2)}
            </p>
            <div className="flex gap-1 items-center">
              <Badge className={`text-xs ${
                account.category === 'business' ? 'bg-ocean-blue text-white' : 
                'bg-bright-orange text-white'
              }`}>
                {account.category}
              </Badge>
              {onEdit && (
                <Button onClick={onEdit} title="Edit Account">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97l-9.193 9.194a2 2 0 0 1-.707.464l-3.23 1.076a.5.5 0 0 1-.635-.634l1.077-3.23a2 2 0 0 1 .463-.707l9.194-9.193Z"/></svg>
                </Button>
              )}
              {onDelete && (
                <Button onClick={onDelete} title="Delete Account">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M10 11v6M14 11v6M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"/></svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Accounts = () => {
  const { currentWorkspace } = useWorkspace();
  const [addAccountOpen, setAddAccountOpen] = React.useState(false);
  
  // Use backend accounts from Supabase
  const { accounts, isLoading, error, addAccount, updateAccount, deleteAccount } = useAccountData();
  const [editAccountId, setEditAccountId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    type: '',
    balance: '',
    category: currentWorkspace || '',
  });
  const [formLoading, setFormLoading] = React.useState(false);

  // Filter accounts based on selected workspace
  const filteredAccounts = accounts.filter(account => 
    account.category === currentWorkspace
  );

  // Calculate total balances
  const totalBalance = filteredAccounts.reduce((total, account) => total + (account.balance || 0), 0);

  // Handlers for add/edit/delete
  const handleAddAccount = () => {
    setEditAccountId(null);
    setFormData({ name: '', type: '', balance: '', category: currentWorkspace || '' });
    setAddAccountOpen(true);
  };

  const handleEditAccount = (account: AccountCardProps["account"]) => {
    setEditAccountId(account.id);
    setFormData({
      name: account.name || '',
      type: account.type || '',
      balance: account.balance?.toString() || '',
      category: account.category || '',
    });
    setAddAccountOpen(true);
  };

  const handleDeleteAccount = (account: AccountCardProps["account"]) => {
    if (window.confirm(`Are you sure you want to delete account "${account.name}"? This action cannot be undone.`)) {
      deleteAccount(account.id)
        .then(() => {
          window.alert('Account deleted successfully.');
        })
        .catch((err: any) => {
          window.alert(err.message || 'Failed to delete account.');
        });
    }
  };

  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editAccountId) {
        await updateAccount({ ...data, id: editAccountId, balance: parseFloat(data.balance) });
      } else {
        await addAccount({ ...data, balance: parseFloat(data.balance) });
      }
    } finally {
      setFormLoading(false);
    }
  };

  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your financial accounts and balances
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleAddAccount} isLoading={formLoading} disabled={formLoading}>
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
            <Button>
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* AccountForm Dialog */}
          <AccountForm
            open={addAccountOpen}
            setOpen={setAddAccountOpen}
            formData={formData}
            setFormData={setFormData}
            editAccountId={editAccountId}
            setEditAccountId={setEditAccountId}
            onSubmit={handleFormSubmit}
            loading={formLoading}
          />
        </div>
        
        <div className="mb-6">
          <Card className="bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  {currentWorkspace === 'personal' ? (
                    <User className="h-5 w-5 text-bright-orange" />
                  ) : (
                    <Building className="h-5 w-5 text-ocean-blue" />
                  )}
                  {currentWorkspace.charAt(0).toUpperCase() + currentWorkspace.slice(1)} Accounts
                </span>
              </CardTitle>
              <CardDescription>
                Total Balance: <span className={`font-semibold ${totalBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${Math.abs(totalBalance).toFixed(2)}
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            <TabsTrigger value="checking">Checking</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="credit">Credit Cards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-4">
            {/* Loading, error, and empty states for accounts list */}
            {isLoading ? (
              <div className="flex flex-col gap-4 py-8">
                {/* Premium animated skeletons matching AccountCard layout */}
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
                <div>Failed to load accounts.</div>
                <button className="mt-2 underline" onClick={() => window.location.reload()}>Retry</button>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <img src="/assets/piggy-bank.svg" alt="No accounts" className="w-24 h-24 mb-4 opacity-80" aria-hidden="true" />
                <div className="font-semibold text-lg mb-2">No accounts yet</div>
                <div className="text-muted-foreground mb-4">Start by adding your first account to manage your finances!</div>
                <Button onClick={handleAddAccount} autoFocus>
                  <Plus className="h-4 w-4" /> Add Account
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 animate-fade-in">
                {filteredAccounts.map(account => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={() => handleEditAccount(account)}
                    onDelete={() => handleDeleteAccount(account)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="checking" className="space-y-4 mt-4">
            {filteredAccounts
              .filter(account => account.type === 'checking')
              .map(account => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={() => handleEditAccount(account)}
                  onDelete={() => handleDeleteAccount(account)}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="savings" className="space-y-4 mt-4">
            {filteredAccounts
              .filter(account => account.type === 'savings')
              .map(account => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={() => handleEditAccount(account)}
                  onDelete={() => handleDeleteAccount(account)}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="credit" className="space-y-4 mt-4">
            {filteredAccounts
              .filter(account => account.type === 'credit')
              .map(account => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={() => handleEditAccount(account)}
                  onDelete={() => handleDeleteAccount(account)}
                />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Accounts;
