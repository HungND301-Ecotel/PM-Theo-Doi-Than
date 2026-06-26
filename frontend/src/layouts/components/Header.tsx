import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export function Header() {
  return (
    <header className='border-b border-border bg-card'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          <span className='text-xl font-bold tracking-tight text-primary'>
            PM Theo Dõi Than
          </span>
          <nav className='flex items-center gap-4 text-sm font-medium'>
            <Link
              to={ROUTES.DASHBOARD}
              className='hover:text-primary transition-colors'
            >
              Tổng Quan
            </Link>
            <Link
              to='/receipts'
              className='hover:text-primary transition-colors'
            >
              Nhập Than
            </Link>
          </nav>
        </div>
        <div className='text-sm text-muted-foreground'>Admin Portal</div>
      </div>
    </header>
  );
}
