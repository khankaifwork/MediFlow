import api from "./api";

export async function getInventory() {
  const response = await api.get("/inventory/");
  return response.data;
}