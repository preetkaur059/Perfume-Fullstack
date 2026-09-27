import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { useCurrentUser } from "@/hooks/auth/useAuth";

const fetchWishlist = async () => {
  const { data } = await api.get("/wishlist");
  return data.wishlist ?? data.items ?? [];
};

export const useWishlist = () => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: !!user,
    staleTime: 1000 * 60, // 1 min
  });
};

const addToWishlist = async (productId) => {
  const { data } = await api.post("/wishlist", { productId });
  return data;
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

const removeFromWishlist = async (productId) => {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return data;
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

const checkWishlist = async (productId) => {
  const { data } = await api.get(`/wishlist/check/${productId}`);
  return data.inWishlist;
};

export const useCheckWishlist = (productId) => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ["wishlist", "check", productId],
    queryFn: () => checkWishlist(productId),
    enabled: !!user && !!productId,
  });
};
