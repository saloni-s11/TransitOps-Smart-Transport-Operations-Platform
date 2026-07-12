import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

export default function AddVehicle() {
  const navigate = useNavigate();
  const { addVehicle } = useAppData();
  
  const [formData, setFormData] = useState({
    registrationNo: "",
    model: "",
    type: "Truck",
    maxCapacityKg: "",
    odometerKm: "0",
    acquisitionCost: "",
    status: "Available"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "registrationNo") setError(""); // clear error on edit
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // addVehicle handles id and status if needed, but we pass full object
    const result = await addVehicle({
      registrationNo: formData.registrationNo,
      model: formData.model,
      type: formData.type,
      maxCapacityKg: Number(formData.maxCapacityKg),
      odometerKm: Number(formData.odometerKm),
      acquisitionCost: Number(formData.acquisitionCost),
      status: formData.status,
      region: "Region K" // default mock region
    });

    if (result.ok) {
      navigate("/vehicles");
    } else {
      setError(result.error?.message || "Failed to add vehicle. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/vehicles" className="p-2 text-secondary hover:bg-surface-container rounded transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-display font-display text-on-surface">Add New Vehicle</h1>
      </div>

      <div className="bg-white p-6 border border-outline-variant rounded shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-label-caps text-secondary block mb-1">Registration Number</label>
            <input 
              required
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
              placeholder="e.g. KA-01-AB-1234" 
              type="text" 
            />
          </div>

          <div>
            <label className="text-label-caps text-secondary block mb-1">Name/Model</label>
            <input 
              required
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
              placeholder="e.g. Tata Ultra 1918" 
              type="text" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-label-caps text-secondary block mb-1">Vehicle Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-1 focus:ring-primary-container"
              >
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Mini">Mini</option>
                <option value="Special">Special</option>
              </select>
            </div>
            
            <div>
              <label className="text-label-caps text-secondary block mb-1">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-1 focus:ring-primary-container"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-label-caps text-secondary block mb-1">Max Capacity (kg)</label>
              <input 
                required
                name="maxCapacityKg"
                value={formData.maxCapacityKg}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
                placeholder="e.g. 9000" 
                type="number" 
              />
            </div>
            <div>
              <label className="text-label-caps text-secondary block mb-1">Odometer (km)</label>
              <input 
                required
                name="odometerKm"
                value={formData.odometerKm}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
                placeholder="0" 
                type="number" 
              />
            </div>
            <div>
              <label className="text-label-caps text-secondary block mb-1">Acquisition Cost (₹)</label>
              <input 
                required
                name="acquisitionCost"
                value={formData.acquisitionCost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container" 
                placeholder="e.g. 3200000" 
                type="number" 
              />
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
                Save Vehicle
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
