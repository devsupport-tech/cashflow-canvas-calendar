
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

// Mockup 3: Dashboard-First Analytics Layout
export const MockupLayout3: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Compact Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600"></div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  FlowFinance
                </span>
              </div>
              <nav className="hidden md:flex items-center gap-1">
                {['Dashboard', 'Analytics', 'Accounts', 'Transactions', 'Budgets'].map((item, i) => (
                  <Button key={i} variant={i === 0 ? "default" : "ghost"} size="sm" className={
                    i === 0 ? "bg-gradient-to-r from-indigo-600 to-cyan-600" : ""
                  }>
                    {item}
                  </Button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filter</Button>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Stats */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Overview</h1>
          <p className="text-gray-600 mb-6">Track your wealth and spending patterns</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { 
                title: 'Net Worth', 
                value: '$84,250.00', 
                change: '+$2,450', 
                period: 'this month',
                icon: TrendingUp,
                color: 'from-green-500 to-emerald-500'
              },
              { 
                title: 'Monthly Income', 
                value: '$8,400.00', 
                change: '+5.2%', 
                period: 'vs last month',
                icon: ArrowUpRight,
                color: 'from-blue-500 to-indigo-500'
              },
              { 
                title: 'Monthly Spending', 
                value: '$3,280.00', 
                change: '-2.1%', 
                period: 'vs last month',
                icon: ArrowDownRight,
                color: 'from-purple-500 to-pink-500'
              }
            ].map((stat, i) => (
              <Card key={i} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-6 text-center">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${stat.color} mx-auto mb-4 flex items-center justify-center`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-1">{stat.title}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500">
                    <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span> {stat.period}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500">Interactive Chart Area</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Spending Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500">Category Breakdown</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Goals Progress */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Savings Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Emergency Fund', progress: 75, target: '$10,000' },
                { name: 'Vacation', progress: 45, target: '$5,000' },
                { name: 'New Car', progress: 30, target: '$25,000' }
              ].map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-gray-500">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">Target: {goal.target}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: 'Add Transaction', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
                { action: 'Schedule Payment', icon: Calendar, color: 'from-blue-500 to-indigo-500' },
                { action: 'View Reports', icon: BarChart3, color: 'from-purple-500 to-pink-500' }
              ].map((item, i) => (
                <Button key={i} variant="outline" className="w-full justify-start h-12">
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mr-3`}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  {item.action}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Alerts & Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: 'Budget Alert', message: 'Dining out budget 80% used', color: 'orange' },
                { type: 'Goal Progress', message: 'Emergency fund goal almost reached!', color: 'green' },
                { type: 'Bill Reminder', message: 'Credit card payment due in 3 days', color: 'blue' }
              ].map((alert, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      alert.color === 'orange' ? 'bg-orange-500' :
                      alert.color === 'green' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{alert.type}</div>
                      <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
