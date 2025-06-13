
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  TrendingUp, 
  Wallet, 
  CreditCard,
  Calendar,
  Settings,
  Menu,
  User,
  ChevronRight
} from 'lucide-react';

// Mockup 2: Mobile-First Bottom Navigation + Top Cards
export const MockupLayout2: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="sm"><Menu className="h-5 w-5" /></Button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-r from-emerald-500 to-blue-500"></div>
            <span className="font-bold text-lg">FlowFinance</span>
          </div>
          <Button variant="ghost" size="sm"><User className="h-5 w-5" /></Button>
        </div>
      </header>

      {/* Quick Stats Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-4">
        <div className="text-center">
          <div className="text-sm opacity-90">Total Balance</div>
          <div className="text-3xl font-bold">$24,850.00</div>
          <div className="text-sm mt-1 opacity-90">+$1,250 this month</div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: Wallet, label: 'Add Income', color: 'from-green-500 to-emerald-500' },
            { icon: CreditCard, label: 'Add Expense', color: 'from-red-500 to-pink-500' },
            { icon: TrendingUp, label: 'View Analytics', color: 'from-blue-500 to-purple-500' },
            { icon: Calendar, label: 'Schedule', color: 'from-orange-500 to-yellow-500' }
          ].map((action, i) => (
            <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="font-medium text-gray-900">{action.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accounts Overview */}
        <Card className="mb-6 border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">My Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Checking Account', balance: '$8,450.00', type: 'checking' },
              { name: 'Savings Account', balance: '$15,200.00', type: 'savings' },
              { name: 'Credit Card', balance: '-$1,200.00', type: 'credit' }
            ].map((account, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full ${
                    account.type === 'checking' ? 'bg-blue-100 text-blue-600' :
                    account.type === 'savings' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  } flex items-center justify-center`}>
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{account.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    account.balance.startsWith('-') ? 'text-red-600' : 'text-gray-900'
                  }`}>{account.balance}</div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { desc: 'Grocery Store', amount: '-$84.50', time: '2 hours ago', category: 'Food' },
                { desc: 'Salary Deposit', amount: '+$3,200.00', time: 'Yesterday', category: 'Income' },
                { desc: 'Netflix Subscription', amount: '-$15.99', time: '2 days ago', category: 'Entertainment' }
              ].map((transaction, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{transaction.desc}</div>
                    <div className="text-sm text-gray-500">{transaction.time}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>{transaction.amount}</div>
                    <Badge variant="secondary" className="text-xs">{transaction.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {[
            { icon: Home, label: 'Home', active: true },
            { icon: TrendingUp, label: 'Analytics' },
            { icon: Wallet, label: 'Accounts' },
            { icon: Calendar, label: 'Calendar' },
            { icon: Settings, label: 'Settings' }
          ].map((item, i) => (
            <div key={i} className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              item.active ? 'text-emerald-600' : 'text-gray-500'
            }`}>
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
