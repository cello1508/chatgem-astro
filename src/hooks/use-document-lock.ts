
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export function useDocumentLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  useEffect(() => {
    // Check if document is locked in localStorage
    const storedLockState = localStorage.getItem('isDocumentLocked');
    if (storedLockState === 'true') {
      setIsLocked(true);
    }
  }, []);

  const handleLock = () => {
    if (isLocked) {
      // Unlock document
      setShowPasswordDialog(true);
    } else {
      // Lock document
      setIsLocked(true);
      localStorage.setItem('isDocumentLocked', 'true');
      toast({
        title: 'Documento bloqueado',
        description: 'O documento foi bloqueado com sucesso.',
        variant: 'default',
      });
    }
  };

  const handleUnlock = (enteredPassword: string) => {
    // In a real app, you would verify the password
    // For this example, we'll just unlock without verification
    setIsLocked(false);
    localStorage.removeItem('isDocumentLocked');
    setShowPasswordDialog(false);
    toast({
      title: 'Documento desbloqueado',
      description: 'O documento foi desbloqueado com sucesso.',
      variant: 'default',
    });
  };

  return {
    isLocked,
    setIsLocked,
    password,
    setPassword,
    showPasswordDialog,
    setShowPasswordDialog,
    handleLock,
    handleUnlock
  };
}
