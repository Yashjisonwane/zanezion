import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Store, Package, ShoppingCart,
  Truck, Calendar, BarChart3, UserCog, Settings, X, Menu,
  Box, LogOut, Briefcase, Navigation, Activity, AlertCircle,
  ShieldCheck, ClipboardList, Gift, Heart, Headphones,
  ShoppingBag, Map, History, FileText, Smartphone, CreditCard,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = {
  superadmin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clients', path: '/dashboard/clients' },
    { icon: Store, label: 'Vendors', path: '/dashboard/vendors' },
    { icon: ShoppingCart, label: 'Orders & Missions', path: '/dashboard/orders' },
    { icon: Package, label: 'Inventory', path: '/dashboard/inventory' },
    { icon: UserCog, label: 'Staff Management', path: '/dashboard/users' },
    { icon: FileText, label: 'Invoices', path: '/dashboard/invoices' },
    { icon: CreditCard, label: 'Payroll', path: '/dashboard/payroll' },
    { icon: BarChart3, label: 'Reports', path: '/dashboard/reports' },
    { icon: Globe, label: 'SaaS Management', path: '/dashboard/plans' },
    { icon: Headphones, label: 'Support Dashboard', path: '/dashboard/support-tickets' },
    { icon: Smartphone, label: 'Staff Terminal', path: '/dashboard/staff-terminal' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ],
  operations: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Projects', path: '/dashboard/projects' },
    { icon: ShoppingCart, label: 'Orders', path: '/dashboard/orders' },
    { icon: Truck, label: 'Deliveries', path: '/dashboard/deliveries' },
    { icon: FileText, label: 'Invoices', path: '/dashboard/invoices' },
    { icon: Smartphone, label: 'Staff Terminal', path: '/dashboard/staff-terminal' },
  ],
  procurement: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingCart, label: 'Purchase Requests', path: '/dashboard/purchase-requests' },
    { icon: Store, label: 'Vendors', path: '/dashboard/vendors' },
    { icon: Box, label: 'Quotes', path: '/dashboard/quotes' },
    { icon: FileText, label: 'Invoices', path: '/dashboard/invoices' },
    { icon: BarChart3, label: 'Audits', path: '/dashboard/audits' },
  ],
  logistics: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Truck, label: 'Fleet', path: '/dashboard/fleet' },
    { icon: Navigation, label: 'Routes', path: '/dashboard/logistics-routes' },
    { icon: Activity, label: 'Tracking', path: '/dashboard/logistics-tracking' },
    { icon: AlertCircle, label: 'Urgent', path: '/dashboard/logistics-urgent' },
    { icon: Smartphone, label: 'Staff Terminal', path: '/dashboard/staff-terminal' },
  ],
  inventory: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Stock', path: '/dashboard/inventory' },
    { icon: Store, label: 'Warehouse', path: '/dashboard/warehouses' },
    { icon: AlertCircle, label: 'Alerts', path: '/dashboard/inventory-alerts' },
    { icon: ClipboardList, label: 'Audits', path: '/dashboard/inventory-audits' },
    { icon: Smartphone, label: 'Staff Terminal', path: '/dashboard/staff-terminal' },
  ],
  concierge: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Events', path: '/dashboard/events' },
    { icon: Heart, label: 'Guest Requests', path: '/dashboard/guest-requests' },
    { icon: Gift, label: 'Luxury Items', path: '/dashboard/luxury-items' },
    { icon: Box, label: 'Storage', path: '/dashboard/inventory' },
    { icon: ShieldCheck, label: 'Access Plans', path: '/dashboard/vip-access' },
  ],
  client: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Place Order', path: '/dashboard/store' },
    { icon: Package, label: 'My Orders', path: '/dashboard/client-orders' },
    { icon: Calendar, label: 'Concierge Events', path: '/dashboard/client-events' },
    { icon: Truck, label: 'Track Delivery', path: '/dashboard/track-delivery' },
    { icon: Package, label: 'Inventory', path: '/dashboard/client-inventory' },
    { icon: FileText, label: 'Invoices', path: '/dashboard/invoices' },
    { icon: Headphones, label: 'Support', path: '/dashboard/support' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ],
  staff: [
    { icon: LayoutDashboard, label: 'Staff Terminal', path: '/dashboard' },
    { icon: Smartphone, label: 'My Assignments', path: '/dashboard?tab=assignments' },
    { icon: Map, label: 'Field Map', path: '/dashboard?tab=map' },
    { icon: Calendar, label: 'Leave & Absence', path: '/dashboard?tab=leave' },
    { icon: History, label: 'Pay & Records', path: '/dashboard?tab=pay' },
  ]
};

import { useData } from '../context/GlobalDataContext';

const Sidebar = ({ isOpen, toggleSidebar, role }) => {
  const { currentUser } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const userRole = role || 'superadmin';

  const userInitials = currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'ZN';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const currentMenu = (menuItems[userRole] || menuItems.superadmin).filter(item => {
    // Client requested leave and absence to be visible for all staff
    // Previous logic was hiding it for Field Staff
    return true;
  });

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: (isMobile && !isOpen) ? '-100%' : 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed top-0 left-0 h-[100dvh] w-72 max-[320px]:w-[260px] bg-sidebar border-r border-border z-50 flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="p-4 md:p-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-white/10 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden shrink-0 transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="ZaneZion" className="w-full h-full object-contain scale-[2.2] brightness-0" />
            </div>
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <span className="text-base md:text-lg font-bold tracking-tighter text-white group-hover:text-accent transition-colors">ZANEZION</span>
              <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-accent uppercase -mt-1 opacity-80 group-hover:opacity-100">Institutional</span>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              className="p-2 ml-auto text-secondary hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {currentMenu.map((item) => {
            const currentPathWithSearch = location.pathname + location.search;
            const isActive =
              currentPathWithSearch === item.path ||
              (item.path !== '/dashboard' && !item.path.includes('?tab=') &&
                (location.pathname === item.path || location.pathname.startsWith(item.path + '/')));

            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => isMobile && toggleSidebar()}
                className={`
                    flex items-center gap-4 px-4 py-3.5 md:py-3 rounded-xl transition-all duration-300 group touch-manipulation
                    ${isActive
                    ? 'bg-accent text-black font-bold shadow-[0_8px_20px_-4px_rgba(200,169,106,0.3)]'
                    : 'text-secondary hover:text-white hover:bg-white/5 active:bg-white/10'
                  }
                  `}
              >
                <item.icon size={22} className={`shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="text-sm md:text-sm tracking-wide">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 md:p-4 pb-6 md:pb-8 border-t border-border mt-auto bg-sidebar/50 backdrop-blur-md shrink-0">
          <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-3 md:p-4 mb-3 md:mb-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold shadow-inner text-sm uppercase">
                  {userInitials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-sidebar rounded-full"></div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-muted truncate uppercase tracking-widest font-black">{userRole}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 md:py-3 rounded-xl text-secondary hover:text-danger hover:bg-danger/10 active:bg-danger/20 transition-all duration-300 group touch-manipulation"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 shrink-0 transition-transform" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
