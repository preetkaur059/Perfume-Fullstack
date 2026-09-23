import { createContext, useCallback, useEffect, useState } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const getProductId = (product) => product._id ?? product.id;

  const [cart, setCart] = useState(() => {
    const storeCart = localStorage.getItem('cart')
    return storeCart ? JSON.parse(storeCart) : []
  });
  const [wishlist, setWishlist] = useState(() => {
    const storeWishlist = localStorage.getItem('wishlist')
    return storeWishlist ? JSON.parse(storeWishlist) : []
  });
  // A Buy Now purchase is intentionally kept separate from the saved cart.
  // This lets Checkout reuse its normal order flow without adding a duplicate
  // cart entry for the product being purchased immediately.
  const [buyNowItem, setBuyNowItem] = useState(null);

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

      const productId = getProductId(product);
      const existingItem = prevCart.find(item => getProductId(item) === productId);

      //  If already exists → increase quantity
      if (existingItem) {
        return prevCart.map(item =>
          getProductId(item) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      //  If not exists → add with quantity 1
      return [...prevCart, { ...product, quantity: 1 }];

    });
  };

  const startBuyNow = (product) => {
    setBuyNowItem({ ...product, quantity: 1 });
  };

  const clearBuyNow = useCallback(() => {
    setBuyNowItem(null);
  }, []);

  const quantityIncrement = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        getProductId(item) === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const quantityDecrease = (productId) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          getProductId(item) === productId
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
      const productId = getProductId(product);
      const alreadyAdded = prev.find(item => getProductId(item) === productId);

      if (alreadyAdded) {
        // remove if already exists (toggle)
        return prev.filter(item => getProductId(item) !== productId);
      } else {
        // add if not exists
        return [...prev, product];
      }
    });
  };
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => getProductId(item) !== productId));
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => getProductId(item) !== productId));
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

  // The bag badge is derived from cart items, so it always stays in sync.
  const cartCount = totalItems;
  const [orderNumber, setOrderNumber] = useState("");


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
      buyNowItem,
      wishlist,
      addToCart,
      startBuyNow,
      clearBuyNow,
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
      orderNumber,
      setOrderNumber,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
