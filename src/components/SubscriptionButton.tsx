
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock, Unlock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SubscriptionButtonProps {
  isPremium: boolean;
  isLoading: boolean;
  handleSubscribe: () => void;
}

export function SubscriptionButton({ isPremium, isLoading, handleSubscribe }: SubscriptionButtonProps) {
  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      variant={isPremium ? "default" : "premium"}
      className="w-full md:w-auto transition-all"
    >
      {isLoading ? (
        "Carregando..."
      ) : isPremium ? (
        <>
          <Unlock className="h-4 w-4 mr-2" />
          Premium Ativo
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Assinar Premium
        </>
      )}
    </Button>
  );
}
