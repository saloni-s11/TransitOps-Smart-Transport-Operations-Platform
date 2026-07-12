import { ProtectedAction } from "../components/common/ProtectedAction";
import { PERMISSIONS } from "../lib/permissions";

export default function Settings() {
  return (
    <>
<div className="max-w-6xl mx-auto space-y-grid_gutter">
{/* Breadcrumbs */}
<div className="flex items-center gap-2 text-secondary">
<span className="text-label-caps font-label-caps">Admin</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
<span className="text-label-caps font-label-caps text-on-surface">Settings & RBAC</span>
</div>
{/* Page Header */}
<div className="flex justify-between items-end mb-8">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Configuration</h1>
<p className="text-body-md text-secondary">Manage platform-wide defaults and enterprise access controls.</p>
</div>
<ProtectedAction permission={PERMISSIONS.EDIT_SETTINGS} mode="tooltip">
  <button className="bg-primary-container text-on-primary-container font-semibold px-6 py-2 rounded-lg hover:opacity-80 active:scale-95 transition-all flex items-center gap-2">
    <span className="material-symbols-outlined">save</span>
                    Save changes
  </button>
</ProtectedAction>
</div>
<div className="grid grid-cols-12 gap-grid_gutter">
{/* General Settings Section */}
<section className="col-span-12 lg:col-span-4 space-y-6">
<div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-primary">tune</span>
<h2 className="font-headline-md text-headline-md">General Settings</h2>
</div>
<div className="space-y-5">
<div>
<label className="block font-label-caps text-label-caps text-secondary mb-1.5 uppercase">DEPOT NAME</label>
<input className="w-full px-4 py-2.5 bg-background border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none" type="text" value="Gandhinagar Depot GW24"/>
</div>
<div>
<label className="block font-label-caps text-label-caps text-secondary mb-1.5 uppercase">CURRENCY</label>
<select className="w-full px-4 py-2.5 bg-background border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none appearance-none">
<option value="INR">INR (₹)</option>
<option value="USD">USD ($)</option>
<option value="EUR">EUR (€)</option>
</select>
</div>
<div>
<label className="block font-label-caps text-label-caps text-secondary mb-1.5 uppercase">DISTANCE UNIT</label>
<div className="grid grid-cols-2 gap-2">
<button className="px-4 py-2.5 bg-primary-container text-on-primary-container font-semibold rounded-lg text-body-md border border-primary-container">Kilometers</button>
<button className="px-4 py-2.5 bg-background text-secondary font-medium rounded-lg text-body-md border border-outline-variant hover:bg-surface-container-high">Miles</button>
</div>
</div>
</div>
{/* Visual illustration for context */}
<div className="mt-8 pt-8 border-t border-outline-variant">
<div className="rounded-lg overflow-hidden border border-outline-variant relative h-40">
<img className="w-full h-full object-cover" data-alt="A high-tech digital control center with multiple large screens showing logistic data and map routes. The environment is professional, with blue and amber lighting accents, reflecting a modern fleet management operations hub. High resolution and cinematic perspective." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNx3Arjq9GzK1vc-v1KNTgBuXvlhIw3LZw9EoXHn6I67ZnGW1TEpjRg3B7FtQ_4LmvYNJc6zmOwc-IHprFGkaKTe9pWdwR-afwVc5ki8E78PnFbStTWXNUpLhYWgdEgq_r15Y8Id7Sv5j3NtIOOs9dqW1cc8oCMzrJHT5lp54fok19RYJhn9ayvhhi6wC0OLNvwcSBqZEU3BcVueWwVxmKXIHFyLEaVoAWK0QBgEI3KPi_VB8y66fkmBu32r62_pu2jH57AqkhwnR8"/>
<div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent flex items-end p-4">
<span className="text-white text-label-caps font-label-caps">Primary Operations Hub</span>
</div>
</div>
</div>
</div>
</section>
{/* RBAC Section */}
<section className="col-span-12 lg:col-span-8 space-y-6">
<div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">security</span>
<h2 className="font-headline-md text-headline-md">Role-Based Access Control (RBAC)</h2>
</div>
<span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Enterprise Policy</span>
</div>
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead>
<tr className="bg-surface-container-lowest">
<th className="text-left px-6 py-4 border-b border-outline-variant font-label-caps text-label-caps text-secondary uppercase tracking-widest bg-[#F8FAFC]">Role</th>
<th className="text-center px-6 py-4 border-b border-outline-variant font-label-caps text-label-caps text-secondary uppercase tracking-widest bg-[#F8FAFC]">Fleet</th>
<th className="text-center px-6 py-4 border-b border-outline-variant font-label-caps text-label-caps text-secondary uppercase tracking-widest bg-[#F8FAFC]">Drivers</th>
<th className="text-center px-6 py-4 border-b border-outline-variant font-label-caps text-label-caps text-secondary uppercase tracking-widest bg-[#F8FAFC]">Trips</th>
<th className="text-center px-6 py-4 border-b border-outline-variant font-label-caps text-label-caps text-secondary uppercase tracking-widest bg-[#F8FAFC]">Fuel/Exp.</th>
<th className="text-center px-6 py-4 border-b border-outline-variant font-label-caps text-label-caps text-secondary uppercase tracking-widest bg-[#F8FAFC]">Analytics</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-[#FFFBEB] transition-colors group">
<td className="px-6 py-5 font-table-data text-table-data text-on-surface font-semibold">Fleet Manager</td>
<td className="px-6 py-5 text-center"><span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span></td>
<td className="px-6 py-5 text-center"><span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span></td>
<td className="px-6 py-5 text-center"><span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span></td>
<td className="px-6 py-5 text-center"><span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span></td>
<td className="px-6 py-5 text-center"><span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span></td>
</tr>
<tr className="hover:bg-[#FFFBEB] transition-colors group">
<td className="px-6 py-5 font-table-data text-table-data text-on-surface font-semibold">Dispatcher</td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
<td className="px-6 py-5 text-center"><span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span></td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
</tr>
<tr className="hover:bg-[#FFFBEB] transition-colors group">
<td className="px-6 py-5 font-table-data text-table-data text-on-surface font-semibold">Safety Officer</td>
<td className="px-6 py-5 text-center"><span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>visibility</span></td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
</tr>
<tr className="hover:bg-[#FFFBEB] transition-colors group">
<td className="px-6 py-5 font-table-data text-table-data text-on-surface font-semibold">Financial Analyst</td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
<td className="px-6 py-5 text-center text-secondary opacity-30"><span className="material-symbols-outlined">remove_circle_outline</span></td>
<td className="px-6 py-5 text-center"><span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span></td>
<td className="px-6 py-5 text-center"><span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span></td>
</tr>
</tbody>
</table>
</div>
<div className="p-6 bg-surface-container-low border-t border-outline-variant">
<p className="text-body-md text-secondary italic">Note: Only Root Administrators can modify these role definitions. Contact TransitOps Enterprise Support for custom roles.</p>
</div>
</div>
{/* Security Insights - Visual Card */}
<div className="grid grid-cols-2 gap-grid_gutter">
<div className="bg-white border border-outline-variant p-6 rounded-xl flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
<span className="material-symbols-outlined">history</span>
</div>
<div>
<h3 className="text-label-caps font-label-caps text-secondary uppercase">Last Audit</h3>
<p className="text-body-lg font-semibold">24 Oct 2023</p>
</div>
</div>
<div className="bg-white border border-outline-variant p-6 rounded-xl flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
<span className="material-symbols-outlined">vpn_key</span>
</div>
<div>
<h3 className="text-label-caps font-label-caps text-secondary uppercase">Active Users</h3>
<p className="text-body-lg font-semibold">12 Managers</p>
</div>
</div>
</div>
</section>
</div>
</div>    </>
  );
}
