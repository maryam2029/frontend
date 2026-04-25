import api from "@/api/axios";

export async function getInvoices() {
  const response = await api.get("/invoice");
  return response.data?.invoices ?? [];
}

export async function getInvoiceById(id) {
  const response = await api.get(`/invoice/${id}`);
  return response.data?.invoice ?? response.data;
}

export async function createInvoice(payload) {
  const response = await api.post("/invoice", payload);
  return response.data;
}

export async function updateInvoice(id, payload) {
  const response = await api.patch(`/invoice/${id}`, payload);
  return response.data;
}

export async function deleteInvoice(id) {
  const response = await api.delete(`/invoice/${id}`);
  return response.data;
}
