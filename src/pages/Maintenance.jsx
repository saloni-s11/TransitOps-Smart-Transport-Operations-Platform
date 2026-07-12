export default function Maintenance() {
  return (
    <>
{/* Left Column: Form & Analytics */}
<div className="w-[400px] flex flex-col gap-grid_gutter shrink-0">
{/* Log Service Record Card */}
<section className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
<div className="flex items-center justify-between mb-6">
<h2 className="text-headline-md font-headline-md text-on-surface">Log Service Record</h2>
<span className="material-symbols-outlined text-primary-container">history_edu</span>
</div>
<form className="space-y-4">
<div>
<label className="block text-body-md font-body-md mb-1.5 text-secondary">Vehicle</label>
<select className="w-full bg-white border border-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-lg p-2.5 text-body-md">
<option>Select Vehicle</option>
<option>VAN-05</option>
<option>TRUCK-11</option>
<option>MINI-03</option>
<option>VAN-09</option>
</select>
</div>
<div>
<label className="block text-body-md font-body-md mb-1.5 text-secondary">Service Type</label>
<input className="w-full border border-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-lg p-2.5 text-body-md" placeholder="e.g., Oil Change, Engine Check" type="text"/>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-body-md font-body-md mb-1.5 text-secondary">Cost ($)</label>
<input className="w-full border border-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-lg p-2.5 text-body-md" placeholder="0.00" type="number"/>
</div>
<div>
<label className="block text-body-md font-body-md mb-1.5 text-secondary">Date</label>
<input className="w-full border border-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-lg p-2.5 text-body-md" type="date"/>
</div>
</div>
<div>
<label className="block text-body-md font-body-md mb-1.5 text-secondary">Status</label>
<div className="flex gap-4 items-center mt-2">
<label className="flex items-center gap-2 cursor-pointer">
<input checked className="text-primary-container focus:ring-primary-container" name="status" type="radio"/>
<span className="text-body-md font-medium text-on-surface">Active</span>
</label>
<label className="flex items-center gap-2 cursor-pointer opacity-50">
<input className="text-secondary focus:ring-secondary" disabled name="status" type="radio"/>
<span className="text-body-md font-medium text-secondary">Inactive</span>
</label>
</div>
</div>
<button className="w-full bg-primary-container text-on-primary py-3 rounded-lg font-bold hover:brightness-95 transition-all shadow-md active:scale-95 mt-4" type="submit">
                        Save Service Record
                    </button>
</form>
</section>
{/* Availability Logic & Legend Card */}
<section className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
<h3 className="text-label-caps font-label-caps text-secondary uppercase tracking-widest mb-6">System Availability Logic</h3>
<div className="space-y-6">
{/* Visual Legend */}
<div className="flex flex-col gap-4">
<div className="flex items-center gap-3">
<span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-label-caps font-bold rounded-full">Available</span>
<span className="text-body-md text-secondary">Ready for dispatch</span>
</div>
<div className="relative flex items-center justify-between py-2">
<div className="flex flex-col items-center z-10 bg-white px-2">
<span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-label-caps font-bold rounded-full line-through">Available</span>
</div>
<div className="absolute inset-x-0 top-1/2 h-[1px] bg-outline-variant"></div>
<span className="material-symbols-outlined text-error z-10 bg-white px-2">arrow_forward</span>
<div className="flex flex-col items-center z-10 bg-white px-2">
<span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-label-caps font-bold rounded-full uppercase">In Shop</span>
</div>
</div>
<div className="flex items-center gap-3">
<span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-label-caps font-bold rounded-full uppercase">In Shop</span>
<span className="text-body-md text-secondary">Maintenance in progress</span>
</div>
</div>
<div className="mt-4 p-4 bg-surface-container rounded-lg border border-outline-variant">
<div className="flex gap-3">
<span className="material-symbols-outlined text-primary">info</span>
<p className="text-body-md text-on-surface italic">
                                Note: In Shop vehicles are removed from the dispatcher pool until maintenance is marked as complete.
                            </p>
</div>
</div>
</div>
</section>
</div>
{/* Right Column: Table */}
<div className="flex-1 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
<div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
<div>
<h2 className="text-headline-md font-headline-md text-on-surface">Service Log</h2>
<p className="text-body-md text-secondary">Historical and ongoing maintenance records</p>
</div>
<div className="flex gap-2">
<button className="bg-surface border border-outline-variant px-4 py-2 rounded-lg text-body-md font-medium hover:bg-surface-container-high transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-lg">filter_list</span>
                        Filter
                    </button>
<button className="bg-surface border border-outline-variant px-4 py-2 rounded-lg text-body-md font-medium hover:bg-surface-container-high transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-lg">download</span>
                        Export
                    </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead>
<tr className="bg-surface-container-low text-left border-b border-outline-variant">
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Vehicle</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Service</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Date</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest text-right">Cost</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Status</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-widest">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{/* Table Row 1 */}
<tr className="hover:bg-primary-fixed/10 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">local_shipping</span>
<span className="text-table-data font-table-data text-on-surface">VAN-05</span>
</div>
</td>
<td className="px-6 py-4 text-table-data font-table-data text-secondary">Oil Change</td>
<td className="px-6 py-4 text-table-data font-table-data text-secondary">05 JUL 2026</td>
<td className="px-6 py-4 text-table-data font-table-data text-on-surface text-right">2,500.00</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-label-caps font-bold rounded-full uppercase">In Shop</span>
</td>
<td className="px-6 py-4">
<button className="text-primary font-bold text-body-md hover:underline">Details</button>
</td>
</tr>
{/* Table Row 2 */}
<tr className="hover:bg-primary-fixed/10 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">local_shipping</span>
<span className="text-table-data font-table-data text-on-surface">TRUCK-11</span>
</div>
</td>
<td className="px-6 py-4 text-table-data font-table-data text-secondary">Engine Repair</td>
<td className="px-6 py-4 text-table-data font-table-data text-secondary">03 JUL 2026</td>
<td className="px-6 py-4 text-table-data font-table-data text-on-surface text-right">18,000.00</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-label-caps font-bold rounded-full">Completed</span>
</td>
<td className="px-6 py-4">
<button className="text-primary font-bold text-body-md hover:underline">Details</button>
</td>
</tr>
{/* Table Row 3 */}
<tr className="hover:bg-primary-fixed/10 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">local_shipping</span>
<span className="text-table-data font-table-data text-on-surface">MINI-03</span>
</div>
</td>
<td className="px-6 py-4 text-table-data font-table-data text-secondary">Tyre Replace</td>
<td className="px-6 py-4 text-table-data font-table-data text-secondary">28 JUN 2026</td>
<td className="px-6 py-4 text-table-data font-table-data text-on-surface text-right">6,200.00</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-label-caps font-bold rounded-full uppercase">In Shop</span>
</td>
<td className="px-6 py-4">
<button className="text-primary font-bold text-body-md hover:underline">Details</button>
</td>
</tr>
{/* Table Row 4 */}
<tr className="hover:bg-primary-fixed/10 transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">local_shipping</span>
<span className="text-table-data font-table-data text-on-surface">VAN-09</span>
</div>
</td>
<td className="px-6 py-4 text-table-data font-table-data text-secondary">Brake Service</td>
<td className="px-6 py-4 text-table-data font-table-data text-secondary">25 JUN 2026</td>
<td className="px-6 py-4 text-table-data font-table-data text-on-surface text-right">1,450.00</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-label-caps font-bold rounded-full">Completed</span>
</td>
<td className="px-6 py-4">
<button className="text-primary font-bold text-body-md hover:underline">Details</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination/Footer */}
<div className="p-6 bg-surface-container-low border-t border-outline-variant mt-auto flex justify-between items-center">
<span className="text-body-md text-secondary">Showing 4 of 12 records</span>
<div className="flex gap-2">
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center bg-primary-container text-on-primary rounded font-bold">1</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors">2</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>    </>
  );
}
