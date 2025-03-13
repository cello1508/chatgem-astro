
import { Button } from '@/components/ui/button';
import { SubscriptionButton } from './SubscriptionButton';

interface ChatHeaderProps {
  isPremium: boolean;
  isLoadingSubscription: boolean;
  handleSubscribe: () => void;
  handleLock: () => void;
  isLocked: boolean;
}

export function ChatHeader({ 
  isPremium, 
  isLoadingSubscription, 
  handleSubscribe, 
  handleLock, 
  isLocked 
}: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center border-b p-4">
      <h1 className="text-xl font-semibold">Chat</h1>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleLock}
        >
          {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
        </Button>
        <SubscriptionButton 
          isPremium={isPremium} 
          isLoading={isLoadingSubscription} 
          handleSubscribe={handleSubscribe} 
        />
      </div>
    </div>
  );
}
