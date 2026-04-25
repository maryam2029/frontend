import api from "@/api/axios";

export async function getSuppliers() {
  const response = await api.get("/suppliers");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getSupplierById(id) {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
}

export async function createSupplier(payload) {
  const response = await api.post("/suppliers", payload);
  return response.data;
}

export async function updateSupplier(id, payload) {
  const response = await api.patch(`/suppliers/${id}`, payload);
  return response.data;
}

export async function deleteSupplier(id) {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
}
