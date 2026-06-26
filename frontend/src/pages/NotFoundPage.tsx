import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-8 overflow-hidden relative'>
      {/* Background decoration */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl' />
      </div>

      <div className='relative z-10 text-center max-w-lg w-full'>
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className='relative mb-4 select-none'
        >
          <span className='text-[160px] font-black leading-none text-primary/10 tracking-tighter'>
            404
          </span>
          {/* Floating icon */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className='absolute inset-0 flex items-center justify-center'
          >
            <div className='w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center'>
              <svg
                className='w-10 h-10 text-primary'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='11' cy='11' r='8' />
                <path d='m21 21-4.35-4.35' />
                <path d='M11 8v6M8 11h6' />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className='text-2xl font-bold text-foreground mb-3'>
            Trang không tồn tại
          </h1>
          <p className='text-muted-foreground text-sm leading-relaxed mb-8'>
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            <br />
            Hãy quay về trang chủ hoặc trang trước đó.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className='flex flex-col sm:flex-row items-center justify-center gap-3'
        >
          <Button
            id='btn-go-home'
            size='lg'
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            <Home />
            Về trang chủ
          </Button>

          <Button
            id='btn-go-back'
            variant='outline'
            size='lg'
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Quay lại
          </Button>
        </motion.div>

        {/* Path hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className='mt-8 text-xs text-muted-foreground/50'
        >
          Mã lỗi: 404 Not Found
        </motion.p>
      </div>
    </div>
  );
}
