
import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from '@/components/ModeToggle';
import { MainNav } from '@/components/MainNav';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { WorkspaceSwitcher } from '@/components/WorkspaceSwitcher';
import { UserMenuButton } from '@/components/UserMenuButton';

export const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 sm:w-1/3 p-6">
              <MainNav isMobile={true} />
            </SheetContent>
          </Sheet>
        )}

        {/* Logo */}
        <Link to="/" className="hidden sm:flex items-center space-x-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-r from-vivid-purple to-ocean-blue"></div>
          <span className="font-bold">FlowFinance</span>
        </Link>

        {/* Main Navigation (Hidden on Mobile) */}
        {!isMobile && <MainNav isMobile={false} />}

        <div className="flex flex-1 items-center justify-end space-x-3">
          <WorkspaceSwitcher />
          <ModeToggle />
          <UserMenuButton />
        </div>
      </div>
    </header>
  );
};
