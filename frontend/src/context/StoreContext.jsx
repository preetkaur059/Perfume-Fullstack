import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    const storeCart = localStorage.getItem('cart')
    return storeCart ? JSON.parse(storeCart) : []
  });
  const [wishlist, setWishlist] = useState(() => {
    const storeWishlist = localStorage.getItem('wishlist')
    return storeWishlist ? JSON.parse(storeWishlist) : []
  });

  // search items 
  const [searchItem, setSearchItem] = useState('');

  // save items to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [cart, wishlist])


  // add to cart 
  const addToCart = (product) => {

    setCart(prevCart => {

      const existingItem = prevCart.find(item => item.id === product.id);

      //  If already exists → increase quantity
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      //  If not exists → add with quantity 1
      return [...prevCart, { ...product, quantity: 1 }];

    });
  };

  const quantityIncrement = (id) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const quantityDecrease = (id) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const subTotal = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  // const shippingFee = totalItems * 2;
  const orderTotal = subTotal ;

  // add to wishlist 
  const addToWishlist = (product) => {
    setWishlist(prev => {
      const alreadyAdded = prev.find(item => item.id === product.id);

      if (alreadyAdded) {
        // remove if already exists (toggle)
        return prev.filter(item => item.id !== product.id);
      } else {
        // add if not exists
        return [...prev, product];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phone: ""
  });

  // clear cart 
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // when click the proceed to payment button then remove the bags count 
  const [cartCount, setCartCount] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart]);
  

  const clearDeliveryInfo = () => {
    setDeliveryInfo({
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
      phone: ""
    });
  };


  return (
    <StoreContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      quantityIncrement,
      quantityDecrease,
      addToWishlist,
      removeFromCart,
      subTotal,
      totalItems,
      orderTotal,
      removeFromWishlist,
      searchItem,
      setSearchItem,
      deliveryInfo,
      setDeliveryInfo,
      clearDeliveryInfo,
      clearCart,
      cartCount,
      setCartCount,
      orderNumber,
      setOrderNumber
    }}>
      {children}
    </StoreContext.Provider>
  );
};