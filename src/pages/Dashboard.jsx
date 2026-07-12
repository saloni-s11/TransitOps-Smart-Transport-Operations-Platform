export default function Dashboard() {
  return (
    <>
<div className="p-container_padding max-w-7xl mx-auto space-y-6">
{/* Filters Row */}
<div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border border-outline-variant shadow-sm">
<div className="space-y-1 shrink-0">
<label className="text-label-caps font-label-caps text-secondary block">VEHICLE TYPE</label>
<select className="bg-surface-container-low border-outline-variant rounded-lg text-body-md font-body-md px-4 py-2 focus:ring-primary min-w-[160px]">
<option>All Types</option>
<option>Trucks</option>
<option>Vans</option>
<option>Special</option>
</select>
</div>
<div className="space-y-1 shrink-0">
<label className="text-label-caps font-label-caps text-secondary block">STATUS</label>
<select className="bg-surface-container-low border-outline-variant rounded-lg text-body-md font-body-md px-4 py-2 focus:ring-primary min-w-[160px]">
<option>All Status</option>
<option>Available</option>
<option>On Trip</option>
<option>Maintenance</option>
</select>
</div>
<div className="space-y-1 shrink-0">
<label className="text-label-caps font-label-caps text-secondary block">REGION</label>
<select className="bg-surface-container-low border-outline-variant rounded-lg text-body-md font-body-md px-4 py-2 focus:ring-primary min-w-[160px]">
<option>All Regions</option>
<option>Region K</option>
<option>Region B</option>
<option>Region Z</option>
</select>
</div>
<button className="ml-auto flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-bold text-body-md hover:bg-opacity-90 transition-all active:scale-95 shadow-lg">
<span className="material-symbols-outlined text-[20px]">add</span>
                    New Dispatch
                </button>
</div>
{/* KPI Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
{/* KPI 1 */}
<div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
<p className="text-label-caps font-label-caps text-secondary mb-1">ACTIVE VEHICLES</p>
<div className="flex items-baseline gap-2">
<span className="text-display font-display text-on-surface">53</span>
<span className="text-label-caps text-green-600 font-bold">↑ 4%</span>
</div>
<div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
<div className="bg-primary h-full" style={{width: '75%'}}></div>
</div>
</div>
{/* KPI 2 */}
<div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
<p className="text-label-caps font-label-caps text-secondary mb-1">AVAILABLE</p>
<div className="flex items-baseline gap-2">
<span className="text-display font-display text-on-surface">42</span>
</div>
<div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
<div className="bg-green-500 h-full" style={{width: '60%'}}></div>
</div>
</div>
{/* KPI 3 */}
<div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
<p className="text-label-caps font-label-caps text-secondary mb-1">IN MAINTENANCE</p>
<div className="flex items-baseline gap-2">
<span className="text-display font-display text-on-surface">05</span>
</div>
<div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
<div className="bg-error h-full" style={{width: '15%'}}></div>
</div>
</div>
{/* KPI 4 */}
<div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
<p className="text-label-caps font-label-caps text-secondary mb-1">ACTIVE TRIPS</p>
<div className="flex items-baseline gap-2">
<span className="text-display font-display text-on-surface">18</span>
</div>
<div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
<div className="bg-tertiary h-full" style={{width: '45%'}}></div>
</div>
</div>
{/* KPI 5 */}
<div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
<p className="text-label-caps font-label-caps text-secondary mb-1">PENDING TRIPS</p>
<div className="flex items-baseline gap-2">
<span className="text-display font-display text-on-surface">09</span>
</div>
<div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
<div className="bg-secondary h-full" style={{width: '30%'}}></div>
</div>
</div>
{/* KPI 6 */}
<div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
<p className="text-label-caps font-label-caps text-secondary mb-1">DRIVERS ON DUTY</p>
<div className="flex items-baseline gap-2">
<span className="text-display font-display text-on-surface">26</span>
</div>
<div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
<div className="bg-primary-container h-full" style={{width: '85%'}}></div>
</div>
</div>
{/* KPI 7 */}
<div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-all">
<p className="text-label-caps font-label-caps text-secondary mb-1">FLEET UTILIZATION</p>
<div className="flex items-baseline gap-2">
<span className="text-display font-display text-on-surface">81%</span>
</div>
<div className="w-full bg-surface-container-highest h-1 mt-4 rounded-full overflow-hidden">
<div className="bg-primary h-full" style={{width: '81%'}}></div>
</div>
</div>
</div>
{/* Bento Layout Content */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* Recent Trips Table (Spans 2 columns) */}
<div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
<div className="p-4 border-b border-outline-variant flex items-center justify-between">
<h3 className="text-headline-md font-headline-md text-on-surface">Recent Trips</h3>
<button className="text-body-md font-body-md text-primary hover:underline">View All Trips</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-surface-container-low">
<tr>
<th className="px-6 py-3 text-label-caps font-label-caps text-secondary">TRIP ID</th>
<th className="px-6 py-3 text-label-caps font-label-caps text-secondary">VEHICLE</th>
<th className="px-6 py-3 text-label-caps font-label-caps text-secondary">DRIVER</th>
<th className="px-6 py-3 text-label-caps font-label-caps text-secondary">STATUS</th>
<th className="px-6 py-3 text-label-caps font-label-caps text-secondary text-right">ETA</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-primary-fixed/20 transition-colors group">
<td className="px-6 py-4 text-mono-data font-mono-data font-bold">TR001</td>
<td className="px-6 py-4 text-table-data font-table-data">VAN-05</td>
<td className="px-6 py-4 text-table-data font-table-data">Alex M.</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 uppercase">On Trip</span>
</td>
<td className="px-6 py-4 text-mono-data font-mono-data text-right">45 min</td>
</tr>
<tr className="hover:bg-primary-fixed/20 transition-colors group">
<td className="px-6 py-4 text-mono-data font-mono-data font-bold">TR002</td>
<td className="px-6 py-4 text-table-data font-table-data">TRK-12</td>
<td className="px-6 py-4 text-table-data font-table-data">Sam R.</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700 uppercase">Completed</span>
</td>
<td className="px-6 py-4 text-mono-data font-mono-data text-right">--</td>
</tr>
<tr className="hover:bg-primary-fixed/20 transition-colors group">
<td className="px-6 py-4 text-mono-data font-mono-data font-bold">TR003</td>
<td className="px-6 py-4 text-table-data font-table-data">MINI-08</td>
<td className="px-6 py-4 text-table-data font-table-data">Priya K.</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700 uppercase">Dispatched</span>
</td>
<td className="px-6 py-4 text-mono-data font-mono-data text-right">3h 10m</td>
</tr>
<tr className="hover:bg-primary-fixed/20 transition-colors group">
<td className="px-6 py-4 text-mono-data font-mono-data font-bold">TR004</td>
<td className="px-6 py-4 text-table-data font-table-data">TRK-09</td>
<td className="px-6 py-4 text-table-data font-table-data">John D.</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 uppercase">On Trip</span>
</td>
<td className="px-6 py-4 text-mono-data font-mono-data text-right">1h 20m</td>
</tr>
<tr className="hover:bg-primary-fixed/20 transition-colors group">
<td className="px-6 py-4 text-mono-data font-mono-data font-bold">TR005</td>
<td className="px-6 py-4 text-table-data font-table-data">VAN-02</td>
<td className="px-6 py-4 text-table-data font-table-data">Unassigned</td>
<td className="px-6 py-4">
<span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 uppercase">Draft</span>
</td>
<td className="px-6 py-4 text-mono-data font-mono-data text-right">--</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Vehicle Status Chart */}
<div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col space-y-6">
<div className="flex items-center justify-between">
<h3 className="text-headline-md font-headline-md text-on-surface">Vehicle Status</h3>
<span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">more_vert</span>
</div>
<div className="space-y-6 flex-grow flex flex-col justify-center">
<div className="space-y-2">
<div className="flex justify-between text-body-md font-body-md">
<span className="text-secondary">Available</span>
<span className="font-bold">42</span>
</div>
<div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
<div className="bg-green-500 h-full transition-all duration-1000" style={{width: '58%'}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-body-md font-body-md">
<span className="text-secondary">On Trip</span>
<span className="font-bold">24</span>
</div>
<div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
<div className="bg-blue-500 h-full transition-all duration-1000" style={{width: '32%'}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-body-md font-body-md">
<span className="text-secondary">In Shop</span>
<span className="font-bold">5</span>
</div>
<div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
<div className="bg-error h-full transition-all duration-1000" style={{width: '8%'}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-body-md font-body-md">
<span className="text-secondary">Retired</span>
<span className="font-bold">2</span>
</div>
<div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
<div className="bg-gray-400 h-full transition-all duration-1000" style={{width: '4%'}}></div>
</div>
</div>
</div>
<div className="pt-4 border-t border-outline-variant">
<div className="grid grid-cols-2 gap-4">
<div className="p-3 bg-surface-container-low rounded-lg text-center">
<p className="text-label-caps font-label-caps text-secondary">AVG LIFETIME</p>
<p className="text-headline-md font-bold text-on-surface">4.2 yrs</p>
</div>
<div className="p-3 bg-surface-container-low rounded-lg text-center">
<p className="text-label-caps font-label-caps text-secondary">TOTAL FLEET</p>
<p className="text-headline-md font-bold text-on-surface">73</p>
</div>
</div>
</div>
</div>
</div>
{/* Asset Usage / Decorative Area */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/* Map / Dispatch View Placeholder */}
<div className="lg:col-span-2 relative h-80 rounded-xl overflow-hidden shadow-sm border border-outline-variant">
<div className="absolute inset-0 z-0" data-alt="A sophisticated digital map visualization for fleet management. The map features a dark blue and gray professional color scheme with glowing tactical icons representing vehicle locations across a metropolitan grid. Subtle data overlays like speed indicators and route paths are visible in amber and teal, evoking a sense of real-time logistics control and operational precision. The style is modern, data-driven, and corporate." style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCeoJQQQTtZGr2dRbKQcnKiawjDnxPf2O4sNW-C_58ruDnlu-swLNDZlSelJ333la2B_djrK8L8gdOz4bUD-7W0gsyHT6YOY_mWnR0vUUqiXWCmYdOYq_ZasR0LuGishfLBaUXvkBUKcuMsXl8biEAyuTKFLXGuXx9dJdeSvxFVZiwv9HZ3BC484m1U2JAskt_yNzHMrYncV1ImJvuqWjfnH3BVHuPub5R9RX7BepEboyYSZoUQlI-qGuAPJI_SU0-g2Deot6b8PcZ2\')'}}></div>
<div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-3 rounded-lg border border-outline-variant shadow-lg max-w-xs">
<h4 className="text-body-md font-bold text-on-surface mb-2">Live Dispatch View</h4>
<div className="flex items-center gap-2 mb-1">
<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
<p className="text-label-caps font-label-caps text-secondary">REGION K ACTIVE</p>
</div>
<p className="text-body-md font-body-md text-secondary">High congestion detected on Main St. Rerouting 4 units.</p>
</div>
<div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
<button className="bg-white p-2 rounded-lg shadow-md border border-outline-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined">zoom_in</span>
</button>
<button className="bg-white p-2 rounded-lg shadow-md border border-outline-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined">zoom_out</span>
</button>
</div>
</div>
{/* Activity Feed */}
<div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6 overflow-hidden">
<h3 className="text-headline-md font-headline-md text-on-surface mb-6">Operations Log</h3>
<div className="space-y-6 overflow-y-auto max-h-[260px] pr-2">
<div className="flex gap-4 relative">
<div className="absolute top-6 bottom-[-24px] left-3 w-[1px] bg-outline-variant"></div>
<div className="w-6 h-6 rounded-full bg-primary-container shrink-0 flex items-center justify-center z-10">
<span className="material-symbols-outlined text-[14px] text-on-primary-container">local_gas_station</span>
</div>
<div>
<p className="text-body-md font-body-md text-on-surface"><strong>TRK-12</strong> refueled in Sector 4</p>
<p className="text-label-caps font-label-caps text-secondary">10 MINUTES AGO</p>
</div>
</div>
<div className="flex gap-4 relative">
<div className="absolute top-6 bottom-[-24px] left-3 w-[1px] bg-outline-variant"></div>
<div className="w-6 h-6 rounded-full bg-error-container shrink-0 flex items-center justify-center z-10">
<span className="material-symbols-outlined text-[14px] text-on-error-container">warning</span>
</div>
<div>
<p className="text-body-md font-body-md text-on-surface">Engine alert reported for <strong>VAN-05</strong></p>
<p className="text-label-caps font-label-caps text-secondary">25 MINUTES AGO</p>
</div>
</div>
<div className="flex gap-4 relative">
<div className="absolute top-6 bottom-[-24px] left-3 w-[1px] bg-outline-variant"></div>
<div className="w-6 h-6 rounded-full bg-secondary-container shrink-0 flex items-center justify-center z-10">
<span className="material-symbols-outlined text-[14px] text-on-secondary-container">check_circle</span>
</div>
<div>
<p className="text-body-md font-body-md text-on-surface"><strong>TR002</strong> completed successfully</p>
<p className="text-label-caps font-label-caps text-secondary">1 HOUR AGO</p>
</div>
</div>
<div className="flex gap-4">
<div className="w-6 h-6 rounded-full bg-tertiary-container shrink-0 flex items-center justify-center z-10">
<span className="material-symbols-outlined text-[14px] text-on-tertiary-container">person</span>
</div>
<div>
<p className="text-body-md font-body-md text-on-surface">New driver <strong>Sarah L.</strong> onboarded</p>
<p className="text-label-caps font-label-caps text-secondary">2 HOURS AGO</p>
</div>
</div>
</div>
</div>
</div>
</div>    </>
  );
}
