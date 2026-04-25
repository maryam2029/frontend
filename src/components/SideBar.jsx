<<<<<<< HEAD
import { X, Package, LayoutGrid, Users, Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
=======
import {
  X,
  Package,
  LayoutGrid,
  Users,
  Receipt,
  Bell,
  ChartColumn,
  ListChecks,
} from "lucide-react";
>>>>>>> ffc9429 (initial frontend commit)
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { name: "Products", icon: Package, href: "/products" },
  { name: "Suppliers", icon: Users, href: "/suppliers" },
<<<<<<< HEAD
=======
  { name: "Invoices", icon: Receipt, href: "/invoices" },
  { name: "Invoice Items", icon: ListChecks, href: "/invoice-items" },
  { name: "Alerts", icon: Bell, href: "/alerts" },
  { name: "Reports", icon: ChartColumn, href: "/reports" },
>>>>>>> ffc9429 (initial frontend commit)
];

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
<<<<<<< HEAD
      <div 
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} 
        onClick={onClose}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none lg:static lg:translate-x-0 h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full p-4 border-r border-gray-100">
          
=======
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none lg:static lg:translate-x-0 h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full p-4 border-r border-gray-100">
>>>>>>> ffc9429 (initial frontend commit)
          <div className="flex items-center justify-between mb-10 mt-2 px-1 flex-none">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-xl p-2.5 shadow-md">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-950">Pharmacy</h1>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all
<<<<<<< HEAD
                      ${isActive 
                        ? "bg-blue-50 text-blue-600 font-bold shadow-sm" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}
=======
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-bold shadow-sm"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }
>>>>>>> ffc9429 (initial frontend commit)
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
<<<<<<< HEAD

          <div className="flex-none pt-4 pb-2 px-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl h-12 flex gap-2.5 items-center justify-center shadow-lg active:scale-[0.98] transition-all">
              <Plus className="h-5 w-5" />
              New Entry
            </Button>
          </div>
=======
>>>>>>> ffc9429 (initial frontend commit)
        </div>
      </aside>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> ffc9429 (initial frontend commit)
