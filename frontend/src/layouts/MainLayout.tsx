import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Suspense } from 'react';
import { PageLoader } from '@/shared/components/loading/PageLoader';

export function MainLayout() {
  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground'>
      <Header />
      <main className='flex-1 container mx-auto px-4 py-6'>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
