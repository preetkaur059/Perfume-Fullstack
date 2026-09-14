import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";

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
