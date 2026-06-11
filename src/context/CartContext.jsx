import React, { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setLoading(true);
    const savedCart = sessionStorage.getItem("sjs_cart");
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        // Ensure each item has valid price and quantity
        const validatedCart = cart.map(item => ({
          ...item,
          price: item.price || 0,
          quantity: item.quantity || 1
        }));
        setCartItems(validatedCart);
        updateStats(validatedCart);
      } catch (e) {
        console.error("Error loading cart:", e);
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
      }
    }
    setLoading(false);
  };

  const updateStats = (items) => {
    // Calculate total with quantity support and ensure prices are numbers
    const total = items.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + (itemPrice * quantity);
    }, 0);
    
    setCartTotal(total);
    setCartCount(items.length);
    
    // Save to sessionStorage
    sessionStorage.setItem("sjs_cart", JSON.stringify(items));
  };

  const updateCartStats = (items) => {
    updateStats(items);
  };

  // Updated addToCart to handle object parameter (for CourseDetail) and individual params (for Courses page)
  const addToCart = (courseId, courseName, coursePrice, courseDuration, quantity = 1) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      window.location.href = "/login";
      return false;
    }

    // Handle if first parameter is an object (from CourseDetail)
    let id, name, price, duration, qty;
    if (typeof courseId === 'object' && courseId !== null) {
      // Called with object parameter
      const course = courseId;
      id = course.id;
      name = course.name;
      price = parseFloat(course.price) || 0;
      duration = course.duration || '';
      qty = course.quantity || 1;
    } else {
      // Called with individual parameters
      id = courseId;
      name = courseName;
      price = parseFloat(coursePrice) || 0;
      duration = courseDuration || '';
      qty = quantity;
    }

    const currentCart = [...cartItems];
    const existingItem = currentCart.find((item) => item.id === id);
    
    if (existingItem) {
      // Update quantity if course already in cart
      existingItem.quantity = (existingItem.quantity || 1) + qty;
      setCartItems(currentCart);
      updateStats(currentCart);
      toast.success(`${name} quantity updated in cart!`);
    } else {
      // Add new course to cart
      currentCart.push({
        id: id,
        name: name,
        price: price,
        duration: duration,
        quantity: qty
      });
      setCartItems(currentCart);
      updateStats(currentCart);
      toast.success(`${name} added to cart!`);
    }
    return true;
  };

  const removeFromCart = (courseId, courseName) => {
    const newCart = cartItems.filter((item) => item.id !== courseId);
    setCartItems(newCart);
    updateStats(newCart);
    toast.success(`${courseName} removed from cart`);
  };

  const updateQuantity = (courseId, quantity) => {
    if (quantity <= 0) {
      const item = cartItems.find(item => item.id === courseId);
      if (item) {
        removeFromCart(courseId, item.name);
      }
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === courseId ? { ...item, quantity: quantity } : item
    );
    setCartItems(updatedCart);
    updateStats(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    updateStats([]);
    toast.success("Cart cleared");
  };

  // Helper functions
  const getCartCount = () => cartCount;
  const getCartTotal = () => cartTotal;
  const getCartItems = () => cartItems;

  // Function to update cart items with latest prices from backend
  const updateCartPrices = (updatedItems) => {
    if (!updatedItems || updatedItems.length === 0) return;
    
    // Validate and update prices
    const validatedItems = updatedItems.map(item => ({
      ...item,
      price: parseFloat(item.price) || 0,
      quantity: item.quantity || 1
    }));
    
    setCartItems(validatedItems);
    updateStats(validatedItems);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems, // Important: This allows direct setting of cart items
        cartCount,
        cartTotal,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateCartStats,
        updateStats,
        getCartCount,
        getCartTotal,
        getCartItems,
        loadCart,
        updateCartPrices // New function to update prices
      }}
    >
      {children}
    </CartContext.Provider>
  );
};