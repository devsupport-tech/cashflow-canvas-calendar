
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
    <nav className={cn(
      "flex items-center",
      isMobile ? "flex-col space-y-4 mt-8" : "space-x-4 mx-6"
    )}>
      {routes.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          className={({ isActive }) =>
            cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isMobile ? "w-full" : "",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            )
          }
        >
          {route.name}
        </NavLink>
      ))}
    </nav>
  );
};
