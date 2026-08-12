import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import PurchaseForm from "../../components/purchases/PurchaseForm";
import PurchaseTable from "../../components/purchases/PurchaseTable";

import { getPurchases } from "../../services/purchase.service";

import type { Purchase } from "../../types/purchase";

function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  async function loadPurchases() {
    try {
      const data = await getPurchases();
      setPurchases(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadPurchases();
  }, []);

  return (
    <AppLayout>
      <h1 className="mb-6 text-3xl font-bold">
        Purchases
      </h1>

      <PurchaseForm
        onPurchaseAdded={loadPurchases}
      />

      <PurchaseTable
        purchases={purchases}
      />
    </AppLayout>
  );
}

export default PurchasesPage;