import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Frontend Stripe instance
export const getStripe = async () => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  return stripePromise;
};

// Backend Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});