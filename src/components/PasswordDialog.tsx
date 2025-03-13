import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: (password: string) => void;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({ open, onOpenChange, onUnlock }) => {
  const [password, setPassword] = useState('');
  const handleSubmit = () => {
    onUnlock(password);
    toast({
      title: "Desbloqueado",
      description: "A senha foi desbloqueada com sucesso.",
      variant: "default", // Change from "success" to "default"
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Digite a senha</AlertDialogTitle>
          <AlertDialogDescription>
            Este documento está bloqueado. Digite a senha para desbloquear.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={handleSubmit}>Desbloquear</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasswordDialog;
