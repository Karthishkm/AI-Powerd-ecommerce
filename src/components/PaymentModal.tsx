import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Truck } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../lib/utils';
import { createPaymentSession } from '../lib/stripe';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cart: any[];
}

export function PaymentModal({ isOpen, onClose, total, cart }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      if (paymentMethod === 'card') {
        const session = await createPaymentSession(cart);
        // In a real app, redirect to Stripe checkout
        console.log('Processing card payment:', session);
      } else if (paymentMethod === 'upi') {
        // Handle UPI payment
        console.log('Processing UPI payment');
      } else {
        // Handle COD
        console.log('Processing Cash on Delivery');
      }

      // Simulate payment processing
      setTimeout(() => {
        alert(`Payment of ${formatPrice(total)} processed successfully via ${paymentMethod}!`);
        setLoading(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        <h2 className="mb-4 text-xl font-bold dark:text-white">Choose Payment Method</h2>
        
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value as 'card')}
              className="text-indigo-600"
            />
            <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="font-medium dark:text-white">Credit/Debit Card</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Secure payment via Stripe</p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
              className="text-indigo-600"
            />
            <Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="font-medium dark:text-white">UPI Payment</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pay using any UPI app</p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
              className="text-indigo-600"
            />
            <Truck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="font-medium dark:text-white">Cash on Delivery</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive</p>
            </div>
          </label>
        </div>

        <div className="mt-6 border-t pt-4 dark:border-gray-700">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-medium dark:text-white">Total Amount</span>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}