import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ProtectedAction } from '../components/common/ProtectedAction';
import { PERMISSIONS } from '../lib/permissions';

// helpers
function fmtDate(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}
function fmtCurrency(n) {
  if (n === null || n === undefined) return 'N/A';
  return Number(n).toLocaleString('en-IN');
}
const FUEL_STATUS_STYLES = {
  Processed: 'bg-green-100 text-green-800',
  'Pending Review': 'bg-amber-100 text-amber-800',
  Rejected: 'bg-red-100 text-red-800',
};

// Modal Wrapper
function ModalWrapper({ title, icon, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" style={{ animation: 'fadeInScale 0.2s ease' }}>
        <div className="bg-primary-container px-6 py-4 flex items-center justify-between">
          <h3 className="text-on-primary-container font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined">{icon}</span>{title}
          </h3>
          <button onClick={onClose} className="text-on-primary-container/70 hover:text-on-primary-container transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Log Fuel Modal
function LogFuelModal({ vehicles, trips, onClose, onSaved }) {
  const [form, setForm] = useState({ vehicle_id: '', trip_id: '', liters: '', cost: '', date: new Date().toISOString().slice(0, 10), status: 'Pending Review' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.vehicle_id || !form.liters || !form.cost || !form.date) { setError('Vehicle, liters, cost and date are required.'); return; }
    setSaving(true); setError('');
    const { error: err } = await supabase.from('fuel_logs').insert([{ vehicle_id: form.vehicle_id, trip_id: form.trip_id || null, liters: parseFloat(form.liters), cost: parseFloat(form.cost), date: form.date, status: form.status }]);
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved(); onClose();
  }

  return (
    <ModalWrapper title="Log Fuel" icon="local_gas_station" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Vehicle *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" value={form.vehicle_id} onChange={set('vehicle_id')} required>
              <option value="">Select vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no} — {v.model}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Trip (optional)</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" value={form.trip_id} onChange={set('trip_id')}>
              <option value="">No linked trip</option>
              {trips.map(t => <option key={t.id} value={t.id}>{t.source} to {t.destination}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Liters *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" type="number" min="0" step="0.1" placeholder="e.g. 42" value={form.liters} onChange={set('liters')} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cost (Rs.) *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" type="number" min="0" step="0.01" placeholder="e.g. 3150" value={form.cost} onChange={set('cost')} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" type="date" value={form.date} onChange={set('date')} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" value={form.status} onChange={set('status')}>
              <option>Pending Review</option><option>Processed</option><option>Rejected</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-container text-on-primary-container font-bold rounded hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60">
            <span className="material-symbols-outlined text-base">save</span>{saving ? 'Saving...' : 'Save Fuel Log'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

// Add Expense Modal
function AddExpenseModal({ vehicles, trips, onClose, onSaved }) {
  const [form, setForm] = useState({ vehicle_id: '', trip_id: '', type: 'Toll', amount: '', date: new Date().toISOString().slice(0, 10), notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.vehicle_id || !form.amount || !form.date) { setError('Vehicle, amount and date are required.'); return; }
    setSaving(true); setError('');
    const { error: err } = await supabase.from('expenses').insert([{ vehicle_id: form.vehicle_id, trip_id: form.trip_id || null, type: form.type, amount: parseFloat(form.amount), date: form.date, notes: form.notes || null }]);
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved(); onClose();
  }

  return (
    <ModalWrapper title="Add Expense" icon="add_card" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Vehicle *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" value={form.vehicle_id} onChange={set('vehicle_id')} required>
              <option value="">Select vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_no} — {v.model}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Trip (optional)</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" value={form.trip_id} onChange={set('trip_id')}>
              <option value="">No linked trip</option>
              {trips.map(t => <option key={t.id} value={t.id}>{t.source} to {t.destination}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" value={form.type} onChange={set('type')}>
              <option>Toll</option><option>Misc</option><option>Parking</option><option>Maintenance</option><option>Driver Allowance</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Amount (Rs.) *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" type="number" min="0" step="0.01" placeholder="e.g. 340" value={form.amount} onChange={set('amount')} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date *</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" type="date" value={form.date} onChange={set('date')} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" type="text" placeholder="Optional notes" value={form.notes} onChange={set('notes')} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-container text-on-primary-container font-bold rounded hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60">
            <span className="material-symbols-outlined text-base">save</span>{saving ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

function TableSkeleton({ cols, rows = 3 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-outline-variant">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" /></td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function EmptyRow({ cols, message }) {
  return (
    <tbody>
      <tr><td colSpan={cols} className="px-6 py-10 text-center text-secondary text-sm">{message}</td></tr>
    </tbody>
  );
}

export default function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loadingFuel, setLoadingFuel] = useState(true);
  const [loadingExp, setLoadingExp] = useState(true);
  const [showLogFuel, setShowLogFuel] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    supabase.from('vehicles').select('id, registration_no, model').then(({ data }) => { if (data) setVehicles(data); });
    supabase.from('trips').select('id, source, destination').then(({ data }) => { if (data) setTrips(data); });
    supabase.from('maintenance_logs').select('cost').then(({ data }) => { if (data) setMaintenance(data); });
  }, []);

  const fetchFuelLogs = useCallback(async () => {
    setLoadingFuel(true);
    const { data, error } = await supabase
      .from('fuel_logs')
      .select('id, liters, cost, date, status, vehicles ( registration_no ), trips ( source, destination )')
      .order('date', { ascending: false })
      .limit(50);
    setLoadingFuel(false);
    if (!error && data) setFuelLogs(data);
  }, []);

  const fetchExpenses = useCallback(async () => {
    setLoadingExp(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('id, type, amount, date, notes, vehicles ( registration_no ), trips ( source, destination )')
      .order('date', { ascending: false })
      .limit(50);
    setLoadingExp(false);
    if (!error && data) setExpenses(data);
  }, []);

  useEffect(() => { fetchFuelLogs(); fetchExpenses(); }, [fetchFuelLogs, fetchExpenses]);

  const totalFuelCost = fuelLogs.reduce((s, r) => s + Number(r.cost || 0), 0);
  const totalExpenseCost = expenses.reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalMaintenanceCost = maintenance.reduce((s, r) => s + Number(r.cost || 0), 0);
  const totalOperational = totalFuelCost + totalExpenseCost + totalMaintenanceCost;
  const totalLiters = fuelLogs.reduce((s, r) => s + Number(r.liters || 0), 0);

  const fuelPct = totalOperational > 0 ? Math.round((totalFuelCost / totalOperational) * 100) : 0;
  const maintPct = totalOperational > 0 ? Math.round((totalMaintenanceCost / totalOperational) * 100) : 0;
  const otherPct = 100 - fuelPct - maintPct;
  const topCategory = fuelPct >= maintPct && fuelPct >= otherPct ? `Fuel (${fuelPct}%)` : maintPct >= otherPct ? `Maintenance (${maintPct}%)` : `Other (${otherPct}%)`;

  const now = new Date();
  const fuelThisMonth = fuelLogs.filter(l => { const d = new Date(l.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;

  return (
    <>
      <style>{`@keyframes fadeInScale { from { opacity:0; transform:scale(0.95);} to { opacity:1; transform:scale(1);} }`}</style>

      {showLogFuel && <LogFuelModal vehicles={vehicles} trips={trips} onClose={() => setShowLogFuel(false)} onSaved={fetchFuelLogs} />}
      {showAddExpense && <AddExpenseModal vehicles={vehicles} trips={trips} onClose={() => setShowAddExpense(false)} onSaved={fetchExpenses} />}

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Fuel &amp; Expense Management</h1>
            <p className="text-body-md text-secondary mt-1">Monitor operational spending and fuel efficiency across the fleet.</p>
          </div>
          <div className="flex gap-3">
            <ProtectedAction permission={PERMISSIONS.ADD_FUEL_LOG} mode="tooltip">
              <button onClick={() => setShowLogFuel(true)} className="bg-primary-container text-on-primary-container px-6 py-2.5 font-bold rounded hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">local_gas_station</span>Log Fuel
              </button>
            </ProtectedAction>
            <ProtectedAction permission={PERMISSIONS.ADD_EXPENSE} mode="tooltip">
              <button onClick={() => setShowAddExpense(true)} className="bg-primary-container text-on-primary-container px-6 py-2.5 font-bold rounded hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">add_card</span>Add Expense
              </button>
            </ProtectedAction>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Fuel Logs Table */}
          <div className="col-span-12 bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">ev_station</span>
                Fuel Logs
                <span className="ml-2 text-sm text-secondary font-normal">({fuelLogs.length} entries)</span>
              </h2>
              <button className="text-primary font-bold text-label-caps hover:underline">View History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant">
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Trip</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Liters</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-right">Cost (Rs.)</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                {loadingFuel ? <TableSkeleton cols={6} rows={4} /> : fuelLogs.length === 0 ? (
                  <EmptyRow cols={6} message="No fuel logs yet. Click 'Log Fuel' to add one." />
                ) : (
                  <tbody className="divide-y divide-outline-variant">
                    {fuelLogs.map(log => {
                      const statusStyle = FUEL_STATUS_STYLES[log.status] || 'bg-gray-100 text-gray-700';
                      return (
                        <tr key={log.id} className="hover:bg-primary-fixed/20 transition-colors">
                          <td className="px-6 py-4 font-table-data text-table-data font-semibold text-primary">{log.vehicles?.registration_no ?? 'N/A'}</td>
                          <td className="px-6 py-4 font-table-data text-table-data text-secondary text-sm">{log.trips ? `${log.trips.source} to ${log.trips.destination}` : 'N/A'}</td>
                          <td className="px-6 py-4 font-table-data text-table-data">{fmtDate(log.date)}</td>
                          <td className="px-6 py-4 font-table-data text-table-data font-mono-data">{log.liters} L</td>
                          <td className="px-6 py-4 font-table-data text-table-data text-right font-mono-data">{fmtCurrency(log.cost)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 text-label-caps rounded-full font-bold ${statusStyle}`}>{log.status ?? 'Pending Review'}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="col-span-12 bg-white rounded-lg border border-outline-variant shadow-sm overflow-hidden">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">toll</span>
                Other Expenses (Toll / Misc)
                <span className="ml-2 text-sm text-secondary font-normal">({expenses.length} entries)</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant">
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Trip</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-right">Toll (Rs.)</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-right">Other (Rs.)</th>
                    <th className="px-6 py-4 text-label-caps font-label-caps text-secondary uppercase tracking-wider text-right">Total (Rs.)</th>
                  </tr>
                </thead>
                {loadingExp ? <TableSkeleton cols={7} rows={4} /> : expenses.length === 0 ? (
                  <EmptyRow cols={7} message="No expenses yet. Click 'Add Expense' to record one." />
                ) : (
                  <tbody className="divide-y divide-outline-variant">
                    {expenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-primary-fixed/20 transition-colors">
                        <td className="px-6 py-4 font-table-data text-table-data font-semibold text-primary">{exp.trips ? `${exp.trips.source} to ${exp.trips.destination}` : 'N/A'}</td>
                        <td className="px-6 py-4 font-table-data text-table-data">{exp.vehicles?.registration_no ?? 'N/A'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-surface-container text-on-surface text-label-caps rounded-full font-bold">{exp.type}</span>
                        </td>
                        <td className="px-6 py-4 font-table-data text-table-data">{fmtDate(exp.date)}</td>
                        <td className="px-6 py-4 font-mono-data text-table-data text-right">{exp.type === 'Toll' ? fmtCurrency(exp.amount) : 'N/A'}</td>
                        <td className="px-6 py-4 font-mono-data text-table-data text-right">{exp.type !== 'Toll' ? fmtCurrency(exp.amount) : 'N/A'}</td>
                        <td className="px-6 py-4 font-mono-data text-table-data text-right font-bold">{fmtCurrency(exp.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="col-span-12 flex justify-end">
            <div className="bg-surface-container-highest p-6 rounded-lg border-2 border-primary-container min-w-[440px]">
              <div className="flex justify-between items-center gap-12">
                <div>
                  <span className="text-label-caps font-bold text-secondary uppercase tracking-widest block">Total Operational Cost (Auto) = Fuel + Maintenance</span>
                  <span className="text-xs text-gray-400 mt-1 block">Fuel ({fmtCurrency(totalFuelCost)}) + Expenses ({fmtCurrency(totalExpenseCost)}) + Maintenance ({fmtCurrency(totalMaintenanceCost)})</span>
                </div>
                <span className="text-display font-display text-primary whitespace-nowrap">Rs. {fmtCurrency(totalOperational)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm">
            <p className="text-label-caps text-secondary mb-2">Fuel Logs This Month</p>
            <div className="flex items-baseline gap-2">
              <span className="text-headline-lg font-headline-lg text-on-surface">{fuelThisMonth} entries</span>
              <span className="text-body-md text-green-600 flex items-center"><span className="material-symbols-outlined text-sm">local_gas_station</span></span>
            </div>
            <div className="w-full bg-surface-container h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.min(fuelPct, 100)}%` }} />
            </div>
            <p className="text-xs text-secondary mt-2">Total: {totalLiters.toFixed(1)} L | Rs. {fmtCurrency(totalFuelCost)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm">
            <p className="text-label-caps text-secondary mb-2">Total Expense Spend</p>
            <div className="flex items-baseline gap-2">
              <span className="text-headline-lg font-headline-lg text-on-surface">Rs. {fmtCurrency(totalExpenseCost + totalMaintenanceCost)}</span>
              <span className="text-body-md text-amber-600 flex items-center"><span className="material-symbols-outlined text-sm">trending_up</span></span>
            </div>
            <div className="w-full bg-surface-container h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full rounded-full transition-all" style={{ width: `${Math.min(maintPct + otherPct, 100)}%` }} />
            </div>
            <p className="text-xs text-secondary mt-2">Expenses: Rs.{fmtCurrency(totalExpenseCost)} | Maintenance: Rs.{fmtCurrency(totalMaintenanceCost)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm">
            <p className="text-label-caps text-secondary mb-2">Highest Expense Category</p>
            <div className="flex items-baseline gap-2">
              <span className="text-headline-lg font-headline-lg text-on-surface">{topCategory}</span>
            </div>
            <div className="flex gap-1 mt-4">
              <div className="bg-primary h-1.5 rounded-full transition-all" style={{ flexGrow: fuelPct || 1 }} />
              <div className="bg-tertiary h-1.5 rounded-full transition-all" style={{ flexGrow: maintPct || 1 }} />
              <div className="bg-secondary h-1.5 rounded-full transition-all" style={{ flexGrow: otherPct || 1 }} />
            </div>
            <div className="flex gap-3 mt-2 text-xs text-secondary">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full inline-block" />Fuel</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-tertiary rounded-full inline-block" />Maint.</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-secondary rounded-full inline-block" />Other</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}