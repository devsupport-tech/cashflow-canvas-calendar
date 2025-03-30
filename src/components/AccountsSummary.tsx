
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, CreditCard, Building, DollarSign } from 'lucide-react';

interface AccountCardProps {
  title: string;
  balance: number;
  icon: React.ReactNode;
  color: string;
}

const AccountCard: React.FC<AccountCardProps> = ({ title, balance, icon, color }) => {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(balance);
  
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-xl font-medium">{formattedBalance}</p>
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
      color: 'bg-green-500'
    },
    {
      title: 'Checking',
      balance: 8392.12,
      icon: <Wallet className="h-5 w-5 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Credit Card',
      balance: -1240.33,
      icon: <CreditCard className="h-5 w-5 text-white" />,
      color: 'bg-red-500'
    },
    {
      title: 'Business',
      balance: 24680.45,
      icon: <Building className="h-5 w-5 text-white" />,
      color: 'bg-purple-500'
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
        />
      ))}
    </>
  );
};
