export default function Vehicles() {
  return (
    <>
{/* Page Header / Filter Bar */}
<div className="flex flex-col gap-6 mb-8">
<div className="flex items-center justify-between">
<div>
<h1 className="text-display font-display text-on-surface">Vehicle Registry</h1>
<p className="text-body-md text-secondary mt-1">Manage and monitor your entire operational fleet assets.</p>
</div>
<button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded shadow-sm hover:opacity-90 active:scale-95 transition-all font-bold flex items-center gap-2">
<span className="material-symbols-outlined">add_circle</span>
                    Add Vehicle
                </button>
</div>
{/* Filters */}
<div className="bg-white p-4 border border-outline-variant flex items-center gap-4 flex-wrap">
<div className="flex-1 min-w-[200px]">
<label className="text-label-caps text-secondary block mb-1">Search Registry</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
<input className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded bg-background focus:ring-2 focus:ring-primary-container focus:border-transparent" placeholder="Reg no., name..." type="text"/>
</div>
</div>
<div className="w-48">
<label className="text-label-caps text-secondary block mb-1">Vehicle Type</label>
<select className="w-full px-3 py-2 border border-outline-variant rounded bg-background focus:ring-1 focus:ring-primary-container">
<option>Type: All</option>
<option>Truck-S (Heavy)</option>
<option>VAN-OS (Light)</option>
<option>MINI-D3 (Utility)</option>
</select>
</div>
<div className="w-48">
<label className="text-label-caps text-secondary block mb-1">Current Status</label>
<select className="w-full px-3 py-2 border border-outline-variant rounded bg-background focus:ring-1 focus:ring-primary-container">
<option>Status: All</option>
<option>Available</option>
<option>On Trip</option>
<option>In Shop</option>
<option>Retired</option>
</select>
</div>
<div className="flex items-end pb-1 h-full">
<button className="p-2 text-secondary hover:bg-surface-container rounded transition-colors" title="Refresh Data">
<span className="material-symbols-outlined">refresh</span>
</button>
</div>
</div>
</div>
{/* Vehicle Table Container */}
<div className="bg-white border border-outline-variant rounded-sm shadow-sm overflow-hidden mb-6">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-4 py-3 text-label-caps text-secondary">Reg. No.</th>
<th className="px-4 py-3 text-label-caps text-secondary">Name/Model</th>
<th className="px-4 py-3 text-label-caps text-secondary">Type</th>
<th className="px-4 py-3 text-label-caps text-secondary">Capacity</th>
<th className="px-4 py-3 text-label-caps text-secondary text-right">Odometer</th>
<th className="px-4 py-3 text-label-caps text-secondary text-right">Acq. Cost</th>
<th className="px-4 py-3 text-label-caps text-secondary text-center">Status</th>
<th className="px-4 py-3 text-label-caps text-secondary text-center">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="table-row-hover transition-colors">
<td className="px-4 py-4 font-mono-data text-on-surface">GJ01BM521</td>
<td className="px-4 py-4 text-table-data font-bold">VAN-OS</td>
<td className="px-4 py-4 text-table-data">Van</td>
<td className="px-4 py-4 text-table-data">800 kg</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">74,000 km</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">₹ 6,20,000</td>
<td className="px-4 py-4 text-center">
<span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800 uppercase">Available</span>
</td>
<td className="px-4 py-4 text-center">
<button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
<tr className="table-row-hover transition-colors">
<td className="px-4 py-4 font-mono-data text-on-surface">GJ01BM441</td>
<td className="px-4 py-4 text-table-data font-bold">TRUCK-S</td>
<td className="px-4 py-4 text-table-data">Truck</td>
<td className="px-4 py-4 text-table-data">5 Ton</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">1,82,000 km</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">₹ 24,50,000</td>
<td className="px-4 py-4 text-center">
<span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 uppercase">On Trip</span>
</td>
<td className="px-4 py-4 text-center">
<button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
<tr className="table-row-hover transition-colors">
<td className="px-4 py-4 font-mono-data text-on-surface">GJ01LB120</td>
<td className="px-4 py-4 text-table-data font-bold">MINI-D3</td>
<td className="px-4 py-4 text-table-data">Mini</td>
<td className="px-4 py-4 text-table-data">1 Ton</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">65,000 km</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">₹ 4,10,000</td>
<td className="px-4 py-4 text-center">
<span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 uppercase">In Shop</span>
</td>
<td className="px-4 py-4 text-center">
<button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
<tr className="table-row-hover transition-colors">
<td className="px-4 py-4 font-mono-data text-on-surface">GJ01LBO97</td>
<td className="px-4 py-4 text-table-data font-bold">VAN-OS</td>
<td className="px-4 py-4 text-table-data">Van</td>
<td className="px-4 py-4 text-table-data">750 kg</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">2,41,900 km</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">₹ 5,40,000</td>
<td className="px-4 py-4 text-center">
<span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-gray-200 text-gray-700 uppercase">Retired</span>
</td>
<td className="px-4 py-4 text-center">
<button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
{/* More mock rows */}
<tr className="table-row-hover transition-colors">
<td className="px-4 py-4 font-mono-data text-on-surface">GJ01AB111</td>
<td className="px-4 py-4 text-table-data font-bold">TRUCK-M</td>
<td className="px-4 py-4 text-table-data">Truck</td>
<td className="px-4 py-4 text-table-data">10 Ton</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">12,400 km</td>
<td className="px-4 py-4 text-table-data text-right font-mono-data">₹ 32,00,000</td>
<td className="px-4 py-4 text-center">
<span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800 uppercase">Available</span>
</td>
<td className="px-4 py-4 text-center">
<button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Rule Note */}
<div className="flex items-start gap-3 p-4 bg-surface-container-high rounded border-l-4 border-primary">
<span className="material-symbols-outlined text-primary">info</span>
<div>
<p className="text-body-md font-bold text-on-surface">Registry Constraint Policy</p>
<p className="text-body-md text-secondary">Registration number must be unique. Vehicles marked as <span className="font-bold">Retired</span> or <span className="font-bold">In Shop</span> are automatically filtered out from the Trip Dispatcher pool to prevent operational assignment errors.</p>
</div>
</div>
{/* Bottom Pagination/Status */}
<div className="mt-8 flex items-center justify-between text-secondary">
<p className="text-body-md">Showing 5 of 124 registered assets</p>
<div className="flex items-center gap-2">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[20px]">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors">3</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[20px]">chevron_right</span>
</button>
</div>
</div>    </>
  );
}
