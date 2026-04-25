<<<<<<< HEAD
import React, { useState } from 'react';
import { Plus, Filter, Search, AlertCircle, Package, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialProducts = [
  { id: 1, name: 'Eames Lounge Chair - Walnut Edition', sku: 'SKU-FUR-0021', purchasePrice: 1240, sellingPrice: 4950, qty: 3, minQty: 5 },
  { id: 2, name: 'Bauhaus Modular Sofa - Deep Teal', sku: 'SKU-FUR-0943', purchasePrice: 840, sellingPrice: 1850, qty: 24, minQty: 10 },
];

const ProductsPage = () => {
  const [products] = useState(initialProducts);
  const navigate = useNavigate();
=======
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  AlertCircle,
  Package,
  Trash2,
  RefreshCw,
  Loader2,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/services/product.service";
import { getSuppliers } from "@/services/supplier.service";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyProductId, setBusyProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadProducts = async ({ withLoader = true } = {}) => {
    if (withLoader) {
      setLoading(true);
      setError("");
    }

    try {
      const [productsData, suppliersData] = await Promise.all([
        getProducts({ limit: 1000 }),
        getSuppliers(),
      ]);

      setProducts(productsData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts({ withLoader: false });
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const sku = product.sku?.toLowerCase() || "";
      return name.includes(normalizedQuery) || sku.includes(normalizedQuery);
    });
  }, [products, query]);

  const lowStockCount = useMemo(
    () => products.filter((product) => product.quantity <= product.minQuantity).length,
    [products],
  );

  const handleDelete = async (productId) => {
    const shouldDelete = window.confirm("Delete this product?");
    if (!shouldDelete) return;

    setBusyProductId(productId);
    try {
      await deleteProduct(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setBusyProductId(null);
    }
  };

  const startEdit = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name || "",
      sku: product.sku || "",
      buyPrice: `${product.buyPrice ?? ""}`,
      sellPrice: `${product.sellPrice ?? ""}`,
      quantity: `${product.quantity ?? ""}`,
      minQuantity: `${product.minQuantity ?? ""}`,
      supplierId: `${product.supplier?.id || ""}`,
    });
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingProduct) return;

    setSavingEdit(true);
    setError("");

    try {
      const payload = {
        name: editingProduct.name.trim(),
        sku: editingProduct.sku.trim(),
        buyPrice: Number(editingProduct.buyPrice),
        sellPrice: Number(editingProduct.sellPrice),
        quantity: Number(editingProduct.quantity),
        minQuantity: Number(editingProduct.minQuantity),
        supplierId: Number(editingProduct.supplierId),
      };

      if (
        !payload.name ||
        !payload.sku ||
        Number.isNaN(payload.buyPrice) ||
        Number.isNaN(payload.sellPrice) ||
        Number.isNaN(payload.quantity) ||
        Number.isNaN(payload.minQuantity) ||
        Number.isNaN(payload.supplierId)
      ) {
        throw new Error("Please complete all product fields with valid values.");
      }

      const updatedProduct = await updateProduct(editingProduct.id, payload);

      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...updatedProduct,
                supplier:
                  suppliers.find((supplier) => supplier.id === payload.supplierId) ||
                  product.supplier,
              }
            : product,
        ),
      );

      setEditingProduct(null);
    } catch (err) {
      setError(err.message || "Failed to update product.");
    } finally {
      setSavingEdit(false);
    }
  };
>>>>>>> ffc9429 (initial frontend commit)

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
<<<<<<< HEAD
          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Inventory Management</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Products Management</h1>
        </div>
        <div className="flex w-full sm:w-auto gap-2 md:gap-3">
          <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 md:px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition">
            <Filter size={16} /> Filters
          </button>
          <button 
            onClick={() => navigate('/products/add')}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-blue-600 text-white px-3 md:px-5 py-2 rounded-lg font-semibold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Add New
=======
          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
            Inventory Management
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Products Management
          </h1>
        </div>
        <div className="flex w-full sm:w-auto gap-2 md:gap-3">
          <button
            onClick={() => void loadProducts()}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 md:px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/products/add")}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-blue-600 text-white px-3 md:px-5 py-2 rounded-lg font-semibold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Add New
>>>>>>> ffc9429 (initial frontend commit)
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 mb-8">
        <div className="lg:col-span-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
<<<<<<< HEAD
          <input 
            type="text" 
            placeholder="Search products..." 
=======
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search by name or SKU..."
>>>>>>> ffc9429 (initial frontend commit)
            className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          />
        </div>
        <div className="grid grid-cols-2 lg:col-span-6 gap-4">
<<<<<<< HEAD
          <StatCard icon={<AlertCircle className="text-red-500" size={18} />} label="Low Stock" value="12 Items" color="bg-red-50" />
          <StatCard icon={<Package className="text-blue-500" size={18} />} label="Total" value="1,248" color="bg-blue-50" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150 md:min-w-full">
            <thead>
              <tr className="text-[10px] md:text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50/30">
                <th className="px-4 md:px-6 py-4 font-bold">Product Name</th>
                <th className="px-2 md:px-4 py-4 font-bold text-center">Purchase</th>
                <th className="px-2 md:px-4 py-4 font-bold text-center">Selling</th>
                <th className="px-2 md:px-4 py-4 font-bold text-center">Qty</th>
                <th className="px-2 md:px-4 py-4 font-bold text-center">Min</th>
                <th className="px-4 md:px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <EmptyState />}
      </div>
=======
          <StatCard
            icon={<AlertCircle className="text-red-500" size={18} />}
            label="Low Stock"
            value={`${lowStockCount} Items`}
            color="bg-red-50"
          />
          <StatCard
            icon={<Package className="text-blue-500" size={18} />}
            label="Total"
            value={products.length}
            color="bg-blue-50"
          />
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : null}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="h-56 flex items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading products...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-180 md:min-w-full">
              <thead>
                <tr className="text-[10px] md:text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50/30">
                  <th className="px-4 md:px-6 py-4 font-bold">Product</th>
                  <th className="px-2 md:px-4 py-4 font-bold">Supplier</th>
                  <th className="px-2 md:px-4 py-4 font-bold text-center">Purchase</th>
                  <th className="px-2 md:px-4 py-4 font-bold text-center">Selling</th>
                  <th className="px-2 md:px-4 py-4 font-bold text-center">Qty</th>
                  <th className="px-2 md:px-4 py-4 font-bold text-center">Min</th>
                  <th className="px-4 md:px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onDelete={handleDelete}
                    onEdit={startEdit}
                    isBusy={busyProductId === product.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredProducts.length === 0 ? <EmptyState /> : null}
      </div>

      {editingProduct ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 p-5 md:p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Edit Product</h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-xs font-semibold text-slate-500"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field
                label="Product Name"
                value={editingProduct.name}
                onChange={(value) =>
                  setEditingProduct((current) => ({ ...current, name: value }))
                }
                required
              />
              <Field
                label="SKU"
                value={editingProduct.sku}
                onChange={(value) =>
                  setEditingProduct((current) => ({ ...current, sku: value }))
                }
                required
              />
              <Field
                label="Buy Price"
                type="number"
                min="0"
                step="0.01"
                value={editingProduct.buyPrice}
                onChange={(value) =>
                  setEditingProduct((current) => ({ ...current, buyPrice: value }))
                }
                required
              />
              <Field
                label="Sell Price"
                type="number"
                min="0"
                step="0.01"
                value={editingProduct.sellPrice}
                onChange={(value) =>
                  setEditingProduct((current) => ({ ...current, sellPrice: value }))
                }
                required
              />
              <Field
                label="Quantity"
                type="number"
                min="0"
                value={editingProduct.quantity}
                onChange={(value) =>
                  setEditingProduct((current) => ({ ...current, quantity: value }))
                }
                required
              />
              <Field
                label="Minimum Quantity"
                type="number"
                min="0"
                value={editingProduct.minQuantity}
                onChange={(value) =>
                  setEditingProduct((current) => ({ ...current, minQuantity: value }))
                }
                required
              />

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-2">Supplier</label>
                <select
                  value={editingProduct.supplierId}
                  onChange={(event) =>
                    setEditingProduct((current) => ({
                      ...current,
                      supplierId: event.target.value,
                    }))
                  }
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} ({supplier.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-60"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
>>>>>>> ffc9429 (initial frontend commit)
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 w-full">
    <div className={`p-2 md:p-3 rounded-lg ${color}`}>{icon}</div>
    <div className="min-w-0">
<<<<<<< HEAD
      <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase leading-tight truncate">{label}</p>
=======
      <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase leading-tight truncate">
        {label}
      </p>
>>>>>>> ffc9429 (initial frontend commit)
      <p className="text-sm md:text-lg font-black text-slate-800">{value}</p>
    </div>
  </div>
);

<<<<<<< HEAD
const ProductRow = ({ product }) => {
  const isLowStock = product.qty <= product.minQty;
  return (
    <tr className="hover:bg-slate-50/50 transition group">
      <td className="px-4 md:px-6 py-4 md:py-5">
        <p className="font-bold text-xs md:text-sm text-slate-700 truncate max-w-37.5 md:max-w-none">{product.name}</p>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{product.sku}</p>
      </td>
      <td className="px-2 md:px-4 py-4 md:py-5 font-bold text-xs md:text-sm text-slate-600 text-center">${product.purchasePrice}</td>
      <td className="px-2 md:px-4 py-4 md:py-5 font-bold text-xs md:text-sm text-slate-600 text-center">${product.sellingPrice}</td>
      <td className="px-2 md:px-4 py-4 md:py-5 text-center">
        <span className={`inline-flex px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[11px] font-bold items-center gap-1 ${
          isLowStock ? 'bg-red-50 text-red-500 ring-1 ring-red-100' : 'bg-emerald-50 text-emerald-500 ring-1 ring-emerald-100'
        }`}>
          {isLowStock && <AlertCircle size={10} />} {product.qty}
        </span>
      </td>
      <td className="px-2 md:px-4 py-4 md:py-5 text-center font-bold text-[10px] md:text-sm text-slate-400">{product.minQty}</td>
      <td className="px-4 md:px-6 py-4 md:py-5 text-right">
        <div className="flex justify-end gap-2 md:gap-3 text-gray-300">
          <button className="hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
          <button className="hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
=======
const ProductRow = ({ product, onDelete, onEdit, isBusy }) => {
  const isLowStock = product.quantity <= product.minQuantity;

  return (
    <tr className="hover:bg-slate-50/50 transition group">
      <td className="px-4 md:px-6 py-4 md:py-5">
        <p className="font-bold text-xs md:text-sm text-slate-700 truncate max-w-37.5 md:max-w-none">
          {product.name}
        </p>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{product.sku}</p>
      </td>
      <td className="px-2 md:px-4 py-4 md:py-5 text-xs md:text-sm text-slate-600">
        {product.supplier?.name || "-"}
      </td>
      <td className="px-2 md:px-4 py-4 md:py-5 font-bold text-xs md:text-sm text-slate-600 text-center">
        ${Number(product.buyPrice || 0).toFixed(2)}
      </td>
      <td className="px-2 md:px-4 py-4 md:py-5 font-bold text-xs md:text-sm text-slate-600 text-center">
        ${Number(product.sellPrice || 0).toFixed(2)}
      </td>
      <td className="px-2 md:px-4 py-4 md:py-5 text-center">
        <span
          className={`inline-flex px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[11px] font-bold items-center gap-1 ${
            isLowStock
              ? "bg-red-50 text-red-500 ring-1 ring-red-100"
              : "bg-emerald-50 text-emerald-500 ring-1 ring-emerald-100"
          }`}
        >
          {isLowStock ? <AlertCircle size={10} /> : null}
          {product.quantity}
        </span>
      </td>
      <td className="px-2 md:px-4 py-4 md:py-5 text-center font-bold text-[10px] md:text-sm text-slate-400">
        {product.minQuantity}
      </td>
      <td className="px-4 md:px-6 py-4 md:py-5 text-right">
        <div className="inline-flex items-center gap-3">
          <button
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <Pencil size={14} />
            <span className="text-xs font-semibold">Edit</span>
          </button>
          <button
            onClick={() => void onDelete(product.id)}
            disabled={isBusy}
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 disabled:opacity-50"
          >
            {isBusy ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
            <span className="text-xs font-semibold">Delete</span>
          </button>
>>>>>>> ffc9429 (initial frontend commit)
        </div>
      </td>
    </tr>
  );
};

const EmptyState = () => (
  <div className="py-16 md:py-24 flex flex-col items-center justify-center bg-blue-50/20 px-4">
    <div className="bg-white p-4 md:p-6 rounded-full shadow-sm mb-4 md:mb-6 ring-4 md:ring-8 ring-blue-50/50">
<<<<<<< HEAD
       <Search size={24} className="text-blue-100" />
    </div>
    <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">No matching products</h3>
    <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-8 text-center max-w-xs leading-relaxed">
      Try adjusting your filters or search terms to find inventory items.
    </p>
    <button className="text-blue-600 font-bold uppercase text-[9px] md:text-[11px] tracking-widest border-b-2 border-blue-600 pb-1 hover:text-blue-700 transition-all">
      Clear All Filters
    </button>
  </div>
);

export default ProductsPage;
=======
      <Search size={24} className="text-blue-100" />
    </div>
    <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">No products found</h3>
    <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-8 text-center max-w-xs leading-relaxed">
      Try adjusting your search text or add a new product.
    </p>
  </div>
);

function Field({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-2">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-11 rounded-xl border border-slate-200 px-3 outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}

export default ProductsPage;
>>>>>>> ffc9429 (initial frontend commit)
