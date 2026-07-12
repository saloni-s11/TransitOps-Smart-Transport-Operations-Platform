export default function FuelExpenses() {
  return (
    <>
<div className="flex flex-col gap-6">
{/* Header & Actions */}
<div className="flex justify-between items-end">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Fuel & Expense Management</h1>
<p className="text-body-md text-secondary mt-1">Monitor operational spending and fuel efficiency across the fleet.</p>
</div>
<div className="flex gap-3">
<button className="bg-primary-container text-on-primary-container px-6 py-2.5 font-bold rounded hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
<span className="material-symbols-outlined">local_gas_station</span>
                        Log Fuel
                    </button>
<button className="bg-primary-container text-on-primary-container px-6 py-2.5 font-bold rounded hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
<span className="material-symbols-outlined">add_card</span>
                        Add Expense
                    </button>
</div>
</div>
{/* Bento Layout for Data Tables */}
<div className="grid grid-cols-12 gap-6">
{/* Section 1: Fuel Logs */}
<div className="col-span-12 bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
<div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
<h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary">ev_station</span>
                            Fuel Logs
                        </h2>
<button className="text-primary font-bold text-label-caps hover:underline">View History</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest border-b border-outline-variant">
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Vehicle</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Date</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Liters</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-right">Cost (₹)</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-center">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-primary-fixed/20 transition-colors">
<td className="px-6 py-4 font-table-data text-table-data">VAN-05</td>
<td className="px-6 py-4 font-table-data text-table-data">05 JUL 2026</td>
<td className="px-6 py-4 font-table-data text-table-data font-mono-data">42 L</td>
<td className="px-6 py-4 font-table-data text-table-data text-right font-mono-data">3,150</td>
<td className="px-6 py-4 text-center">
<span className="px-3 py-1 bg-green-100 text-green-800 text-label-caps rounded-full font-bold">Processed</span>
</td>
</tr>
<tr className="hover:bg-primary-fixed/20 transition-colors">
<td className="px-6 py-4 font-table-data text-table-data">TRUCK-11</td>
<td className="px-6 py-4 font-table-data text-table-data">06 JUL 2026</td>
<td className="px-6 py-4 font-table-data text-table-data font-mono-data">110 L</td>
<td className="px-6 py-4 font-table-data text-table-data text-right font-mono-data">8,400</td>
<td className="px-6 py-4 text-center">
<span className="px-3 py-1 bg-green-100 text-green-800 text-label-caps rounded-full font-bold">Processed</span>
</td>
</tr>
<tr className="hover:bg-primary-fixed/20 transition-colors">
<td className="px-6 py-4 font-table-data text-table-data">MINI-02</td>
<td className="px-6 py-4 font-table-data text-table-data">06 JUL 2026</td>
<td className="px-6 py-4 font-table-data text-table-data font-mono-data">28 L</td>
<td className="px-6 py-4 font-table-data text-table-data text-right font-mono-data">2,050</td>
<td className="px-6 py-4 text-center">
<span className="px-3 py-1 bg-amber-100 text-amber-800 text-label-caps rounded-full font-bold">Pending Review</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Section 2: Other Expenses */}
<div className="col-span-12 bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
<div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant">
<h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary">toll</span>
                            Other Expenses (Toll / Misc)
                        </h2>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest border-b border-outline-variant">
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Trip</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Vehicle</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-right">Toll</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-right">Other</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Agent (Cleared)</th>
<th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-right">Total (₹)</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-primary-fixed/20 transition-colors">
<td className="px-6 py-4 font-table-data text-table-data">TR001</td>
<td className="px-6 py-4 font-table-data text-table-data">VAN-05</td>
<td className="px-6 py-4 font-mono-data text-table-data text-right">120</td>
<td className="px-6 py-4 font-mono-data text-table-data text-right">0</td>
<td className="px-6 py-4 text-center">
<span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-label-caps rounded-full font-bold">Available</span>
</td>
<td className="px-6 py-4 font-mono-data text-table-data text-right font-bold">120</td>
</tr>
<tr className="hover:bg-primary-fixed/20 transition-colors">
<td className="px-6 py-4 font-table-data text-table-data">TR002</td>
<td className="px-6 py-4 font-table-data text-table-data">TRX-12</td>
<td className="px-6 py-4 font-mono-data text-table-data text-right">340</td>
<td className="px-6 py-4 font-mono-data text-table-data text-right">150</td>
<td className="px-6 py-4 text-center">
<span className="px-3 py-1 bg-green-100 text-green-800 text-label-caps rounded-full font-bold">Completed</span>
</td>
<td className="px-6 py-4 font-mono-data text-table-data text-right font-bold">19,000</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Section 3: Summary Total */}
<div className="col-span-12 flex justify-end">
<div className="bg-surface-container-highest p-6 rounded-lg border-2 border-primary-container min-w-[400px]">
<div className="flex justify-between items-center gap-12">
<span className="text-label-caps font-bold text-secondary uppercase tracking-widest">Total Operational Cost (Auto) = Fuel + Maintenance</span>
<span className="text-display font-display text-primary">₹ 34,070</span>
</div>
</div>
</div>
</div>
{/* Operational Insights (Secondary Content) */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
<div className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm">
<p className="text-label-caps text-secondary mb-2">Fuel Efficiency Avg</p>
<div className="flex items-baseline gap-2">
<span className="text-headline-lg font-headline-lg text-on-surface">8.4 km/l</span>
<span className="text-body-md text-green-600 flex items-center"><span className="material-symbols-outlined text-sm">arrow_upward</span> 4%</span>
</div>
<div className="w-full bg-surface-container h-1.5 mt-4 rounded-full overflow-hidden">
<div className="bg-primary w-3/4 h-full"></div>
</div>
</div>
<div className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm">
<p className="text-label-caps text-secondary mb-2">Maintenance Spend (MTD)</p>
<div className="flex items-baseline gap-2">
<span className="text-headline-lg font-headline-lg text-on-surface">₹ 14,200</span>
<span className="text-body-md text-amber-600 flex items-center"><span className="material-symbols-outlined text-sm">trending_up</span> 12%</span>
</div>
<div className="w-full bg-surface-container h-1.5 mt-4 rounded-full overflow-hidden">
<div className="bg-tertiary w-1/2 h-full"></div>
</div>
</div>
<div className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm">
<p className="text-label-caps text-secondary mb-2">Highest Expense Category</p>
<div className="flex items-baseline gap-2">
<span className="text-headline-lg font-headline-lg text-on-surface">Fuel (72%)</span>
</div>
<div className="flex gap-1 mt-4">
<div className="bg-primary h-1.5 flex-grow-[72] rounded-full"></div>
<div className="bg-tertiary h-1.5 flex-grow-[18] rounded-full"></div>
<div className="bg-secondary h-1.5 flex-grow-[10] rounded-full"></div>
</div>
</div>
</div>
</div>    </>
  );
}
