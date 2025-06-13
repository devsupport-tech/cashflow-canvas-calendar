
import { Business } from './types';

export const dummyBusinesses: Business[] = [
  {
    id: '1',
    name: 'Tech Startup',
    color: '#3b82f6',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Consulting Firm',
    color: '#10b981',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'E-commerce Store',
    color: '#f59e0b',
    createdAt: new Date()
  }
];

export const dummyData = {
  businesses: dummyBusinesses
};
