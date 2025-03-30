
import React from 'react';
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
  User
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
  const { currentWorkspace } = useWorkspace();
  
  const workspaceIcon = currentWorkspace === 'personal' ? (
    <User className="text-violet-500" />
  ) : (
    <Briefcase className="text-blue-500" />
  );

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
          <WorkspaceSwitcher />
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
