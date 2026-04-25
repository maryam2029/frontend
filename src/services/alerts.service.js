import api from "@/api/axios";

export async function getAlerts() {
  const response = await api.get("/alerts");
  return Array.isArray(response.data) ? response.data : [];
}

export async function markAlertAsRead(id) {
  const response = await api.patch(`/alerts/${id}/read`);
  return response.data;
}
