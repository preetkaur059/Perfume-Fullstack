import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/api/client";
import { toast } from "react-toastify";

// ===============================
// GET ORDERS
// ===============================
const getOrders = async (url, { page = 1, limit = 10 } = {}) => {
  const { data } = await api.get(url, { params: { page, limit } });
  return data;
};

export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders("/orders", params),

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

// ===============================
// UPDATE ORDER
// ===============================
// export const useUpdateOrder = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ id, orderItems }) => {
//       const response = await api.patch(
//         `/orders/${id}`,
//         {
//           orderItems,
//         }
//       );

//       return response.data;
//     },

//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["orders"],
//       });

//       toast.success(
//         data.message || "Order updated successfully"
//       );
//     },

//     onError: (error) => {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to update order"
//       );
//     },
//   });
// };

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

      toast.success(data.message || "Order deleted successfully");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete order");
    },
  });
};
