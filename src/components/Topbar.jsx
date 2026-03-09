import React, { useState } from 'react';
import { Search, Bell, Menu, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/GlobalDataContext';

const Topbar = ({ toggleSidebar, role }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser } = useData();
  const userRole = role || 'superadmin';

  const userInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const roleLabel = {
    superadmin: 'Super Admin',
    operations: 'Operations',
    procurement: 'Procurement',
    logistics: 'Logistics',
    inventory: 'Inventory',
    concierge: 'Concierge',
    client: 'Client',
    staff: 'Field Staff',
  }[userRole] || userRole;

  return (
    <header className="h-16 border-b border-border bg-background/90 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 gap-4">

      {/* Left: Mobile menu + logo (mobile only) */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-secondary hover:text-white p-2 hover:bg-white/5 rounded-lg"
        >
          <Menu size={20} />
        </button>

        {/* Logo — only on mobile since desktop sidebar already shows it */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(200,169,106,0.4)] overflow-hidden ring-2 ring-accent/60">
            <img src="/logo.png" alt="ZaneZion" className="w-full h-full object-contain scale-[2.4]" />
          </div>
          <span className="text-sm font-black text-white tracking-tight">ZaneZion</span>
        </div>
      </div>

      {/* Centre: Search */}
      <div className="relative flex-1 max-w-lg hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
        <input
          type="text"
          placeholder="Search orders, clients, inventory…"
          className="w-full bg-card border border-border rounded-xl py-2 pl-9 pr-4 text-sm text-secondary placeholder:text-muted focus:outline-none focus:border-accent focus:text-white transition-all"
        />
      </div>

      {/* Right: Bell + Profile */}
      <div className="flex items-center gap-1 flex-shrink-0">

        {/* Notifications */}
        <button className="relative p-2 text-secondary hover:text-accent hover:bg-white/5 rounded-xl transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full"></span>
        </button>

        <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-black text-xs flex-shrink-0">
              {userInitials}
            </div>

            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-white truncate max-w-[100px]">{currentUser?.name || 'User'}</p>
              <p className="text-[10px] text-muted font-bold uppercase tracking-wider">{roleLabel}</p>
            </div>

            <ChevronDown size={14} className={`text-muted transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-sidebar border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-border/60 bg-white/[0.02]">
                    <p className="text-sm font-bold text-white">{currentUser?.name || 'User'}</p>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest">{roleLabel}</p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                      <User size={15} /> My Profile
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                      <Settings size={15} /> Settings
                    </button>
                    <div className="h-px bg-border my-1.5 mx-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-xl transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
