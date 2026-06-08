import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaCreditCard, FaSpinner } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems, removeFromCart, clearCart, loading } = useCart();
  const [processing, setProcessing] = useState(false);
  const [updatingPrices, setUpdatingPrices] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [localCartTotal, setLocalCartTotal] = useState(0);

  // Calculate cart total from cartItems
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
      setLocalCartTotal(total);
    } else {
      setLocalCartTotal(0);
    }
  }, [cartItems]);

  // Listen for payment approval events to clear cart
  useEffect(() => {
    const handlePaymentApproved = (event) => {
      console.log("Payment approved, clearing cart...", event.detail);
      clearCart();
      localStorage.removeItem('sjs_cart');
      localStorage.removeItem('pendingOrder');
      toast.success('Thank you for your purchase! Your cart has been cleared.');
    };
    
    window.addEventListener('paymentApproved', handlePaymentApproved);
    
    return () => {
      window.removeEventListener('paymentApproved', handlePaymentApproved);
    };
  }, [clearCart]);

  // Check if user is logged in and token is valid
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      console.log("Cart - Auth Check:", { token: !!token, userType });
      
      if (!token) {
        toast.error('Please login to view cart');
        navigate('/login', { state: { returnUrl: '/cart' } });
        return;
      }
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      try {
        // ✅ FIXED: Added /api/ prefix
        const response = await api.get('/api/auth/verify-token');
        console.log("Token verification response:", response.data);
        
        if (response.data.valid) {
          // User is authenticated
        } else {
          localStorage.clear();
          toast.error('Session expired. Please login again.');
          navigate('/login', { state: { returnUrl: '/cart' } });
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          toast.error('Session expired. Please login again.');
          navigate('/login', { state: { returnUrl: '/cart' } });
        } else {
          toast.error('Could not verify session. Please refresh the page.');
        }
      } finally {
        setAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Load cart with latest prices from database
  useEffect(() => {
    const loadCartWithLatestPrices = async () => {
      if (!cartItems || cartItems.length === 0) {
        console.log("No cart items to update");
        return;
      }
      
      setUpdatingPrices(true);
      try {
        // ✅ FIXED: Added /api/ prefix
        console.log("Fetching latest prices for cart items...");
        const response = await api.get('/api/courses/latest-prices');
        console.log("Latest prices response:", response.data);
        
        if (response.data && response.data.success && response.data.courses) {
          const latestCourses = response.data.courses;
          console.log("Latest courses data:", latestCourses);
          
          const updatedCart = cartItems.map(cartItem => {
            const latestCourse = latestCourses.find(c => c.id === cartItem.id);
            if (latestCourse) {
              console.log(`Updating course ${cartItem.name}: old price ${cartItem.price} -> new price ${latestCourse.price}`);
              return { 
                ...cartItem, 
                price: parseFloat(latestCourse.price) || 0,
                duration: latestCourse.duration || cartItem.duration
              };
            }
            return cartItem;
          });
          
          setCartItems(updatedCart);
          console.log("Cart updated with latest prices:", updatedCart);
        } else if (response.data && response.data.courses) {
          const latestCourses = response.data.courses;
          const updatedCart = cartItems.map(cartItem => {
            const latestCourse = latestCourses.find(c => c.id === cartItem.id);
            if (latestCourse) {
              return { ...cartItem, price: parseFloat(latestCourse.price) || 0 };
            }
            return cartItem;
          });
          setCartItems(updatedCart);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error('Error updating cart prices:', error);
      } finally {
        setUpdatingPrices(false);
      }
    };
    
    if (cartItems && cartItems.length > 0) {
      loadCartWithLatestPrices();
    }
  }, [cartItems.length, setCartItems]);

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to proceed');
      navigate('/login', { state: { returnUrl: '/cart' } });
      return;
    }

    setProcessing(true);
    
    try {
      const orderData = {
        courses: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price || 0,
          duration: item.duration,
          quantity: item.quantity || 1
        })),
        total_amount: localCartTotal
      };
      
      console.log("Creating order with data:", orderData);
      
      // ✅ FIXED: Added /api/ prefix
      const response = await api.post('/api/cart/create-order', orderData);
      console.log("Order creation response:", response.data);
      
      if (response.data.success) {
        const orderInfo = {
          orderId: response.data.order_id,
          totalAmount: response.data.total_amount,
          courses: response.data.courses,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('pendingOrder', JSON.stringify(orderInfo));
        
        navigate('/payment-verification', { state: orderInfo });
      } else {
        toast.error(response.data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.clear();
        navigate('/login', { state: { returnUrl: '/cart' } });
      } else {
        toast.error(error.response?.data?.error || 'Failed to process checkout');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4 text-center">
          <FaSpinner className="text-5xl text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (loading || updatingPrices) {
    return (
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4 text-center">
          <FaSpinner className="text-5xl text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{updatingPrices ? "Updating prices..." : "Loading your cart..."}</p>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4 text-center">
          <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Browse our courses and add some to your cart!</p>
          <Link to="/courses">
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition">
              Browse Courses →
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/courses" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition">
            <FaArrowLeft /> Continue Shopping
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart ({cartItems.length} items)</h1>

          {updatingPrices && (
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-center mb-4">
              <FaSpinner className="animate-spin inline mr-2" />
              Updating to latest prices...
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b hover:bg-gray-50 transition">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.duration || 'Course'}</p>
                  {item.quantity && item.quantity > 1 && (
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                  )}
                  <p className="text-primary-600 font-bold mt-1 md:hidden">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto mt-3 md:mt-0">
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary-600 hidden md:inline">
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </span>
                    {item.quantity && item.quantity > 1 && (
                      <p className="text-xs text-gray-400 hidden md:block">
                        ₹{(item.price || 0).toLocaleString()} each
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.name)}
                    className="text-red-500 hover:text-red-700 transition ml-4 md:ml-6"
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-6 pt-2 border-t">
                <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ₹{(localCartTotal || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCreditCard />
                      Proceed to Payment →
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                Secure payment gateway. Your information is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;