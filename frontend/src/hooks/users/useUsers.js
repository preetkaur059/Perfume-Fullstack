import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";

const getUsers = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await api.get("/users/all", { params: { page, limit } });
  return data;
};

export const useUsers = (params = {}) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });

const updateUser = async ({ id, userData }) => {
  const { data } = await api.patch(`/users/${id}`, userData);
  return data.user;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
