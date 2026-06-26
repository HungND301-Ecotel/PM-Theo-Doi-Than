import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Field, FieldError, FieldGroup } from '@/shared/components/ui/field';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { MESSAGES } from '@/shared/constants/message';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (err) {
      setError('root', {
        message:
          err instanceof Error ? err.message : MESSAGES.common.networkError,
      });
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* ── LEFT PANEL ── */}
      <div
        className='hidden lg:flex flex-col justify-between w-[520px] shrink-0 p-10 relative overflow-hidden'
        style={{
          background:
            'linear-gradient(160deg, #0f2044 0%, #1a3a6b 60%, #1e4d8c 100%)',
        }}
      >
        {/* Grid overlay */}
        <div
          className='absolute inset-0 opacity-[0.04]'
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Accent shape */}
        <div
          className='absolute bottom-0 right-0 w-64 h-64 opacity-10'
          style={{
            background:
              'radial-gradient(circle at bottom right, #3b82f6, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div className='relative z-10 flex items-center gap-3'>
          <div className='w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center bg-white/10'>
            <svg
              viewBox='0 0 24 24'
              className='w-5 h-5'
              fill='none'
              stroke='white'
              strokeWidth='1.8'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' />
              <polyline points='9 22 9 12 15 12 15 22' />
            </svg>
          </div>
          <div>
            <p className='text-white font-bold text-lg leading-none tracking-wide'>
              KVCP
            </p>
            <p className='text-white/50 text-xs mt-0.5 tracking-widest uppercase'>
              Kho Vận Cẩm Phả · TKV
            </p>
          </div>
        </div>

        {/* Main copy */}
        <div className='relative z-10 space-y-6'>
          <div>
            <p className='text-white/50 text-sm font-medium uppercase tracking-widest mb-3'>
              Phần mềm quản lý
            </p>
            <h1 className='text-4xl font-extrabold text-white leading-tight'>
              HỆ THỐNG QUẢN LÝ
            </h1>
            <h1
              className='text-4xl font-extrabold leading-tight'
              style={{ color: '#f59e0b' }}
            >
              XUẤT NHẬP THAN
            </h1>
            <p className='text-white/60 text-sm mt-4 leading-relaxed max-w-xs'>
              Số hóa toàn bộ quy trình nhập – xuất – tồn kho than tại các Kho
              Cảng G9 · Hóa Chất và Km6.
            </p>
          </div>

          <ul className='space-y-3'>
            {[
              'Quản lý phiếu nhập / xuất theo ca, kíp',
              'Thẻ kho điện tử tự động cập nhật tồn',
              'Quy ẩm & đối chiều tồn kho minh bạch',
              'Workflow ký duyệt nhiều cấp',
            ].map((item) => (
              <li
                key={item}
                className='flex items-start gap-2.5 text-white/70 text-sm'
              >
                <span
                  className='mt-1.5 w-1.5 h-1.5 rounded-full shrink-0'
                  style={{ background: '#f59e0b' }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className='relative z-10 text-white/25 text-xs'>
          © {new Date().getFullYear()} Tập đoàn Công nghiệp Than · Khoáng sản
          Việt Nam (TKV)
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className='flex-1 flex flex-col items-center justify-between py-8 px-6'
        style={{ background: '#f1f5f9' }}
      >
        <div />

        {/* Card */}
        <div className='w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10'>
          <div className='text-center mb-8'>
            <h2 className='text-xl font-bold text-gray-800 tracking-wide'>
              ĐĂNG NHẬP HỆ THỐNG
            </h2>
            <p className='text-gray-400 text-xs mt-1.5'>
              Nhập thông tin tài khoản được cấp bởi quản trị viên
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className='gap-5'>
              {/* Username */}
              <Field>
                <Label htmlFor='username'>
                  Tên đăng nhập / Mã nhân viên{' '}
                  <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='username'
                  type='text'
                  placeholder='vd: thongke.kho1'
                  disabled={isSubmitting}
                  className='h-11'
                  {...register('username')}
                />
                {errors.username && (
                  <FieldError>{errors.username.message}</FieldError>
                )}
              </Field>

              {/* Password */}
              <Field>
                <Label htmlFor='password'>
                  Mật khẩu <span className='text-red-500'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    disabled={isSubmitting}
                    className='h-11 pr-11'
                    {...register('password')}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    onClick={() => setShowPassword((v) => !v)}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground'
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>

              {/* Remember me + Forgot */}
              <div className='flex items-center justify-between'>
                <label className='flex items-center gap-2 cursor-pointer select-none'>
                  <input
                    type='checkbox'
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className='w-4 h-4 rounded border-gray-300 accent-blue-600'
                  />
                  <span className='text-sm text-gray-600'>
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <button
                  type='button'
                  className='text-sm font-medium text-primary hover:underline transition'
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Root error */}
              {errors.root && (
                <FieldError className='rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm'>
                  {errors.root.message}
                </FieldError>
              )}

              {/* Submit */}
              <Button
                type='submit'
                size='lg'
                disabled={isSubmitting}
                className='w-full mt-1'
              >
                {isSubmitting ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
              </Button>

              {/* Divider */}
              <div className='flex items-center gap-3'>
                <div className='flex-1 h-px bg-gray-200' />
                <span className='text-xs text-gray-400'>hoặc</span>
                <div className='flex-1 h-px bg-gray-200' />
              </div>

              {/* SSO */}
              <button
                type='button'
                className='w-full text-sm font-medium text-primary hover:underline transition'
              >
                Đăng nhập bằng tài khoản AD / SSO của TKV
              </button>
            </FieldGroup>
          </form>
        </div>

        <p className='text-xs text-gray-400 mt-6'>
          Phần mềm do{' '}
          <a
            href='https://ecotel.com.vn/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline'
          >
            Công Ty TNHH Ecotel
          </a>{' '}
          phát triển và triển khai.
        </p>
      </div>
    </div>
  );
}
