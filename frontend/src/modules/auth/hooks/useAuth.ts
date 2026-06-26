import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';
import { notify } from '@/shared/utils/toast';
import type { LoginFormData } from '../schemas/auth.schema';
import { ROUTES } from '@/shared/constants/routes';
import { MESSAGES } from '@/shared/constants/message';
import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api';

export function useAuth() {
  const navigate = useNavigate();
  const { setToken, clearAuth } = useAuthStore();

  const login = async (data: LoginFormData) => {
    try {
      const { data: json } = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.auth.login}`,
        data
      );
      setToken(json.accessToken, json.refreshToken);
      notify.success(MESSAGES.auth.loginSuccess);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          err.response?.data?.message || MESSAGES.auth.loginFailed
        );
      }
      throw new Error(MESSAGES.common.networkError);
    }
  };

  const logout = () => {
    clearAuth();
    navigate(ROUTES.AUTH.LOGIN);
  };

  return { login, logout };
}
