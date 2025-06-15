
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
const FlightBookingTab = () => {
  // Add fetching and showing user's flight bookings
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flight Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">All your upcoming and past flight bookings will show here.</p>
      </CardContent>
    </Card>
  );
};
export default FlightBookingTab;
