import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://fiyyvzineicyysinzdzy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpeXl2emluZWljeXlzaW56ZHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MzI2MjAsImV4cCI6MjA5OTQwODYyMH0.8FYo-k6fMmirozNycMkBNj81rAZEBjp7m8UkwTsB09Y');

const { data: trips } = await supabase.from('trips').select('source, destination, completed_at, status, planned_distance_km, cargo_weight_kg').eq('status', 'Completed').order('completed_at');

console.log('All completed trips:');
trips.forEach((t, i) => {
  const date = new Date(t.completed_at);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  console.log(`${i+1}. ${t.source} -> ${t.destination} | ${month} | ${t.planned_distance_km}km | ${t.cargo_weight_kg}kg`);
});