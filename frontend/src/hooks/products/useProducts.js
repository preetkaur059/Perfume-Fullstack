import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";

const getProducts = async () => {
  const { data } = await api.get("/products/all");
  return Array.isArray(data) ? data : data.data ?? data.products ?? [];
};

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

const getProduct = async (productId) => {
  const { data } = await api.get(`/products/${productId}`);
  return data.product;
};

export const useProduct = (productId) =>
  useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
  });

const createProduct = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data.data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

const updateProduct = async ({ productId, productData }) => {
  const { data } = await api.patch(`/products/${productId}`, productData);
  return data.data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", product._id] });
    },
  });
};

const deleteProduct = async (productId) => {
  await api.delete(`/products/${productId}`);
  return productId;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.removeQueries({ queryKey: ["product", productId] });
    },
  });
};
