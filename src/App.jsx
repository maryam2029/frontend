<<<<<<< HEAD
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/SideBar";
import { Header } from "./components/Header"; 
=======
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/SideBar";
import { Header } from "./components/Header";
>>>>>>> ffc9429 (initial frontend commit)
import SuppliersPage from "./pages/supplier/SuppManagement";
import Dashboard from "./pages/dashbord/Dashboard";
import ProductsPage from "./pages/add-product/ProductManagement";
import AddProductPage from "./pages/add-product/AddProductPage";
<<<<<<< HEAD

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto bg-slate-50">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/add" element={<AddProductPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/invoices" element={<div className="p-10 font-bold">Invoices Page Content</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
=======
import InvoicesPage from "./pages/invoices/InvoicesPage";
import InvoiceItemsPage from "./pages/invoice-items/InvoiceItemsPage";
import AlertsPage from "./pages/alerts/AlertsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { API_UNAUTHORIZED_EVENT } from "@/api/axios";
import { clearStoredToken, getStoredToken } from "@/lib/auth";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(getStoredToken()));
    };

    if (typeof window !== "undefined") {
      window.addEventListener(API_UNAUTHORIZED_EVENT, syncAuthState);
      window.addEventListener("storage", syncAuthState);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(API_UNAUTHORIZED_EVENT, syncAuthState);
        window.removeEventListener("storage", syncAuthState);
      }
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(Boolean(getStoredToken()));
  };

  const handleLogout = () => {
    clearStoredToken();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage onAuthSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ForgotPasswordPage />
            )
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated ? (
              <div className="flex h-screen bg-gray-50 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <Header
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                    onLogout={handleLogout}
                  />

                  <main className="flex-1 overflow-y-auto bg-slate-50">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/add" element={<AddProductPage />} />
                      <Route path="/suppliers" element={<SuppliersPage />} />
                      <Route path="/invoices" element={<InvoicesPage />} />
                      <Route path="/invoice-items" element={<InvoiceItemsPage />} />
                      <Route path="/alerts" element={<AlertsPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
>>>>>>> ffc9429 (initial frontend commit)
