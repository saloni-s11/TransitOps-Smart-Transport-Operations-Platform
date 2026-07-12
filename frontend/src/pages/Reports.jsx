import { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { ProtectedAction } from "../components/common/ProtectedAction";
import { PERMISSIONS } from "../lib/permissions";

export default function Reports() {
  const { vehicles, trips, fuelLogs, expenses, maintenanceLogs } = useAppData();
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Calculate real analytics
  const analytics = useMemo(() => {
    // Fuel efficiency calculation
    const totalLiters = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
    const totalDistance = trips
      .filter(t => t.status === 'Completed')
      .reduce((sum, trip) => sum + trip.plannedDistanceKm, 0);
    const fuelEfficiency = totalLiters > 0 ? (totalDistance / totalLiters).toFixed(1) : 0;

    // Fleet utilization
    const activeVehicles = vehicles.filter(v => v.status !== 'Retired');
    const onTripVehicles = vehicles.filter(v => v.status === 'On Trip');
    const utilization = activeVehicles.length > 0 ? 
      Math.round((onTripVehicles.length / activeVehicles.length) * 100) : 0;

    // Operational cost (last 30 days)
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentFuelCosts = fuelLogs
      .filter(log => new Date(log.date) >= last30Days)
      .reduce((sum, log) => sum + log.cost, 0);
    const recentExpenses = expenses
      .filter(exp => new Date(exp.date) >= last30Days)
      .reduce((sum, exp) => sum + exp.amount, 0);
    const recentMaintenance = maintenanceLogs
      .filter(log => new Date(log.service_date) >= last30Days)
      .reduce((sum, log) => sum + log.cost, 0);
    const operationalCost = recentFuelCosts + recentExpenses + recentMaintenance;

    // Vehicle ROI calculation (simplified)
    const totalAcquisitionCost = activeVehicles.reduce((sum, v) => sum + v.acquisitionCost, 0);
    const totalRevenue = trips.filter(t => t.status === 'Completed').length * 5000; // Estimated revenue per trip
    const roi = totalAcquisitionCost > 0 ? 
      ((totalRevenue - operationalCost * 12) / totalAcquisitionCost * 100).toFixed(1) : 0;

    return {
      fuelEfficiency,
      utilization,
      operationalCost,
      roi
    };
  }, [vehicles, trips, fuelLogs, expenses, maintenanceLogs]);
  // Monthly revenue data based on actual completed trips
  const monthlyRevenue = useMemo(() => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentYear = new Date().getFullYear();
    
    // Calculate revenue per month from actual completed trips
    const monthlyData = months.map((month, index) => {
      // Filter trips completed in this month
      const monthTrips = trips.filter(trip => {
        if (trip.status !== 'Completed' || !trip.completedAt) return false;
        const completedDate = new Date(trip.completedAt);
        return completedDate.getFullYear() === currentYear && 
               completedDate.getMonth() === index;
      });
      
      // Calculate revenue based on trip characteristics
      const monthRevenue = monthTrips.reduce((revenue, trip) => {
        // Revenue calculation based on distance, cargo weight, and vehicle type
        const baseRate = 15; // ₹15 per km base rate
        const distanceRevenue = trip.plannedDistanceKm * baseRate;
        
        // Bonus for heavier cargo (freight premium)
        const cargoBonus = trip.cargoWeightKg * 2; // ₹2 per kg
        
        // Vehicle type multiplier
        const vehicle = vehicles.find(v => v.id === trip.vehicleId);
        let typeMultiplier = 1;
        if (vehicle?.type === 'Truck') typeMultiplier = 1.5;
        else if (vehicle?.type === 'Special') typeMultiplier = 2.0;
        else if (vehicle?.type === 'Van') typeMultiplier = 1.2;
        
        const tripRevenue = (distanceRevenue + cargoBonus) * typeMultiplier;
        return revenue + tripRevenue;
      }, 0);
      
      return {
        month,
        revenue: Math.round(monthRevenue),
        tripCount: monthTrips.length,
        height: 0 // Will be calculated after we have all revenues
      };
    });
    
    // Calculate heights based on maximum revenue for proper scaling
    const maxRevenue = Math.max(...monthlyData.map(m => m.revenue), 1); // Minimum 1 for scaling
    
    return monthlyData.map((monthData, index) => ({
      ...monthData,
      height: monthData.revenue > 0 ? 
        Math.max(40, (monthData.revenue / maxRevenue) * 85) : 0 // 0% for zero revenue, minimum 40% for revenue months
    }));
  }, [trips, vehicles]);

  // Top costliest vehicles based on real data
  const costliestVehicles = useMemo(() => {
    const vehicleCosts = vehicles.map(vehicle => {
      const fuelCost = fuelLogs
        .filter(log => log.vehicle_id === vehicle.id)
        .reduce((sum, log) => sum + log.cost, 0);
      const expenseCost = expenses
        .filter(exp => exp.vehicle_id === vehicle.id)
        .reduce((sum, exp) => sum + exp.amount, 0);
      const maintenanceCost = maintenanceLogs
        .filter(log => log.vehicleId === vehicle.id)
        .reduce((sum, log) => sum + log.cost, 0);
      
      const totalCost = fuelCost + expenseCost + maintenanceCost;
      return {
        ...vehicle,
        totalCost,
        registrationDisplay: vehicle.registrationNo || `${vehicle.type}-${vehicle.id.slice(-2)}`
      };
    }).filter(v => v.totalCost > 0)
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 3);

    const maxCost = vehicleCosts[0]?.totalCost || 1;
    return vehicleCosts.map(v => ({
      ...v,
      percentage: Math.round((v.totalCost / maxCost) * 100)
    }));
  }, [vehicles, fuelLogs, expenses, maintenanceLogs]);

  // Fleet category efficiency
  const categoryEfficiency = useMemo(() => {
    const categories = ['Truck', 'Van', 'Special'];
    return categories.map(type => {
      const categoryVehicles = vehicles.filter(v => v.type === type && v.status !== 'Retired');
      const categoryFuelLogs = fuelLogs.filter(log => {
        const vehicle = vehicles.find(v => v.id === log.vehicle_id);
        return vehicle && vehicle.type === type;
      });
      
      const totalLiters = categoryFuelLogs.reduce((sum, log) => sum + log.liters, 0);
      const categoryTrips = trips.filter(trip => {
        const vehicle = vehicles.find(v => v.id === trip.vehicleId);
        return vehicle && vehicle.type === type && trip.status === 'Completed';
      });
      const totalDistance = categoryTrips.reduce((sum, trip) => sum + trip.plannedDistanceKm, 0);
      
      const efficiency = totalLiters > 0 ? (totalDistance / totalLiters).toFixed(1) : 0;
      
      const totalCosts = fuelLogs
        .filter(log => {
          const vehicle = vehicles.find(v => v.id === log.vehicle_id);
          return vehicle && vehicle.type === type;
        })
        .reduce((sum, log) => sum + log.cost, 0);

      return {
        category: type + (type === 'Special' ? '' : 's'),
        activeAssets: categoryVehicles.length,
        efficiency: efficiency + ' km/l',
        totalCost: '₹' + totalCosts.toLocaleString(),
        status: totalCosts > 15000 ? 'High Expense' : 'Optimal'
      };
    }).filter(cat => cat.activeAssets > 0);
  }, [vehicles, fuelLogs, trips]);

  // Detailed vehicle analytics (shown when "View All Details" is clicked)
  const detailedVehicleAnalytics = useMemo(() => {
    return vehicles.map(vehicle => {
      const vehicleTrips = trips.filter(t => t.vehicleId === vehicle.id && t.status === 'Completed');
      const vehicleFuelLogs = fuelLogs.filter(f => f.vehicle_id === vehicle.id);
      const vehicleExpenses = expenses.filter(e => e.vehicle_id === vehicle.id);
      const vehicleMaintenance = maintenanceLogs.filter(m => m.vehicleId === vehicle.id);
      
      const totalDistance = vehicleTrips.reduce((sum, t) => sum + t.plannedDistanceKm, 0);
      const totalFuelCost = vehicleFuelLogs.reduce((sum, f) => sum + f.cost, 0);
      const totalExpenseCost = vehicleExpenses.reduce((sum, e) => sum + e.amount, 0);
      const totalMaintenanceCost = vehicleMaintenance.reduce((sum, m) => sum + m.cost, 0);
      const totalOperatingCost = totalFuelCost + totalExpenseCost + totalMaintenanceCost;
      
      const totalFuel = vehicleFuelLogs.reduce((sum, f) => sum + f.liters, 0);
      const fuelEfficiency = totalFuel > 0 ? (totalDistance / totalFuel).toFixed(1) : 0;
      
      const utilization = vehicleTrips.length > 0 ? 
        (vehicleTrips.length / trips.filter(t => t.status === 'Completed').length * 100).toFixed(1) : 0;
      
      return {
        ...vehicle,
        tripCount: vehicleTrips.length,
        totalDistance,
        fuelEfficiency: fuelEfficiency + ' km/l',
        totalOperatingCost,
        utilization: utilization + '%',
        status: vehicle.status,
        costPerKm: totalDistance > 0 ? (totalOperatingCost / totalDistance).toFixed(2) : 0
      };
    }).filter(v => v.tripCount > 0 || v.totalOperatingCost > 0)
      .sort((a, b) => b.totalOperatingCost - a.totalOperatingCost);
  }, [vehicles, trips, fuelLogs, expenses, maintenanceLogs]);

  return (
    <>
{/* Header Section */}
<div className="flex items-center justify-between mb-8">
<div>
<h1 className="text-headline-lg font-headline-lg text-on-surface">Reports & Analytics</h1>
<p className="text-body-md text-secondary">Strategic performance monitoring and ROI analysis.</p>
</div>
<div className="flex gap-3">
<button 
  onClick={() => alert('Date range filter coming soon! Currently showing all-time data.')}
  className="px-4 py-2 border border-outline text-secondary text-label-caps font-label-caps rounded flex items-center gap-2 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    Last 30 Days
                </button>
<ProtectedAction permission={PERMISSIONS.EXPORT_REPORTS} mode="tooltip">
  <button 
    onClick={() => {
      alert('Generating PDF report...\n\nThis feature will export:\n• Monthly revenue chart\n• KPI summary\n• Fleet utilization stats\n• Top costliest vehicles');
    }}
    className="px-4 py-2 bg-primary text-white text-label-caps font-label-caps rounded flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export PDF
  </button>
</ProtectedAction>
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
<h3 className="text-display font-display text-on-surface">{analytics.fuelEfficiency} km/l</h3>
<div className="absolute bottom-0 left-0 h-1 bg-primary-container w-3/4"></div>
</div>
{/* Fleet Utilization */}
<div className="bg-white p-6 rounded-xl border border-outline-variant hover:shadow-md transition-shadow relative overflow-hidden">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-secondary-fixed rounded-lg text-on-secondary-fixed">
<span className="material-symbols-outlined">group_work</span>
</div>
<span className={`flex items-center text-label-caps font-label-caps ${analytics.utilization > 80 ? 'text-green-600' : 'text-red-500'}`}>
<span className="material-symbols-outlined text-[16px]">{analytics.utilization > 80 ? 'trending_up' : 'trending_down'}</span> 1.8%
                    </span>
</div>
<p className="text-label-caps font-label-caps text-secondary mb-1">Fleet Utilization</p>
<h3 className="text-display font-display text-on-surface">{analytics.utilization}%</h3>
<div className="absolute bottom-0 left-0 h-1 bg-secondary" style={{width: `${analytics.utilization}%`}}></div>
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
<h3 className="text-display font-display text-on-surface">₹{analytics.operationalCost.toLocaleString()}</h3>
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
<h3 className="text-display font-display text-on-surface">{analytics.roi}%</h3>
<div className="absolute bottom-0 left-0 h-1 bg-primary" style={{width: `${Math.min(100, Math.abs(analytics.roi))}%`}}></div>
</div>
</div>
{/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/* Monthly Revenue Bar Chart */}
<div className="lg:col-span-2 bg-white p-6 rounded-xl border border-outline-variant">
<div className="flex items-center justify-between mb-4">
<div>
<h2 className="text-headline-md font-headline-md">Monthly Revenue</h2>
<p className="text-body-md text-secondary">
Based on completed trips • ₹15/km base + ₹2/kg cargo + vehicle type premium
</p>
</div>
<select className="bg-surface-container-low border border-outline-variant rounded px-2 py-1 text-label-caps font-label-caps outline-none">
<option>2026</option>
<option>2025</option>
</select>
</div>
<div className="flex items-end justify-between h-64 gap-1 px-4 overflow-x-auto">
{monthlyRevenue.map((month, index) => {
  const isCurrentMonth = index === new Date().getMonth();
  return (
    <div key={month.month} className="flex flex-col items-center flex-shrink-0 min-w-[60px]">
      <div 
        className={`w-full hover:bg-primary-container transition-all rounded-t ${
          month.revenue === 0 ? 'border-b-2 border-gray-300' :
          isCurrentMonth ? 'bg-primary min-h-[40px]' : 'bg-secondary-container min-h-[40px]'
        }`}
        style={{ height: month.revenue > 0 ? `${month.height}%` : '2px' }}
        title={`${month.month}: ₹${month.revenue.toLocaleString()} (${month.tripCount} trips)`}
      ></div>
      <span className={`text-label-caps font-label-caps mt-2 text-xs ${
        isCurrentMonth ? 'font-bold text-primary' : 
        month.revenue > 0 ? 'text-secondary' : 'text-gray-400'
      }`}>
        {month.month}
      </span>
      <span className="text-[10px] text-gray-500 mt-1">
        {month.tripCount > 0 ? `${month.tripCount}` : '0'}
      </span>
    </div>
  );
})}
</div>
<div className="mt-6 pt-6 border-t border-outline-variant">
<div className="grid grid-cols-3 gap-4 mb-4">
<div className="text-center">
<div className="text-headline-sm font-headline-sm text-on-surface">
₹{monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
</div>
<div className="text-label-caps font-label-caps text-secondary">Total YTD Revenue</div>
</div>
<div className="text-center">
<div className="text-headline-sm font-headline-sm text-on-surface">
{monthlyRevenue.reduce((sum, m) => sum + m.tripCount, 0)}
</div>
<div className="text-label-caps font-label-caps text-secondary">Completed Trips</div>
</div>
<div className="text-center">
<div className="text-headline-sm font-headline-sm text-on-surface">
₹{monthlyRevenue.filter(m => m.revenue > 0).length > 0 ? 
  Math.round(monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / 
  monthlyRevenue.filter(m => m.revenue > 0).length).toLocaleString() : '0'}
</div>
<div className="text-label-caps font-label-caps text-secondary">Avg Monthly Revenue</div>
</div>
</div>
<div className="flex gap-6">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<span className="text-body-md text-secondary">Current Month</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-secondary-container"></div>
<span className="text-body-md text-secondary">Historical</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-gray-200"></div>
<span className="text-body-md text-secondary">No Revenue</span>
</div>
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
{costliestVehicles.map((vehicle, index) => (
<div key={vehicle.id}>
<div className="flex justify-between items-center mb-2">
<span className="text-label-caps font-label-caps font-bold">{vehicle.registrationDisplay}</span>
<span className="text-mono-data font-mono-data font-bold">₹{vehicle.totalCost.toLocaleString()}</span>
</div>
<div className="h-4 bg-surface-container rounded-full overflow-hidden">
<div 
  className={`h-full rounded-full ${index === 0 ? 'bg-error' : index === 1 ? 'bg-primary-container' : 'bg-tertiary-container'}`}
  style={{ width: `${vehicle.percentage}%` }}
></div>
</div>
</div>
))}
{costliestVehicles.length === 0 && (
<div className="text-center py-8 text-secondary">No expense data available</div>
)}
{/* Legend / CTA */}
{costliestVehicles.length > 0 && (
<div className="mt-auto pt-4 bg-surface-container-low p-4 rounded-lg border border-dashed border-outline">
<p className="text-body-md text-on-surface-variant italic">
<span className="material-symbols-outlined text-[16px] align-middle mr-1">info</span>
  {costliestVehicles[0]?.registrationDisplay} has highest operational costs. Consider maintenance review.
</p>
</div>
)}
</div>
</div>
</div>
{/* Detail Data Row (Table for context) */}
<div className="mt-8 bg-white rounded-xl border border-outline-variant overflow-hidden">
<div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
<h3 className="text-label-caps font-label-caps font-bold">Efficiency by Fleet Category</h3>
<button 
  onClick={() => setShowDetailedView(!showDetailedView)}
  className="text-primary text-label-caps font-label-caps hover:underline flex items-center gap-1">
  {showDetailedView ? 'Hide Details' : 'View All Details'}
  <span className="material-symbols-outlined text-[16px]">
    {showDetailedView ? 'expand_less' : 'expand_more'}
  </span>
</button>
</div>
<table className="w-full zebra-table">
<thead>
<tr className="bg-surface-container-low text-label-caps font-label-caps text-secondary">
{!showDetailedView ? (
  <>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Category</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Active Assets</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Avg Efficiency</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Total Cost</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Status</th>
  </>
) : (
  <>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Vehicle</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Type</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Trips</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Distance</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Fuel Efficiency</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Operating Cost</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Cost/km</th>
    <th className="px-6 py-3 text-left border-b border-outline-variant">Status</th>
  </>
)}
</tr>
</thead>
<tbody className="text-table-data font-table-data">
{!showDetailedView ? (
  <>
    {categoryEfficiency.map((cat, index) => (
    <tr key={cat.category}>
      <td className="px-6 py-4">{cat.category}</td>
      <td className="px-6 py-4">{cat.activeAssets}</td>
      <td className="px-6 py-4">{cat.efficiency}</td>
      <td className="px-6 py-4">{cat.totalCost}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-[10px] ${
          cat.status === 'High Expense' 
            ? 'bg-error-container text-on-error-container' 
            : 'bg-primary-fixed text-on-primary-fixed-variant'
        }`}>
          {cat.status}
        </span>
      </td>
    </tr>
    ))}
    {categoryEfficiency.length === 0 && (
    <tr><td colSpan="5" className="text-center py-4 text-secondary">No data available</td></tr>
    )}
  </>
) : (
  <>
    {detailedVehicleAnalytics.map((vehicle, index) => (
    <tr key={vehicle.id}>
      <td className="px-6 py-4 font-mono text-sm">{vehicle.registrationNo}</td>
      <td className="px-6 py-4">{vehicle.type}</td>
      <td className="px-6 py-4 text-center">{vehicle.tripCount}</td>
      <td className="px-6 py-4">{vehicle.totalDistance.toLocaleString()}km</td>
      <td className="px-6 py-4">{vehicle.fuelEfficiency}</td>
      <td className="px-6 py-4">₹{vehicle.totalOperatingCost.toLocaleString()}</td>
      <td className="px-6 py-4">₹{vehicle.costPerKm}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-[10px] ${
          vehicle.status === 'Available' ? 'bg-green-100 text-green-700' :
          vehicle.status === 'On Trip' ? 'bg-blue-100 text-blue-700' :
          vehicle.status === 'In Shop' ? 'bg-orange-100 text-orange-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {vehicle.status}
        </span>
      </td>
    </tr>
    ))}
    {detailedVehicleAnalytics.length === 0 && (
    <tr><td colSpan="8" className="text-center py-4 text-secondary">No vehicle data available</td></tr>
    )}
  </>
)}
</tbody>
</table>
</div>    </>
  );
}
