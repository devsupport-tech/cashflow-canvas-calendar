
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, CreditCard, Building, DollarSign } from 'lucide-react';
import { useAccountData } from '@/hooks/useAccountData';

interface AccountCardProps {
  title: string;
  balance: number;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const AccountCard: React.FC<AccountCardProps> = ({ title, balance, icon, color, index }) => {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(balance);
  
  return (
    <Card className="card-hover glass-card transform transition-transform duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className={`text-xl font-medium ${balance < 0 ? 'text-destructive' : ''}`}>{formattedBalance}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export const AccountsSummary = () => {
  const { accounts, isLoading, error } = useAccountData();

  // Map account type/category to icon and color
  const getAccountIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cash':
        return <DollarSign className="h-5 w-5 text-white" />;
      case 'checking':
        return <Wallet className="h-5 w-5 text-white" />;
      case 'credit card':
      case 'credit':
        return <CreditCard className="h-5 w-5 text-white" />;
      case 'business':
        return <Building className="h-5 w-5 text-white" />;
      default:
        return <Wallet className="h-5 w-5 text-white" />;
    }
  };
  const getAccountColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cash':
        return 'bg-gradient-to-r from-green-400 to-emerald-500';
      case 'checking':
        return 'bg-gradient-to-r from-ocean-blue to-blue-600';
      case 'credit card':
      case 'credit':
        return 'bg-gradient-to-r from-red-400 to-red-600';
      case 'business':
        return 'bg-gradient-to-r from-vivid-purple to-purple-700';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="w-full animate-fade-in">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted to-secondary/80 rounded-lg animate-pulse">
              <div className="flex-1">
                <div className="h-4 w-1/3 rounded bg-muted-foreground/20 mb-2" />
                <div className="h-6 w-1/2 rounded bg-muted-foreground/10" />
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted-foreground/20" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-destructive animate-fade-in">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="mb-2 animate-bounce">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
        <div>Failed to load accounts.</div>
        <button className="mt-2 underline" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
        <img src="/assets/dashboard-empty.svg" alt="No accounts" className="w-16 h-16 mb-3 opacity-80" aria-hidden="true" />
        <div className="font-semibold text-base mb-1">No accounts found</div>
        <div className="text-muted-foreground mb-2">Add an account to get started tracking your finances.</div>
        <a href="/accounts" tabIndex={0} className="underline text-primary">Go to Accounts</a>
      </div>
    );
  }

  return (
    <>
      {accounts.map((account, index) => (
        <div key={account.id || index} className="animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
          <AccountCard
            title={account.name} // Changed from account.title || account.name to just account.name
            balance={Number(account.balance) || 0}
            icon={getAccountIcon(account.type || account.category)}
            color={getAccountColor(account.type || account.category)}
            index={index}
          />
        </div>
      ))}
    </>
  );
};
