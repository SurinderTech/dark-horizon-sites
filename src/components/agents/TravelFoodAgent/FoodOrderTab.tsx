
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const FoodOrderTab = () => {
  // Could implement fetching from Supabase and show order history/list
  // For demo: just show a placeholder
  // For real version: userId = useAuth().user?.id
  // Render fetched user's food_orders here
  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your past and active food orders will appear here soon!</p>
      </CardContent>
    </Card>
  );
};
export default FoodOrderTab;
