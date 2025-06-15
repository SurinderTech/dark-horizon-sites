
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UtensilsCrossed, MapPin, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';

const FoodOrderingAgent = ({ agent }) => {
  const [orderText, setOrderText] = useState('');
  const [address, setAddress] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockRestaurants = [
    { id: 1, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5, deliveryTime: '25-35 min' },
    { id: 2, name: 'Burger Barn', cuisine: 'American', rating: 4.2, deliveryTime: '20-30 min' },
    { id: 3, name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.8, deliveryTime: '30-40 min' }
  ];

  const handlePlaceOrder = async () => {
    if (!orderText || !address) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate AI processing the order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrder = {
        id: Date.now(),
        text: orderText,
        address: address,
        restaurant: mockRestaurants[Math.floor(Math.random() * mockRestaurants.length)],
        status: 'Processing',
        timestamp: new Date().toLocaleString(),
        estimatedTime: '25-35 minutes'
      };

      setOrders(prev => [newOrder, ...prev]);
      setOrderText('');
      toast.success('Order placed successfully! Processing your request...');
      
      // Simulate status updates
      setTimeout(() => {
        setOrders(prev => prev.map(order => 
          order.id === newOrder.id ? { ...order, status: 'Confirmed' } : order
        ));
        toast.success('Order confirmed by restaurant!');
      }, 3000);

    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="order" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="order">Place Order</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="order" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UtensilsCrossed className="mr-2 h-5 w-5" />
                AI Food Ordering
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="order-text">Describe what you want to order</Label>
                <Input
                  id="order-text"
                  placeholder="e.g., 'I want a large pepperoni pizza and some chicken wings'"
                  value={orderText}
                  onChange={(e) => setOrderText(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <Button 
                onClick={handlePlaceOrder} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processing Order...' : 'Place Order with AI'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-4">
          <div className="grid gap-4">
            {mockRestaurants.map((restaurant) => (
              <Card key={restaurant.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <span className="text-yellow-500">★ {restaurant.rating}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Menu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-semibold">{order.restaurant.name}</h3>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            order.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{order.text}</p>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{order.address}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ordered: {order.timestamp}
                        </p>
                      </div>
                      {order.status === 'Confirmed' && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No orders yet. Place your first order!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodOrderingAgent;
