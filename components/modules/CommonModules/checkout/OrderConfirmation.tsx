"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckoutOrder, Coupon } from '@/types/checkout';
import { 
  ShoppingCart, 
  Tag, 
  DollarSign, 
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

interface OrderConfirmationProps {
  order: CheckoutOrder;
  onOrderUpdate: (order: CheckoutOrder) => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onOrderUpdate }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Fake coupon validation
  const validateCoupon = async (code: string): Promise<Coupon> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fakeCoupons = {
      'SAVE10': { code: 'SAVE10', discount: 10, type: 'percentage' as const, valid: true },
      'SAVE20': { code: 'SAVE20', discount: 20, type: 'percentage' as const, valid: true },
      'FIXED5': { code: 'FIXED5', discount: 5, type: 'fixed' as const, valid: true },
      'WELCOME': { code: 'WELCOME', discount: 15, type: 'percentage' as const, valid: true }
    };

    const coupon = fakeCoupons[code as keyof typeof fakeCoupons];
    
    if (coupon) {
      return coupon;
    } else {
      throw new Error('Invalid coupon code');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const coupon = await validateCoupon(couponCode);
      setAppliedCoupon(coupon);
      
      // Calculate new payable amount
      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (order.price * coupon.discount) / 100;
      } else {
        discount = coupon.discount;
      }
      
      const newPayableAmount = Math.max(0, order.price - discount);
      
      onOrderUpdate({
        ...order,
        discount,
        couponCode: coupon.code,
        payableAmount: newPayableAmount
      });
      
      setCouponCode('');
    } catch (error) {
      alert('Invalid coupon code. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    onOrderUpdate({
      ...order,
      discount: 0,
      couponCode: undefined,
      payableAmount: order.price
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order.currency
    }).format(amount);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Confirmation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order ID */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Order ID:</span>
          <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
            {order.orderId}
          </span>
        </div>

        {/* Template Details */}
        <div className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={order.templateImage}
              alt={order.templateName}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {order.templateName}
            </h3>
            <Badge variant="secondary" className="mb-2">
              {order.category}
            </Badge>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Premium template with lifetime updates and support
            </p>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Pricing Breakdown</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Template Price:</span>
              <span className="font-medium">{formatCurrency(order.price)}</span>
            </div>
            
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-blue-600">{formatCurrency(order.payableAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Have a Coupon?</h4>
          
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-400">
                  Coupon applied: {appliedCoupon.code}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || isApplyingCoupon}
                size="sm"
                className="whitespace-nowrap"
              >
                {isApplyingCoupon ? 'Applying...' : 'Apply'}
              </Button>
            </div>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Try: SAVE10, SAVE20, FIXED5, WELCOME
          </p>
        </div>

        {/* Features Included */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">What&apos;s Included</h4>
          <div className="space-y-2">
            {[
              'Lifetime access to template',
              'Free updates and bug fixes',
              'Premium support for 1 year',
              'Source code included',
              'Commercial license',
              'Documentation and guides'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderConfirmation;
