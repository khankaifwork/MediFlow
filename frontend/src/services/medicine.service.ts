import api from "./api";

export async function getMedicines() {
  const response = await api.get("/medicines");
  return response.data;
}

export async function getMedicine(id: number) {
  const response = await api.get(`/medicines/${id}`);
  return response.data;
}

export async function createMedicine(data: any) {
  const response = await api.post("/medicines", data);
  return response.data;
}

export async function updateMedicine(
  id: number,
  data: any
) {
  const response = await api.put(
    `/medicines/${id}`,
    data
  );

  return response.data;
}

export async function deleteMedicine(id: number) {
  const response = await api.delete(
    `/medicines/${id}`
  );

  return response.data;
}

export async function searchMedicines(name: string) {
  const response = await api.get(
    `/medicines/search?name=${name}`
  );

  return response.data;
}