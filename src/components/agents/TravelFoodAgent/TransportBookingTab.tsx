
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
const TransportBookingTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bus & Train Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">All your bus or train bookings will display here.</p>
      </CardContent>
    </Card>
  );
};
export default TransportBookingTab;
