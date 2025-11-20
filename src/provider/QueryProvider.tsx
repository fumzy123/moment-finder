// src/components/react/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';

// Initialize the client once outside the component to ensure a singleton
const queryClient = new QueryClient(); 

export default function QueryProvider({ children }:{ children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}