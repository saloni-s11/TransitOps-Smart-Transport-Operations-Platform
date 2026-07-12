# TransitOps Role Definitions (Official Documentation)

## 📋 Overview

This document clarifies the four user roles in TransitOps based on the official requirements documentation.

## ⚠️ Important Note on "Driver" Role

**Documentation Terminology Issue:**
The official documentation uses the term "Driver" but describes responsibilities that are actually those of a **Dispatcher/Operations role** (someone who creates trips and assigns vehicles/drivers).

**In this implementation:**
- The role is named **"Dispatcher"** in the code
- This avoids confusion with actual vehicle drivers (who are managed as driver records in the system)
- All functionality matches what the documentation describes under "Driver"

---

## 👥 Four User Roles

### 1. 🚛 Fleet Manager

**Primary Scope:**  
Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency.

**Core Responsibilities:**
- ✅ Manages the vehicle registry (vehicle lifecycle)
- ✅ Monitors asset conditions
- ✅ Oversees maintenance logs (putting vehicles "In Shop" and closing maintenance records)
- ✅ Monitors overall operational efficiency through dashboards and reports

**System Access:**
| Module | Access Level |
|--------|--------------|
| Dashboard | ✅ Full Access |
| Fleet/Vehicles | ✅ Manage (Add, Edit, View) |
| Drivers | 👁️ View Only |
| Trips | 👁️ View Only |
| Maintenance | ✅ Manage (Create, Close) |
| Fuel & Expenses | 👁️ View Only |
| Analytics/Reports | ✅ Full Access |
| Settings | ✅ Manage |

**Key Actions:**
- Add/update vehicles
- Create maintenance records (auto-sets vehicle to "In Shop")
- Close maintenance records (restores vehicle to "Available")
- View operational efficiency metrics
- Monitor fleet utilization
- System configuration

---

### 2. 📦 Dispatcher (called "Driver" in documentation)

**Primary Scope:**  
Creates and manages trips, assigns vehicles and drivers to deliveries, monitors active operations.

**Core Responsibilities:**
- ✅ Creates and manages trips (drafting, dispatching, completing trips)
- ✅ Assigns available vehicles and drivers to active deliveries
- ✅ Monitors active deliveries and routes
- ✅ Ensures proper vehicle/driver availability

**Business Rules:**
- ❌ Cannot select vehicles that are "Retired" or "In Shop" (under maintenance)
- ❌ Cannot assign drivers who are "Suspended" or have expired licenses
- ✅ Validates cargo weight against vehicle capacity
- ✅ Automatically updates vehicle/driver status to "On Trip" when dispatching

**System Access:**
| Module | Access Level |
|--------|--------------|
| Dashboard | ✅ Full Access |
| Fleet/Vehicles | 👁️ View Only (to select for trips) |
| Drivers | 👁️ View Only (to select for trips) |
| Trips | ✅ Manage (Create, Dispatch, Complete, Cancel) |
| Maintenance | 🔒 No Access |
| Fuel & Expenses | 🔒 No Access |
| Analytics/Reports | 🔒 No Access |
| Settings | 🔒 No Access |

**Key Actions:**
- Create new trips (draft mode)
- Dispatch trips (assigns vehicle + driver, changes status to "On Trip")
- Complete trips (records completion, restores vehicle/driver to "Available")
- Cancel trips (restores availability)
- View available vehicles and drivers

---

### 3. 🛡️ Safety Officer

**Primary Scope:**  
Ensures driver compliance and tracks fleet safety metrics.

**Core Responsibilities:**
- ✅ Monitors driver compliance
- ✅ Tracks driver license validity (ensuring licenses are not expired)
- ✅ Monitors and tracks driver safety scores
- ✅ Manages driver status (Available, Off Duty, Suspended)

**System Access:**
| Module | Access Level |
|--------|--------------|
| Dashboard | ✅ Full Access |
| Fleet/Vehicles | 👁️ View Only (for safety tracking) |
| Drivers | ✅ Manage (Add, Edit, Update status) |
| Trips | 👁️ View Only (for safety monitoring) |
| Maintenance | 🔒 No Access |
| Fuel & Expenses | 🔒 No Access |
| Analytics/Reports | 🔒 No Access |
| Settings | 🔒 No Access |

**Key Actions:**
- Add/update driver records
- Monitor license expiry dates
- Track and update safety scores
- Suspend drivers for compliance issues
- View trip history for safety analysis
- Ensure driver compliance before trip assignment

---

### 4. 💰 Financial Analyst

**Primary Scope:**  
Reviews all operational costs, expenditures, and financial performance metrics.

**Core Responsibilities:**
- ✅ Reviews operational expenses, fuel consumption, and maintenance costs
- ✅ Analyzes vehicle ROI using the formula:
  
  $$\text{ROI} = \frac{\text{Revenue} - (\text{Maintenance} + \text{Fuel})}{\text{Acquisition Cost}}$$

- ✅ Monitors automatically computed total operational costs (Fuel + Maintenance) per vehicle
- ✅ Tracks overall profitability

**System Access:**
| Module | Access Level |
|--------|--------------|
| Dashboard | ✅ Full Access |
| Fleet/Vehicles | 👁️ View Only (for cost tracking) |
| Drivers | 🔒 No Access |
| Trips | 🔒 No Access |
| Maintenance | 👁️ View Only (for cost analysis) |
| Fuel & Expenses | ✅ Manage (Track fuel, expenses) |
| Analytics/Reports | ✅ Full Access (ROI, profitability) |
| Settings | 🔒 No Access |

**Key Actions:**
- Record fuel logs (liters, cost, date)
- Record other expenses (tolls, repairs, etc.)
- View total operational costs per vehicle
- Analyze vehicle ROI and profitability
- Generate financial reports
- Monitor fuel efficiency metrics

**Automatic Calculations:**
- Total Operational Cost = Fuel Cost + Maintenance Cost
- Fuel Efficiency = Distance Traveled / Fuel Consumed
- Vehicle ROI = (Revenue - Total Costs) / Acquisition Cost

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Feature/Module | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst |
|----------------|---------------|------------|----------------|-------------------|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ |
| **Vehicles** | ✅ Manage | 👁️ View | 👁️ View | 👁️ View |
| **Drivers** | 👁️ View | 👁️ View | ✅ Manage | 🔒 No Access |
| **Trips** | 👁️ View | ✅ Manage | 👁️ View | 🔒 No Access |
| **Maintenance** | ✅ Manage | 🔒 No Access | 🔒 No Access | 👁️ View |
| **Fuel & Expenses** | 👁️ View | 🔒 No Access | 🔒 No Access | ✅ Manage |
| **Analytics** | ✅ View | 🔒 No Access | 🔒 No Access | ✅ View |
| **Settings** | ✅ Manage | 🔒 No Access | 🔒 No Access | 🔒 No Access |

**Legend:**
- ✅ Full Access (Manage/Create/Edit/Delete/View)
- 👁️ View Only (Read-only access)
- 🔒 No Access (Page locked/hidden)

---

## 🔄 Status Workflows by Role

### Fleet Manager - Vehicle Lifecycle
```
Available → (Create Maintenance) → In Shop → (Close Maintenance) → Available
Available → (Manual Update) → Retired
```

### Dispatcher - Trip Lifecycle
```
Draft → (Dispatch) → Dispatched → (Complete) → Completed
                                 → (Cancel) → Cancelled

Status Changes:
- Dispatch: Vehicle/Driver → "On Trip"
- Complete/Cancel: Vehicle/Driver → "Available"
```

### Safety Officer - Driver Compliance
```
Available → (Trip Assignment) → On Trip → (Trip Complete) → Available
Available → (Violation) → Suspended
Available → (Manual) → Off Duty
```

### Financial Analyst - Cost Tracking
```
Trip Completed → Record Fuel → Update Operational Cost
              → Record Expenses → Recalculate ROI
```

---

## 🎯 Business Rules by Role

### Fleet Manager Rules:
- ✅ Can manage vehicles at any lifecycle stage
- ✅ Creating maintenance automatically changes vehicle to "In Shop"
- ✅ Closing maintenance restores vehicle to "Available" (unless retired)
- ✅ Retired vehicles cannot be restored

### Dispatcher Rules:
- ❌ Cannot assign "Retired" or "In Shop" vehicles
- ❌ Cannot assign "Suspended" drivers or drivers with expired licenses
- ❌ Cannot assign driver/vehicle already "On Trip"
- ✅ Cargo weight must not exceed vehicle capacity
- ✅ Dispatch automatically changes both vehicle and driver to "On Trip"
- ✅ Complete/Cancel automatically restores vehicle and driver to "Available"

### Safety Officer Rules:
- ✅ Can suspend drivers for compliance violations
- ✅ Suspended drivers cannot be assigned to trips
- ✅ Must track license expiry dates
- ⚠️ System prevents assignment of drivers with expired licenses

### Financial Analyst Rules:
- ✅ Can record fuel consumption and costs
- ✅ Can record all operational expenses
- ✅ System automatically computes total operational cost
- ✅ Vehicle ROI calculated using: (Revenue - Costs) / Acquisition Cost

---

## 📊 Role Usage Examples

### Example 1: Fleet Manager Workflow
1. Add new vehicle "Van-06" with 600kg capacity → Status: Available
2. Vehicle needs maintenance
3. Create maintenance log (Oil Change, ₹5,000)
4. System automatically sets vehicle to "In Shop"
5. Maintenance completed
6. Close maintenance record
7. System restores vehicle to "Available"

### Example 2: Dispatcher Workflow
1. Create trip from Bengaluru to Chennai
2. Select available vehicle "Van-06" (600kg capacity)
3. Select available driver "Alex" (valid license)
4. Set cargo weight 550kg (validates: 550 ≤ 600 ✅)
5. Dispatch trip
6. System sets both vehicle and driver to "On Trip"
7. Trip completed
8. Enter final odometer and fuel consumed
9. System restores both to "Available"

### Example 3: Safety Officer Workflow
1. Add new driver "Sarah" with license details
2. Set license expiry date (2027-12-31)
3. Assign initial safety score (100)
4. Monitor driver performance
5. Driver violation occurs
6. Update status to "Suspended"
7. System prevents dispatcher from assigning this driver

### Example 4: Financial Analyst Workflow
1. Trip completed for "Van-06"
2. Record fuel log: 40 liters at ₹4,000
3. Record toll expense: ₹500
4. System calculates total operational cost
5. View vehicle ROI report
6. ROI = (Revenue ₹15,000 - Costs ₹9,500) / Acquisition ₹500,000
7. Analyze profitability trends

---

## 🔑 Key Takeaways

1. **Fleet Manager** = Vehicle & maintenance oversight + operational efficiency monitoring
2. **Dispatcher** = Trip creation & vehicle/driver assignment (NOT an actual driver)
3. **Safety Officer** = Driver compliance & safety score tracking
4. **Financial Analyst** = Cost tracking, expense management, ROI analysis

5. **All roles** have access to Dashboard but with different KPI visibility
6. **Only Fleet Manager** has Settings access (system administration)
7. **Business rules** are enforced automatically by the system
8. **Status transitions** happen automatically based on role actions

---

## 📚 References

- Official Documentation: TransitOps Smart Transport Operations Platform
- Implementation: `/frontend/src/lib/permissions.js`
- Database Schema: `/backend/supabase_schema.sql`

---

**Note:** The term "Driver" in the documentation refers to the **Dispatcher role** in our implementation to avoid confusion with actual vehicle drivers who are managed as driver records in the system.
