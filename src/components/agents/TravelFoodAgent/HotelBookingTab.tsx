
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
const HotelBookingTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotel Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your hotel bookings will be shown here.</p>
      </CardContent>
    </Card>
  );
};
export default HotelBookingTab;
