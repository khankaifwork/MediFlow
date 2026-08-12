export type SaleItem = {
  medicine_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type Sale = {
  id: number;
  invoice_number: string;
  customer_id: number;
  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;
  payment_method: string;
  sale_date: string;
  items: SaleItem[];
};