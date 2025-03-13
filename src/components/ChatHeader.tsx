
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface ChatHeaderProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  isEncrypted: boolean;
  onEncryptToggle: () => { showPasswordDialog: boolean; isCreatingPassword: boolean };
  activeSection: string;
  setShowPasswordDialog: (show: boolean) => void;
  setIsCreatingPassword: (isCreating: boolean) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  showSidebar,
  setShowSidebar,
  isEncrypted,
  onEncryptToggle,
  activeSection,
  setShowPasswordDialog,
  setIsCreatingPassword
}) => {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  const handleEncryptToggle = () => {
    const { showPasswordDialog, isCreatingPassword } = onEncryptToggle();
    setShowPasswordDialog(showPasswordDialog);
    setIsCreatingPassword(isCreatingPassword);
  };

  return (
    <div className="sticky top-0 z-10 p-2 flex justify-between items-center glass w-full">
      {isMobile && (
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 rounded-md bg-[#171717]/80 border border-gray-800 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}
      
      <div className="ml-auto flex items-center gap-2">
        {activeSection === 'chat' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEncryptToggle}
            className="text-gray-400 hover:text-white"
            title={isEncrypted ? "Desativar criptografia" : "Ativar criptografia"}
          >
            {isEncrypted ? (
              <Lock size={18} className="text-amber-500" />
            ) : (
              <Unlock size={18} />
            )}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          className="text-gray-400 hover:text-white"
          title="Sair"
        >
          <LogOut size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
