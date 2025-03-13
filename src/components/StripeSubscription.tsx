
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard } from 'lucide-react';

// Define subscription plans
const SUBSCRIPTION_PLANS = [
  {
    name: 'Premium Plan',
    description: 'Acesso a todos os recursos premium do chat',
    price: 'R$ 19.90/mês',
    priceId: 'price_1Pu6JhPYkpVMBJXqSESp8yO3' // Replace with your actual Stripe price ID
  }
];

export const StripeSubscription: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubscription = async (priceId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-subscription', {
        body: {
          action: 'create-checkout-session',
          priceId: priceId,
        },
      });

      if (error) throw error;
      
      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível iniciar o pagamento. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 glass rounded-lg shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Assine o Plano Premium</h2>
        <p className="text-gray-300">Desbloqueie recursos exclusivos e melhore sua experiência</p>
      </div>

      {SUBSCRIPTION_PLANS.map((plan) => (
        <div key={plan.priceId} className="p-4 border border-gray-700 rounded-lg mb-4 bg-gray-800/50">
          <h3 className="text-lg font-medium text-white">{plan.name}</h3>
          <p className="text-gray-300 mb-3">{plan.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">{plan.price}</span>
            <Button
              onClick={() => handleSubscription(plan.priceId)}
              disabled={isLoading}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              <CreditCard className="mr-2 h-4 w-4" /> 
              {isLoading ? 'Processando...' : 'Assinar agora'}
            </Button>
          </div>
        </div>
      ))}
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Pagamentos processados de forma segura através do Stripe
      </div>
    </div>
  );
};
