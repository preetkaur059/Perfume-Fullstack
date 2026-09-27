import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";

const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/users/me");
    return data.user ?? null;
  } catch (err) {
    if (err.response?.status === 401) {
      return null;
    }
    throw err;
  }
};

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

const login = async (credentials) => {
  const { data } = await api.post("/users/login", credentials);
  return data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

const logout = async () => {
  const { data } = await api.post("/users/logout");
  return data;
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["users"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["wishlist"] });
      queryClient.removeQueries({ queryKey: ["orders"] });
    },
  });
};
