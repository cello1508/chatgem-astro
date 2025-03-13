
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/auth');
    }
  }, [session, isLoading, navigate]);

  // Mostrar nada enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0F0F0F]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
      </div>
    );
  }

  // Se não estiver autenticado, não mostra nada (o useEffect irá redirecionar)
  if (!session) {
    return null;
  }

  // Se estiver autenticado, mostra o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;
