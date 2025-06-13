
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Monitor, Smartphone, Palette, Zap } from 'lucide-react';
import { MockupLayout1 } from '@/components/mockups/MockupLayout1';
import { MockupLayout2 } from '@/components/mockups/MockupLayout2';
import { MockupLayout3 } from '@/components/mockups/MockupLayout3';
import { MockupLayout4 } from '@/components/mockups/MockupLayout4';
import { useNavigate } from 'react-router-dom';

const LayoutMockups = () => {
  const [selectedMockup, setSelectedMockup] = useState<number | null>(null);
  const navigate = useNavigate();

  const mockups = [
    {
      id: 1,
      title: 'Clean Sidebar Layout',
      description: 'Classic sidebar navigation with card-based content and glass morphism effects',
      tags: ['Desktop First', 'Professional', 'Cards'],
      component: MockupLayout1,
      preview: '/api/placeholder/400/300'
    },
    {
      id: 2,
      title: 'Mobile-First Design',
      description: 'Bottom navigation with quick actions and mobile-optimized interface',
      tags: ['Mobile First', 'Touch Friendly', 'Modern'],
      component: MockupLayout2,
      preview: '/api/placeholder/400/300'
    },
    {
      id: 3,
      title: 'Analytics Dashboard',
      description: 'Data-heavy layout with emphasis on charts, metrics, and insights',
      tags: ['Analytics', 'Charts', 'Data Rich'],
      component: MockupLayout3,
      preview: '/api/placeholder/400/300'
    },
    {
      id: 4,
      title: 'SaaS Dark Theme',
      description: 'Modern dark theme with gradients, AI features, and premium feel',
      tags: ['Dark Theme', 'Premium', 'AI-Powered'],
      component: MockupLayout4,
      preview: '/api/placeholder/400/300'
    }
  ];

  const handleBackToOverview = () => {
    setSelectedMockup(null);
  };

  const handleImplement = (mockupId: number) => {
    // This would trigger the implementation of the selected mockup
    console.log(`Implementing mockup ${mockupId}`);
    // You could add logic here to actually replace the current layout
  };

  if (selectedMockup) {
    const mockup = mockups.find(m => m.id === selectedMockup);
    if (!mockup) return null;

    const MockupComponent = mockup.component;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Preview Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={handleBackToOverview} variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{mockup.title}</h1>
                <p className="text-sm text-gray-500">{mockup.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleImplement(mockup.id)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Zap className="h-4 w-4 mr-2" />
                Implement This Layout
              </Button>
            </div>
          </div>
        </div>

        {/* Full Preview */}
        <div className="relative">
          <MockupComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UI/UX Layout Mockups
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from these modern, responsive layouts designed to improve your FlowFinance experience. 
            Each layout offers unique advantages for different use cases.
          </p>
        </div>

        {/* Mockup Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {mockups.map((mockup) => (
            <Card key={mockup.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="text-xl font-semibold">{mockup.title}</CardTitle>
                  <div className="flex gap-1">
                    {mockup.id === 1 && <Monitor className="h-5 w-5 text-blue-500" />}
                    {mockup.id === 2 && <Smartphone className="h-5 w-5 text-green-500" />}
                    {mockup.id === 3 && <Palette className="h-5 w-5 text-purple-500" />}
                    {mockup.id === 4 && <Zap className="h-5 w-5 text-violet-500" />}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{mockup.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {mockup.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {/* Preview Thumbnail */}
                <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-video group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {mockup.id === 1 && (
                        <div className="w-24 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-2 opacity-70"></div>
                      )}
                      {mockup.id === 2 && (
                        <div className="w-16 h-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg mx-auto mb-2 opacity-70"></div>
                      )}
                      {mockup.id === 3 && (
                        <div className="w-24 h-16 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg mx-auto mb-2 opacity-70"></div>
                      )}
                      {mockup.id === 4 && (
                        <div className="w-24 h-16 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg mx-auto mb-2 opacity-70"></div>
                      )}
                      <div className="text-xs text-gray-500">Click to preview</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => setSelectedMockup(mockup.id)}
                    variant="outline" 
                    className="flex-1"
                  >
                    Preview Full Layout
                  </Button>
                  <Button 
                    onClick={() => handleImplement(mockup.id)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Implement
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="bg-white shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Layout Features Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Sidebar Layout</th>
                    <th className="text-center py-3 px-4">Mobile-First</th>
                    <th className="text-center py-3 px-4">Analytics</th>
                    <th className="text-center py-3 px-4">SaaS Dark</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Mobile Responsive', '✓', '✓✓', '✓', '✓'],
                    ['Dark Mode', '✓', '○', '○', '✓✓'],
                    ['Data Visualization', '✓', '○', '✓✓', '✓✓'],
                    ['Touch Friendly', '○', '✓✓', '✓', '✓'],
                    ['Professional Look', '✓✓', '✓', '✓✓', '✓✓'],
                    ['AI Features', '○', '○', '✓', '✓✓']
                  ].map(([feature, ...ratings], i) => (
                    <tr key={i} className="border-b">
                      <td className="py-3 px-4 font-medium">{feature}</td>
                      {ratings.map((rating, j) => (
                        <td key={j} className="text-center py-3 px-4">
                          <span className={
                            rating === '✓✓' ? 'text-green-600 font-bold' :
                            rating === '✓' ? 'text-green-500' :
                            'text-gray-400'
                          }>
                            {rating}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LayoutMockups;
