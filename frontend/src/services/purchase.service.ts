import api from "./api";

export async function getPurchases() {
  const response = await api.get("/purchases/");
  return response.data;
}

export async function createPurchase(purchase: {
  supplier_id: number;
  medicine_id: number;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  batch_number: string;
  manufacture_date: string;
  expiry_date: string;
}) {
  const response = await api.post(
    "/purchases/",
    purchase
  );

  return response.data;
}