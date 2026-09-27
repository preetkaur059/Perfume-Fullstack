import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { useCurrentUser } from "@/hooks/auth/useAuth";

const fetchCart = async () => {
  const { data } = await api.get("/cart");
  return data.items ?? data.cart ?? [];
};

export const useCart = () => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user,
    staleTime: 1000 * 60, // 1 min
  });
};

const addToCart = async ({ productId, quantity = 1 }) => {
  const { data } = await api.post("/cart", { productId, quantity });
  return data;
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

const updateCartQuantity = async ({ productId, quantity, action, delta }) => {
  const { data } = await api.patch(`/cart/${productId}`, {
    quantity,
    action,
    delta,
  });
  return data;
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

const removeFromCart = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

const clearCart = async () => {
  const { data } = await api.delete("/cart");
  return data;
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
