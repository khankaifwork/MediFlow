export type Purchase = {
  id: number;

  supplier_id: number;

  medicine_id: number;

  quantity: number;

  purchase_price: number;

  selling_price: number;

  batch_number: string;

  manufacture_date: string;

  expiry_date: string;
};