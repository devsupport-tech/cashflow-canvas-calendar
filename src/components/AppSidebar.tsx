
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  ListPlus, 
  Calendar,
  Settings, 
  CreditCard, 
  PiggyBank,
  Wallet,
  FileText,
  Briefcase,
  User,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

// Menu items for the sidebar
const mainNavItems = [
  { 
    title: 'Dashboard', 
    icon: LayoutDashboard,
    href: '/' 
  },
  { 
    title: 'Calendar', 
    icon: Calendar,
    href: '/calendar' 
  },
  { 
    title: 'Analytics', 
    icon: BarChart3,
    href: '/analytics' 
  },
  { 
    title: 'Transactions', 
    icon: ListPlus,
    href: '/transactions' 
  },
  { 
    title: 'Documents', 
    icon: FileText,
    href: '/documents' 
  }
];

const financeNavItems = [
  { 
    title: 'Accounts', 
    icon: CreditCard,
    href: '/accounts' 
  },
  { 
    title: 'Budgets', 
    icon: PiggyBank,
    href: '/budgets' 
  },
  { 
    title: 'Expenses', 
    icon: Wallet,
    href: '/expenses' 
  }
];

export function AppSidebar() {
  const { currentWorkspace, setWorkspace } = useWorkspace();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Display text for the workspace selector
  const workspaceDisplay = currentWorkspace === 'all' 
    ? 'All' 
    : currentWorkspace.charAt(0).toUpperCase() + currentWorkspace.slice(1);
  
  // Icon based on selected workspace
  const workspaceIcon = () => {
    switch(currentWorkspace) {
      case 'personal':
        return <User className="text-violet-500" />;
      case 'business':
        return <Briefcase className="text-blue-500" />;
      default:
        return <User className="text-primary" />;
    }
  };

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 pl-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-r from-vivid-purple to-ocean-blue"></div>
          <span className="font-semibold text-gradient">FlowFinance</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-3 py-2">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 font-normal"
              >
                {workspaceIcon()}
                <span>{workspaceDisplay}</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem 
                onClick={() => setWorkspace('all')}
                className={cn("cursor-pointer", currentWorkspace === 'all' && "bg-accent")}
              >
                <User className="mr-2 h-4 w-4 text-primary" />
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setWorkspace('personal')}
                className={cn("cursor-pointer", currentWorkspace === 'personal' && "bg-accent")}
              >
                <User className="mr-2 h-4 w-4 text-violet-500" />
                Personal
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setWorkspace('business')}
                className={cn("cursor-pointer", currentWorkspace === 'business' && "bg-accent")}
              >
                <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
                Business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item, index) => (
                <SidebarMenuItem key={item.title} className={`animate-slide-down`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.href}
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn("nav-link", isActive && "active")
                      }
                    >
                      <item.icon className={location.pathname === item.href ? 'text-primary' : ''} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Finance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeNavItems.map((item, index) => (
                <SidebarMenuItem key={item.title} className={`animate-slide-down`} style={{ animationDelay: `${(index + mainNavItems.length) * 0.05}s` }}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.href}
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn("nav-link", isActive && "active")
                      }
                    >
                      <item.icon className={location.pathname === item.href ? 'text-primary' : ''} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
            >
              <NavLink to="/settings">
                <Settings />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
