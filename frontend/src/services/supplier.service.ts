import api from "./api";

import type { Supplier } from "../types/supplier";

export async function getSuppliers() {
  const response = await api.get("/suppliers/");
  return response.data;
}

export async function getSupplier(id: number) {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
}

export async function createSupplier(
  supplier: Omit<Supplier, "id">
) {
  const response = await api.post(
    "/suppliers/",
    supplier
  );

  return response.data;
}

export async function updateSupplier(
  id: number,
  supplier: Omit<Supplier, "id">
) {
  const response = await api.put(
    `/suppliers/${id}`,
    supplier
  );

  return response.data;
}

export async function deleteSupplier(id: number) {
  const response = await api.delete(
    `/suppliers/${id}`
  );

  return response.data;
}