
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MainNavProps {
  isMobile: boolean;
}

export const MainNav: React.FC<MainNavProps> = ({ isMobile }) => {
  const routes = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Transactions",
      path: "/transactions",
    },
    {
      name: "Expenses",
      path: "/expenses",
    },
    {
      name: "Calendar",
      path: "/calendar",
    },
    {
      name: "Analytics",
      path: "/analytics",
    },
    {
      name: "Budgets",
      path: "/budgets",
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        "flex items-center",
        isMobile ? "flex-col space-y-4 mt-8 w-full" : "space-x-2 mx-4"
      )}
    >
      {routes.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          className={({ isActive }) =>
            cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isMobile ? "w-full text-center" : "",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
          tabIndex={0}
        >
          {({ isActive }) => (
            <span aria-current={isActive ? "page" : undefined}>{route.name}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
