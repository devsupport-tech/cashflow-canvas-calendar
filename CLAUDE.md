# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Lint the code**: `npm run lint`
- **Preview the production build**: `npm run preview`

## Architecture

This is a React application built with Vite and styled with Tailwind CSS and shadcn/ui.

- **Framework**: React, Vite
- **Styling**: Tailwind CSS, shadcn/ui components are in `src/components/ui`.
- **Routing**: `react-router-dom`, with routes defined in `src/routes.tsx`.
- **State Management**: Primarily uses React Context API. See `src/contexts` for various contexts like `AuthContext` and `WorkspaceContext`. TanStack Query (`react-query`) is used for data fetching.
- **Backend**: The application uses Supabase as its backend. The Supabase client is initialized in `src/lib/supabase.ts`.
- **Components**: Reusable components are located in `src/components`. Larger features have their own subdirectories (e.g., `src/components/auth`, `src/components/budgets`).
- **Pages**: Top-level page components are in `src/pages`.
- **Hooks**: Custom hooks are located in `src/hooks` for reusable logic.
- **Types**: TypeScript types are defined in `src/types` and `src/lib/types.ts`.
- **Authentication**: Authentication logic is handled within `src/contexts/auth` and components in `src/components/auth`.
