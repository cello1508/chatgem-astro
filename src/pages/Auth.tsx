import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth, useToast } from '@/hooks';

type AuthMode = 'login' | 'register' | 'resetPassword';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'resetPassword'>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    checkSession();

    // Monitorar mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        toast.success('Login realizado com sucesso!');
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username
            }
          }
        });

        if (error) throw error;
        toast.success('Conta criada com sucesso! Verifique seu email.');
      } else if (mode === 'resetPassword') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) throw error;
        toast.success('Instruções enviadas para seu email!');
        setResetSent(true);
      }
    } catch (error) {
      console.error('Erro de autenticação:', error);
      setError('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === 'resetPassword' && resetSent) {
      return (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Recuperar Senha
          </h1>
          <p className="text-gray-400">
            As instruções para redefinir sua senha foram enviadas para seu email.
          </p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode !== 'resetPassword' && (
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-gray-700 text-white"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>
        )}

        {mode !== 'resetPassword' && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-white">Senha</Label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('resetPassword')}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-gray-700 text-white"
                placeholder="Digite sua senha"
                required={mode !== 'resetPassword'}
              />
            </div>
          </div>
        )}

        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">Nome de usuário</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-gray-700 text-white"
                placeholder="Digite seu nome de usuário"
                required={mode === 'register'}
              />
            </div>
          </div>
        )}

        {mode !== 'resetPassword' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-gray-700 text-white"
                placeholder="Confirme sua senha"
                required={mode !== 'resetPassword'}
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Registrar' : 'Enviar instruções'}
              <ArrowRight size={16} />
            </>
          )}
        </Button>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        <div className="text-center text-sm text-gray-400">
          {mode === 'login' ? (
            <p>
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-success hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          ) : mode === 'register' ? (
            <p>
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-success hover:underline"
              >
                Entrar
              </button>
            </p>
          ) : (
            <p>
              Lembrou da senha?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-success hover:underline"
              >
                Entrar
              </button>
            </p>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] p-4">
      <div className="w-full max-w-md space-y-8 glass rounded-xl p-8">
        {renderForm()}
      </div>
    </div>
  );
};

export default Auth;
