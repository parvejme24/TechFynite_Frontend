"use client"
import React, { useState, useEffect } from 'react';
import OrderConfirmation from './OrderConfirmation';
import UserAccountForm from './UserAccountForm';
import { CheckoutOrder, CheckoutUser } from '@/types/checkout';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/user';

interface CheckoutContainerProps {
  templateId: string;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ templateId }) => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [userInfo, setUserInfo] = useState<CheckoutUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser as unknown as User);
    }
  }, [currentUser]);

  // Generate fake order data based on templateId
  useEffect(() => {
    const generateOrder = () => {
      const fakeTemplates = {
        'template-1': {
          name: 'E-Commerce Dashboard',
          category: 'Dashboard',
          price: 49.99,
          image: '/assets/common/placeholder.png'
        },
        'template-2': {
          name: 'Admin Panel Pro',
          category: 'Admin Panel',
          price: 79.99,
          image: '/assets/common/placeholder.png'
        },
        'template-3': {
          name: 'Portfolio Website',
          category: 'Portfolio',
          price: 29.99,
          image: '/assets/common/placeholder.png'
        },
        'template-4': {
          name: 'Blog Template',
          category: 'Blog',
          price: 39.99,
          image: '/assets/common/placeholder.png'
        }
      };

      const template = fakeTemplates[templateId as keyof typeof fakeTemplates] || {
        name: 'Premium Template',
        category: 'General',
        price: 59.99,
        image: '/assets/common/placeholder.png'
      };

      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setOrder({
        orderId,
        templateId,
        templateName: template.name,
        templateImage: template.image,
        category: template.category,
        price: template.price,
        discount: 0,
        payableAmount: template.price,
        currency: 'USD'
      });

      // If user is logged in, pre-fill user info
      if (user) {
        setUserInfo({
          id: user.id,
          email: user.email || '',
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          company: '',
          phone: user.phone || '',
          address: {
            street: '',
            city: user.city || '',
            state: user.stateOrRegion || '',
            zipCode: user.postCode || '',
            country: user.country || ''
          }
        });
      }

      setIsLoading(false);
    };

    generateOrder();
  }, [templateId, user]);

  const handleOrderUpdate = (updatedOrder: CheckoutOrder) => {
    setOrder(updatedOrder);
  };

  const handleUserInfoUpdate = (updatedUserInfo: CheckoutUser) => {
    setUserInfo(updatedUserInfo);
  };

  const handleCheckout = async () => {
    if (!order || !userInfo) {
      alert('Please fill in all required information');
      return;
    }

    try {
      // Here you would integrate with FastSpring or your payment processor
      console.log('Processing checkout:', { order, userInfo });
      
      // Redirect to payment processor or show success message
      alert('Redirecting to payment processor...');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Complete Your Purchase
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
          Secure checkout powered by FastSpring
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Side - Order Confirmation */}
        <div className="space-y-6">
          <OrderConfirmation 
            order={order!} 
            onOrderUpdate={handleOrderUpdate}
          />
        </div>

        {/* Right Side - User Account Form */}
        <div className="space-y-6">
          <UserAccountForm 
            userInfo={userInfo}
            onUserInfoUpdate={handleUserInfoUpdate}
            isLoggedIn={!!user}
          />
        </div>
      </div>

      {/* Payment Method Info */}
      <div className="mt-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Secure Payment Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The payment method for this invoice will be processed by FastSpring
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-2xl">💳</span>
              <span>Credit Cards</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-2xl">🔵</span>
              <span>PayPal</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-2xl">🏦</span>
              <span>Bank Transfer</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-2xl">₿</span>
              <span>Cryptocurrency</span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleCheckout}
              disabled={!order || !userInfo}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Register and Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContainer;
