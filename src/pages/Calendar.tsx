
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { ExpenseCalendar } from '@/components/ExpenseCalendar';
import { dummyTransactions } from '@/lib/dummyData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';

const Calendar = () => {
  const [formOpen, setFormOpen] = React.useState(false);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expense Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Track and visualize your expenses
            </p>
          </div>
          
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <ExpenseForm onClose={() => setFormOpen(false)} />
          </Dialog>
        </div>
        
        <ExpenseCalendar transactions={dummyTransactions} />
      </div>
    </MainLayout>
  );
};

export default Calendar;
