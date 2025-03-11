
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
import { LockKeyhole, Unlock } from 'lucide-react';
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
          variant: "success",
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
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isCreating ? <LockKeyhole size={18} /> : <Unlock size={18} />}
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              
              {isCreating && (
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirme a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}
              
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!password || (isCreating && !confirmPassword) || isSubmitting}
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
