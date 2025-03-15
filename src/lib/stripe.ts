import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'your_stripe_public_key');

export const createPaymentSession = async (cart: any[]) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    // In a real application, this would call your backend to create a Stripe session
    const session = {
      items: cart.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price * 100, // Convert to cents
        },
        quantity: item.quantity,
      })),
    };

    // For demo purposes, we'll just log the session
    console.log('Payment session created:', session);
    return session;
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw error;
  }
};