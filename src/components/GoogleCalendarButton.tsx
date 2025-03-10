
import React, { useState } from 'react';
import { Calendar, Check, Loader2, PenLine } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface GoogleCalendarButtonProps {
  onSuccess?: (accessToken: string) => void;
}

const GoogleCalendarButton: React.FC<GoogleCalendarButtonProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [clientId, setClientId] = useState(() => {
    return localStorage.getItem('google_calendar_client_id') || '';
  });
  const { toast } = useToast();

  const handleGoogleLogin = () => {
    const savedClientId = localStorage.getItem('google_calendar_client_id');
    
    if (!savedClientId) {
      setShowCredentialsDialog(true);
      return;
    }

    setIsLoading(true);
    
    // Define the scope for Google Calendar API
    const scope = 'https://www.googleapis.com/auth/calendar';
    
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    // Create form to request access token from Google's OAuth 2.0 server
    const form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
    
    // Parameters to pass to OAuth 2.0 endpoint
    const params = {
      'client_id': savedClientId,
      'redirect_uri': window.location.origin + window.location.pathname,
      'response_type': 'token',
      'scope': scope,
      'include_granted_scopes': 'true',
      'state': 'pass-through-value'
    };
    
    // Add form parameters as hidden input values
    for (const p in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p as keyof typeof params]);
      form.appendChild(input);
    }
    
    // Add form to page and submit it to open OAuth 2.0 endpoint
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const handleSaveClientId = () => {
    if (clientId.trim()) {
      localStorage.setItem('google_calendar_client_id', clientId.trim());
      setShowCredentialsDialog(false);
      toast({
        title: "Credenciais salvas",
        description: "Seu Client ID do Google foi salvo com sucesso.",
      });
      
      // Attempt login after saving credentials
      setTimeout(handleGoogleLogin, 500);
    }
  };

  const handleShowCredentialsForm = () => {
    setShowCredentialsDialog(true);
  };

  React.useEffect(() => {
    // Parse URL fragment for access token after OAuth redirect
    const fragmentString = window.location.hash.substring(1);
    
    // Temporary storage for the token/expiry
    let accessToken = '';
    let expiresIn = '';
    
    // Parse fragment parameters
    if (fragmentString) {
      const params = new URLSearchParams(fragmentString);
      accessToken = params.get('access_token') || '';
      expiresIn = params.get('expires_in') || '';
      
      // Clear the hash fragment from the URL
      if (accessToken) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        
        // Store token in sessionStorage (more secure than localStorage for this use case)
        sessionStorage.setItem('google_calendar_token', accessToken);
        sessionStorage.setItem('google_calendar_token_expiry', (Date.now() + (parseInt(expiresIn) * 1000)).toString());
        
        setIsConnected(true);
        setIsLoading(false);
        
        toast({
          title: "Conectado com sucesso!",
          description: "Sua agenda do Google foi conectada.",
        });
        
        if (onSuccess) {
          onSuccess(accessToken);
        }
      }
    }
    
    // Check if there's an existing valid token
    const storedToken = sessionStorage.getItem('google_calendar_token');
    const tokenExpiry = sessionStorage.getItem('google_calendar_token_expiry');
    
    if (storedToken && tokenExpiry && parseInt(tokenExpiry) > Date.now()) {
      setIsConnected(true);
      if (onSuccess) {
        onSuccess(storedToken);
      }
    }
  }, [onSuccess, toast]);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
            isConnected 
              ? 'bg-success/20 text-success hover:bg-success/30' 
              : 'bg-white text-gray-800 hover:bg-gray-100'
          }`}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isConnected ? (
            <Check size={18} />
          ) : (
            <Calendar size={18} />
          )}
          {isConnected ? 'Google Agenda Conectado' : 'Conectar com Google Agenda'}
        </button>
        
        <button
          onClick={handleShowCredentialsForm}
          className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-all"
          title="Configurar credenciais"
        >
          <PenLine size={16} />
        </button>
      </div>

      {/* Client ID Input Dialog */}
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent className="glass border-gray-800">
          <DialogHeader>
            <DialogTitle>Configurar Credenciais do Google</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p>Para usar a integração com o Google Agenda, você precisa configurar um ID de cliente OAuth do Google.</p>
            
            <div className="space-y-2">
              <label htmlFor="clientId" className="block text-sm font-medium">
                Client ID
              </label>
              <input
                id="clientId"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Seu Google OAuth Client ID"
                className="w-full glass-input rounded-lg px-3 py-2 text-gray-100 focus:outline-none placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-400">
                O Client ID é uma string longa que parece com: 123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
              </p>
            </div>
            
            <div className="bg-gray-800/60 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Como obter seu Client ID:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Acesse o <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-success underline">Google Cloud Console</a></li>
                <li>Crie um novo projeto ou selecione um existente</li>
                <li>Navegue até "APIs e Serviços" &gt; "Credenciais"</li>
                <li>Clique em "Criar Credenciais" e selecione "ID do cliente OAuth"</li>
                <li>Configure o tipo de aplicação como "Aplicativo da Web"</li>
                <li>Adicione {window.location.origin} como URI de redirecionamento autorizado</li>
                <li>Clique em "Criar" e copie o ID do cliente</li>
              </ol>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCredentialsDialog(false)}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveClientId}
                disabled={!clientId.trim()}
                className="px-4 py-2 rounded-lg bg-success hover:bg-success/90 text-black transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                Salvar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="glass border-gray-800">
          <DialogHeader>
            <DialogTitle>Configuração Necessária</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p>Para usar a integração com o Google Agenda, você precisa configurar um ID de cliente OAuth do Google.</p>
            
            <div className="bg-gray-800/60 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Como configurar:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Acesse o <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-success underline">Google Cloud Console</a></li>
                <li>Crie um novo projeto ou selecione um existente</li>
                <li>Navegue até "APIs e Serviços" &gt; "Credenciais"</li>
                <li>Crie um ID de cliente OAuth 2.0</li>
                <li>Adicione {window.location.origin} como URI de redirecionamento autorizado</li>
                <li>Copie o ID do cliente e defina-o na aplicação</li>
              </ol>
            </div>
            
            <p className="text-sm text-gray-400">
              Depois de obter seu Client ID, você precisará editar o código fonte para adicioná-lo.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoogleCalendarButton;
