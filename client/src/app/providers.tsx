'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminProvider } from '../contexts/AdminContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useState } from 'react';
import '../i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AdminProvider>
          {children}
        </AdminProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
