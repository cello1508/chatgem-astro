
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export function useSubscription() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoadingSubscription(true);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'create-checkout-session',
            priceId: 'price_1OCqXSPXmV7LU6j0zJ0zrRsq', // Replace with your actual price ID
          }),
        }
      );

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'Erro ao assinar',
        description: 'Ocorreu um erro ao tentar assinar o plano premium.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  return {
    isPremium,
    setIsPremium,
    isLoadingSubscription,
    handleSubscribe
  };
}
