export default function Trips() {
  return (
    <>
<div className="max-w-[1400px] mx-auto">
{/* Trip Lifecycle Header */}
<div className="bg-white border border-outline-variant p-6 rounded-lg mb-6">
<p className="text-label-caps text-secondary mb-4 uppercase">Trip Lifecycle</p>
<div className="flex items-center justify-between relative px-12">
{/* Progress Line */}
<div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-outline-variant z-0"></div>
<div className="flex flex-col items-center gap-2 z-10">
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white">
<span className="material-symbols-outlined text-sm">edit</span>
</div>
<span className="text-label-caps text-primary font-bold">Draft</span>
</div>
<div className="flex flex-col items-center gap-2 z-10 opacity-40">
<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white ring-4 ring-white">
<span className="material-symbols-outlined text-sm">rocket_launch</span>
</div>
<span className="text-label-caps">Dispatched</span>
</div>
<div className="flex flex-col items-center gap-2 z-10 opacity-40">
<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white ring-4 ring-white">
<span className="material-symbols-outlined text-sm">check_circle</span>
</div>
<span className="text-label-caps">Completed</span>
</div>
<div className="flex flex-col items-center gap-2 z-10 opacity-40">
<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white ring-4 ring-white">
<span className="material-symbols-outlined text-sm">cancel</span>
</div>
<span className="text-label-caps">Cancelled</span>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
{/* Create Trip Form (Left Column) */}
<section className="lg:col-span-7 bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col">
<div className="p-6 border-b border-outline-variant">
<h2 className="text-headline-md font-bold text-on-surface">Create Trip</h2>
</div>
<div className="p-6 flex-1 space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* Source */}
<div className="flex flex-col gap-2">
<label className="text-body-md font-semibold text-secondary">SOURCE</label>
<select className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md appearance-none">
<option>Gandhinagar Depot</option>
<option>Ahmedabad Hub</option>
<option>Sanand Warehouse</option>
</select>
</div>
{/* Destination */}
<div className="flex flex-col gap-2">
<label className="text-body-md font-semibold text-secondary">DESTINATION</label>
<select className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md">
<option>Ahmedabad Hub</option>
<option>Gandhinagar Depot</option>
<option>Kalol Depot</option>
</select>
</div>
{/* Vehicle */}
<div className="flex flex-col gap-2">
<label className="text-body-md font-semibold text-secondary">VEHICLE (AVAILABLE ONLY)</label>
<select className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md" id="vehicle-select">
<option value="500">VAN-05 (500 kg capacity)</option>
<option value="5000">TRUCK-11 (5,000 kg capacity)</option>
<option value="1000">MINI-03 (1,000 kg capacity)</option>
</select>
</div>
{/* Driver */}
<div className="flex flex-col gap-2">
<label className="text-body-md font-semibold text-secondary">DRIVER (AVAILABLE ONLY)</label>
<select className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md">
<option>Alex</option>
<option>Suresh</option>
<option>Priya</option>
</select>
</div>
{/* Cargo Weight */}
<div className="flex flex-col gap-2">
<label className="text-body-md font-semibold text-secondary">CARGO WEIGHT (kg)</label>
<input className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md" id="cargo-weight" type="number" value="700"/>
</div>
{/* Planned Distance */}
<div className="flex flex-col gap-2">
<label className="text-body-md font-semibold text-secondary">PLANNED DISTANCE (km)</label>
<input className="bg-surface-container-low border border-outline rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary text-body-md" type="number" value="38"/>
</div>
</div>
{/* Validation Message Box */}
<div className="p-4 bg-error-container border border-error rounded-lg flex items-start gap-4" id="validation-box">
<span className="material-symbols-outlined text-error mt-0.5">error</span>
<div>
<p className="text-body-md font-bold text-on-error-container">Capacity exceeded by 200 kg</p>
<p className="text-body-md text-on-error-container opacity-80">dispatcher blocked — please reduce load or select a larger vehicle.</p>
</div>
</div>
{/* Info Box */}
<div className="p-4 bg-surface-container-high rounded-lg flex items-start gap-4">
<span className="material-symbols-outlined text-secondary">info</span>
<div className="text-body-md text-secondary">
<p>Vehicle Capacity: <span id="display-capacity">500</span> kg</p>
<p>Cargo Weight: <span id="display-weight">700</span> kg</p>
</div>
</div>
</div>
{/* Actions */}
<div className="p-6 bg-surface-container-low flex items-center justify-end gap-4 border-t border-outline-variant">
<button className="px-6 py-2.5 border border-outline text-on-surface font-semibold rounded hover:bg-surface-container transition-all">Cancel</button>
<button className="px-10 py-2.5 bg-primary opacity-50 cursor-not-allowed text-white font-bold rounded shadow-sm" disabled id="dispatch-btn">Dispatch</button>
</div>
</section>
{/* Live Board (Right Column) */}
<section className="lg:col-span-5 flex flex-col gap-6">
<div className="bg-white border border-outline-variant rounded-lg overflow-hidden h-full">
<div className="p-6 border-b border-outline-variant flex items-center justify-between">
<h2 className="text-headline-md font-bold text-on-surface">Live Board</h2>
<span className="material-symbols-outlined text-secondary cursor-pointer">refresh</span>
</div>
<div className="divide-y divide-outline-variant">
{/* Trip Item */}
<div className="p-6 hover:bg-surface-container-lowest transition-colors cursor-pointer">
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-body-lg font-bold text-on-surface">TR001</p>
<p className="text-body-md text-secondary">Gandhinagar Depot → Ahmedabad Hub</p>
</div>
<span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-label-caps rounded-full font-bold">Dispatched</span>
</div>
<div className="flex justify-between items-center mt-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[18px]">person</span>
<span className="text-body-md font-medium">Alex</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[18px]">local_shipping</span>
<span className="text-body-md font-medium">VAN-05</span>
</div>
<div className="flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-[18px]">schedule</span>
<span className="text-body-md font-bold">45 min</span>
</div>
</div>
</div>
{/* Trip Item */}
<div className="p-6 hover:bg-surface-container-lowest transition-colors cursor-pointer">
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-body-lg font-bold text-on-surface">TR004</p>
<p className="text-body-md text-secondary">Vatva Industrial Area → Sanand Warehouse</p>
</div>
<span className="px-3 py-1 bg-surface-container-high text-secondary text-label-caps rounded-full font-bold">Draft</span>
</div>
<div className="flex justify-between items-center mt-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[18px]">person</span>
<span className="text-body-md font-medium">Suresh</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[18px]">local_shipping</span>
<span className="text-body-md font-medium">TRUCK-11</span>
</div>
<div className="text-body-md text-secondary italic">Awaiting driver</div>
</div>
</div>
{/* Trip Item */}
<div className="p-6 hover:bg-surface-container-lowest transition-colors cursor-pointer">
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-body-lg font-bold text-on-surface">TR006</p>
<p className="text-body-md text-secondary">Mahesa → Kalol Depot</p>
</div>
<span className="px-3 py-1 bg-error-container text-on-error-container text-label-caps rounded-full font-bold">Cancelled</span>
</div>
<div className="flex justify-between items-center mt-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[18px]">person</span>
<span className="text-body-md font-medium opacity-50">Unassigned</span>
</div>
<div className="text-body-md text-error font-medium">Vehicle sent to shop</div>
</div>
</div>
</div>
<div className="p-6 border-t border-outline-variant">
<div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-between">
<p className="text-label-caps text-secondary uppercase">Quick Flow</p>
<p className="text-body-md font-medium text-secondary">Odometer → Fuel Log → Expense → Available</p>
</div>
</div>
</div>
</section>
</div>
</div>    </>
  );
}
