<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, UploadCloud, ChevronDown, Trash2 } from "lucide-react";

export default function AddProductPage() {
  return (
    <div className="bg-slate-50 p-4 md:p-10 text-gray-900 min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <p className="text-[10px] md:text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Inventory Management</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950">Add New Product</h1>
        </div>
        <div className="flex w-full sm:w-auto gap-2 md:gap-3">
          <Button variant="ghost" className="flex-1 sm:flex-none text-xs md:text-sm text-gray-600 font-semibold hover:bg-gray-100">Discard</Button>
          <Button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm">Save Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          <div className="bg-white p-5 md:p-7 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 md:mb-8 pb-3 border-b border-gray-100">
              <Info className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              <h2 className="text-lg md:text-xl font-bold">General Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="col-span-1">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase mb-2 block">Product Name</label>
                <Input placeholder="e.g. Ergonomic Office Chair" className="bg-gray-50 border-gray-100 h-10 rounded-lg text-sm" />
              </div>
              <div className="col-span-1">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase mb-2 block">SKU Number</label>
                <Input defaultValue="AL-00923-XC" className="bg-gray-50 border-gray-100 h-10 rounded-lg text-sm" />
              </div>
              
              <div className="col-span-1">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase mb-2 block">Category</label>
                <div className="relative">
                  <Input defaultValue="Select Category" className="bg-gray-50 border-gray-100 h-10 rounded-lg text-sm pr-10 cursor-pointer" />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                </div>
              </div>
              <div className="col-span-1">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase mb-2 block">Base Price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                  <Input type="number" defaultValue="0.00" className="bg-gray-50 border-gray-100 h-10 rounded-lg text-sm pl-8 pr-4" />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <label className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase mb-2 block">Description</label>
                <textarea 
                  rows={4}
                  className="md:rows-6 w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm focus:ring-1 focus:ring-blue-300 outline-none"
                  placeholder="Provide a detailed product description..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 md:p-7 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 md:mb-8 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                <h2 className="text-lg md:text-xl font-bold">Product Imagery</h2>
              </div>
              <span className="text-[9px] md:text-[11px] text-gray-400 font-semibold uppercase">MAX 5 IMAGES</span>
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 md:p-12 text-center cursor-pointer hover:border-blue-200 hover:bg-slate-50 transition">
              <UploadCloud className="mx-auto h-10 w-10 md:h-12 md:w-12 text-blue-400 mb-4 md:mb-6" />
              <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-1">Click to upload or drag and drop</h4>
              <p className="text-[10px] md:text-xs text-gray-500">PNG, JPG or WEBP (Max 800x400px)</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-blue-600 p-6 md:p-8 rounded-3xl shadow-xl text-white">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-500">
              <Trash2 className="h-5 w-5 md:h-6 md:w-6 text-blue-200" />
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight">Marketplace Insights</h2>
            </div>
            
            <p className="text-blue-100 text-[11px] md:text-xs leading-relaxed mb-6 md:mb-8">Competitive landscape in top markets.</p>
            
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              <div>
                <p className="text-[8px] md:text-[10px] text-blue-100 uppercase font-bold tracking-wider mb-1">AVG PRICE</p>
                <p className="text-2xl md:text-3xl font-extrabold">$245.00</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] md:text-[10px] text-blue-100 uppercase font-bold tracking-wider mb-1">DEMAND</p>
                <span className="text-[9px] md:text-xs font-bold text-white bg-blue-500 px-2 md:px-3 py-1 rounded-full">HIGH</span>
              </div>
              <div className="mt-1">
                <p className="text-[8px] md:text-[10px] text-blue-100 uppercase font-bold tracking-wider mb-1">CEILING</p>
                <p className="text-2xl md:text-3xl font-extrabold">$389</p>
              </div>
              <div className="text-right mt-1">
                <p className="text-[8px] md:text-[10px] text-blue-100 uppercase font-bold tracking-wider mb-1">COMP.</p>
                <span className="text-[9px] md:text-xs font-bold text-white bg-blue-500 px-2 md:px-3 py-1 rounded-full">MEDIUM</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 md:p-7 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-6 md:mb-8 tracking-wider">SIMILAR LISTINGS</h3>
            
            <div className="space-y-5 md:space-y-6">
              {[
                { title: "ProSeries Task Chair", platform: "Amazon.com", price: 219.00 },
                { title: "Executive Leather XL", platform: "Wayfair", price: 345.50 },
                { title: "Nordic Swivel", platform: "KEA Business", price: 189.99 },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 md:gap-4 items-center border-b border-gray-100 pb-4 md:pb-5 last:border-0 last:pb-0">
                  <div className="bg-slate-100 rounded-lg h-10 w-10 md:h-12 md:w-12 flex-none" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] md:text-xs font-bold text-gray-900 truncate">{item.title}</p>
                    <p className="text-[10px] md:text-[11px] text-gray-500 truncate">{item.platform}</p>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-blue-600">${item.price.toFixed(0)}</span>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-6 md:mt-8 text-[10px] md:text-xs font-bold text-blue-600 border-gray-100 rounded-xl h-10">View Full Report</Button>
          </div>
=======
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { createProduct } from "@/services/product.service";
import { getSuppliers } from "@/services/supplier.service";

const initialFormState = {
  name: "",
  sku: "",
  buyPrice: "",
  sellPrice: "",
  quantity: "",
  minQuantity: "",
  supplierId: "",
};

export default function AddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadSuppliers = async () => {
      setLoadingSuppliers(true);
      setError("");

      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        setError(err.message || "Failed to load suppliers.");
      } finally {
        setLoadingSuppliers(false);
      }
    };

    void loadSuppliers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.supplierId) {
      setError("Supplier is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      buyPrice: Number(form.buyPrice),
      sellPrice: Number(form.sellPrice),
      quantity: Number(form.quantity),
      minQuantity: Number(form.minQuantity),
      supplierId: Number(form.supplierId),
    };

    if (
      !payload.name ||
      !payload.sku ||
      Number.isNaN(payload.buyPrice) ||
      Number.isNaN(payload.sellPrice) ||
      Number.isNaN(payload.quantity) ||
      Number.isNaN(payload.minQuantity)
    ) {
      setError("Please fill all required fields with valid values.");
      return;
    }

    setSubmitting(true);
    try {
      await createProduct(payload);
      setSuccess("Product created successfully.");
      setForm(initialFormState);
    } catch (err) {
      setError(err.message || "Unable to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 p-4 md:p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/products")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-wider text-blue-600 font-bold mb-2">
            Inventory Management
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
            Add New Product
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Surgical Gloves"
              required
            />
            <InputField
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="SKU-0001"
              required
            />
            <InputField
              label="Buy Price"
              name="buyPrice"
              value={form.buyPrice}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              required
            />
            <InputField
              label="Sell Price"
              name="sellPrice"
              value={form.sellPrice}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              required
            />
            <InputField
              label="Quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              type="number"
              min="0"
              required
            />
            <InputField
              label="Minimum Quantity"
              name="minQuantity"
              value={form.minQuantity}
              onChange={handleChange}
              type="number"
              min="0"
              required
            />

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-2">
                Supplier
              </label>
              <select
                name="supplierId"
                value={form.supplierId}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-slate-200 px-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
                disabled={loadingSuppliers}
              >
                <option value="">
                  {loadingSuppliers ? "Loading suppliers..." : "Select supplier"}
                </option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} ({supplier.email})
                  </option>
                ))}
              </select>
            </div>

            {error ? (
              <div className="md:col-span-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="md:col-span-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-600">
                {success}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="h-11 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                {submitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
>>>>>>> ffc9429 (initial frontend commit)
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
  required = false,
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        required={required}
        className="w-full h-11 rounded-xl border border-slate-200 px-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
>>>>>>> ffc9429 (initial frontend commit)
