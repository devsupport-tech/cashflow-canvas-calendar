
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme based on saved preference or system preference
const initializeTheme = () => {
  const root = window.document.documentElement;
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
  
  if (savedTheme) {
    if (savedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(savedTheme);
    }
  } else {
    // Default to system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
    localStorage.setItem('theme', 'system');
  }
};

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
