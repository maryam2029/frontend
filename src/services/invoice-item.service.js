import api from "@/api/axios";

export async function getInvoiceItems() {
  const response = await api.get("/invoice-item");
  return response.data?.data ?? [];
}

export async function getInvoiceItemById(id) {
  const response = await api.get(`/invoice-item/${id}`);
  return response.data?.data ?? response.data;
}

export async function createInvoiceItem(payload) {
  const response = await api.post("/invoice-item", payload);
  return response.data;
}

export async function updateInvoiceItem(id, payload) {
  const response = await api.patch(`/invoice-item/${id}`, payload);
  return response.data;
}

export async function deleteInvoiceItem(id) {
  const response = await api.delete(`/invoice-item/${id}`);
  return response.data;
}
