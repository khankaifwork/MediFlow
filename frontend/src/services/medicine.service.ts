import api from "./api";
import type { Medicine, MedicineCreate, MedicineUpdate } from "../types/medicine";

export async function getMedicines(skip: number = 0, limit: number = 20): Promise<Medicine[]> {
  const response = await api.get<Medicine[]>(`/medicines?skip=${skip}&limit=${limit}`);
  return response.data;
}

export async function getMedicine(id: number): Promise<Medicine> {
  const response = await api.get<Medicine>(`/medicines/${id}`);
  return response.data;
}

export async function createMedicine(data: MedicineCreate): Promise<Medicine> {
  const response = await api.post<Medicine>("/medicines", data);
  return response.data;
}

export async function updateMedicine(id: number, data: MedicineUpdate): Promise<Medicine> {
  const response = await api.put<Medicine>(`/medicines/${id}`, data);
  return response.data;
}

export async function deleteMedicine(id: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/medicines/${id}`);
  return response.data;
}

export async function searchMedicines(name: string): Promise<Medicine[]> {
  const response = await api.get<Medicine[]>(`/medicines/search?name=${encodeURIComponent(name)}`);
  return response.data;
}