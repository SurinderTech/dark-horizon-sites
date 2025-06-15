
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Purchase {
  id: string;
  agent_id: string;
  purchase_type: string;
  amount: number;
  status: string;
  purchased_at: string;
}

export const useUserPurchases = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching user purchases...');
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (error) {
        console.error('Error fetching purchases:', error);
        throw error;
      }

      console.log('User purchases:', data);
      return data as Purchase[];
    },
    enabled: !!user,
  });
};
