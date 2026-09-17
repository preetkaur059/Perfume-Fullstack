import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/api/client";
import { toast } from "react-toastify";

// ===============================
// GET ORDERS
// ===============================
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],

    queryFn: async () => {
      const response = await api.get("/orders");

      return response.data.data;
    },

    retry: false,

    staleTime: 60 * 1000,

    refetchOnWindowFocus: false,
  });
};

// ===============================
// CREATE ORDER
// ===============================
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, orderItems, status }) => {
      const response = await api.post("/orders", {
        user,
        orderItems,
        status,
      });

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
      const response = await api.patch(`/orders/${id}`, {
        orderItems,
        status,
      });

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
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
      const response = await api.delete(`/orders/${id}`);

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success(data.message || "Order deleted successfully");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete order");
    },
  });
};
