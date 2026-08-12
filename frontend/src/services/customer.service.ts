import api from "./api";

export async function getCustomers() {
  const response = await api.get("/customers");
  return response.data;
}

export async function getCustomer(id: number) {
  const response = await api.get(`/customers/${id}`);
  return response.data;
}

export async function createCustomer(customer: {
  name: string;
  phone: string;
  email: string;
  address: string;
}) {
  const response = await api.post("/customers", customer);
  return response.data;
}

export async function updateCustomer(
  id: number,
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  }
) {
  const response = await api.put(`/customers/${id}`, customer);
  return response.data;
}

export async function deleteCustomer(id: number) {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
}

export async function searchCustomers(name: string) {
  const response = await api.get(`/customers/search?name=${name}`);
  return response.data;
}