export default function Drivers() {
  return (
    <>
{/* Header & Action Row */}
<div className="flex justify-between items-center mb-8">
<div>
<h1 className="text-display font-display text-on-surface">Drivers & Safety Profiles</h1>
<p className="text-body-md text-secondary mt-1">Manage personnel, safety compliance, and operational availability.</p>
</div>
<button className="bg-primary-container text-on-primary-container font-bold px-6 py-2.5 rounded shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
<span className="material-symbols-outlined">person_add</span>
                Add Driver
            </button>
</div>
{/* Filter & Toggle Bar */}
<div className="bg-white border border-outline-variant p-4 rounded mb-6 flex flex-wrap items-center justify-between gap-4">
<div className="flex items-center gap-4">
<div className="flex rounded border border-outline overflow-hidden">
<button className="px-4 py-1.5 bg-green-100 text-green-800 text-label-caps font-bold border-r border-outline">AVAILABLE</button>
<button className="px-4 py-1.5 bg-surface-container-high text-secondary text-label-caps font-bold border-r border-outline">ON TRIP</button>
<button className="px-4 py-1.5 bg-surface-container-high text-secondary text-label-caps font-bold border-r border-outline">OFF DUTY</button>
<button className="px-4 py-1.5 bg-surface-container-high text-secondary text-label-caps font-bold">SUSPENDED</button>
</div>
<div className="h-8 w-px bg-outline-variant"></div>
<p className="text-body-md text-error italic flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">info</span>
                    Expiring license or suspended status - blocked from trip assignment.
                </p>
</div>
<div className="flex items-center gap-2">
<span className="text-label-caps text-secondary uppercase">Sort By:</span>
<select className="border border-outline-variant rounded px-3 py-1.5 text-body-md focus:ring-primary focus:border-primary">
<option>Safety Score</option>
<option>Name (A-Z)</option>
<option>Trips Completed</option>
</select>
</div>
</div>
{/* Data Table Container */}
<div className="bg-white border border-outline-variant rounded overflow-hidden">
<table className="w-full text-left zebra-table border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-4 py-3 text-label-caps text-secondary uppercase">Driver</th>
<th className="px-4 py-3 text-label-caps text-secondary uppercase">License No.</th>
<th className="px-4 py-3 text-label-caps text-secondary uppercase">Category</th>
<th className="px-4 py-3 text-label-caps text-secondary uppercase">Expiry</th>
<th className="px-4 py-3 text-label-caps text-secondary uppercase">Contact</th>
<th className="px-4 py-3 text-label-caps text-secondary uppercase">Trip Compl.</th>
<th className="px-4 py-3 text-label-caps text-secondary uppercase">Safety</th>
<th className="px-4 py-3 text-label-caps text-secondary uppercase text-right">Status</th>
</tr>
</thead>
<tbody className="text-table-data">
{/* Row 1 */}
<tr className="border-b border-outline-variant">
<td className="px-4 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant">AB</div>
<span className="font-bold text-on-surface">Alex B.</span>
</div>
</td>
<td className="px-4 py-4 font-mono-data text-secondary">DL-88213</td>
<td className="px-4 py-4">LMV</td>
<td className="px-4 py-4">12/2028</td>
<td className="px-4 py-4 text-secondary">98765XXXXX</td>
<td className="px-4 py-4 font-bold">96%</td>
<td className="px-4 py-4">
<div className="flex gap-0.5">
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-200 rounded-sm"></div>
</div>
</td>
<td className="px-4 py-4 text-right">
<span className="px-3 py-1 rounded-full text-label-caps bg-green-100 text-green-800">AVAILABLE</span>
</td>
</tr>
{/* Row 2 */}
<tr className="border-b border-outline-variant">
<td className="px-4 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant">JD</div>
<span className="font-bold text-on-surface">John Doe</span>
</div>
</td>
<td className="px-4 py-4 font-mono-data text-secondary">DL-44210</td>
<td className="px-4 py-4">HMV</td>
<td className="px-4 py-4 text-error font-bold">03/2024 EXPIRED</td>
<td className="px-4 py-4 text-secondary">91220XXXXX</td>
<td className="px-4 py-4 font-bold">51%</td>
<td className="px-4 py-4">
<div className="flex gap-0.5">
<div className="w-4 h-2 bg-red-500 rounded-sm"></div>
<div className="w-4 h-2 bg-red-500 rounded-sm"></div>
<div className="w-4 h-2 bg-red-100 rounded-sm"></div>
<div className="w-4 h-2 bg-red-100 rounded-sm"></div>
<div className="w-4 h-2 bg-red-100 rounded-sm"></div>
</div>
</td>
<td className="px-4 py-4 text-right">
<span className="px-3 py-1 rounded-full text-label-caps bg-red-100 text-red-800">SUSPENDED</span>
</td>
</tr>
{/* Row 3 */}
<tr className="border-b border-outline-variant">
<td className="px-4 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant">PK</div>
<span className="font-bold text-on-surface">Priya K.</span>
</div>
</td>
<td className="px-4 py-4 font-mono-data text-secondary">DL-77031</td>
<td className="px-4 py-4">LMV</td>
<td className="px-4 py-4">08/2027</td>
<td className="px-4 py-4 text-secondary">99820XXXXX</td>
<td className="px-4 py-4 font-bold">99%</td>
<td className="px-4 py-4">
<div className="flex gap-0.5">
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
</div>
</td>
<td className="px-4 py-4 text-right">
<span className="px-3 py-1 rounded-full text-label-caps bg-blue-100 text-blue-800">ON TRIP</span>
</td>
</tr>
{/* Row 4 */}
<tr className="border-b border-outline-variant">
<td className="px-4 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant">SR</div>
<span className="font-bold text-on-surface">Suresh R.</span>
</div>
</td>
<td className="px-4 py-4 font-mono-data text-secondary">DL-90045</td>
<td className="px-4 py-4">HMV</td>
<td className="px-4 py-4">01/2027</td>
<td className="px-4 py-4 text-secondary">97440XXXXX</td>
<td className="px-4 py-4 font-bold">88%</td>
<td className="px-4 py-4">
<div className="flex gap-0.5">
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-200 rounded-sm"></div>
<div className="w-4 h-2 bg-green-200 rounded-sm"></div>
</div>
</td>
<td className="px-4 py-4 text-right">
<span className="px-3 py-1 rounded-full text-label-caps bg-gray-100 text-gray-800">OFF DUTY</span>
</td>
</tr>
{/* Row 5 */}
<tr className="border-b border-outline-variant">
<td className="px-4 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center font-bold text-on-surface-variant">MA</div>
<span className="font-bold text-on-surface">Mike A.</span>
</div>
</td>
<td className="px-4 py-4 font-mono-data text-secondary">DL-33982</td>
<td className="px-4 py-4">LMV</td>
<td className="px-4 py-4">06/2026</td>
<td className="px-4 py-4 text-secondary">95510XXXXX</td>
<td className="px-4 py-4 font-bold">92%</td>
<td className="px-4 py-4">
<div className="flex gap-0.5">
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
<div className="w-4 h-2 bg-green-200 rounded-sm"></div>
</div>
</td>
<td className="px-4 py-4 text-right">
<span className="px-3 py-1 rounded-full text-label-caps bg-green-100 text-green-800">AVAILABLE</span>
</td>
</tr>
</tbody>
</table>
{/* Table Footer / Pagination */}
<div className="px-6 py-4 flex items-center justify-between bg-surface-container-low">
<p className="text-body-md text-secondary">Showing 5 of 128 drivers</p>
<div className="flex gap-2">
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-white">Previous</button>
<button className="px-3 py-1 bg-primary-fixed border border-primary text-on-primary-fixed-variant rounded font-bold">1</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-white">2</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-white">3</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-white">Next</button>
</div>
</div>
</div>
{/* Metric Summary Cards */}
<div className="grid grid-cols-4 gap-grid_gutter mt-8">
<div className="bg-white border border-outline-variant p-5 rounded relative overflow-hidden group">
<div className="flex justify-between items-start mb-3">
<span className="text-label-caps text-secondary uppercase">Active Drivers</span>
<span className="material-symbols-outlined text-primary">groups</span>
</div>
<h4 className="text-display font-display text-on-surface">84</h4>
<div className="absolute bottom-0 left-0 h-1 bg-primary w-2/3 group-hover:w-full transition-all duration-500"></div>
</div>
<div className="bg-white border border-outline-variant p-5 rounded relative overflow-hidden group">
<div className="flex justify-between items-start mb-3">
<span className="text-label-caps text-secondary uppercase">Average Safety Score</span>
<span className="material-symbols-outlined text-green-600">verified</span>
</div>
<h4 className="text-display font-display text-on-surface">9.2<span className="text-headline-md text-secondary ml-1">/10</span></h4>
<div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full"></div>
</div>
<div className="bg-white border border-outline-variant p-5 rounded relative overflow-hidden group">
<div className="flex justify-between items-start mb-3">
<span className="text-label-caps text-secondary uppercase">Compliance Alerts</span>
<span className="material-symbols-outlined text-error">warning</span>
</div>
<h4 className="text-display font-display text-on-surface">06</h4>
<div className="absolute bottom-0 left-0 h-1 bg-error w-1/4 group-hover:w-full transition-all duration-500"></div>
</div>
<div className="bg-white border border-outline-variant p-5 rounded relative overflow-hidden group">
<div className="flex justify-between items-start mb-3">
<span className="text-label-caps text-secondary uppercase">Shift Utilization</span>
<span className="material-symbols-outlined text-blue-600">schedule</span>
</div>
<h4 className="text-display font-display text-on-surface">78%</h4>
<div className="absolute bottom-0 left-0 h-1 bg-blue-500 w-[78%] group-hover:w-full transition-all duration-500"></div>
</div>
</div>    </>
  );
}
