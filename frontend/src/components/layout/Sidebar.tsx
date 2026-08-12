import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Pill,
  Users,
  Truck,
  ShoppingCart,
  Receipt,
  Package,
  BarChart3,
  Bot,
} from "lucide-react";

const menu = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Pill, label: "Medicines", path: "/medicines" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Truck, label: "Suppliers", path: "/suppliers" },
  { icon: ShoppingCart, label: "Purchases", path: "/purchases" },
  { icon: Receipt, label: "Sales", path: "/sales" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Bot, label: "AI Assistant", path: "/ai" },
];

function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <nav className="space-y-2 p-4">
        {menu.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg p-3 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;