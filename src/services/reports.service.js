import api from "@/api/axios";

export async function getProfitReport({ type = "day", date }) {
  const response = await api.get("/reports/profit", {
    params: { type, date },
  });
  return response.data;
}

export async function getQuantitySoldReport({ date } = {}) {
  const response = await api.get("/reports/quantity-sold", {
    params: date ? { date } : {},
  });
  return response.data;
}

export async function getBestSellingReport({ limit = 10, date } = {}) {
  const response = await api.get("/reports/best-selling", {
    params: {
      limit,
      ...(date ? { date } : {}),
    },
  });
  return response.data;
}

export async function getActiveSuppliersReport({ date } = {}) {
  const response = await api.get("/reports/active-suppliers", {
    params: date ? { date } : {},
  });
  return response.data;
}

export async function exportFullReportPdf(date) {
  const response = await api.get("/reports/export-full-pdf", {
    params: { date },
    responseType: "blob",
  });
  return response.data;
}
