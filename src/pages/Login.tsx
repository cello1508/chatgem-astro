
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  // Get the redirect path from location state or default to '/'
  const from = location.state?.from?.pathname || '/';

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      // For demo purposes, accept any non-empty credentials
      if (username.trim() && password.trim()) {
        login(username);
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        // Navigate to the redirect path or home
        navigate('/');
      } else {
        toast({
          title: "Falha no login",
          description: "Nome de usuário ou senha inválidos",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup API call
    setTimeout(() => {
      if (signupUsername.trim() && signupPassword.trim() && signupEmail.trim()) {
        // Store user data in localStorage (in a real app, this would be done on the server)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({ username: signupUsername, email: signupEmail });
        localStorage.setItem('users', JSON.stringify(users));
        
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso!",
        });
        
        setShowSignupDialog(false);
        setUsername(signupUsername);
        setPassword(signupPassword);
      } else {
        toast({
          title: "Falha no cadastro",
          description: "Por favor, preencha todos os campos",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md glass p-8 rounded-xl shadow-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-white mb-2">Produtividade</h1>
          <p className="text-center text-gray-400">Faça login para acessar sua conta</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Nome de usuário
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input block w-full pl-10 pr-3 py-3 border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Digite seu nome de usuário"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input block w-full pl-10 pr-3 py-3 border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Entrar
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Não tem uma conta?{' '}
            <button 
              onClick={() => setShowSignupDialog(true)}
              className="font-medium text-purple-500 hover:text-purple-400 transition-colors"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>

      {/* Signup Dialog */}
      <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
        <DialogContent className="glass border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Criar nova conta</DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha as informações abaixo para se cadastrar
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div>
              <label htmlFor="signup-username" className="block text-sm font-medium text-gray-300 mb-1">
                Nome de usuário
              </label>
              <input
                id="signup-username"
                type="text"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className="glass-input block w-full px-3 py-2 border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-1">
                E-mail
              </label>
              <input
                id="signup-email"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="glass-input block w-full px-3 py-2 border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <input
                id="signup-password"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="glass-input block w-full px-3 py-2 border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                {isLoading ? "Processando..." : "Criar conta"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
