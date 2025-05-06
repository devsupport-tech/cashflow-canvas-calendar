
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, ListPlus, Calendar, Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

const navItems = [
  { 
    name: 'Dashboard', 
    icon: <LayoutDashboard className="h-4 w-4" />, 
    href: '/' 
  },
  { 
    name: 'Calendar', 
    icon: <Calendar className="h-4 w-4" />, 
    href: '/calendar' 
  },
  { 
    name: 'Analytics', 
    icon: <BarChart3 className="h-4 w-4" />, 
    href: '/analytics' 
  },
  { 
    name: 'Transactions', 
    icon: <ListPlus className="h-4 w-4" />, 
    href: '/transactions' 
  },
  { 
    name: 'Settings', 
    icon: <Settings className="h-4 w-4" />, 
    href: '/settings' 
  }
];

export const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const location = useLocation();

  const NavItems = () => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => setSheetOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-colors", 
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "hover:bg-accent/50"
              )
            }
          >
            {React.cloneElement(item.icon, { 
              className: cn("h-4 w-4", isActive ? "text-primary" : "") 
            })}
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border transition-all duration-200">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-medium text-lg">FlowFinance</h1>
          {!isMobile && <WorkspaceSwitcher />}
        </div>

        {isMobile ? (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {sheetOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-10">
              <div className="mb-8">
                <WorkspaceSwitcher />
              </div>
              <nav className="flex flex-col gap-1">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-1">
            <NavItems />
          </nav>
        )}
      </div>
    </header>
  );
};
