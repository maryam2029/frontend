<<<<<<< HEAD
import React from 'react';
import { Search, UserPlus, Building2, ChevronRight, Edit3 } from 'lucide-react';

const SuppliersPage = () => {
  const suppliers = [
    { id: 1, name: 'Global Glass Co.', contact: 'Elena Vance', email: 'elena@globalglass.com', products: 142, status: 'ACTIVE', color: 'text-blue-600 bg-blue-50' },
    { id: 2, name: 'Precision Steel Ltd.', contact: 'Marcus Thorne', email: 'm.thorne@psteel.io', products: 86, status: 'ACTIVE', color: 'text-indigo-600 bg-indigo-50' },
    { id: 3, name: 'EcoChemicals NV', contact: 'Sarah Connor', email: 'sarah@ecochem.net', products: 23, status: 'PENDING', color: 'text-sky-600 bg-sky-50' },
    { id: 4, name: 'Direct Logistics', contact: 'Tom Wilson', email: 'tw@directlog.com', products: 412, status: 'ACTIVE', color: 'text-blue-700 bg-blue-100' },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#f8faff] min-h-screen font-sans text-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Supply Chain Architecture</p>
          <h1 className="text-3xl md:text-4xl font-black text-[#1a2b4b]">Suppliers</h1>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter ledger..." 
              className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-white border-none rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 md:py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
            <UserPlus size={18} /> <span className="whitespace-nowrap">Add Supplier</span>
=======
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Building2,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "@/services/supplier.service";

const initialSupplierForm = {
  name: "",
  phone: "",
  address: "",
  email: "",
};

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialSupplierForm);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadSuppliers = async ({ withLoader = true } = {}) => {
    if (withLoader) {
      setLoading(true);
      setError("");
    }

    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err.message || "Unable to load suppliers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSuppliers({ withLoader: false });
  }, []);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return suppliers;

    return suppliers.filter((supplier) => {
      const name = supplier.name?.toLowerCase() || "";
      const email = supplier.email?.toLowerCase() || "";
      const phone = supplier.phone?.toLowerCase() || "";
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }, [suppliers, search]);

  const activeSuppliersCount = filteredSuppliers.length;
  const totalLinkedProducts = filteredSuppliers.reduce(
    (sum, supplier) => sum + (supplier.products?.length || 0),
    0,
  );

  const handleCreateSupplier = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await createSupplier({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        email: form.email.trim(),
      });

      if (response?.supplier) {
        setSuppliers((current) => [response.supplier, ...current]);
      } else {
        await loadSuppliers();
      }

      setForm(initialSupplierForm);
    } catch (err) {
      setError(err.message || "Unable to create supplier.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm("Delete this supplier?")) return;

    setBusyId(supplierId);
    setError("");

    try {
      await deleteSupplier(supplierId);
      setSuppliers((current) => current.filter((supplier) => supplier.id !== supplierId));
    } catch (err) {
      setError(err.message || "Unable to delete supplier.");
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (supplier) => {
    setEditingSupplier({
      id: supplier.id,
      name: supplier.name || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      email: supplier.email || "",
    });
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!editingSupplier) return;

    setBusyId(editingSupplier.id);
    setError("");

    try {
      const payload = {
        name: editingSupplier.name.trim(),
        phone: editingSupplier.phone.trim(),
        address: editingSupplier.address.trim(),
        email: editingSupplier.email.trim(),
      };

      const response = await updateSupplier(editingSupplier.id, payload);
      const updatedSupplier = response?.supplier || payload;

      setSuppliers((current) =>
        current.map((supplier) =>
          supplier.id === editingSupplier.id
            ? {
                ...supplier,
                ...updatedSupplier,
                products: supplier.products,
              }
            : supplier,
        ),
      );

      setEditingSupplier(null);
    } catch (err) {
      setError(err.message || "Unable to update supplier.");
    } finally {
      setBusyId(null);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8faff] min-h-screen text-slate-900">
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
            Supply Chain
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-[#1a2b4b]">Suppliers</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={() => void loadSuppliers()}
            className="flex items-center justify-center gap-2 bg-white text-slate-700 px-4 py-3 rounded-xl font-semibold text-sm shadow-sm border border-slate-100 hover:bg-slate-50 transition"
          >
            <RefreshCw size={16} />
            Refresh
>>>>>>> ffc9429 (initial frontend commit)
          </button>
        </div>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-12">
        <div className="lg:col-span-8 order-2 lg:order-1">
          <div className="hidden md:grid grid-cols-12 px-6 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <div className="col-span-4">Name / Entity</div>
            <div className="col-span-4">Primary Contact</div>
            <div className="col-span-2">Inventory</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Activity</div>
          </div>
          
          <div className="space-y-3">
            {suppliers.map((s) => (
              <div key={s.id} className="grid grid-cols-1 md:grid-cols-12 items-center bg-white p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group gap-4 md:gap-0">
                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                  <div className={`p-2.5 md:p-3 rounded-xl shrink-0 ${s.color}`}>
                    <Building2 size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm md:text-base text-slate-800 group-hover:text-blue-600 transition truncate">{s.name}</p>
                    <p className="md:hidden text-[11px] text-gray-400 font-medium truncate">{s.email}</p>
                  </div>
                </div>
                <div className="hidden md:block col-span-4">
                  <p className="text-sm font-bold text-slate-700">{s.contact}</p>
                  <p className="text-[11px] text-gray-400 font-medium truncate">{s.email}</p>
                </div>
                <div className="col-span-1 md:col-span-2 flex md:block items-center justify-between">
                  <p className="md:hidden text-[10px] text-gray-400 font-bold uppercase">Inventory</p>
                  <div>
                    <p className="text-sm font-black text-slate-700 md:inline">{s.products}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase md:mt-0.5">Products</p>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-1 flex md:block justify-end">
                   <span className={`text-[9px] font-black px-2 py-1 rounded-md ${
                    s.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <div className="hidden md:flex col-span-1 justify-end text-gray-300">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 order-1 lg:order-2 bg-[#eff4ff] rounded-4xl md:rounded-[2.5rem] p-6 md:p-8 border border-white shadow-sm h-fit">
          <div className="flex justify-between items-start mb-6">
            <div className="min-w-0">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 md:mb-2">Supplier Profile</p>
              <h2 className="text-xl md:text-2xl font-black text-[#1a2b4b] leading-tight truncate">Precision Steel Ltd.</h2>
              <p className="text-xs font-bold text-gray-400 mt-1">Industrial Heavy Materials</p>
            </div>
            <button className="bg-white p-2 rounded-lg text-gray-400 hover:text-blue-600 transition shadow-sm shrink-0">
              <Edit3 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-white p-4 md:p-5 rounded-2xl">
              <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase mb-1">Stock Vol.</p>
              <p className="text-xl md:text-2xl font-black text-slate-800">4.2k</p>
            </div>
            <div className="bg-white p-4 md:p-5 rounded-2xl">
              <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase mb-1">Avg Lead</p>
              <p className="text-xl md:text-2xl font-black text-slate-800">4.5d</p>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] md:text-[11px] font-black text-[#1a2b4b] uppercase tracking-widest">Linked Products</h3>
              <button className="text-[9px] md:text-[10px] font-bold text-blue-600">View All</button>
            </div>
            <div className="space-y-3">
              <ProductItem name="Stainless Beam 40x40" sku="SKU: ST-440-LX" />
              <ProductItem name="Galvanized Sheet 2mm" sku="SKU: GS-200-MT" />
            </div>
          </div>

          <div>
            <h3 className="text-[10px] md:text-[11px] font-black text-[#1a2b4b] uppercase tracking-widest mb-4">Purchase History</h3>
            <div className="space-y-2">
              <HistoryItem id="#PO-8829" date="12 Oct 2023" amount="$12,450" />
              <HistoryItem id="#PO-8751" date="04 Sep 2023" amount="$8,120" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <SummaryCard label="Suppliers" value="84" />
        <SummaryCard label="Active" value="62" />
        <SummaryCard label="Health" value="94%" />
        <SummaryCard label="Volume" value="$1.2M" />
      </div>
=======
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <SummaryCard label="Shown Suppliers" value={activeSuppliersCount} />
            <SummaryCard label="Linked Products" value={totalLinkedProducts} />
          </div>

          {error ? (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          ) : null}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="h-64 flex items-center justify-center text-slate-500">
                <Loader2 className="animate-spin mr-2" size={18} />
                Loading suppliers...
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                <Building2 size={24} className="mb-3" />
                No suppliers found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Building2 size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{supplier.name}</p>
                      <p className="text-xs text-slate-400 truncate">{supplier.address}</p>
                    </div>

                    <div className="text-xs text-slate-500 min-w-50">
                      <p className="flex items-center gap-1.5 mb-1">
                        <Mail size={13} />
                        {supplier.email}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone size={13} />
                        {supplier.phone}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-blue-600 shrink-0">
                      {supplier.products?.length || 0} products
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => startEdit(supplier)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => void handleDeleteSupplier(supplier.id)}
                        disabled={busyId === supplier.id}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-semibold disabled:opacity-60"
                      >
                        {busyId === supplier.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 h-fit">
          <div className="flex items-center gap-2 mb-5">
            <UserPlus size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Add Supplier</h2>
          </div>

          <form onSubmit={handleCreateSupplier} className="space-y-3">
            <Field
              label="Supplier Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="ABC Supplies"
              required
            />
            <Field
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              placeholder="01012345678"
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="supplier@example.com"
              required
            />
            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleFormChange}
              placeholder="Cairo, Egypt"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
              {submitting ? "Creating..." : "Create Supplier"}
            </button>
          </form>
        </div>
      </div>

      {editingSupplier ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-xl bg-white rounded-2xl border border-slate-100 p-5 md:p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Edit Supplier</h2>
              <button
                type="button"
                onClick={() => setEditingSupplier(null)}
                className="text-xs font-semibold text-slate-500"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <Field
                label="Supplier Name"
                value={editingSupplier.name}
                onChange={(event) =>
                  setEditingSupplier((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
              <Field
                label="Phone"
                value={editingSupplier.phone}
                onChange={(event) =>
                  setEditingSupplier((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                required
              />
              <Field
                label="Email"
                type="email"
                value={editingSupplier.email}
                onChange={(event) =>
                  setEditingSupplier((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
              />
              <Field
                label="Address"
                value={editingSupplier.address}
                onChange={(event) =>
                  setEditingSupplier((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setEditingSupplier(null)}
                className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busyId === editingSupplier.id}
                className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-60"
              >
                {busyId === editingSupplier.id ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
>>>>>>> ffc9429 (initial frontend commit)
    </div>
  );
};

<<<<<<< HEAD
const ProductItem = ({ name, sku }) => (
  <div className="flex items-center gap-3 bg-white/50 p-2 rounded-xl min-w-0">
    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-lg shrink-0"></div>
    <div className="min-w-0">
      <p className="text-[11px] md:text-xs font-bold text-slate-800 truncate">{name}</p>
      <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase truncate">{sku}</p>
    </div>
  </div>
);

const HistoryItem = ({ id, date, amount }) => (
  <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-white/40">
    <div>
      <p className="text-[10px] md:text-[11px] font-black text-slate-800">{id}</p>
      <p className="text-[8px] md:text-[9px] text-gray-400 font-bold">{date}</p>
    </div>
    <p className="text-xs md:text-sm font-black text-slate-800">{amount}</p>
  </div>
);

const SummaryCard = ({ label, value }) => (
  <div className="bg-[#eff4ff] p-5 md:p-8 rounded-3xl md:rounded-4xl border border-white shadow-sm text-center lg:text-left">
    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">{label}</p>
    <p className="text-2xl md:text-4xl font-black text-blue-600">{value}</p>
  </div>
);

export default SuppliersPage;
=======
function SummaryCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-blue-600">{value}</p>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

export default SuppliersPage;
>>>>>>> ffc9429 (initial frontend commit)
