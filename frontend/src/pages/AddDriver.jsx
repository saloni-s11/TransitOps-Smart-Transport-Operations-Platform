import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

export default function AddDriver() {
  const navigate = useNavigate();
  const { addDriver } = useAppData();
  
  const [formData, setFormData] = useState({
    name: "",
    licenseNo: "",
    licenseCategory: "HMV",
    licenseExpiry: "",
    contactNo: "",
    safetyScore: "100",
    status: "Available"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await addDriver({
      name: formData.name,
      licenseNo: formData.licenseNo,
      licenseCategory: formData.licenseCategory,
      licenseExpiry: formData.licenseExpiry,
      contactNo: formData.contactNo,
      safetyScore: Number(formData.safetyScore),
      status: formData.status
    });

    if (result.ok) {
      navigate("/drivers");
    } else {
      setError(result.error?.message || "Failed to add driver. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/drivers" className="p-2 text-secondary hover:bg-surface-container rounded transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-display font-display text-on-surface">Add New Driver</h1>
      </div>

      <div className="bg-white p-6 border border-outline-variant rounded shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-label-caps text-secondary mb-1">Full Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
              placeholder="e.g. Arjun Mehta" 
              type="text" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-caps text-secondary mb-1">License Number</label>
              <input 
                required
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
                placeholder="e.g. DL-0420110012345" 
                type="text" 
              />
            </div>
            <div>
              <label className="block text-label-caps text-secondary mb-1">License Category</label>
              <select 
                name="licenseCategory"
                value={formData.licenseCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-1 focus:ring-primary-container"
              >
                <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                <option value="LMV">LMV (Light Motor Vehicle)</option>
                <option value="MCWG">MCWG (Motorcycle with Gear)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-caps text-secondary mb-1">License Expiry Date</label>
              <input 
                required
                name="licenseExpiry"
                value={formData.licenseExpiry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
                type="date" 
              />
            </div>
            <div>
              <label className="block text-label-caps text-secondary mb-1">Contact Number</label>
              <input 
                required
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
                placeholder="e.g. +91 98765 43210" 
                type="tel" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-caps text-secondary mb-1">Initial Safety Score</label>
              <input 
                required
                name="safetyScore"
                value={formData.safetyScore}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
                placeholder="0-100" 
                type="number" 
              />
              <p className="text-body-sm text-secondary mt-1">Default is 100. Will be adjusted based on performance.</p>
            </div>
            <div>
              <label className="block text-label-caps text-secondary mb-1">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-1 focus:ring-primary-container"
              >
                <option value="Available">Available</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-error-container text-on-error-container rounded-lg text-body-md">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-primary-container text-on-primary-container px-8 py-3 rounded shadow-sm hover:opacity-90 active:scale-95 transition-all font-bold"
              >
                Save Driver
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
