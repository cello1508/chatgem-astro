import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, KeyRound, LockKeyhole, Shield, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
  isCreating?: boolean;
  title?: string;
  description?: string;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isCreating = false,
  title = "Digite a senha",
  description = "Esta conversa está protegida por senha."
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (isCreating && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(password);
      
      if (success) {
        setPassword('');
        setConfirmPassword('');
        onClose();
        toast({
          title: isCreating ? "Senha criada" : "Senha correta",
          description: isCreating 
            ? "Conversa protegida com sucesso."
            : "Você agora tem acesso à conversa.",
          variant: "default",
        });
      } else {
        setError("Senha incorreta. Tente novamente.");
        toast({
          title: "Erro",
          description: "Senha incorreta. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao processar senha:", error);
      setError("Ocorreu um erro ao processar a senha.");
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a senha.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#171717] border border-gray-800 text-gray-100">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#2a2a2a] mx-auto flex items-center justify-center">
              {isCreating ? (
                <Shield className="h-8 w-8 text-success" />
              ) : (
                <KeyRound className="h-8 w-8 text-amber-500" />
              )}
            </div>
            <DialogTitle className="text-xl font-bold text-center">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="pr-10 bg-[#212121] border-gray-700 focus:border-success focus:ring-success text-gray-100"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {isCreating && (
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 bg-[#212121] border-gray-700 focus:border-success focus:ring-success text-gray-100"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}
              
              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 py-2 px-3 rounded border border-red-400/20">
                  {error}
                </p>
              )}

              {!error && isCreating && password.length > 0 && (
                <div className="mt-1">
                  <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        password.length < 6 ? 'bg-red-500' : 
                        password.length < 10 ? 'bg-amber-500' : 
                        'bg-success'
                      }`} 
                      style={{ width: `${Math.min(100, password.length * 10)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-400">
                    {password.length < 6 ? 'Senha fraca' : 
                     password.length < 10 ? 'Senha média' : 
                     'Senha forte'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-3 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-700 hover:bg-gray-800 text-gray-300"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!password || (isCreating && !confirmPassword) || isSubmitting}
              className="bg-success hover:bg-success/90 text-white"
            >
              {isSubmitting ? "Processando..." : isCreating ? "Criar senha" : "Desbloquear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
