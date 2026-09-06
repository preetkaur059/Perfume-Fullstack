import { createContext, useEffect, useState } from "react";
import api from "../api/client";

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
const [products, setProducts] = useState([]);

const getProducts = async () => {
  try {
    const { data } = await api.get("/products/all");
    setProducts(Array.isArray(data) ? data : data.products ?? []);
  } catch (error) {
    console.error("Error fetching products:", error);
    setProducts([]);
  }
};

useEffect(() => {
  getProducts();
}, []);

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
      setOrderNumber,
      products,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
