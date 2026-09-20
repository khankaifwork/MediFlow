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
  Sparkles,
} from "lucide-react";

type NavSection = {
  title: string;
  items: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    path: string;
    badge?: string;
    glow?: boolean;
  }[];
};

const navigationSections: NavSection[] = [
  {
    title: "Core Operations",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: Receipt, label: "POS Sales Terminal", path: "/sales", badge: "Live" },
      { icon: Package, label: "Inventory & Stock", path: "/inventory" },
      { icon: Pill, label: "Medicines Catalog", path: "/medicines" },
    ],
  },
  {
    title: "Procurement & CRM",
    items: [
      { icon: ShoppingCart, label: "Restock Purchases", path: "/purchases" },
      { icon: Truck, label: "Suppliers & Vendors", path: "/suppliers" },
      { icon: Users, label: "Customer Registry", path: "/customers" },
    ],
  },
  {
    title: "Analytics & Intelligence",
    items: [
      { icon: Bot, label: "AI Assistant", path: "/ai", badge: "Gemini", glow: true },
      { icon: BarChart3, label: "Executive Reports", path: "/reports" },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200/80 bg-white/95 backdrop-blur-md flex flex-col justify-between p-4 overflow-y-auto">
      <nav className="space-y-6">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                            isActive
                              ? "text-white"
                              : item.glow
                              ? "text-teal-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isActive
                              ? "bg-white/20 text-white"
                              : item.glow
                              ? "bg-teal-100 text-teal-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick AI Tip Widget */}
      <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-50 to-cyan-50/50 p-3.5 mt-4">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
          <Sparkles className="h-4 w-4 text-teal-600 animate-pulse" />
          <span>Smart AI Powered</span>
        </div>
        <p className="mt-1 text-[11px] text-teal-700/80 leading-relaxed">
          Ask Gemini to audit low stock, analyze revenue, or review pharmacy KPIs.
        </p>
      </div>
    </aside>
  );
}