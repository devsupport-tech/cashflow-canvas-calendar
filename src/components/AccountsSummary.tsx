
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, CreditCard, Building, DollarSign } from 'lucide-react';

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
  const accounts = [
    {
      title: 'Cash',
      balance: 12450.55,
      icon: <DollarSign className="h-5 w-5 text-white" />,
      color: 'bg-gradient-to-r from-green-400 to-emerald-500'
    },
    {
      title: 'Checking',
      balance: 8392.12,
      icon: <Wallet className="h-5 w-5 text-white" />,
      color: 'bg-gradient-to-r from-ocean-blue to-blue-600'
    },
    {
      title: 'Credit Card',
      balance: -1240.33,
      icon: <CreditCard className="h-5 w-5 text-white" />,
      color: 'bg-gradient-to-r from-red-400 to-red-600'
    },
    {
      title: 'Business',
      balance: 24680.45,
      icon: <Building className="h-5 w-5 text-white" />,
      color: 'bg-gradient-to-r from-vivid-purple to-purple-700'
    }
  ];
  
  return (
    <>
      {accounts.map((account, index) => (
        <AccountCard 
          key={index}
          title={account.title}
          balance={account.balance}
          icon={account.icon}
          color={account.color}
          index={index}
        />
      ))}
    </>
  );
};
