import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

// Base Dashboards
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const OperationsDashboard = lazy(() => import('./pages/Operations/OperationsDashboard'));
const ProcurementDashboard = lazy(() => import('./pages/Procurement/ProcurementDashboard'));
const LogisticsDashboard = lazy(() => import('./pages/Logistics/LogisticsDashboard'));
const InventoryDashboardRole = lazy(() => import('./pages/Inventory/InventoryDashboardRole'));
const ConciergeDashboard = lazy(() => import('./pages/Concierge/ConciergeDashboard'));
const ClientDashboard = lazy(() => import('./pages/Client/ClientDashboard'));

// Management Pages
const Clients = lazy(() => import('./pages/Admin/Clients'));
const Vendors = lazy(() => import('./pages/Common/Vendors'));
const Orders = lazy(() => import('./pages/Common/Orders'));
const Inventory = lazy(() => import('./pages/Common/Inventory'));
const Reports = lazy(() => import('./pages/Admin/Reports'));
const Users = lazy(() => import('./pages/Admin/Users'));
const Settings = lazy(() => import('./pages/Common/Settings'));
const Projects = lazy(() => import('./pages/Operations/Projects'));
const Deliveries = lazy(() => import('./pages/Operations/Deliveries'));

// Procurement Pages
const PurchaseRequests = lazy(() => import('./pages/Procurement/PurchaseRequests'));
const Quotes = lazy(() => import('./pages/Procurement/Quotes'));
const Audits = lazy(() => import('./pages/Procurement/Audits'));

// Logistics Pages
const Fleet = lazy(() => import('./pages/Logistics/Fleet'));
const LogisticsRoutes = lazy(() => import('./pages/Logistics/LogisticsRoutes'));
const LogisticsTracking = lazy(() => import('./pages/Logistics/LogisticsTracking'));
const LogisticsUrgent = lazy(() => import('./pages/Logistics/LogisticsUrgent'));

// Inventory Pages
const Warehouses = lazy(() => import('./pages/Inventory/Warehouses'));
const InventoryAlerts = lazy(() => import('./pages/Inventory/InventoryAlerts'));
const InventoryAudits = lazy(() => import('./pages/Inventory/InventoryAudits'));

// Concierge Pages
const Events = lazy(() => import('./pages/Concierge/Events'));
const GuestRequests = lazy(() => import('./pages/Concierge/GuestRequests'));
const LuxuryItems = lazy(() => import('./pages/Concierge/LuxuryItems'));
const ConciergeAccessPlans = lazy(() => import('./pages/Concierge/ConciergeAccessPlans'));

// Client Pages
const ClientOrders = lazy(() => import('./pages/Client/ClientOrders'));
const ClientEvents = lazy(() => import('./pages/Client/ClientEvents'));
const ClientTracking = lazy(() => import('./pages/Client/ClientTracking'));
const ClientInventory = lazy(() => import('./pages/Client/ClientInventory'));
const ClientInvoices = lazy(() => import('./pages/Client/ClientInvoices'));
const ClientSupport = lazy(() => import('./pages/Client/ClientSupport'));
const ClientStore = lazy(() => import('./pages/Client/ClientStore'));

// Core Pages
const Landing = lazy(() => import('./pages/Common/Landing'));
const Plans = lazy(() => import('./pages/Common/Plans'));
const EmployeePortal = lazy(() => import('./pages/Staff/EmployeePortal'));
const Login = lazy(() => import('./pages/Common/Login'));
const Payroll = lazy(() => import('./pages/Admin/Payroll'));
const Invoices = lazy(() => import('./pages/Common/Invoices'));
const SaaSManagement = lazy(() => import('./pages/Admin/SaaSManagement'));
const SupportDashboard = lazy(() => import('./pages/Admin/SupportDashboard'));

import { GlobalDataProvider } from './context/GlobalDataContext';

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="text-secondary font-bold text-xs uppercase tracking-widest animate-pulse">Initializing Interface...</p>
    </div>
  </div>
);

const RoleProtectedRoute = ({ role, allowedRoles, children }) => {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: !!localStorage.getItem('userRole'),
    role: localStorage.getItem('userRole') || null
  });

  const handleLogin = (role) => {
    localStorage.setItem('userRole', role);
    setAuth({
      isAuthenticated: true,
      role: role
    });
  };

  const getDashboard = () => {
    switch (auth.role) {
      case 'operations': return <OperationsDashboard />;
      case 'procurement': return <ProcurementDashboard />;
      case 'logistics': return <LogisticsDashboard />;
      case 'inventory': return <InventoryDashboardRole />;
      case 'concierge': return <ConciergeDashboard />;
      case 'client': return <ClientDashboard />;
      case 'staff': return <EmployeePortal />;
      default: return <Dashboard />;
    }
  };

  const isAdmin = ['superadmin'].includes(auth.role);
  const isProcurement = ['superadmin', 'procurement'].includes(auth.role);
  const isOperations = ['superadmin', 'operations'].includes(auth.role);
  const isLogistics = ['superadmin', 'logistics'].includes(auth.role);
  const isInventory = ['superadmin', 'inventory'].includes(auth.role);
  const isConcierge = ['superadmin', 'concierge'].includes(auth.role);
  const isClient = ['client'].includes(auth.role);

  return (
    <GlobalDataProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            <Route
              path="/dashboard"
              element={auth.isAuthenticated ? <DashboardLayout role={auth.role} /> : <Navigate to="/login" />}
            >
              {/* Role-based index route */}
              <Route index element={getDashboard()} />

              <Route path="clients" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin']}>
                  <Clients />
                </RoleProtectedRoute>
              } />
              <Route path="vendors" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'procurement']}>
                  <Vendors />
                </RoleProtectedRoute>
              } />
              <Route path="orders" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'operations', 'procurement', 'concierge']}>
                  <Orders />
                </RoleProtectedRoute>
              } />
              <Route path="inventory" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'inventory', 'concierge']}>
                  <Inventory />
                </RoleProtectedRoute>
              } />
              <Route path="reports" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin']}>
                  <Reports />
                </RoleProtectedRoute>
              } />
              <Route path="users" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin']}>
                  <Users />
                </RoleProtectedRoute>
              } />
              <Route path="settings" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'client']}>
                  <Settings />
                </RoleProtectedRoute>
              } />
              <Route path="payroll" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin']}>
                  <Payroll />
                </RoleProtectedRoute>
              } />
              <Route path="invoices" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'client', 'operations', 'procurement']}>
                  {auth.role === 'client' ? <ClientInvoices /> : <Invoices />}
                </RoleProtectedRoute>
              } />
              <Route path="plans" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin']}>
                  <SaaSManagement />
                </RoleProtectedRoute>
              } />
              <Route path="support-tickets" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin']}>
                  <SupportDashboard />
                </RoleProtectedRoute>
              } />

              {/* Operations Specific Routes */}
              <Route path="projects" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'operations']}>
                  <Projects />
                </RoleProtectedRoute>
              } />
              <Route path="deliveries" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'operations']}>
                  <Deliveries />
                </RoleProtectedRoute>
              } />

              {/* Procurement Specific Routes */}
              <Route path="purchase-requests" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'procurement']}>
                  <PurchaseRequests />
                </RoleProtectedRoute>
              } />
              <Route path="quotes" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'procurement']}>
                  <Quotes />
                </RoleProtectedRoute>
              } />
              <Route path="audits" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'procurement']}>
                  <Audits />
                </RoleProtectedRoute>
              } />

              {/* Logistics Specific Routes */}
              <Route path="fleet" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'logistics']}>
                  <Fleet />
                </RoleProtectedRoute>
              } />
              <Route path="logistics-routes" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'logistics']}>
                  <LogisticsRoutes />
                </RoleProtectedRoute>
              } />
              <Route path="logistics-tracking" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'logistics']}>
                  <LogisticsTracking />
                </RoleProtectedRoute>
              } />
              <Route path="logistics-urgent" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'logistics']}>
                  <LogisticsUrgent />
                </RoleProtectedRoute>
              } />

              {/* Inventory Role Specific */}
              <Route path="warehouses" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'inventory']}>
                  <Warehouses />
                </RoleProtectedRoute>
              } />
              <Route path="inventory-alerts" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'inventory']}>
                  <InventoryAlerts />
                </RoleProtectedRoute>
              } />
              <Route path="inventory-audits" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'inventory']}>
                  <InventoryAudits />
                </RoleProtectedRoute>
              } />

              {/* Concierge Role Specific */}
              <Route path="events" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'concierge']}>
                  <Events />
                </RoleProtectedRoute>
              } />
              <Route path="guest-requests" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'concierge']}>
                  <GuestRequests />
                </RoleProtectedRoute>
              } />
              <Route path="luxury-items" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'concierge']}>
                  <LuxuryItems />
                </RoleProtectedRoute>
              } />
              <Route path="vip-access" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'concierge']}>
                  <ConciergeAccessPlans />
                </RoleProtectedRoute>
              } />

              {/* Employee/Staff Routes */}
              <Route path="staff-terminal" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['superadmin', 'staff', 'operations', 'logistics', 'inventory']}>
                  <EmployeePortal />
                </RoleProtectedRoute>
              } />

              {/* Client Portal Specific */}
              <Route path="client-orders" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['client']}>
                  <ClientOrders />
                </RoleProtectedRoute>
              } />
              <Route path="client-events" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['client']}>
                  <ClientEvents />
                </RoleProtectedRoute>
              } />
              <Route path="track-delivery" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['client']}>
                  <ClientTracking />
                </RoleProtectedRoute>
              } />
              <Route path="client-inventory" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['client']}>
                  <ClientInventory />
                </RoleProtectedRoute>
              } />
              <Route path="support" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['client']}>
                  <ClientSupport />
                </RoleProtectedRoute>
              } />
              <Route path="store" element={
                <RoleProtectedRoute role={auth.role} allowedRoles={['client']}>
                  <ClientStore />
                </RoleProtectedRoute>
              } />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </GlobalDataProvider>
  );
}

export default App;
