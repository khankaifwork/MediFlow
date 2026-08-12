import api from "./api";

export async function getDashboardReport() {
  const response = await api.get("/reports/dashboard");
  return response.data;
}

export async function getDailySales() {
  const response = await api.get("/reports/daily-sales");
  return response.data;
}

export async function getMonthlySales() {
  const response = await api.get("/reports/monthly-sales");
  return response.data;
}

export async function getTopMedicines() {
  const response = await api.get("/reports/top-medicines");
  return response.data;
}

export async function getTopCustomers() {
  const response = await api.get("/reports/top-customers");
  return response.data;
}

export async function getRevenueTrend() {
  const response = await api.get("/reports/revenue-trend");
  return response.data;
}