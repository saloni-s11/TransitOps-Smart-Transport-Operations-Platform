// TransitOps - Database Seed Script
// Inserts real entries into Supabase for each section of the platform.
// Run with: node seed.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fiyyvzineicyysinzdzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpeXl2emluZWljeXlzaW56ZHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MzI2MjAsImV4cCI6MjA5OTQwODYyMH0.8FYo-k6fMmirozNycMkBNj81rAZEBjp7m8UkwTsB09Y';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function log(msg) { console.log(`\n✅ ${msg}`); }
function err(msg, e) { console.error(`\n❌ ${msg}:`, e?.message || e); }

async function seed() {
  console.log('🚀 TransitOps Database Seed Starting...\n');

  // ─── 0. Clear existing data ───────────────────────────────────────────────
  console.log('🗑️  Clearing existing data...');
  await supabase.from('expenses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('fuel_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('maintenance_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('trips').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('drivers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('vehicles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  log('All existing data cleared');

  // ─── 1. Vehicles ──────────────────────────────────────────────────────────
  const { data: vehicles, error: vErr } = await supabase
    .from('vehicles')
    .insert([
      { registration_no: 'KA-01-AB-1234', model: 'Tata Ultra 1918', type: 'Truck', max_capacity_kg: 9000, odometer_km: 84210, acquisition_cost: 3200000, status: 'Available' },
      { registration_no: 'KA-02-CD-5566', model: 'Ashok Leyland Dost', type: 'Van', max_capacity_kg: 1500, odometer_km: 32110, acquisition_cost: 950000, status: 'Available' },
      { registration_no: 'KA-03-EF-7788', model: 'Eicher Pro 3015', type: 'Truck', max_capacity_kg: 5500, odometer_km: 121340, acquisition_cost: 2450000, status: 'In Shop' },
      { registration_no: 'KA-04-GH-9900', model: 'Mahindra Bolero Pickup', type: 'Van', max_capacity_kg: 1200, odometer_km: 55210, acquisition_cost: 780000, status: 'Available' },
      { registration_no: 'KA-05-IJ-2233', model: 'BharatBenz 1617R', type: 'Special', max_capacity_kg: 8000, odometer_km: 44210, acquisition_cost: 3600000, status: 'Available' },
      { registration_no: 'KA-06-KL-4455', model: 'Tata Ace Gold', type: 'Van', max_capacity_kg: 750, odometer_km: 19340, acquisition_cost: 520000, status: 'Retired' },
      { registration_no: 'KA-07-MN-6677', model: 'Volvo FMX 400', type: 'Truck', max_capacity_kg: 12000, odometer_km: 68210, acquisition_cost: 5200000, status: 'Available' },
    ])
    .select();

  if (vErr) { err('Vehicles insert failed', vErr); return; }
  log(`Inserted ${vehicles.length} vehicles`);

  const vMap = {};
  vehicles.forEach(v => { vMap[v.registration_no] = v.id; });

  // ─── 2. Drivers ──────────────────────────────────────────────────────────
  const { data: drivers, error: dErr } = await supabase
    .from('drivers')
    .insert([
      { name: 'Arjun Mehta',    license_no: 'DL-0420110012345', license_category: 'HMV', license_expiry: '2027-03-14', contact_no: '+91 98765 43210', safety_score: 96, status: 'Available' },
      { name: 'Priya Nair',     license_no: 'DL-0420110023456', license_category: 'LMV', license_expiry: '2026-11-02', contact_no: '+91 98765 43211', safety_score: 88, status: 'Available' },
      { name: 'Ramesh Iyer',    license_no: 'DL-0420110034567', license_category: 'HMV', license_expiry: '2026-08-20', contact_no: '+91 98765 43212', safety_score: 74, status: 'Suspended' },
      { name: 'Sana Sheikh',    license_no: 'DL-0420110045678', license_category: 'HMV', license_expiry: '2028-01-09', contact_no: '+91 98765 43213', safety_score: 99, status: 'Available' },
      { name: 'Vikram Rao',     license_no: 'DL-0420110056789', license_category: 'LMV', license_expiry: '2026-09-30', contact_no: '+91 98765 43214', safety_score: 81, status: 'Off Duty' },
      { name: 'Neha Kulkarni',  license_no: 'DL-0420110067890', license_category: 'HMV', license_expiry: '2027-05-17', contact_no: '+91 98765 43215', safety_score: 91, status: 'Available' },
    ])
    .select();

  if (dErr) { err('Drivers insert failed', dErr); return; }
  log(`Inserted ${drivers.length} drivers`);

  const dMap = {};
  drivers.forEach(d => { dMap[d.name] = d.id; });

  // ─── 3. Trips ─────────────────────────────────────────────────────────────
  // Historical trips spread across past months for analytics
  const { data: trips, error: tErr } = await supabase
    .from('trips')
    .insert([
      // January 2026 - Low activity (3 trips, smaller cargo)
      {
        source: 'Bengaluru DC', destination: 'Chennai Hub',
        vehicle_id: vMap['KA-04-GH-9900'], driver_id: dMap['Priya Nair'],
        cargo_weight_kg: 900, planned_distance_km: 350,
        status: 'Completed', dispatched_at: '2026-01-15', completed_at: '2026-01-15',
      },
      {
        source: 'Mysuru Depot', destination: 'Bengaluru DC',
        vehicle_id: vMap['KA-02-CD-5566'], driver_id: dMap['Sana Sheikh'],
        cargo_weight_kg: 1200, planned_distance_km: 145,
        status: 'Completed', dispatched_at: '2026-01-22', completed_at: '2026-01-22',
      },
      {
        source: 'Bengaluru DC', destination: 'Coimbatore Hub',
        vehicle_id: vMap['KA-01-AB-1234'], driver_id: dMap['Arjun Mehta'],
        cargo_weight_kg: 3500, planned_distance_km: 365,
        status: 'Completed', dispatched_at: '2026-01-08', completed_at: '2026-01-08',
      },

      // February 2026 - Growing activity (4 trips, moderate cargo)
      {
        source: 'Bengaluru DC', destination: 'Hyderabad Hub',
        vehicle_id: vMap['KA-05-IJ-2233'], driver_id: dMap['Neha Kulkarni'],
        cargo_weight_kg: 4200, planned_distance_km: 570,
        status: 'Completed', dispatched_at: '2026-02-05', completed_at: '2026-02-05',
      },
      {
        source: 'Bengaluru DC', destination: 'Chennai Hub',
        vehicle_id: vMap['KA-01-AB-1234'], driver_id: dMap['Priya Nair'],
        cargo_weight_kg: 3800, planned_distance_km: 350,
        status: 'Completed', dispatched_at: '2026-02-18', completed_at: '2026-02-18',
      },
      {
        source: 'Bengaluru DC', destination: 'Coimbatore Hub',
        vehicle_id: vMap['KA-04-GH-9900'], driver_id: dMap['Sana Sheikh'],
        cargo_weight_kg: 1000, planned_distance_km: 365,
        status: 'Completed', dispatched_at: '2026-02-25', completed_at: '2026-02-25',
      },
      {
        source: 'Mysuru Depot', destination: 'Bengaluru DC',
        vehicle_id: vMap['KA-02-CD-5566'], driver_id: dMap['Arjun Mehta'],
        cargo_weight_kg: 1300, planned_distance_km: 145,
        status: 'Completed', dispatched_at: '2026-02-12', completed_at: '2026-02-12',
      },

      // March 2026 - Peak activity (4 trips, higher cargo + longer routes)
      {
        source: 'Bengaluru DC', destination: 'Pune Hub',
        vehicle_id: vMap['KA-07-MN-6677'], driver_id: dMap['Arjun Mehta'],
        cargo_weight_kg: 6500, planned_distance_km: 840,
        status: 'Completed', dispatched_at: '2026-03-10', completed_at: '2026-03-10',
      },
      {
        source: 'Bengaluru DC', destination: 'Hyderabad Hub',
        vehicle_id: vMap['KA-05-IJ-2233'], driver_id: dMap['Priya Nair'],
        cargo_weight_kg: 5200, planned_distance_km: 570,
        status: 'Completed', dispatched_at: '2026-03-17', completed_at: '2026-03-17',
      },
      {
        source: 'Bengaluru DC', destination: 'Chennai Hub',
        vehicle_id: vMap['KA-01-AB-1234'], driver_id: dMap['Sana Sheikh'],
        cargo_weight_kg: 5800, planned_distance_km: 350,
        status: 'Completed', dispatched_at: '2026-03-24', completed_at: '2026-03-24',
      },
      {
        source: 'Bengaluru DC', destination: 'Coimbatore Hub',
        vehicle_id: vMap['KA-04-GH-9900'], driver_id: dMap['Neha Kulkarni'],
        cargo_weight_kg: 1100, planned_distance_km: 365,
        status: 'Completed', dispatched_at: '2026-03-03', completed_at: '2026-03-03',
      },

      // April 2026 - High activity sustained (5 trips, heavy cargo)
      {
        source: 'Bengaluru DC', destination: 'Mumbai Hub',
        vehicle_id: vMap['KA-07-MN-6677'], driver_id: dMap['Neha Kulkarni'],
        cargo_weight_kg: 7200, planned_distance_km: 980,
        status: 'Completed', dispatched_at: '2026-04-02', completed_at: '2026-04-02',
      },
      {
        source: 'Bengaluru DC', destination: 'Hyderabad Hub',
        vehicle_id: vMap['KA-05-IJ-2233'], driver_id: dMap['Arjun Mehta'],
        cargo_weight_kg: 5500, planned_distance_km: 570,
        status: 'Completed', dispatched_at: '2026-04-15', completed_at: '2026-04-15',
      },
      {
        source: 'Bengaluru DC', destination: 'Chennai Hub',
        vehicle_id: vMap['KA-01-AB-1234'], driver_id: dMap['Sana Sheikh'],
        cargo_weight_kg: 6000, planned_distance_km: 350,
        status: 'Completed', dispatched_at: '2026-04-22', completed_at: '2026-04-22',
      },
      {
        source: 'Bengaluru DC', destination: 'Coimbatore Hub',
        vehicle_id: vMap['KA-04-GH-9900'], driver_id: dMap['Priya Nair'],
        cargo_weight_kg: 1100, planned_distance_km: 365,
        status: 'Completed', dispatched_at: '2026-04-08', completed_at: '2026-04-08',
      },
      {
        source: 'Mysuru Depot', destination: 'Bengaluru DC',
        vehicle_id: vMap['KA-02-CD-5566'], driver_id: dMap['Neha Kulkarni'],
        cargo_weight_kg: 1400, planned_distance_km: 145,
        status: 'Completed', dispatched_at: '2026-04-28', completed_at: '2026-04-28',
      },

      // May 2026 - Moderate decline (4 trips, medium cargo)
      {
        source: 'Bengaluru DC', destination: 'Hyderabad Hub',
        vehicle_id: vMap['KA-05-IJ-2233'], driver_id: dMap['Priya Nair'],
        cargo_weight_kg: 4500, planned_distance_km: 570,
        status: 'Completed', dispatched_at: '2026-05-12', completed_at: '2026-05-12',
      },
      {
        source: 'Bengaluru DC', destination: 'Chennai Hub',
        vehicle_id: vMap['KA-01-AB-1234'], driver_id: dMap['Sana Sheikh'],
        cargo_weight_kg: 4800, planned_distance_km: 350,
        status: 'Completed', dispatched_at: '2026-05-18', completed_at: '2026-05-18',
      },
      {
        source: 'Bengaluru DC', destination: 'Pune Hub',
        vehicle_id: vMap['KA-07-MN-6677'], driver_id: dMap['Arjun Mehta'],
        cargo_weight_kg: 5500, planned_distance_km: 840,
        status: 'Completed', dispatched_at: '2026-05-05', completed_at: '2026-05-05',
      },
      {
        source: 'Mysuru Depot', destination: 'Bengaluru DC',
        vehicle_id: vMap['KA-04-GH-9900'], driver_id: dMap['Neha Kulkarni'],
        cargo_weight_kg: 1100, planned_distance_km: 145,
        status: 'Completed', dispatched_at: '2026-05-25', completed_at: '2026-05-25',
      },

      // June 2026 - Lower activity (4 trips, reduced cargo)
      {
        source: 'Bengaluru DC', destination: 'Hyderabad Hub',
        vehicle_id: vMap['KA-05-IJ-2233'], driver_id: dMap['Neha Kulkarni'],
        cargo_weight_kg: 3800, planned_distance_km: 570,
        status: 'Completed', dispatched_at: '2026-06-03', completed_at: '2026-06-03',
      },
      {
        source: 'Bengaluru DC', destination: 'Coimbatore Hub',
        vehicle_id: vMap['KA-02-CD-5566'], driver_id: dMap['Priya Nair'],
        cargo_weight_kg: 1200, planned_distance_km: 365,
        status: 'Completed', dispatched_at: '2026-06-09', completed_at: '2026-06-09',
      },
      {
        source: 'Bengaluru DC', destination: 'Chennai Hub',
        vehicle_id: vMap['KA-01-AB-1234'], driver_id: dMap['Sana Sheikh'],
        cargo_weight_kg: 4000, planned_distance_km: 350,
        status: 'Completed', dispatched_at: '2026-06-22', completed_at: '2026-06-22',
      },
      {
        source: 'Mysuru Depot', destination: 'Bengaluru DC',
        vehicle_id: vMap['KA-04-GH-9900'], driver_id: dMap['Arjun Mehta'],
        cargo_weight_kg: 1050, planned_distance_km: 145,
        status: 'Completed', dispatched_at: '2026-06-15', completed_at: '2026-06-15',
      },

      // July 2026 (current/recent trips)
      {
        source: 'Bengaluru DC', destination: 'Chennai Hub',
        vehicle_id: vMap['KA-02-CD-5566'], driver_id: dMap['Priya Nair'],
        cargo_weight_kg: 1200, planned_distance_km: 350,
        status: 'Dispatched', dispatched_at: '2026-07-10',
      },
      {
        source: 'Mysuru Depot', destination: 'Bengaluru DC',
        vehicle_id: vMap['KA-01-AB-1234'], driver_id: dMap['Arjun Mehta'],
        cargo_weight_kg: 7800, planned_distance_km: 145,
        status: 'Completed', dispatched_at: '2026-07-08', completed_at: '2026-07-08',
      },
      {
        source: 'Bengaluru DC', destination: 'Coimbatore Hub',
        vehicle_id: vMap['KA-04-GH-9900'], driver_id: dMap['Vikram Rao'],
        cargo_weight_kg: 900, planned_distance_km: 365,
        status: 'Draft',
      },
      {
        source: 'Bengaluru DC', destination: 'Pune Hub',
        vehicle_id: vMap['KA-07-MN-6677'], driver_id: dMap['Sana Sheikh'],
        cargo_weight_kg: 11000, planned_distance_km: 840,
        status: 'Cancelled',
      },
    ])
    .select();

  if (tErr) { err('Trips insert failed', tErr); return; }
  log(`Inserted ${trips.length} trips`);

  // Mark vehicles that are on trip / in shop
  await supabase.from('vehicles').update({ status: 'On Trip' }).eq('id', vMap['KA-02-CD-5566']);
  await supabase.from('drivers').update({ status: 'On Trip' }).eq('id', dMap['Priya Nair']);
  log('Updated vehicle & driver statuses for dispatched trips');

  // ─── 4. Maintenance Logs ─────────────────────────────────────────────────
  const { data: mLogs, error: mErr } = await supabase
    .from('maintenance_logs')
    .insert([
      { vehicle_id: vMap['KA-03-EF-7788'], service_type: 'Engine Overhaul',    cost: 45000, service_date: '2026-07-09', status: 'Active',    notes: 'Awaiting parts delivery' },
      { vehicle_id: vMap['KA-01-AB-1234'], service_type: 'Brake Inspection',   cost: 3200,  service_date: '2026-06-28', status: 'Completed', notes: 'Passed inspection' },
      { vehicle_id: vMap['KA-06-KL-4455'], service_type: 'Decommission Check', cost: 0,     service_date: '2026-05-15', status: 'Completed', notes: 'Vehicle retired from fleet' },
      { vehicle_id: vMap['KA-07-MN-6677'], service_type: 'Tyre Replacement',   cost: 18500, service_date: '2026-07-01', status: 'Completed', notes: 'All 6 tyres replaced' },
    ])
    .select();

  if (mErr) { err('Maintenance logs insert failed', mErr); return; }
  log(`Inserted ${mLogs.length} maintenance logs`);

  // ─── 5. Fuel Logs ────────────────────────────────────────────────────────
  const tMap = {};
  trips.forEach(t => { tMap[`${t.source}-${t.destination}`] = t.id; });

  const { data: fLogs, error: fErr } = await supabase
    .from('fuel_logs')
    .insert([
      { vehicle_id: vMap['KA-02-CD-5566'], trip_id: tMap['Bengaluru DC-Chennai Hub'],    liters: 42.5, cost: 4250, date: '2026-07-10', status: 'Processed' },
      { vehicle_id: vMap['KA-05-IJ-2233'], trip_id: tMap['Bengaluru DC-Hyderabad Hub'],  liters: 96.2, cost: 9620, date: '2026-07-11', status: 'Processed' },
      { vehicle_id: vMap['KA-01-AB-1234'], trip_id: tMap['Mysuru Depot-Bengaluru DC'],   liters: 28.4, cost: 2840, date: '2026-07-08', status: 'Processed' },
      { vehicle_id: vMap['KA-07-MN-6677'], trip_id: null, liters: 55.0, cost: 5500, date: '2026-07-05', status: 'Pending Review' },
      { vehicle_id: vMap['KA-04-GH-9900'], trip_id: null, liters: 18.0, cost: 1800, date: '2026-07-03', status: 'Processed' },
    ])
    .select();

  if (fErr) { err('Fuel logs insert failed', fErr); return; }
  log(`Inserted ${fLogs.length} fuel logs`);

  // ─── 6. Expenses ─────────────────────────────────────────────────────────
  const { data: exps, error: eErr } = await supabase
    .from('expenses')
    .insert([
      { vehicle_id: vMap['KA-02-CD-5566'], trip_id: tMap['Bengaluru DC-Chennai Hub'],   type: 'Toll',             amount: 850,  date: '2026-07-10', notes: 'Chennai expressway toll' },
      { vehicle_id: vMap['KA-05-IJ-2233'], trip_id: tMap['Bengaluru DC-Hyderabad Hub'], type: 'Toll',             amount: 1620, date: '2026-07-11', notes: 'NH-44 toll charges' },
      { vehicle_id: vMap['KA-01-AB-1234'], trip_id: tMap['Mysuru Depot-Bengaluru DC'],  type: 'Misc',             amount: 300,  date: '2026-07-08', notes: 'Weighbridge charges' },
      { vehicle_id: vMap['KA-07-MN-6677'], trip_id: null,                               type: 'Driver Allowance', amount: 800,  date: '2026-07-06', notes: 'Night halt allowance' },
      { vehicle_id: vMap['KA-04-GH-9900'], trip_id: null,                               type: 'Parking',          amount: 200,  date: '2026-07-03', notes: 'Depot parking fee' },
    ])
    .select();

  if (eErr) { err('Expenses insert failed', eErr); return; }
  log(`Inserted ${exps.length} expenses`);

  console.log('\n🎉 Seed complete! All data is now live in Supabase.\n');
}

seed().catch(console.error);
