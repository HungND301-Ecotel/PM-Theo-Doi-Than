import { cn } from '@/shared/utils/cn';

interface PageLoaderProps {
  /** Chiếm toàn màn hình (100vh). Dùng cho route-level fallback, KHÔNG dùng khi nested trong layout. */
  fullscreen?: boolean;
}

export function PageLoader({ fullscreen = false }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullscreen ? 'min-h-screen' : 'h-full min-h-[200px]'
      )}
    >
      <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin' />
    </div>
  );
}
