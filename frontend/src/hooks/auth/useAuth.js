import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";

const getCurrentUser = async () => {
  const { data } = await api.get("/users/me");
  return data.user;
};

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
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
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["users"] });
    },
  });
};
