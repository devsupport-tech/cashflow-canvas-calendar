
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Globe,
  ArrowRight,
  Play,
  Star,
  Users,
  Target,
  BarChart
} from 'lucide-react';

// Mockup 4: Modern SaaS-Style Dashboard
export const MockupLayout4: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <nav className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500"></div>
              <span className="text-xl font-bold">FlowFinance</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                Pro Plan
              </Badge>
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                <Users className="h-4 w-4 mr-2" />
                Team
              </Button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"></div>
            </div>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Your Financial Command Center
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time insights, automated tracking, and intelligent recommendations for your money.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Portfolio Value', value: '$127,450', change: '+8.2%', icon: TrendingUp },
              { label: 'Monthly Savings', value: '$4,280', change: '+12%', icon: Target },
              { label: 'Active Goals', value: '7', change: '+2', icon: Star },
              { label: 'Credit Score', value: '785', change: '+12', icon: Shield }
            ].map((metric, i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="h-5 w-5 text-violet-400" />
                    <span className="text-xs text-green-400">{metric.change}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
              <Zap className="h-4 w-4 mr-2" />
              Quick Action
            </Button>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
              <Globe className="h-4 w-4 mr-2" />
              Markets
            </Button>
          </div>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2 bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Portfolio Performance</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-500/30 text-green-400">
                    +15.2% YTD
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-violet-900/20 to-cyan-900/20 rounded-xl flex items-center justify-center border border-gray-700/30">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-violet-400 mx-auto mb-4" />
                  <div className="text-gray-400">Interactive Portfolio Chart</div>
                  <div className="text-sm text-gray-500 mt-2">Real-time market data</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-violet-900/40 to-cyan-900/40 border-violet-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-violet-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-black/20 rounded-lg border border-violet-500/20">
                  <div className="text-sm font-medium text-violet-300 mb-1">Smart Tip</div>
                  <div className="text-sm text-gray-300">Consider increasing your tech allocation by 5% based on market trends.</div>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-cyan-500/20">
                  <div className="text-sm font-medium text-cyan-300 mb-1">Opportunity</div>
                  <div className="text-sm text-gray-300">Your emergency fund target is within reach. Automate $200 more monthly.</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { desc: 'Automated Investment', amount: '+$500.00', time: '9:30 AM', type: 'investment' },
                  { desc: 'Dividend Payment', amount: '+$48.50', time: '11:15 AM', type: 'income' },
                  { desc: 'Subscription Charge', amount: '-$29.99', time: '2:45 PM', type: 'expense' }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        activity.type === 'investment' ? 'bg-violet-500' :
                        activity.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="text-sm font-medium">{activity.desc}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      activity.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {activity.amount}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Goals Progress */}
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Goals Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'House Down Payment', progress: 85, color: 'violet' },
                  { name: 'Retirement Fund', progress: 42, color: 'cyan' },
                  { name: 'Education Fund', progress: 67, color: 'green' }
                ].map((goal, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{goal.name}</span>
                      <span className="text-gray-400">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          goal.color === 'violet' ? 'bg-gradient-to-r from-violet-500 to-violet-400' :
                          goal.color === 'cyan' ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' :
                          'bg-gradient-to-r from-green-500 to-green-400'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
