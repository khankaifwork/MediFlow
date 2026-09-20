import api from "./api";

export async function getSales() {
  const response = await api.get("/sales/");
  return response.data;
}

export async function createSale(sale: {
  customer_id: number;
  payment_method: string;
  discount: number;
  items: {
    medicine_id: number;
    quantity: number;
  }[];
}) {
  const response = await api.post("/sales/", sale);
  return response.data;
}