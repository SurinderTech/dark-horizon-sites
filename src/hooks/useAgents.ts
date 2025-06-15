
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  monthly_price: number;
  yearly_price: number;
  lifetime_price: number;
  is_popular: boolean;
}

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      console.log('Fetching agents from database...');
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agents:', error);
        throw error;
      }

      console.log('Fetched agents:', data);
      return data as Agent[];
    },
  });
};
