import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";

const getUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  role = "All",
  sort = "newest",
} = {}) => {
  const { data } = await api.get("/users/all", {
    params: {
      page,
      limit,
      ...(search && { search }),
      ...(role && role !== "All" && { role }),
      ...(sort && { sort }),
    },
  });
  return data;
};

export const useUsers = (params = {}) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });

const getUserStats = async () => {
  const { data } = await api.get("/users/stats");
  return data;
};

export const useUserStats = () =>
  useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStats,
  });

const updateUser = async ({ id, userData }) => {
  const { data } = await api.patch(`/users/${id}`, userData);
  return data.user;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

const deleteUser = async (userId) => {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};
