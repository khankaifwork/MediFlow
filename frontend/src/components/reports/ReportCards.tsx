import type { DashboardReport } from "../../types/report";

type ReportCardsProps = {
  report: DashboardReport;
};

function ReportCards({
  report,
}: ReportCardsProps) {
  const cards = [
    {
      title: "Revenue",
      value: `₹${report.total_sales.toFixed(2)}`,
      color: "bg-green-600",
    },
    {
      title: "Purchases",
      value: `₹${report.total_purchases.toFixed(2)}`,
      color: "bg-blue-600",
    },
    {
      title: "Medicines",
      value: report.total_medicines,
      color: "bg-purple-600",
    },
    {
      title: "Customers",
      value: report.total_customers,
      color: "bg-orange-600",
    },
    {
      title: "Low Stock",
      value: report.low_stock,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} rounded-2xl p-6 text-white shadow`}
        >
          <h3 className="text-lg font-medium">
            {card.title}
          </h3>

          <p className="mt-3 text-3xl font-bold">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ReportCards;