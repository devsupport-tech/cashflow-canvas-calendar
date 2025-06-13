
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  CreditCard,
  PieChart,
  Settings,
  Bell,
  Search,
  Plus,
  Filter
} from 'lucide-react';

// Mockup 1: Sidebar + Top Header with Cards Grid
export const MockupLayout1: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FlowFinance
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm"><Search className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm"><Bell className="h-4 w-4" /></Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/70 backdrop-blur-sm border-r border-gray-200/50 min-h-screen p-4">
          <nav className="space-y-2">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', active: true },
              { icon: Wallet, label: 'Accounts', badge: '4' },
              { icon: TrendingUp, label: 'Analytics' },
              { icon: CreditCard, label: 'Transactions' },
              { icon: PieChart, label: 'Budgets' },
              { icon: Settings, label: 'Settings' }
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                item.active ? 'bg-blue-100 text-blue-700 shadow-sm' : 'hover:bg-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && <Badge variant="secondary" className="text-xs">{item.badge}</Badge>}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filter</Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />Add Transaction
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Total Balance', value: '$24,850.00', change: '+12.5%', positive: true },
                { title: 'Monthly Income', value: '$8,400.00', change: '+5.2%', positive: true },
                { title: 'Monthly Expenses', value: '$3,200.00', change: '-2.1%', positive: false },
                { title: 'Savings Goal', value: '68%', change: '+8.3%', positive: true }
              ].map((stat, i) => (
                <Card key={i} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className={`text-sm mt-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chart and Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Spending Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                          <div>
                            <div className="font-medium">Transaction {i}</div>
                            <div className="text-sm text-gray-500">Today</div>
                          </div>
                        </div>
                        <div className="font-semibold text-gray-900">-$45.00</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
