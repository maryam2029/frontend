/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import {
  createInvoiceItem,
  deleteInvoiceItem,
  getInvoiceItems,
  updateInvoiceItem,
} from "@/services/invoice-item.service";
import { getInvoices } from "@/services/invoice.service";
import { getProducts } from "@/services/product.service";

const initialFormState = {
  invoiceId: "",
  productId: "",
  quantity: "1",
  unitPrice: "",
};

export default function InvoiceItemsPage() {
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState(initialFormState);
  const [editingItem, setEditingItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadData = async ({ withLoader = true } = {}) => {
    if (withLoader) {
      setLoading(true);
      setError("");
    }

    try {
      const [itemsData, invoicesData, productsData] = await Promise.all([
        getInvoiceItems(),
        getInvoices(),
        getProducts({ limit: 1000 }),
      ]);

      setInvoiceItems(itemsData);
      setInvoices(invoicesData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || "Unable to load invoice items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData({ withLoader: false });
  }, []);

  const parsePayload = (values) => {
    const payload = {
      invoiceId: Number(values.invoiceId),
      productId: Number(values.productId),
      quantity: Number(values.quantity),
      unitPrice: Number(values.unitPrice),
    };

    if (
      !payload.invoiceId ||
      !payload.productId ||
      Number.isNaN(payload.quantity) ||
      Number.isNaN(payload.unitPrice) ||
      payload.quantity <= 0 ||
      payload.unitPrice < 0
    ) {
      throw new Error("Please provide valid invoice, product, quantity and unit price.");
    }

    return payload;
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = parsePayload(form);
      await createInvoiceItem(payload);
      setForm(initialFormState);
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to create invoice item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this invoice item?")) return;

    setBusyId(itemId);
    setError("");

    try {
      await deleteInvoiceItem(itemId);
      setInvoiceItems((current) => current.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err.message || "Unable to delete invoice item.");
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (item) => {
    setEditingItem({
      id: item.id,
      invoiceId: `${item.invoice?.id || ""}`,
      productId: `${item.product?.id || ""}`,
      quantity: `${item.quantity || ""}`,
      unitPrice: `${item.unitPrice || ""}`,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    setBusyId(editingItem.id);
    setError("");

    try {
      const payload = parsePayload(editingItem);
      await updateInvoiceItem(editingItem.id, payload);
      setEditingItem(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to update invoice item.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
            Invoice Management
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Invoice Items</h1>
        </div>

        <button
          onClick={() => void loadData()}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 h-fit">
          <h2 className="font-bold text-slate-900 mb-4">Create Invoice Item</h2>

          <form onSubmit={handleCreate} className="space-y-3">
            <SelectField
              label="Invoice"
              value={form.invoiceId}
              onChange={(value) => setForm((current) => ({ ...current, invoiceId: value }))}
              options={invoices.map((invoice) => ({
                value: String(invoice.id),
                label: `#${invoice.id} (${invoice.type})`,
              }))}
            />

            <SelectField
              label="Product"
              value={form.productId}
              onChange={(value) => setForm((current) => ({ ...current, productId: value }))}
              options={products.map((product) => ({
                value: String(product.id),
                label: `${product.name} (${product.sku})`,
              }))}
            />

            <Field
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(value) => setForm((current) => ({ ...current, quantity: value }))}
              min="1"
            />

            <Field
              label="Unit Price"
              type="number"
              value={form.unitPrice}
              onChange={(value) => setForm((current) => ({ ...current, unitPrice: value }))}
              min="0"
              step="0.01"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {submitting ? "Creating..." : "Create Item"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">
              <Loader2 className="animate-spin mr-2" size={18} />
              Loading invoice items...
            </div>
          ) : invoiceItems.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500">
              No invoice items found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-180">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest text-slate-400 bg-slate-50">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item) => {
                    const isEditing = editingItem?.id === item.id;

                    return (
                      <tr key={item.id} className="border-t border-slate-100 text-sm">
                        <td className="px-4 py-3 font-semibold text-slate-700">#{item.id}</td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select
                              value={editingItem.invoiceId}
                              onChange={(event) =>
                                setEditingItem((current) => ({
                                  ...current,
                                  invoiceId: event.target.value,
                                }))
                              }
                              className="h-9 border border-slate-200 rounded-lg px-2"
                            >
                              <option value="">Select</option>
                              {invoices.map((invoice) => (
                                <option key={invoice.id} value={invoice.id}>
                                  #{invoice.id}
                                </option>
                              ))}
                            </select>
                          ) : (
                            `#${item.invoice?.id || "-"}`
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select
                              value={editingItem.productId}
                              onChange={(event) =>
                                setEditingItem((current) => ({
                                  ...current,
                                  productId: event.target.value,
                                }))
                              }
                              className="h-9 border border-slate-200 rounded-lg px-2"
                            >
                              <option value="">Select</option>
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            item.product?.name || "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              min="1"
                              value={editingItem.quantity}
                              onChange={(event) =>
                                setEditingItem((current) => ({
                                  ...current,
                                  quantity: event.target.value,
                                }))
                              }
                              className="h-9 w-20 border border-slate-200 rounded-lg px-2"
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editingItem.unitPrice}
                              onChange={(event) =>
                                setEditingItem((current) => ({
                                  ...current,
                                  unitPrice: event.target.value,
                                }))
                              }
                              className="h-9 w-24 border border-slate-200 rounded-lg px-2"
                            />
                          ) : (
                            `$${Number(item.unitPrice || 0).toFixed(2)}`
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => void handleSaveEdit()}
                                  disabled={busyId === item.id}
                                  className="h-8 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold disabled:opacity-60"
                                >
                                  {busyId === item.id ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-semibold"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(item)}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold"
                                >
                                  <Pencil size={13} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => void handleDelete(item.id)}
                                  disabled={busyId === item.id}
                                  className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-semibold disabled:opacity-60"
                                >
                                  {busyId === item.id ? (
                                    <Loader2 size={13} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={13} />
                                  )}
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-2">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-11 border border-slate-200 rounded-xl px-3"
        {...props}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-2">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-11 border border-slate-200 rounded-xl px-3"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
