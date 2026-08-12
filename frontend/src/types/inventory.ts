export type Inventory = {
  id: number;

  name: string;

  manufacturer: string;

  stock: number;

  price: number;

  expiry_date: string;

  prescription_required: boolean;

  status: string;
};