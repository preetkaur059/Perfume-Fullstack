import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";

const getProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  sort = "newest",
  minPrice = "",
  maxPrice = "",
} = {}) => {
  const { data } = await api.get("/products", {
    params: {
      page,
      limit,
      ...(search && { search }),
      ...(category && category !== "All" && { category }),
      ...(sort && { sort }),
      ...(minPrice !== "" && minPrice !== undefined && { minPrice }),
      ...(maxPrice !== "" && maxPrice !== undefined && { maxPrice }),
    },
  });
  return data;
};

export const useProducts = (params = {}) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });

const getProductStats = async () => {
  const { data } = await api.get("/products/stats");
  return data;
};

export const useProductStats = () =>
  useQuery({
    queryKey: ["productStats"],
    queryFn: getProductStats,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
    },
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
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
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
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
      queryClient.removeQueries({ queryKey: ["product", productId] });
    },
  });
};
