import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4'>
      <h1 className='text-4xl font-bold text-gray-800'>403</h1>
      <p className='text-gray-500'>Bạn không có quyền truy cập trang này.</p>
      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className='text-primary text-sm hover:underline'
      >
        Về trang chủ
      </button>
    </div>
  );
}
