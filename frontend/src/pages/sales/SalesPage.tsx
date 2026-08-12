import AppLayout from "../../components/layout/AppLayout";
import SaleForm from "../../components/sales/SaleForm";

function SalesPage() {
  return (
    <AppLayout>
      <h1 className="mb-6 text-3xl font-bold">
        Sales
      </h1>

      <SaleForm />
    </AppLayout>
  );
}

export default SalesPage;