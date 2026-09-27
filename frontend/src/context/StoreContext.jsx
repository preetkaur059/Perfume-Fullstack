import { createContext, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/auth/useAuth";
import {
  useCart,
  useAddToCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
  useClearCart,
} from "@/hooks/cart/useCart";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/wishlist/useWishlist";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const getProductId = (product) => product?._id ?? product?.id;

  const { data: user } = useCurrentUser();

  const { data: cartData = [], isLoading: isCartLoading } = useCart();
  const { data: wishlistData = [], isLoading: isWishlistLoading } =
    useWishlist();

  const addToCartMutation = useAddToCart();
  const updateCartQuantityMutation = useUpdateCartQuantity();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Cart and wishlist data are fetched and managed by backend + TanStack Query
  const cart = user ? cartData : [];
  const wishlist = user ? wishlistData : [];

  // Temporary UI state for immediate Buy Now purchases
  const [buyNowItem, setBuyNowItem] = useState(null);

  // Search input UI state
  const [searchItem, setSearchItem] = useState("");

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [orderNumber, setOrderNumber] = useState("");

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      toast.error(
        "Please login first to add this product to your cart/wishlist.",
      );
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    const productId = getProductId(product);
    if (!productId) return;

    addToCartMutation.mutate({ productId, quantity });
  };

  const startBuyNow = (product) => {
    setBuyNowItem({ ...product, quantity: 1 });
  };

  const clearBuyNow = useCallback(() => {
    setBuyNowItem(null);
  }, []);

  const quantityIncrement = (productId) => {
    if (!user || !productId) return;
    updateCartQuantityMutation.mutate({ productId, action: "increase" });
  };

  const quantityDecrease = (productId) => {
    if (!user || !productId) return;
    updateCartQuantityMutation.mutate({ productId, action: "decrease" });
  };

  const removeFromCart = (productId) => {
    if (!user || !productId) return;
    removeFromCartMutation.mutate(productId);
  };

  const clearCart = () => {
    if (!user) return;
    clearCartMutation.mutate();
  };

  const addToWishlist = (product) => {
    if (!user) {
      toast.error(
        "Please login first to add this product to your cart/wishlist.",
      );
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    const productId = getProductId(product);
    if (!productId) return;

    const alreadyAdded = wishlist.some(
      (item) => getProductId(item) === productId,
    );

    if (alreadyAdded) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  const removeFromWishlist = (productId) => {
    if (!user || !productId) return;
    removeFromWishlistMutation.mutate(productId);
  };

  const subTotal = cart.reduce((acc, item) => {
    return acc + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);

  const totalItems = cart.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0,
  );
  const cartCount = totalItems;
  const orderTotal = subTotal;

  const clearDeliveryInfo = () => {
    setDeliveryInfo({
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
      postalCode: "",
      country: "",
      phone: "",
    });
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        isCartLoading,
        buyNowItem,
        wishlist,
        isWishlistLoading,
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
