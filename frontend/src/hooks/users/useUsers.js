import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";

const getUsers = async () => {
  const { data } = await api.get("/users/all");
  return data.users ?? [];
};

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

const updateUser = async ({ userId, userData }) => {
  const { data } = await api.patch(`/users/${userId}`, userData);
  return data.user;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
