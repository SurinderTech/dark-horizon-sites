
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, UtensilsCrossed, Plane, Hotel, TrainFront, MessagesSquare, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import useBookingByPrompt from './hooks/useBookingByPrompt';
import FoodOrderTab from './TravelFoodAgent/FoodOrderTab';
import FlightBookingTab from './TravelFoodAgent/FlightBookingTab';
import HotelBookingTab from './TravelFoodAgent/HotelBookingTab';
import TransportBookingTab from './TravelFoodAgent/TransportBookingTab';

const TravelFoodAgent = ({ agent }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [promptResult, setPromptResult] = useState(null);
  const { user } = useAuth();
  const bookingByPrompt = useBookingByPrompt();

  const handlePrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter your request.');
      return;
    }
    setLoading(true);
    setPromptResult(null);
    try {
      const { type, booking, error } = await bookingByPrompt(prompt);
      if (error) {
        toast.error(error);
        setPromptResult(null);
      } else {
        setPromptResult({ type, booking });
        toast.success(
          <div>
            <div className="flex gap-2 items-center mb-1">
              <CheckCircle className="text-green-600 h-5 w-5" />
              <span>Booking successful! Type: <b>{type}</b></span>
            </div>
            <div className="text-xs text-muted-foreground">See your order in the {type.charAt(0).toUpperCase() + type.slice(1)} tab.</div>
          </div>
        );
        setPrompt('');
      }
    } catch (err) {
      toast.error('Something went wrong processing your request.');
    } finally {
      setLoading(false);
    }
  };

  // For initial tab: "prompt"
  return (
    <div className="space-y-6">
      <Tabs defaultValue="prompt" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="prompt">
            <MessagesSquare className="inline mr-2 h-5 w-5" />
            Prompt
          </TabsTrigger>
          <TabsTrigger value="food">
            <UtensilsCrossed className="inline mr-2 h-5 w-5" />
            Food
          </TabsTrigger>
          <TabsTrigger value="flight">
            <Plane className="inline mr-2 h-5 w-5" />
            Flight
          </TabsTrigger>
          <TabsTrigger value="hotel">
            <Hotel className="inline mr-2 h-5 w-5" />
            Hotel
          </TabsTrigger>
          <TabsTrigger value="transport">
            <TrainFront className="inline mr-2 h-5 w-5" />
            Bus/Train
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <MessagesSquare className="mr-2 h-5 w-5" />
                Ask AI agent anything about food or travel bookings!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. Book me 2 train tickets to Paris on Sunday, or Get 1 hotel room in Berlin for this weekend, or Order a pizza to 123 Main St..."
                disabled={loading}
              />
              <Button 
                onClick={handlePrompt} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Prompt"}
              </Button>
              {promptResult && promptResult.type && (
                <div className="border rounded p-3 mt-4 space-y-1 bg-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" />
                    <b>{promptResult.type.charAt(0).toUpperCase() + promptResult.type.slice(1)} booking created!</b>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="food">
          <FoodOrderTab />
        </TabsContent>
        <TabsContent value="flight">
          <FlightBookingTab />
        </TabsContent>
        <TabsContent value="hotel">
          <HotelBookingTab />
        </TabsContent>
        <TabsContent value="transport">
          <TransportBookingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelFoodAgent;
