/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Loader2,
  RefreshCw,
  Plus,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  updateInvoice,
} from "@/services/invoice.service";
import { getProducts } from "@/services/product.service";

const initialInvoiceForm = {
  type: "sale",
  items: [{ productId: "", quantity: "1", unitPrice: "" }],
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [invoiceForm, setInvoiceForm] = useState(initialInvoiceForm);
  const [submitting, setSubmitting] = useState(false);

  const [editingInvoice, setEditingInvoice] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadInvoices = async ({ withLoader = true } = {}) => {
    if (withLoader) {
      setLoading(true);
      setError("");
    }

    try {
      const [invoicesData, productsData] = await Promise.all([
        getInvoices(),
        getProducts({ limit: 1000 }),
      ]);

      setInvoices(invoicesData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || "Unable to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInvoices({ withLoader: false });
  }, []);

  const computedTotal = useMemo(
    () =>
      invoiceForm.items.reduce(
        (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
        0,
      ),
    [invoiceForm.items],
  );

  const totalSales = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.type === "sale")
        .reduce((sum, invoice) => sum + Number(invoice.totalAmount || 0), 0),
    [invoices],
  );

  const parseInvoiceItems = (items) => {
    const normalizedItems = items.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    }));

    if (
      normalizedItems.some(
        (item) =>
          !item.productId ||
          Number.isNaN(item.quantity) ||
          item.quantity <= 0 ||
          Number.isNaN(item.unitPrice) ||
          item.unitPrice < 0,
      )
    ) {
      throw new Error("Please provide valid product, quantity, and unit price for all items.");
    }

    return normalizedItems;
  };

  const handleCreateInvoice = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const parsedItems = parseInvoiceItems(invoiceForm.items);
      const totalAmount = parsedItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );

      if (totalAmount <= 0) {
        throw new Error("Total amount must be greater than zero.");
      }

      await createInvoice({
        type: invoiceForm.type,
        totalAmount,
        invoiceItems: parsedItems,
      });

      setInvoiceForm(initialInvoiceForm);
      await loadInvoices();
    } catch (err) {
      setError(err.message || "Unable to create invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Delete this invoice?")) return;

    setBusyId(invoiceId);
    setError("");

    try {
      await deleteInvoice(invoiceId);
      setInvoices((current) => current.filter((invoice) => invoice.id !== invoiceId));
    } catch (err) {
      setError(err.message || "Unable to delete invoice.");
    } finally {
      setBusyId(null);
    }
  };

  const startEditInvoice = (invoice) => {
    setEditingInvoice({
      id: invoice.id,
      type: invoice.type,
      totalAmount: `${invoice.totalAmount}`,
    });
  };

  const handleSaveInvoiceEdit = async () => {
    if (!editingInvoice) return;

    setSavingEdit(true);
    setError("");

    try {
      const payload = {
        type: editingInvoice.type,
        totalAmount: Number(editingInvoice.totalAmount),
      };

      if (!payload.type || Number.isNaN(payload.totalAmount) || payload.totalAmount <= 0) {
        throw new Error("Please provide valid invoice type and total amount.");
      }

      await updateInvoice(editingInvoice.id, payload);
      setEditingInvoice(null);
      await loadInvoices();
    } catch (err) {
      setError(err.message || "Unable to update invoice.");
    } finally {
      setSavingEdit(false);
    }
  };

  const updateFormItem = (index, key, value) => {
    setInvoiceForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addItemRow = () => {
    setInvoiceForm((current) => ({
      ...current,
      items: [...current.items, { productId: "", quantity: "1", unitPrice: "" }],
    }));
  };

  const removeItemRow = (index) => {
    setInvoiceForm((current) => {
      if (current.items.length === 1) return current;

      return {
        ...current,
        items: current.items.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Financial Flow
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Invoices</h1>
        </div>

        <button
          onClick={() => void loadInvoices()}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Invoices" value={invoices.length} />
        <StatCard
          label="Sale Invoices"
          value={invoices.filter((invoice) => invoice.type === "sale").length}
        />
        <StatCard label="Total Sales Amount" value={`$${totalSales.toFixed(2)}`} />
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 font-semibold">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 h-fit">
          <h2 className="font-bold text-slate-900 mb-4">Create Invoice</h2>

          <form onSubmit={handleCreateInvoice} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Type</label>
              <select
                value={invoiceForm.type}
                onChange={(event) =>
                  setInvoiceForm((current) => ({ ...current, type: event.target.value }))
                }
                className="w-full h-11 rounded-xl border border-slate-200 px-3"
              >
                <option value="sale">Sale</option>
                <option value="purchase">Purchase</option>
              </select>
            </div>

            <div className="space-y-2">
              {invoiceForm.items.map((item, index) => (
                <div key={`item-${index}`} className="grid grid-cols-12 gap-2">
                  <select
                    value={item.productId}
                    onChange={(event) => updateFormItem(index, "productId", event.target.value)}
                    className="col-span-6 h-10 rounded-lg border border-slate-200 px-2 text-sm"
                  >
                    <option value="">Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateFormItem(index, "quantity", event.target.value)}
                    className="col-span-2 h-10 rounded-lg border border-slate-200 px-2 text-sm"
                    placeholder="Qty"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) => updateFormItem(index, "unitPrice", event.target.value)}
                    className="col-span-3 h-10 rounded-lg border border-slate-200 px-2 text-sm"
                    placeholder="Price"
                  />

                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    className="col-span-1 h-10 rounded-lg border border-slate-200 text-slate-500 flex items-center justify-center"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItemRow}
              className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold inline-flex items-center gap-2"
            >
              <Plus size={14} />
              Add Item Row
            </button>

            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
              Computed Total: ${computedTotal.toFixed(2)}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {submitting ? "Creating Invoice..." : "Create Invoice"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="h-60 flex items-center justify-center text-slate-500">
              <Loader2 className="animate-spin mr-2" size={18} />
              Loading invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-slate-500">
              <FileText size={24} className="mb-3" />
              No invoices found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-180">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest text-slate-400 bg-slate-50">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Created At</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => {
                    const isEditing = editingInvoice?.id === invoice.id;

                    return (
                      <tr key={invoice.id} className="border-t border-slate-100 text-sm">
                        <td className="px-4 py-3 font-semibold text-slate-700">#{invoice.id}</td>
                        <td className="px-4 py-3 capitalize">
                          {isEditing ? (
                            <select
                              value={editingInvoice.type}
                              onChange={(event) =>
                                setEditingInvoice((current) => ({
                                  ...current,
                                  type: event.target.value,
                                }))
                              }
                              className="h-9 border border-slate-200 rounded-lg px-2"
                            >
                              <option value="sale">Sale</option>
                              <option value="purchase">Purchase</option>
                            </select>
                          ) : (
                            invoice.type
                          )}
                        </td>
                        <td className="px-4 py-3">{invoice.invoiceItems?.length ?? 0}</td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editingInvoice.totalAmount}
                              onChange={(event) =>
                                setEditingInvoice((current) => ({
                                  ...current,
                                  totalAmount: event.target.value,
                                }))
                              }
                              className="h-9 w-24 border border-slate-200 rounded-lg px-2"
                            />
                          ) : (
                            `$${Number(invoice.totalAmount || 0).toFixed(2)}`
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {invoice.createdAt ? new Date(invoice.createdAt).toLocaleString() : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => void handleSaveInvoiceEdit()}
                                  disabled={savingEdit}
                                  className="h-8 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold disabled:opacity-60"
                                >
                                  {savingEdit ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={() => setEditingInvoice(null)}
                                  className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-semibold"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditInvoice(invoice)}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold"
                                >
                                  <Pencil size={13} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => void handleDeleteInvoice(invoice.id)}
                                  disabled={busyId === invoice.id}
                                  className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-semibold disabled:opacity-60"
                                >
                                  {busyId === invoice.id ? (
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

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">{label}</p>
      <p className="text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
