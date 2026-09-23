import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/api/client";
import { toast } from "react-toastify";

// ===============================
// GET ORDERS
// ===============================
const getOrders = async (url, params = {}) => {
  const { data } = await api.get(url, { params });
  return data;
};

export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    // The customer endpoint returns { success, data, pagination }. Customer
    // screens only need the order list, so expose that list consistently.
    queryFn: async () => {
      const response = await getOrders("/orders", params);
      return response?.data ?? [];
    },

    retry: false,

    staleTime: 60 * 1000,

    refetchOnWindowFocus: false,
  });
};

export const useAdminOrders = (params = {}) =>
  useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => getOrders("/admin/orders", params),
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useAdminOrderStats = () =>
  useQuery({
    queryKey: ["admin-order-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/orders/stats");
      return data;
    },
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

// ===============================
// CREATE ORDER
// ===============================
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, orderItems, status }) => {
      const payload = {
        user,
        orderItems,
        status,
      };

      const response = await api.post("/orders", payload);

      return response.data;
    },

    onSuccess: (data) => {
      // Refresh orders after creating a new order
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success(data.message || "Order created successfully");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create order");
    },
  });
};

export const useCreateAdminOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, orderItems, status }) => {
      const response = await api.post("/admin/orders", {
        user,
        orderItems,
        status,
      });

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-order-stats"],
      });

      toast.success(data.message || "Order created successfully");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create order");
    },
  });
};

// ===============================
// UPDATE ORDER
// ===============================
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, orderItems, status }) => {
      const response = await api.patch(`/admin/orders/${id}`, {
        orderItems,
        status,
      });

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-order-stats"],
      });

      toast.success(data.message || "Order updated successfully");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update order");
    },
  });
};

// ===============================
// DELETE ORDER
// ===============================
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/admin/orders/${id}`);

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-order-stats"],
      });

      toast.success(data.message || "Order deleted successfully");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete order");
    },
  });
};
