import api from "@/api/axios";

export async function getProducts(params = {}) {
  const response = await api.get("/products", { params });
  return response.data?.data ?? [];
}

export async function getProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function createProduct(payload) {
  const response = await api.post("/products", payload);
  return response.data;
}

export async function updateProduct(id, payload) {
  const response = await api.patch(`/products/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
