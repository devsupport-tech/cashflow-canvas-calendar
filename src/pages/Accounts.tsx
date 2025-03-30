
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, CreditCard, Building, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const Accounts = () => {
  const { currentWorkspace } = useWorkspace();
  const [addAccountOpen, setAddAccountOpen] = React.useState(false);
  
  const accounts = [
    { id: 1, name: 'Main Checking', type: 'checking', balance: 5463.23, category: 'personal' },
    { id: 2, name: 'Savings', type: 'savings', balance: 12750.42, category: 'personal' },
    { id: 3, name: 'Business Checking', type: 'checking', balance: 8425.19, category: 'business' },
    { id: 4, name: 'Tax Savings', type: 'savings', balance: 4260.87, category: 'business' },
    { id: 5, name: 'Credit Card', type: 'credit', balance: -1240.56, category: 'personal' },
    { id: 6, name: 'Business Credit Card', type: 'credit', balance: -3560.42, category: 'business' },
  ];
  
  // Filter accounts based on selected workspace
  const filteredAccounts = accounts.filter(account => 
    account.category === currentWorkspace
  );
  
  // Calculate total balances
  const totalBalance = filteredAccounts.reduce((total, account) => total + account.balance, 0);
  
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
            <Dialog open={addAccountOpen} onOpenChange={setAddAccountOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Account
                </Button>
              </DialogTrigger>
              {/* Account form will go here in a future update */}
            </Dialog>
            
            <Button variant="outline" className="gap-1">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
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
            {filteredAccounts.map(account => (
              <AccountCard key={account.id} account={account} />
            ))}
          </TabsContent>
          
          <TabsContent value="checking" className="space-y-4 mt-4">
            {filteredAccounts
              .filter(account => account.type === 'checking')
              .map(account => (
                <AccountCard key={account.id} account={account} />
              ))}
          </TabsContent>
          
          <TabsContent value="savings" className="space-y-4 mt-4">
            {filteredAccounts
              .filter(account => account.type === 'savings')
              .map(account => (
                <AccountCard key={account.id} account={account} />
              ))}
          </TabsContent>
          
          <TabsContent value="credit" className="space-y-4 mt-4">
            {filteredAccounts
              .filter(account => account.type === 'credit')
              .map(account => (
                <AccountCard key={account.id} account={account} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

interface AccountCardProps {
  account: {
    id: number;
    name: string;
    type: string;
    balance: number;
    category: string;
  };
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
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
          <div className="text-right">
            <p className={`font-semibold text-lg ${account.balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {account.balance >= 0 ? '$' : '-$'}{Math.abs(account.balance).toFixed(2)}
            </p>
            <Badge variant="outline" className={`text-xs ${
              account.category === 'business' ? 'bg-ocean-blue text-white' : 
              'bg-bright-orange text-white'
            }`}>
              {account.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Accounts;
