
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { financeSummary } from '@/lib/dummyData';

const Analytics = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Financial insights and trends
            </p>
          </div>
        </div>
        
        <AnalyticsDashboard summary={financeSummary} />
      </div>
    </MainLayout>
  );
};

export default Analytics;
