
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Naive example: Detect booking type from keywords. Extend for smarter prompt parsing!
function determineType(prompt: string) {
  const txt = prompt.toLowerCase();
  if (txt.includes('pizza') || txt.includes('food') || txt.includes('order')) return 'food';
  if (txt.includes('flight') || txt.includes('fly') || txt.includes('plane') || txt.includes('airport')) return 'flight';
  if (txt.includes('hotel') || txt.includes('room') || txt.includes('stay')) return 'hotel';
  if (txt.includes('bus') || txt.includes('train') || txt.includes('ticket')) return 'transport';
  return null;
}

// TODO: Fine-tune extracting data from the free text prompt. For now, extremely basic stubs.
export default function useBookingByPrompt() {
  const { user } = useAuth();

  return async (prompt: string) => {
    const type = determineType(prompt);

    if (!type) return { error: "Couldn't determine what you're requesting. Please use a prompt like 'Book a flight to Paris' or 'Order food'." };

    if (!user || !user.id) return { error: "You need to sign in to book!" };

    // Food order example
    if (type === 'food') {
      const address = 'Your Address'; // TODO: extract from prompt
      const description = prompt;
      const { data, error } = await supabase.from('food_orders').insert([
        { user_id: user.id, address, description, status: 'processing' }
      ]).select().single();
      if (error) return { error: error.message };
      return { type, booking: data };
    }

    // Flight booking example
    if (type === 'flight') {
      const origin = 'CityA'; // TODO: extract from prompt intelligently
      const destination = 'CityB';
      const departure_date = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase.from('flight_bookings').insert([
        { user_id: user.id, origin, destination, departure_date, status: 'pending', prompt }
      ]).select().single();
      if (error) return { error: error.message };
      return { type, booking: data };
    }

    // Hotel booking example
    if (type === 'hotel') {
      const location = 'Some Hotel'; // TODO: extract from prompt
      const check_in = new Date().toISOString().slice(0, 10);
      const check_out = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const { data, error } = await supabase.from('hotel_bookings').insert([
        { user_id: user.id, location, check_in, check_out, status: 'pending', prompt }
      ]).select().single();
      if (error) return { error: error.message };
      return { type, booking: data };
    }

    // Transport booking example
    if (type === 'transport') {
      const mode = prompt.toLowerCase().includes('train') ? 'train' : 'bus';
      const origin = 'OriginCity'; // TODO: extract from prompt
      const destination = 'DestCity';
      const travel_date = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase.from('transport_bookings').insert([
        { user_id: user.id, mode, origin, destination, travel_date, status: 'pending', prompt }
      ]).select().single();
      if (error) return { error: error.message };
      return { type, booking: data };
    }

    return { error: 'Booking type not handled.' };
  };
}
