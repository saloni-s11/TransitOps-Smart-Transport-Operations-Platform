export default function Reports() {
  return (
    <>
{/* Header Section */}
<div className="flex items-center justify-between mb-8">
<div>
<h1 className="text-headline-lg font-headline-lg text-on-surface">Reports & Analytics</h1>
<p className="text-body-md text-secondary">Strategic performance monitoring and ROI analysis.</p>
</div>
<div className="flex gap-3">
<button className="px-4 py-2 border border-outline text-secondary text-label-caps font-label-caps rounded flex items-center gap-2 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    Last 30 Days
                </button>
<button className="px-4 py-2 bg-primary text-white text-label-caps font-label-caps rounded flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
<span className="material-symbols-outlined text-[18px]">download</span>
                    Export PDF
                </button>
</div>
</div>
{/* Bento Grid: Top KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
{/* Fuel Efficiency */}
<div className="bg-white p-6 rounded-xl border border-outline-variant hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary-fixed rounded-lg text-on-primary-fixed-variant">
<span className="material-symbols-outlined">local_gas_station</span>
</div>
<span className="text-green-600 flex items-center text-label-caps font-label-caps">
<span className="material-symbols-outlined text-[16px]">trending_up</span> 4.2%
                    </span>
</div>
<p className="text-label-caps font-label-caps text-secondary mb-1">Fuel Efficiency</p>
<h3 className="text-display font-display text-on-surface">8.4 km/l</h3>
<div className="absolute bottom-0 left-0 h-1 bg-primary-container w-3/4"></div>
</div>
{/* Fleet Utilization */}
<div className="bg-white p-6 rounded-xl border border-outline-variant hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-secondary-fixed rounded-lg text-on-secondary-fixed">
<span className="material-symbols-outlined">group_work</span>
</div>
<span className="text-red-500 flex items-center text-label-caps font-label-caps">
<span className="material-symbols-outlined text-[16px]">trending_down</span> 1.8%
                    </span>
</div>
<p className="text-label-caps font-label-caps text-secondary mb-1">Fleet Utilization</p>
<h3 className="text-display font-display text-on-surface">81%</h3>
<div className="absolute bottom-0 left-0 h-1 bg-secondary w-[81%]"></div>
</div>
{/* Operational Cost */}
<div className="bg-white p-6 rounded-xl border border-outline-variant hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-tertiary-fixed rounded-lg text-on-tertiary-fixed">
<span className="material-symbols-outlined">payments</span>
</div>
<span className="text-green-600 flex items-center text-label-caps font-label-caps">
<span className="material-symbols-outlined text-[16px]">trending_down</span> 12.5%
                    </span>
</div>
<p className="text-label-caps font-label-caps text-secondary mb-1">Operational Cost</p>
<h3 className="text-display font-display text-on-surface">$34,070</h3>
<div className="absolute bottom-0 left-0 h-1 bg-tertiary w-1/2"></div>
</div>
{/* Vehicle ROI */}
<div className="bg-white p-6 rounded-xl border border-outline-variant hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary-fixed rounded-lg text-on-primary-fixed-variant">
<span className="material-symbols-outlined">trending_up</span>
</div>
<span className="text-green-600 flex items-center text-label-caps font-label-caps">
<span className="material-symbols-outlined text-[16px]">add</span> 0.5%
                    </span>
</div>
<p className="text-label-caps font-label-caps text-secondary mb-1">Vehicle ROI</p>
<h3 className="text-display font-display text-on-surface">14.2%</h3>
<div className="absolute bottom-0 left-0 h-1 bg-primary w-[14%]"></div>
</div>
</div>
{/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/* Monthly Revenue Bar Chart */}
<div className="lg:col-span-2 bg-white p-6 rounded-xl border border-outline-variant">
<div className="flex items-center justify-between mb-8">
<h2 className="text-headline-md font-headline-md">Monthly Revenue</h2>
<select className="bg-surface-container-low border border-outline-variant rounded px-2 py-1 text-label-caps font-label-caps outline-none">
<option>2024</option>
<option>2023</option>
</select>
</div>
<div className="flex items-end justify-between h-64 gap-2 px-4">
{/* Dynamic Bars simulating data */}
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-secondary-container hover:bg-primary-container transition-all rounded-t h-[40%]" title="Jan: $45k"></div>
<span className="text-label-caps font-label-caps mt-2 text-secondary">JAN</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-secondary-container hover:bg-primary-container transition-all rounded-t h-[55%]" title="Feb: $62k"></div>
<span className="text-label-caps font-label-caps mt-2 text-secondary">FEB</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-secondary-container hover:bg-primary-container transition-all rounded-t h-[45%]" title="Mar: $50k"></div>
<span className="text-label-caps font-label-caps mt-2 text-secondary">MAR</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-secondary-container hover:bg-primary-container transition-all rounded-t h-[70%]" title="Apr: $82k"></div>
<span className="text-label-caps font-label-caps mt-2 text-secondary">APR</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-secondary-container hover:bg-primary-container transition-all rounded-t h-[85%]" title="May: $98k"></div>
<span className="text-label-caps font-label-caps mt-2 text-secondary">MAY</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-secondary-container hover:bg-primary-container transition-all rounded-t h-[65%]" title="Jun: $75k"></div>
<span className="text-label-caps font-label-caps mt-2 text-secondary">JUN</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-primary-container hover:bg-primary transition-all rounded-t h-[95%]" title="Jul: $110k"></div>
<span className="text-label-caps font-label-caps mt-2 font-bold text-primary">JUL</span>
</div>
<div className="flex flex-col items-center flex-1">
<div className="w-full bg-secondary-container opacity-30 rounded-t h-[10%]" title="Projected"></div>
<span className="text-label-caps font-label-caps mt-2 text-secondary">AUG</span>
</div>
</div>
<div className="mt-6 pt-6 border-t border-outline-variant flex gap-6">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-primary-container"></div>
<span className="text-body-md text-secondary">Revenue</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-secondary-container"></div>
<span className="text-body-md text-secondary">Historical</span>
</div>
</div>
</div>
{/* Top Costliest Vehicles Horizontal Chart */}
<div className="bg-white p-6 rounded-xl border border-outline-variant flex flex-col">
<div className="mb-8">
<h2 className="text-headline-md font-headline-md">Top Costliest Vehicles</h2>
<p className="text-body-md text-secondary">Total maintenance + fuel + toll</p>
</div>
<div className="space-y-8 flex-1">
{/* Truck-11 */}
<div>
<div className="flex justify-between items-center mb-2">
<span className="text-label-caps font-label-caps font-bold">Truck-11</span>
<span className="text-mono-data font-mono-data font-bold">$12,450</span>
</div>
<div className="h-4 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-error w-[90%] rounded-full"></div>
</div>
</div>
{/* Mini-03 */}
<div>
<div className="flex justify-between items-center mb-2">
<span className="text-label-caps font-label-caps font-bold">Mini-03</span>
<span className="text-mono-data font-mono-data font-bold">$8,210</span>
</div>
<div className="h-4 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary-container w-[65%] rounded-full"></div>
</div>
</div>
{/* Van-05 */}
<div>
<div className="flex justify-between items-center mb-2">
<span className="text-label-caps font-label-caps font-bold">Van-05</span>
<span className="text-mono-data font-mono-data font-bold">$6,410</span>
</div>
<div className="h-4 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-tertiary-container w-[45%] rounded-full"></div>
</div>
</div>
{/* Legend / CTA */}
<div className="mt-auto pt-4 bg-surface-container-low p-4 rounded-lg border border-dashed border-outline">
<p className="text-body-md text-on-surface-variant italic">
<span className="material-symbols-outlined text-[16px] align-middle mr-1">info</span>
                            Truck-11 exceeded monthly budget by 24%. Recommended for engine diagnostics.
                        </p>
</div>
</div>
</div>
</div>
{/* Detail Data Row (Table for context) */}
<div className="mt-8 bg-white rounded-xl border border-outline-variant overflow-hidden">
<div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
<h3 className="text-label-caps font-label-caps font-bold">Efficiency by Fleet Category</h3>
<button className="text-primary text-label-caps font-label-caps hover:underline">View All Details</button>
</div>
<table className="w-full zebra-table">
<thead>
<tr className="bg-surface-container-low text-label-caps font-label-caps text-secondary">
<th className="px-6 py-3 text-left border-b border-outline-variant">Category</th>
<th className="px-6 py-3 text-left border-b border-outline-variant">Active Assets</th>
<th className="px-6 py-3 text-left border-b border-outline-variant">Avg Efficiency</th>
<th className="px-6 py-3 text-left border-b border-outline-variant">Total Cost</th>
<th className="px-6 py-3 text-left border-b border-outline-variant">Status</th>
</tr>
</thead>
<tbody className="text-table-data font-table-data">
<tr>
<td className="px-6 py-4">Heavy Trucks</td>
<td className="px-6 py-4">12</td>
<td className="px-6 py-4">4.2 km/l</td>
<td className="px-6 py-4">$18,450</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-error-container text-on-error-container rounded-full text-[10px]">High Expense</span>
</td>
</tr>
<tr>
<td className="px-6 py-4">Medium Vans</td>
<td className="px-6 py-4">28</td>
<td className="px-6 py-4">9.5 km/l</td>
<td className="px-6 py-4">$9,220</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[10px]">Optimal</span>
</td>
</tr>
<tr>
<td className="px-6 py-4">Mini Sedans</td>
<td className="px-6 py-4">15</td>
<td className="px-6 py-4">14.8 km/l</td>
<td className="px-6 py-4">$6,400</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[10px]">Optimal</span>
</td>
</tr>
</tbody>
</table>
</div>    </>
  );
}
