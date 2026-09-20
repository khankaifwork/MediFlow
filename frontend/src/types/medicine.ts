export type Medicine = {
  id: number;
  name: string;
  manufacturer: string;
  price: number;
  stock: number;
  expiry_date: string;
  prescription_required: boolean;
};

export type MedicineCreate = Omit<Medicine, "id">;
export type MedicineUpdate = Partial<MedicineCreate>;